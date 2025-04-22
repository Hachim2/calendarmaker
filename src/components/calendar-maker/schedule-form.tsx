"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2 } from "lucide-react"
// Ajouter l'import pour l'algorithme de génération
import { generateSchedule } from "@/lib/schedule-generator"

interface ScheduleFormProps {
  formData: any
  updateFormData: (data: any) => void
}

export function ScheduleForm({ formData, updateFormData }: ScheduleFormProps) {
  const { toast } = useToast()
  const [schedule, setSchedule] = useState<
    Array<{
      course_id: string
      time_slot_id: string
      room_id: string
    }>
  >([])
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [selectedLevel, setSelectedLevel] = useState<string>("")

  useEffect(() => {
    if (formData.schedule && formData.schedule.length > 0) {
      setSchedule(formData.schedule)
    }
  }, [formData.schedule])

  // Données pour les classes, cours, créneaux horaires et salles
  const classes = formData.classes || []
  const courses = formData.courses || []
  const timeSlots = formData.timeSlots || []
  const rooms = formData.rooms || []

  // Extraire les niveaux uniques des classes
  const levels = Array.from(new Set(classes.map((cls: any) => cls.levelName || cls.level.split(" ")[0])))

  // Filtrer les classes par niveau sélectionné
  const classesByLevel = selectedLevel
    ? classes.filter((cls: any) => {
        const levelName = cls.levelName || cls.level.split(" ")[0]
        return levelName === selectedLevel
      })
    : []

  // Filter courses by selected class
  const filteredCourses = selectedClass
    ? courses.filter(
        (course: any) =>
          course.class_id === selectedClass ||
          course.class_id === `class-${classes.findIndex((c: any) => c.id === selectedClass)}`,
      )
    : []

  const handleAddScheduleItem = (course_id: string, time_slot_id: string, room_id: string) => {
    // Check if this time slot is already scheduled
    const existingItem = schedule.find((item) => item.time_slot_id === time_slot_id)

    if (existingItem) {
      toast({
        title: "Créneau déjà occupé",
        description: "Ce créneau horaire est déjà attribué à un cours.",
        variant: "destructive",
      })
      return
    }

    const newSchedule = [...schedule, { course_id, time_slot_id, room_id }]
    setSchedule(newSchedule)
    updateFormData(newSchedule)

    toast({
      title: "Cours planifié",
      description: "Le cours a été ajouté à l'emploi du temps.",
    })
  }

  const handleRemoveScheduleItem = (index: number) => {
    const newSchedule = [...schedule]
    newSchedule.splice(index, 1)
    setSchedule(newSchedule)
    updateFormData(newSchedule)

    toast({
      title: "Cours retiré",
      description: "Le cours a été retiré de l'emploi du temps.",
    })
  }

  const getCourseById = (id: string) => {
    return courses.find((course: any) => course.id === id || `course-${courses.indexOf(course)}` === id)
  }

  const getTimeSlotById = (id: string) => {
    return timeSlots.find((slot: any) => slot.id === id || `time-slot-${timeSlots.indexOf(slot)}` === id)
  }

  const getRoomById = (id: string) => {
    return rooms.find((room: any) => room.id === id || `room-${rooms.indexOf(room)}` === id)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="level-select">Sélectionner un niveau</Label>
          <Select
            value={selectedLevel}
            onValueChange={(value) => {
              setSelectedLevel(value)
              setSelectedClass("") // Réinitialiser la classe sélectionnée
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un niveau" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((level, i) => (
                <SelectItem key={i} value={level}>
                  {level}
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

      {selectedClass && (
        <div className="space-y-4">
          <h3 className="font-medium">Planifier des cours</h3>

          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredCourses.map((course: any, i: number) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-4">
                    <h4 className="font-medium">{course.subject}</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {course.hoursPerWeek}h par semaine - Durée: {course.duration} minutes
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Créneau horaire</Label>
                        <Select
                          onValueChange={(timeSlotId) => {
                            const roomId = rooms.length > 0 ? rooms[0].id || `room-0` : ""
                            handleAddScheduleItem(course.id || `course-${i}`, timeSlotId, roomId)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un créneau" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((slot: any, j: number) => (
                              <SelectItem key={j} value={slot.id || `time-slot-${j}`}>
                                {slot.day_of_week} {slot.start_time}-{slot.end_time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Salle</Label>
                        <Select
                          onValueChange={(roomId) => {
                            // This is just for UI, actual assignment happens when time slot is selected
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une salle" />
                          </SelectTrigger>
                          <SelectContent>
                            {rooms.map((room: any, j: number) => (
                              <SelectItem key={j} value={room.id || `room-${j}`}>
                                {room.name} (capacité: {room.capacity})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-muted-foreground">
              Aucun cours n'est associé à cette classe. Veuillez d'abord ajouter des cours.
            </p>
          )}

          <h3 className="font-medium mt-6">Emploi du temps actuel</h3>

          {schedule.filter((item) => {
            const course = getCourseById(item.course_id)
            return (
              course &&
              (course.class_id === selectedClass ||
                course.class_id === `class-${classes.findIndex((c: any) => c.id === selectedClass)}`)
            )
          }).length > 0 ? (
            <div className="space-y-2">
              {schedule
                .filter((item) => {
                  const course = getCourseById(item.course_id)
                  return (
                    course &&
                    (course.class_id === selectedClass ||
                      course.class_id === `class-${classes.findIndex((c: any) => c.id === selectedClass)}`)
                  )
                })
                .map((item, i) => {
                  const course = getCourseById(item.course_id)
                  const timeSlot = getTimeSlotById(item.time_slot_id)
                  const room = getRoomById(item.room_id)

                  return (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <div className="font-medium">{course?.subject}</div>
                        <div className="text-sm text-muted-foreground">
                          {timeSlot?.day_of_week} {timeSlot?.start_time}-{timeSlot?.end_time} | Salle: {room?.name}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveScheduleItem(schedule.indexOf(item))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                })}
            </div>
          ) : (
            <p className="text-center py-4 text-muted-foreground">Aucun cours planifié pour cette classe.</p>
          )}
        </div>
      )}

      {/* Bouton pour la génération automatique */}
      <Button
        type="button"
        onClick={() => {
          const result = generateSchedule(formData)

          if (result.success) {
            setSchedule(result.schedule)
            updateFormData(result.schedule)

            toast({
              title: "Emploi du temps généré automatiquement",
              description:
                "L'algorithme a généré un emploi du temps optimal pour toutes les classes et tous les enseignants.",
            })
          } else {
            toast({
              title: "Erreur",
              description: result.message,
              variant: "destructive",
            })
          }
        }}
        className="mt-4 w-full"
      >
        Générer automatiquement l'emploi du temps
      </Button>

      <Button
        type="button"
        onClick={() => {
          updateFormData(schedule)
          toast({
            title: "Emploi du temps sauvegardé",
            description: "L'emploi du temps a été sauvegardé avec succès.",
          })
        }}
        className="mt-4"
      >
        Sauvegarder l'emploi du temps
      </Button>
    </div>
  )
}
