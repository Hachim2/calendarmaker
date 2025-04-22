"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

interface Holiday {
  id?: string
  name: string
  start_date: string
  end_date: string
}

interface HolidaysFormProps {
  formData: any
  updateFormData: (data: any) => void
}

export function HolidaysForm({ formData, updateFormData }: HolidaysFormProps) {
  const [holidays, setHolidays] = useState<Holiday[]>(formData.holidays || [])

  const addHoliday = () => {
    setHolidays([...holidays, { name: "", start_date: "", end_date: "" }])
  }

  const removeHoliday = (index: number) => {
    const newHolidays = holidays.filter((_, i) => i !== index)
    setHolidays(newHolidays)
    updateFormData(newHolidays)
  }

  const updateHoliday = (index: number, field: keyof Holiday, value: string) => {
    const newHolidays = [...holidays]
    newHolidays[index] = { ...newHolidays[index], [field]: value }
    setHolidays(newHolidays)
    updateFormData(newHolidays)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Vacances</h3>
        <Button onClick={addHoliday} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter des vacances
        </Button>
      </div>

      <div className="space-y-4">
        {holidays.map((holiday, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor={`name-${index}`}>Nom</Label>
              <Input
                id={`name-${index}`}
                value={holiday.name}
                onChange={(e) => updateHoliday(index, "name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`start-date-${index}`}>Date de début</Label>
              <Input
                id={`start-date-${index}`}
                type="date"
                value={holiday.start_date}
                onChange={(e) => updateHoliday(index, "start_date", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`end-date-${index}`}>Date de fin</Label>
              <Input
                id={`end-date-${index}`}
                type="date"
                value={holiday.end_date}
                onChange={(e) => updateHoliday(index, "end_date", e.target.value)}
                required
              />
            </div>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeHoliday(index)}
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
