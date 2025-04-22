"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TimeSlotsFormProps {
  formData: any
  updateFormData: (data: any) => void
}

const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]

export function TimeSlotsForm({ formData, updateFormData }: TimeSlotsFormProps) {
  const { toast } = useToast()
  const [timeSlots, setTimeSlots] = useState<
    Array<{
      id?: string
      start_time: string
      end_time: string
      day_of_week: string
    }>
  >([])

  useEffect(() => {
    if (formData.timeSlots && formData.timeSlots.length > 0) {
      setTimeSlots(formData.timeSlots)
    } else {
      // Initialize with common time slots
      setTimeSlots([
        { start_time: "08:00", end_time: "09:00", day_of_week: "Lundi" },
        { start_time: "09:00", end_time: "10:00", day_of_week: "Lundi" },
        { start_time: "10:15", end_time: "11:15", day_of_week: "Lundi" },
        { start_time: "11:15", end_time: "12:15", day_of_week: "Lundi" },
      ])
    }
  }, [formData.timeSlots])

  const handleChange = (index: number, field: string, value: string) => {
    const updatedTimeSlots = [...timeSlots]
    updatedTimeSlots[index] = {
      ...updatedTimeSlots[index],
      [field]: value,
    }
    setTimeSlots(updatedTimeSlots)
  }

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { start_time: "", end_time: "", day_of_week: "Lundi" }])
  }

  const removeTimeSlot = (index: number) => {
    const updatedTimeSlots = [...timeSlots]
    updatedTimeSlots.splice(index, 1)
    setTimeSlots(updatedTimeSlots)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const invalidTimeSlots = timeSlots.filter((slot) => !slot.start_time || !slot.end_time || !slot.day_of_week)
    if (invalidTimeSlots.length > 0) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs pour chaque créneau horaire.",
        variant: "destructive",
      })
      return
    }

    updateFormData(timeSlots)
    toast({
      title: "Créneaux horaires enregistrés",
      description: `${timeSlots.length} créneau(x) horaire(s) ont été sauvegardés.`,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {timeSlots.map((slot, index) => (
        <div key={index} className="p-4 border rounded-md space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Créneau {index + 1}</h3>
            {timeSlots.length > 1 && (
              <Button type="button" variant="ghost" size="sm" onClick={() => removeTimeSlot(index)}>
                <Trash2 className="h-4 w-4 mr-1" />
                Supprimer
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`day-${index}`}>Jour *</Label>
              <Select value={slot.day_of_week} onValueChange={(value) => handleChange(index, "day_of_week", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un jour" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`start-${index}`}>Heure de début *</Label>
              <Input
                id={`start-${index}`}
                type="time"
                value={slot.start_time}
                onChange={(e) => handleChange(index, "start_time", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`end-${index}`}>Heure de fin *</Label>
              <Input
                id={`end-${index}`}
                type="time"
                value={slot.end_time}
                onChange={(e) => handleChange(index, "end_time", e.target.value)}
                required
              />
            </div>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addTimeSlot} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Ajouter un créneau horaire
      </Button>

      <Button type="submit" className="mt-4">
        Sauvegarder
      </Button>
    </form>
  )
}
