"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

interface Class {
  id?: string
  name: string
  level: string
  capacity: number
}

interface ClassesFormProps {
  formData: any
  updateFormData: (data: any) => void
}

export function ClassesForm({ formData, updateFormData }: ClassesFormProps) {
  const [classes, setClasses] = useState<Class[]>(formData.classes || [])

  const addClass = () => {
    setClasses([...classes, { name: "", level: "", capacity: 0 }])
  }

  const removeClass = (index: number) => {
    const newClasses = classes.filter((_, i) => i !== index)
    setClasses(newClasses)
    updateFormData(newClasses)
  }

  const updateClass = (index: number, field: keyof Class, value: string | number) => {
    const newClasses = [...classes]
    newClasses[index] = { ...newClasses[index], [field]: value }
    setClasses(newClasses)
    updateFormData(newClasses)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Classes</h3>
        <Button onClick={addClass} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une classe
        </Button>
      </div>

      <div className="space-y-4">
        {classes.map((cls, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor={`name-${index}`}>Nom</Label>
              <Input
                id={`name-${index}`}
                value={cls.name}
                onChange={(e) => updateClass(index, "name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`level-${index}`}>Niveau</Label>
              <Input
                id={`level-${index}`}
                value={cls.level}
                onChange={(e) => updateClass(index, "level", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`capacity-${index}`}>Capacité</Label>
              <Input
                id={`capacity-${index}`}
                type="number"
                value={cls.capacity}
                onChange={(e) => updateClass(index, "capacity", parseInt(e.target.value))}
                required
              />
            </div>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeClass(index)}
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
