"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/lib/hooks/use-toast"
import { Download, Printer, CalendarDays } from "lucide-react"
import { generateSchedule } from "@/lib/schedule-generator"

interface TeacherCalendarPreviewProps {
  formData: any
  isAuthenticated: boolean
}

export function TeacherCalendarPreview({ formData, isAuthenticated }: TeacherCalendarPreviewProps) {
  const { toast } = useToast()
  const [selectedTeacher, setSelectedTeacher] = useState<string>("")
  const [calendar, setCalendar] = useState<any>({})
  const [isGenerating, setIsGenerating] = useState(false)

  const teachers = formData.teachers || []
  const schedule = formData.schedule || []
  const courses = formData.courses || []
  const timeSlots = formData.timeSlots || []
  const rooms = formData.rooms || []
  const classes = formData.classes || []

  useEffect(() => {
    if (selectedTeacher) {
      generateCalendar(selectedTeacher)
    }
  }, [selectedTeacher, schedule])

  const generateCalendar = (teacherId: string) => {
    setIsGenerating(true)

    try {
      // Utiliser l'algorithme de génération
      const result = generateSchedule(formData)

      if (result.success) {
        setCalendar(result.teacherSchedules[teacherId] || {})

        toast({
          title: "Calendrier généré",
          description: "Le calendrier de l'enseignant a été généré avec succès.",
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

  const handleDownload = () => {
    try {
      // Préparer les données pour le téléchargement
      const selectedTeacherName =
        teachers.find((t: any) => t.id === selectedTeacher || `teacher-${teachers.indexOf(t)}` === selectedTeacher)
          ?.name || "Enseignant"

      const calendarData = {
        teacher: selectedTeacherName,
        subject:
          teachers.find((t: any) => t.id === selectedTeacher || `teacher-${teachers.indexOf(t)}` === selectedTeacher)
            ?.subject || "",
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
      a.download = `calendrier-${selectedTeacherName.replace(/\s+/g, "-")}.json`
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
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="teacher-select">Sélectionner un enseignant</Label>
        <Select
          value={selectedTeacher}
          onValueChange={(value) => {
            setSelectedTeacher(value)
            setCalendar({}) // Réinitialiser le calendrier
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un enseignant" />
          </SelectTrigger>
          <SelectContent>
            {teachers.map((teacher: any, i: number) => (
              <SelectItem key={i} value={teacher.id || `teacher-${i}`}>
                {teacher.name} ({teacher.subject})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={() => {
          if (selectedTeacher) {
            handleDownload()
          } else {
            toast({
              title: "Sélection requise",
              description: "Veuillez sélectionner un enseignant.",
              variant: "destructive",
            })
          }
        }}
        disabled={!selectedTeacher || isGenerating || Object.keys(calendar).length === 0}
        className="mt-4 w-full"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            Génération...
          </>
        ) : (
          <>
            <CalendarDays className="h-4 w-4 mr-2" />
            Télécharger le calendrier
          </>
        )}
      </Button>

      {selectedTeacher && Object.keys(calendar).length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-lg">
              Emploi du temps -{" "}
              {
                teachers.find(
                  (t: any) => t.id === selectedTeacher || `teacher-${teachers.indexOf(t)}` === selectedTeacher,
                )?.name
              }
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
                            <div className="flex space-x-2">
                              <span className="text-sm bg-primary/20 px-2 py-1 rounded">{slot.room}</span>
                              <span className="text-sm bg-secondary/20 px-2 py-1 rounded">{slot.class}</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-1">{slot.subject || "Libre"}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedTeacher && Object.keys(calendar).length === 0 && !isGenerating && (
        <div className="text-center py-8 border rounded-md bg-muted/10">
          <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">
            Aucun emploi du temps n'a été généré. Veuillez patienter pendant la génération.
          </p>
        </div>
      )}
    </div>
  )
}
