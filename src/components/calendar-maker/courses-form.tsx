"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CoursesFormProps {
  formData: any
  updateFormData: (data: any) => void
}

export function CoursesForm({ formData, updateFormData }: CoursesFormProps) {
  const { toast } = useToast()
  const [courses, setCourses] = useState<
    Array<{
      id?: string
      subject: string
      teacher_id: string
      class_id: string
      duration: number
    }>
  >([])

  useEffect(() => {
    if (formData.courses && formData.courses.length > 0) {
      setCourses(formData.courses)
    } else {
      // Initialize with one empty course
      setCourses([{ subject: "", teacher_id: "", class_id: "", duration: 60 }])
    }
  }, [formData.courses])

  const handleChange = (index: number, field: string, value: string | number) => {
    const updatedCourses = [...courses]
    updatedCourses[index] = {
      ...updatedCourses[index],
      [field]: value,
    }
    setCourses(updatedCourses)
  }

  const addCourse = () => {
    setCourses([...courses, { subject: "", teacher_id: "", class_id: "", duration: 60 }])
  }

  const removeCourse = (index: number) => {
    const updatedCourses = [...courses]
    updatedCourses.splice(index, 1)
    setCourses(updatedCourses)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const invalidCourses = courses.filter((course) => !course.subject || !course.teacher_id || !course.class_id)
    if (invalidCourses.length > 0) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires pour chaque cours.",
        variant: "destructive",
      })
      return
    }

    updateFormData(courses)
    toast({
      title: "Cours enregistrés",
      description: `${courses.length} cours ont été sauvegardés.`,
    })
  }

  // Données pour les enseignants et les classes
  const teachers = formData.teachers || []
  const classes = formData.classes || []

  // Grouper les classes par niveau pour une meilleure organisation dans le select
  const classesByLevel: Record<string, any[]> = {}
  classes.forEach((cls: any) => {
    const levelName = cls.levelName || cls.level.split(" ")[0]
    if (!classesByLevel[levelName]) {
      classesByLevel[levelName] = []
    }
    classesByLevel[levelName].push(cls)
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {courses.map((course, index) => (
        <div key={index} className="p-4 border rounded-md space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Cours {index + 1}</h3>
            {courses.length > 1 && (
              <Button type="button" variant="ghost" size="sm" onClick={() => removeCourse(index)}>
                <Trash2 className="h-4 w-4 mr-1" />
                Supprimer
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`subject-${index}`}>Matière *</Label>
              <Input
                id={`subject-${index}`}
                value={course.subject}
                onChange={(e) => handleChange(index, "subject", e.target.value)}
                placeholder="Mathématiques"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`teacher-${index}`}>Enseignant *</Label>
              <Select value={course.teacher_id} onValueChange={(value) => handleChange(index, "teacher_id", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un enseignant" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher: any, i: number) => (
                    <SelectItem key={i} value={teacher.id || `teacher-${i}`}>
                      {teacher.name} ({teacher.subject})
                    </SelectItem>
                  ))}
                  {teachers.length === 0 && (
                    <SelectItem value="placeholder" disabled>
                      Ajoutez d'abord des enseignants
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`class-${index}`}>Classe *</Label>
              <Select value={course.class_id} onValueChange={(value) => handleChange(index, "class_id", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(classesByLevel).map((level) => (
                    <div key={level}>
                      <div className="px-2 py-1.5 text-sm font-semibold bg-muted/50">{level}</div>
                      {classesByLevel[level].map((cls: any, i: number) => (
                        <SelectItem key={`${level}-${i}`} value={cls.id || `class-${classes.indexOf(cls)}`}>
                          {cls.className ? `${cls.className}` : cls.level.split(" ").slice(1).join(" ")}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                  {classes.length === 0 && (
                    <SelectItem value="placeholder" disabled>
                      Ajoutez d'abord des classes
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`duration-${index}`}>Durée (minutes) *</Label>
              <Input
                id={`duration-${index}`}
                type="number"
                value={course.duration.toString()}
                onChange={(e) => handleChange(index, "duration", Number.parseInt(e.target.value) || 60)}
                min="30"
                step="15"
                required
              />
            </div>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addCourse} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Ajouter un cours
      </Button>

      <Button type="submit" className="mt-4">
        Sauvegarder
      </Button>
    </form>
  )
}
