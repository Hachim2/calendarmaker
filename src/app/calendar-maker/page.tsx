"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarPreview } from "@/components/calendar-maker/calendar-preview"
import { TeacherCalendarPreview } from "@/components/calendar-maker/teacher-calendar-preview"
import { useRouter } from "next/navigation"
import { ArrowLeft, Database, Settings } from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"
import { supabase } from "@/lib/supabase/client"
import { getSchedule, getTimeSlots, getCourses, getClasses, getRooms, getTeachers } from "@/lib/supabase/queries"
import { FormWizard } from "@/components/calendar-maker/form-wizard"
import { loadMockData } from "@/lib/mock-data"
import { generateSchedule, type ScheduleGenerationResult } from "@/lib/schedule-generator"

export default function SchedulesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState<any>(null)
  const [showWizard, setShowWizard] = useState(true)
  const [activeTab, setActiveTab] = useState("class-preview")
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setIsAuthenticated(!!user)

        if (user) {
          const [{ data: scheduleData }, { data: timeSlotsData }, { data: coursesData }, { data: classesData }, { data: roomsData }, { data: teachersData }] =
            await Promise.all([getSchedule(), getTimeSlots(), getCourses(), getClasses(), getRooms(), getTeachers()])

          const formattedClasses =
            classesData?.map((cls) => ({
              id: cls.id,
              level: cls.level,
              capacity: cls.capacity,
              levelName: cls.level.match(/(6e|5e|4e|3e|2de)/)?.[0] || cls.level.split(" ")[0],
              className: cls.level.replace(/(6e|5e|4e|3e|2de)\s*/, ""),
            })) || []

          const loaded = {
            schedule: scheduleData || [],
            timeSlots: timeSlotsData || [],
            courses: coursesData || [],
            classes: formattedClasses,
            rooms: roomsData || [],
            teachers: teachersData || [],
          }
          setFormData(loaded)

          // If we have meaningful data, skip the wizard
          if (loaded.classes.length > 0 && loaded.timeSlots.length > 0) {
            setShowWizard(false)
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement:", error)
        toast({ title: "Erreur", description: "Problème lors du chargement des données.", variant: "destructive" })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [toast])

  // Generate schedule once whenever formData changes — shared between both preview tabs
  const generatedSchedule = useMemo<ScheduleGenerationResult | null>(() => {
    if (!formData?.courses?.length || !formData?.timeSlots?.length) return null
    try {
      return generateSchedule(formData)
    } catch {
      return null
    }
  }, [formData])

  const handleLoadMockData = () => {
    const mockData = loadMockData()
    setFormData(mockData)
    setShowWizard(false)
    toast({ title: "Données de test chargées", description: "Les données de test ont été chargées." })
  }

  const handleWizardComplete = () => {
    setShowWizard(false)
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto" />
          <p className="mt-4 text-slate-600 dark:text-slate-300">Chargement des données...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto py-10 px-4 md:px-6 min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center mb-8 gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/")}
          className="border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 relative">
          Emploi du temps
          <span className="absolute bottom-0 left-0 w-1/3 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full" />
        </h1>

        <div className="flex-1" />

        {!showWizard && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowWizard(true)}
            className="border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300"
          >
            <Settings className="h-4 w-4 mr-2" />
            Modifier la configuration
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={handleLoadMockData}
          className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white border-none shadow-md"
        >
          <Database className="h-4 w-4 mr-2" />
          Données de test
        </Button>
      </div>

      {showWizard ? (
        <FormWizard formData={formData} setFormData={setFormData} onComplete={handleWizardComplete} />
      ) : (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
              <TabsTrigger
                value="class-preview"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all"
              >
                Par classe
              </TabsTrigger>
              <TabsTrigger
                value="teacher-preview"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all"
              >
                Par enseignant
              </TabsTrigger>
            </TabsList>

            <TabsContent value="class-preview" className="focus:outline-none">
              <CalendarPreview
                formData={formData}
                generatedSchedule={generatedSchedule}
                isAuthenticated={isAuthenticated}
              />
            </TabsContent>

            <TabsContent value="teacher-preview" className="focus:outline-none">
              <TeacherCalendarPreview
                formData={formData}
                generatedSchedule={generatedSchedule}
                isAuthenticated={isAuthenticated}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </main>
  )
}
