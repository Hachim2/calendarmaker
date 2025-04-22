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

interface Course {
  id?: string
  name: string
  code: string
  description: string
}

interface CurriculumFormProps {
  formData: any
  updateFormData: (data: any) => void
}

const subjects = [
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
  const [courses, setCourses] = useState<Course[]>(formData.courses || [])

  // Extraire les niveaux des classes une seule fois
  // Mémorisez cette valeur pour éviter les recalculs inutiles
  const levels = Array.from(
    new Set(
      (formData.classes || []).map((cls: any) => {
        return cls.levelName || cls.level.split(" ")[0]
      }),
    ),
  )

  // Initialiser le curriculum de manière plus efficace
  useEffect(() => {
    if (formData.curriculum && formData.curriculum.length > 0) {
      setCurriculum(formData.curriculum)
    } else if (curriculum.length === 0 && levels.length > 0) {
      // Initialiser seulement si on n'a pas déjà du curriculum et que nous avons des niveaux
      const initialCurriculum = levels.map((levelName) => ({
        levelName,
        subjects: [],
      }))
      setCurriculum(initialCurriculum)
    }
  }, [formData.curriculum, levels, curriculum.length])

  // Utiliser useCallback pour éviter de recréer cette fonction à chaque rendu
  const handleAddSubject = useCallback(() => {
    if (!selectedLevel || !selectedSubject || hoursPerWeek <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un niveau, une matière et spécifier un nombre d'heures valide.",
        variant: "destructive",
      })
      return
    }

    setCurriculum((prevCurriculum) => {
      const updatedCurriculum = [...prevCurriculum]
      const levelIndex = updatedCurriculum.findIndex((level) => level.levelName === selectedLevel)

      if (levelIndex === -1) {
        // Si le niveau n'existe pas encore, l'ajouter
        return [
          ...updatedCurriculum,
          {
            levelName: selectedLevel,
            subjects: [{ subject: selectedSubject, hoursPerWeek }],
          },
        ]
      } else {
        // Vérifier si la matière existe déjà pour ce niveau
        const subjectIndex = updatedCurriculum[levelIndex].subjects.findIndex((s) => s.subject === selectedSubject)

        if (subjectIndex !== -1) {
          // Mettre à jour le nombre d'heures si la matière existe déjà
          updatedCurriculum[levelIndex].subjects[subjectIndex].hoursPerWeek = hoursPerWeek
        } else {
          // Ajouter la nouvelle matière
          updatedCurriculum[levelIndex].subjects.push({ subject: selectedSubject, hoursPerWeek })
        }
        return updatedCurriculum
      }
    })

    setSelectedSubject("")
    setHoursPerWeek(1)

    toast({
      title: "Matière ajoutée",
      description: `${selectedSubject} (${hoursPerWeek}h) a été ajouté au niveau ${selectedLevel}.`,
    })
  }, [selectedLevel, selectedSubject, hoursPerWeek, toast])

  const handleRemoveSubject = useCallback((levelIndex: number, subjectIndex: number) => {
    setCurriculum((prevCurriculum) => {
      const updatedCurriculum = [...prevCurriculum]
      updatedCurriculum[levelIndex].subjects.splice(subjectIndex, 1)
      return updatedCurriculum
    })
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const emptyLevels = curriculum.filter((level) => level.subjects.length === 0)
    if (emptyLevels.length > 0) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez ajouter au moins une matière à chaque niveau.",
        variant: "destructive",
      })
      return
    }

    // Générer les cours basés sur le curriculum
    const courses = generateCoursesFromCurriculum(curriculum, formData)

    // Mettre à jour les données du formulaire
    updateFormData({
      curriculum,
      courses,
    })

    toast({
      title: "Programme enregistré",
      description: "Le programme des matières a été sauvegardé avec succès.",
    })
  }

  // Fonction pour générer les cours à partir du curriculum
  const generateCoursesFromCurriculum = (curriculum: LevelCurriculum[], formData: any) => {
    const classes = formData.classes || []
    const teachers = formData.teachers || []
    const courses: any[] = []

    curriculum.forEach((level) => {
      // Trouver toutes les classes de ce niveau
      const levelClasses = classes.filter(
        (cls: any) => cls.levelName === level.levelName || cls.level.split(" ")[0] === level.levelName,
      )

      level.subjects.forEach((subjectHours) => {
        // Trouver les enseignants pour cette matière
        const subjectTeachers = teachers.filter((teacher: any) => teacher.subject === subjectHours.subject)

        levelClasses.forEach((cls: any) => {
          // Assigner un enseignant si disponible
          const teacherId =
            subjectTeachers.length > 0 ? subjectTeachers[0].id || `teacher-${teachers.indexOf(subjectTeachers[0])}` : ""

          courses.push({
            subject: subjectHours.subject,
            teacher_id: teacherId,
            class_id: cls.id || `class-${classes.indexOf(cls)}`,
            duration: 60, // Durée par défaut en minutes
            hoursPerWeek: subjectHours.hoursPerWeek,
          })
        })
      })
    })

    return courses
  }

  // Filtrer les matières qui ne sont pas encore ajoutées au niveau sélectionné
  const getAvailableSubjects = () => {
    if (!selectedLevel) return subjects

    const levelIndex = curriculum.findIndex((level) => level.levelName === selectedLevel)
    if (levelIndex === -1) return subjects

    const assignedSubjects = curriculum[levelIndex].subjects.map((s) => s.subject)
    return subjects.filter((subject) => !assignedSubjects.includes(subject))
  }

  const addCourse = () => {
    setCourses([...courses, { name: "", code: "", description: "" }])
  }

  const removeCourse = (index: number) => {
    const newCourses = courses.filter((_, i) => i !== index)
    setCourses(newCourses)
    updateFormData(newCourses)
  }

  const updateCourse = (index: number, field: keyof Course, value: string) => {
    const newCourses = [...courses]
    newCourses[index] = { ...newCourses[index], [field]: value }
    setCourses(newCourses)
    updateFormData(newCourses)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-muted/20 p-4 rounded-md">
        <h3 className="font-medium mb-4">Ajouter une matière au programme</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="level-select">Niveau *</Label>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un niveau" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level, i) => (
                  <SelectItem key={i} value={level.toString()}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject-select">Matière *</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une matière" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableSubjects().map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours-input">Heures par semaine *</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="hours-input"
                type="number"
                min="0.5"
                step="0.5"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                className="flex-1"
              />
              <Button type="button" onClick={handleAddSubject} className="whitespace-nowrap">
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Programme par niveau</h3>

        {curriculum.length > 0 ? (
          <Accordion type="multiple" className="w-full">
            {curriculum.map((level, levelIndex) => (
              <AccordionItem key={levelIndex} value={`level-${levelIndex}`}>
                <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                  <div className="flex items-center justify-between w-full">
                    <span>{level.levelName}</span>
                    <span className="text-sm text-muted-foreground">
                      {level.subjects.length} matière(s) - {level.subjects.reduce((sum, s) => sum + s.hoursPerWeek, 0)}h
                      /semaine
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
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-2 text-muted-foreground">
                        Aucune matière ajoutée à ce niveau. Veuillez ajouter des matières.
                      </p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-center py-4 text-muted-foreground">
            Aucun niveau disponible. Veuillez d'abord ajouter des classes.
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Programme</h3>
          <Button onClick={addCourse} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un cours
          </Button>
        </div>

        <div className="space-y-4">
          {courses.map((course, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor={`name-${index}`}>Nom</Label>
                <Input
                  id={`name-${index}`}
                  value={course.name}
                  onChange={(e) => updateCourse(index, "name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`code-${index}`}>Code</Label>
                <Input
                  id={`code-${index}`}
                  value={course.code}
                  onChange={(e) => updateCourse(index, "code", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`description-${index}`}>Description</Label>
                <Input
                  id={`description-${index}`}
                  value={course.description}
                  onChange={(e) => updateCourse(index, "description", e.target.value)}
                  required
                />
              </div>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeCourse(index)}
                className="h-10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" className="mt-4">
        Sauvegarder le programme
      </Button>
    </form>
  )
}
