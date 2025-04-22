"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarPreview } from "@/components/calendar-maker/calendar-preview"
import { TeacherCalendarPreview } from "@/components/calendar-maker/teacher-calendar-preview"
import { useRouter } from "next/navigation"
import { ArrowLeft, Home, LogIn, Database } from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"
import { supabase } from "@/lib/supabase/client"
import { getSchedule, getTimeSlots, getCourses, getClasses, getRooms, getTeachers } from "@/lib/supabase/queries"
import { FormWizard } from "@/components/calendar-maker/form-wizard"
import { loadMockData } from "@/lib/mock-data"

export default function SchedulesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("class-preview")
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)

      try {
        // Vérifier l'authentification
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setIsAuthenticated(!!user)

        if (user) {
          // Charger les données depuis Supabase
          const { data: scheduleData } = await getSchedule()
          const { data: timeSlotsData } = await getTimeSlots()
          const { data: coursesData } = await getCourses()
          const { data: classesData } = await getClasses()
          const { data: roomsData } = await getRooms()
          const { data: teachersData } = await getTeachers()

          // Formater les classes pour notre interface
          const formattedClasses =
            classesData?.map((cls) => ({
              id: cls.id,
              level: cls.level,
              capacity: cls.capacity,
              levelName: cls.level.match(/(6e|5e|4e|3e|2de)/)?.[0] || cls.level,
              className: cls.level.replace(/(6e|5e|4e|3e|2de)\s*/, ""),
            })) || []

          setFormData({
            schedule: scheduleData || [],
            timeSlots: timeSlotsData || [],
            courses: coursesData || [],
            classes: formattedClasses,
            rooms: roomsData || [],
            teachers: teachersData || [],
          })
        } else {
          // Réinitialiser le localStorage et formData
          localStorage.removeItem("schoolFormData")
          setFormData(null)
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
        toast({
          title: "Erreur",
          description: "Problème lors du chargement des données. Veuillez réessayer.",
          variant: "destructive",
        })
        // Réinitialiser en cas d'erreur
        localStorage.removeItem("schoolFormData")
        setFormData(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router, toast])

  const updateFormData = async (key: string, data: any) => {
    if (!formData) return

    try {
      const updatedData = {
        ...formData,
        [key]: data,
      }

      setFormData(updatedData)

      // Sauvegarder dans localStorage comme fallback
      localStorage.setItem("schoolFormData", JSON.stringify(updatedData))

      // Si authentifié, sauvegarder dans Supabase
      if (isAuthenticated && key === "schedule") {
        const { error } = await supabase.from("schedule").upsert(
          data.map((item: any) => ({
            course_id: item.course_id,
            time_slot_id: item.time_slot_id,
            room_id: item.room_id,
          })),
        )

        if (error) throw error
      }

      toast({
        title: "Données mises à jour",
        description: "Les modifications ont été enregistrées avec succès.",
      })
    } catch (error) {
      console.error("Erreur lors de la mise à jour des données:", error)
      toast({
        title: "Erreur",
        description: "Échec de l'enregistrement des modifications.",
        variant: "destructive",
      })
    }
  }

  const handleLoadMockData = () => {
    const mockData = loadMockData()
    setFormData(mockData)
    localStorage.setItem("schoolFormData", JSON.stringify(mockData))
    toast({
      title: "Données de test chargées",
      description: "Les données de test ont été chargées avec succès.",
    })
  }

  const handleLogin = () => {
    router.push("/auth")
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-300">Chargement des données...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto py-10 px-4 md:px-6 min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="flex items-center mb-8 space-x-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => router.push("/")} 
          className="border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 relative">
          Création d'emploi du temps
          <span className="absolute bottom-0 left-0 w-1/4 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"></span>
        </h1>
        <div className="flex-1"></div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLoadMockData}
          className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white shadow-lg hover:shadow-indigo-500/25 transition-all border-none"
        >
          <Database className="h-4 w-4 mr-2" />
          Charger données de test
        </Button>
      </div>

      {(!formData || !formData.school || Object.keys(formData).length === 0) ? (
        <div className="container mx-auto p-4">
          <div className="no-print">
            <h1 className="text-3xl font-bold mb-6 text-primary">Créateur de calendrier</h1>
            <p className="text-muted-foreground mb-8">
              Remplissez les informations de base pour votre école, puis accédez à la gestion des emplois du temps.
            </p>
          </div>
          <FormWizard formData={formData} setFormData={setFormData} />
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
              <TabsTrigger 
                value="class-preview"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all"
              >
                Aperçu par classe
              </TabsTrigger>
              <TabsTrigger 
                value="teacher-preview"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all"
              >
                Aperçu par enseignant
              </TabsTrigger>
            </TabsList>

            <TabsContent value="class-preview" className="focus:outline-none">
              <CalendarPreview
                formData={formData}
                updateFormData={(data: any) => updateFormData("schedule", data)}
                isAuthenticated={isAuthenticated}
              />
            </TabsContent>

            <TabsContent value="teacher-preview" className="focus:outline-none">
              <TeacherCalendarPreview formData={formData} isAuthenticated={isAuthenticated} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </main>
  )
}
