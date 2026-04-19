"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface CurriculumFormProps {
  formData: any
  updateFormData: (data: any) => void
}

const SUBJECTS = [
  "Mathématiques",
  "Français",
  "Histoire-Géographie",
  "Anglais",
  "Espagnol",
  "Allemand",
  "SVT",
  "Physique-Chimie",
  "Technologie",
  "Arts Plastiques",
  "Musique",
  "EPS",
  "Latin",
  "Grec",
]

interface SubjectHours {
  subject: string
  hoursPerWeek: number
}

interface LevelCurriculum {
  levelName: string
  subjects: SubjectHours[]
}

export function CurriculumForm({ formData, updateFormData }: CurriculumFormProps) {
  const { toast } = useToast()
  const [curriculum, setCurriculum] = useState<LevelCurriculum[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [selectedLevel, setSelectedLevel] = useState<string>("")
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(1)

  const levels = Array.from(
    new Set(
      (formData.classes || []).map((cls: any) => cls.levelName || cls.level?.split(" ")[0]),
    ),
  ).filter(Boolean) as string[]

  useEffect(() => {
    if (formData.curriculum && formData.curriculum.length > 0) {
      setCurriculum(formData.curriculum)
    } else if (levels.length > 0 && curriculum.length === 0) {
      setCurriculum(levels.map((levelName) => ({ levelName, subjects: [] })))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.curriculum])

  const saveToParent = useCallback(
    (updatedCurriculum: LevelCurriculum[]) => {
      const classes = formData.classes || []
      const teachers = formData.teachers || []
      const courses: any[] = []

      updatedCurriculum.forEach((level) => {
        const levelClasses = classes.filter(
          (cls: any) => cls.levelName === level.levelName || cls.level?.split(" ")[0] === level.levelName,
        )

        level.subjects.forEach((subjectHours) => {
          const subjectTeachers = teachers.filter((t: any) => t.subject === subjectHours.subject)

          levelClasses.forEach((cls: any) => {
            const teacherId =
              subjectTeachers.length > 0
                ? subjectTeachers[0].id || `teacher-${teachers.indexOf(subjectTeachers[0])}`
                : ""

            courses.push({
              subject: subjectHours.subject,
              teacher_id: teacherId,
              class_id: cls.id || `class-${classes.indexOf(cls)}`,
              duration: 60,
              hoursPerWeek: subjectHours.hoursPerWeek,
            })
          })
        })
      })

      updateFormData({ curriculum: updatedCurriculum, courses })
    },
    [formData.classes, formData.teachers, updateFormData],
  )

  const handleAddSubject = useCallback(() => {
    if (!selectedLevel || !selectedSubject || hoursPerWeek <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un niveau, une matière et un nombre d'heures valide.",
        variant: "destructive",
      })
      return
    }

    setCurriculum((prev) => {
      const updated = [...prev]
      const levelIdx = updated.findIndex((l) => l.levelName === selectedLevel)

      if (levelIdx === -1) {
        updated.push({ levelName: selectedLevel, subjects: [{ subject: selectedSubject, hoursPerWeek }] })
      } else {
        const subjectIdx = updated[levelIdx].subjects.findIndex((s) => s.subject === selectedSubject)
        if (subjectIdx !== -1) {
          updated[levelIdx].subjects[subjectIdx].hoursPerWeek = hoursPerWeek
        } else {
          updated[levelIdx].subjects.push({ subject: selectedSubject, hoursPerWeek })
        }
      }

      saveToParent(updated)
      return updated
    })

    setSelectedSubject("")
    setHoursPerWeek(1)
    toast({ title: "Matière ajoutée", description: `${selectedSubject} (${hoursPerWeek}h/sem) → niveau ${selectedLevel}` })
  }, [selectedLevel, selectedSubject, hoursPerWeek, toast, saveToParent])

  const handleRemoveSubject = useCallback(
    (levelIndex: number, subjectIndex: number) => {
      setCurriculum((prev) => {
        const updated = prev.map((l, i) =>
          i === levelIndex ? { ...l, subjects: l.subjects.filter((_, j) => j !== subjectIndex) } : l,
        )
        saveToParent(updated)
        return updated
      })
    },
    [saveToParent],
  )

  const availableSubjects = () => {
    if (!selectedLevel) return SUBJECTS
    const level = curriculum.find((l) => l.levelName === selectedLevel)
    if (!level) return SUBJECTS
    const assigned = new Set(level.subjects.map((s) => s.subject))
    return SUBJECTS.filter((s) => !assigned.has(s))
  }

  return (
    <div className="space-y-6">
      <div className="bg-muted/20 p-4 rounded-md border">
        <h3 className="font-medium mb-4">Ajouter une matière</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Niveau *</Label>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un niveau" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Matière *</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une matière" />
              </SelectTrigger>
              <SelectContent>
                {availableSubjects().map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Heures / semaine *</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0.5"
                step="0.5"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                className="flex-1"
              />
              <Button type="button" onClick={handleAddSubject}>
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Programme par niveau</h3>

        {curriculum.length > 0 ? (
          <Accordion type="multiple" className="w-full">
            {curriculum.map((level, levelIndex) => (
              <AccordionItem key={levelIndex} value={`level-${levelIndex}`}>
                <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                  <div className="flex items-center justify-between w-full pr-2">
                    <span>{level.levelName}</span>
                    <span className="text-sm text-muted-foreground">
                      {level.subjects.length} matière(s) —{" "}
                      {level.subjects.reduce((sum, s) => sum + s.hoursPerWeek, 0)}h/sem
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pl-4 pr-2 py-2">
                    {level.subjects.length > 0 ? (
                      level.subjects.map((subject, subjectIndex) => (
                        <div
                          key={subjectIndex}
                          className="flex items-center justify-between p-3 border rounded-md bg-background"
                        >
                          <div>
                            <div className="font-medium">{subject.subject}</div>
                            <div className="text-sm text-muted-foreground">{subject.hoursPerWeek}h par semaine</div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveSubject(levelIndex, subjectIndex)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-2 text-muted-foreground text-sm">
                        Aucune matière. Utilisez le formulaire ci-dessus.
                      </p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-center py-4 text-muted-foreground text-sm">
            Aucun niveau disponible. Ajoutez d'abord des classes à l'étape précédente.
          </p>
        )}
      </div>
    </div>
  )
}
