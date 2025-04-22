"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

interface Teacher {
  id?: string
  first_name: string
  last_name: string
  email: string
  subject: string
}

interface TeachersFormProps {
  formData: any
  updateFormData: (data: any) => void
}

export function TeachersForm({ formData, updateFormData }: TeachersFormProps) {
  const [teachers, setTeachers] = useState<Teacher[]>(formData.teachers || [])

  const addTeacher = () => {
    setTeachers([...teachers, { first_name: "", last_name: "", email: "", subject: "" }])
  }

  const removeTeacher = (index: number) => {
    const newTeachers = teachers.filter((_, i) => i !== index)
    setTeachers(newTeachers)
    updateFormData(newTeachers)
  }

  const updateTeacher = (index: number, field: keyof Teacher, value: string) => {
    const newTeachers = [...teachers]
    newTeachers[index] = { ...newTeachers[index], [field]: value }
    setTeachers(newTeachers)
    updateFormData(newTeachers)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Enseignants</h3>
        <Button onClick={addTeacher} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un enseignant
        </Button>
      </div>

      <div className="space-y-4">
        {teachers.map((teacher, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor={`first-name-${index}`}>Prénom</Label>
              <Input
                id={`first-name-${index}`}
                value={teacher.first_name}
                onChange={(e) => updateTeacher(index, "first_name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`last-name-${index}`}>Nom</Label>
              <Input
                id={`last-name-${index}`}
                value={teacher.last_name}
                onChange={(e) => updateTeacher(index, "last_name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`email-${index}`}>Email</Label>
              <Input
                id={`email-${index}`}
                type="email"
                value={teacher.email}
                onChange={(e) => updateTeacher(index, "email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`subject-${index}`}>Matière</Label>
              <Input
                id={`subject-${index}`}
                value={teacher.subject}
                onChange={(e) => updateTeacher(index, "subject", e.target.value)}
                required
              />
            </div>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeTeacher(index)}
              className="h-10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
