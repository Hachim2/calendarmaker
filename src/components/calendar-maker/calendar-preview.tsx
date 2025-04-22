"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/lib/hooks/use-toast"
import { Download, Printer, CalendarDays } from "lucide-react"
import { generateSchedule } from "@/lib/schedule-generator"
import { saveGeneratedCalendar } from "@/lib/calendar"

interface CalendarPreviewProps {
  formData: any
  updateFormData: (data: any) => void
  isAuthenticated?: boolean
}

export function CalendarPreview({ formData, updateFormData, isAuthenticated = false }: CalendarPreviewProps) {
  const { toast } = useToast()
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [selectedLevel, setSelectedLevel] = useState<string>("")
  const [calendar, setCalendar] = useState<any>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const classes = formData.classes || []
  const schedule = formData.schedule || []
  const courses = formData.courses || []
  const timeSlots = formData.timeSlots || []
  const rooms = formData.rooms || []
  const teachers = formData.teachers || []

  // Extraire les niveaux uniques des classes
  const levels = Array.from(new Set(classes.map((cls: any) => cls.levelName || cls.level.split(" ")[0])))

  // Filtrer les classes par niveau sélectionné
  const classesByLevel = selectedLevel
    ? classes.filter((cls: any) => {
        const levelName = cls.levelName || cls.level.split(" ")[0]
        return levelName === selectedLevel
      })
    : []

  useEffect(() => {
    if (selectedClass) {
      generateCalendar(selectedClass)
    }
  }, [selectedClass, schedule])

  const generateCalendar = (classId: string) => {
    setIsGenerating(true)

    try {
      // Utiliser l'algorithme de génération
      const result = generateSchedule(formData)

      if (result.success) {
        const classCalendar = result.classSchedules[classId] || {}
        setCalendar(classCalendar)

        // Sauvegarder dans Supabase si authentifié
        if (isAuthenticated) {
          saveCalendarToSupabase(classId, classCalendar)
        }

        toast({
          title: "Calendrier généré",
          description: "Le calendrier de la classe a été généré avec succès.",
        })
      } else {
        toast({
          title: "Erreur",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur lors de la génération du calendrier:", error)
      toast({
        title: "Erreur inattendue",
        description: "Une erreur est survenue lors de la génération du calendrier.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const saveCalendarToSupabase = async (classId: string, calendarData: any) => {
    if (!isAuthenticated) return
    
    setIsSaving(true)
    try {
      // Convertir l'ID de classe en nombre si c'est une chaîne
      const numericClassId = typeof classId === 'string' && classId.startsWith('class-') 
        ? Number.parseInt(classId.replace('class-', '')) 
        : Number.parseInt(classId)
      
      if (isNaN(numericClassId)) {
        throw new Error("ID de classe invalide")
      }
      
      await saveGeneratedCalendar(calendarData, numericClassId)
      
      toast({
        title: "Calendrier sauvegardé",
        description: "Le calendrier a été sauvegardé dans la base de données.",
      })
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du calendrier:", error)
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder le calendrier dans la base de données.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownload = () => {
    try {
      // Préparer les données pour le téléchargement
      const selectedClassName =
        classes.find((c: any) => c.id === selectedClass || `class-${classes.indexOf(c)}` === selectedClass)?.level ||
        "Classe"

      const calendarData = {
        class: selectedClassName,
        calendar: calendar,
        generatedAt: new Date().toISOString(),
        school: formData.school?.name || "École",
      }

      // Créer un blob avec les données
      const blob = new Blob([JSON.stringify(calendarData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)

      // Créer un lien pour télécharger le fichier
      const a = document.createElement("a")
      a.href = url
      a.download = `calendrier-${selectedClassName.replace(/\s+/g, "-")}.json`
      document.body.appendChild(a)
      a.click()

      // Nettoyer
      URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Téléchargement",
        description: "Le calendrier a été téléchargé avec succès.",
      })
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error)
      toast({
        title: "Erreur",
        description: "Un problème est survenu lors du téléchargement du calendrier.",
        variant: "destructive",
      })
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="calendar-preview">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="level-select">Sélectionner un niveau</Label>
            <Select
              value={selectedLevel}
              onValueChange={(value) => {
                setSelectedLevel(value)
                setSelectedClass("") // Réinitialiser la classe sélectionnée
                setCalendar({}) // Réinitialiser le calendrier
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un niveau" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level, i) => (
                  <SelectItem key={i} value={level as string}>
                    {level as string}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedLevel && (
            <div className="space-y-2">
              <Label htmlFor="class-select">Sélectionner une classe</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent>
                  {classesByLevel.map((cls: any, i: number) => (
                    <SelectItem key={i} value={cls.id || `class-${classes.indexOf(cls)}`}>
                      {cls.className || cls.level.split(" ").slice(1).join(" ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Button
          onClick={() => {
            if (selectedClass) {
              handleDownload()
            } else {
              toast({
                title: "Sélection requise",
                description: "Veuillez sélectionner une classe.",
                variant: "destructive",
              })
            }
          }}
          disabled={!selectedClass || isGenerating || isSaving || Object.keys(calendar).length === 0}
          className="mt-4 w-full"
        >
          {isGenerating || isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              {isGenerating ? "Génération..." : "Sauvegarde..."}
            </>
          ) : (
            <>
              <CalendarDays className="h-4 w-4 mr-2" />
              Télécharger le calendrier
            </>
          )}
        </Button>

        {selectedClass && Object.keys(calendar).length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-lg">
                Emploi du temps -{" "}
                {classes.find((c: any) => c.id === selectedClass || `class-${classes.indexOf(c)}` === selectedClass)?.level}
              </h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-1" />
                  Télécharger
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-1" />
                  Imprimer
                </Button>
              </div>
            </div>

            <div className="print:shadow-none">
              {Object.entries(calendar).map(([day, slots]: [string, any]) => (
                <Card key={day} className="mb-4">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-lg mb-2">{day}</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {slots.map((slot: any, i: number) => (
                        <div
                          key={i}
                          className={`p-3 rounded-md ${slot.subject ? "bg-primary/10" : "bg-muted"} transition-colors`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">
                              {slot.start} - {slot.end}
                            </span>
                            {slot.subject && (
                              <span className="text-sm bg-primary/20 px-2 py-1 rounded">
                                {slot.room}
                              </span>
                            )}
                          </div>
                          {slot.subject && (
                            <div className="mt-2 space-y-1">
                              <div className="font-medium text-primary">{slot.subject}</div>
                              <div className="text-sm text-muted-foreground">{slot.teacher}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
