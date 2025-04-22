"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

interface Room {
  id?: string
  name: string
  capacity: number
  type: string
}

interface RoomsFormProps {
  formData: any
  updateFormData: (data: any) => void
}

export function RoomsForm({ formData, updateFormData }: RoomsFormProps) {
  const [rooms, setRooms] = useState<Room[]>(formData.rooms || [])

  const addRoom = () => {
    setRooms([...rooms, { name: "", capacity: 0, type: "" }])
  }

  const removeRoom = (index: number) => {
    const newRooms = rooms.filter((_, i) => i !== index)
    setRooms(newRooms)
    updateFormData(newRooms)
  }

  const updateRoom = (index: number, field: keyof Room, value: string | number) => {
    const newRooms = [...rooms]
    newRooms[index] = { ...newRooms[index], [field]: value }
    setRooms(newRooms)
    updateFormData(newRooms)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Salles</h3>
        <Button onClick={addRoom} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une salle
        </Button>
      </div>

      <div className="space-y-4">
        {rooms.map((room, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor={`name-${index}`}>Nom</Label>
              <Input
                id={`name-${index}`}
                value={room.name}
                onChange={(e) => updateRoom(index, "name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`capacity-${index}`}>Capacité</Label>
              <Input
                id={`capacity-${index}`}
                type="number"
                value={room.capacity}
                onChange={(e) => updateRoom(index, "capacity", parseInt(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`type-${index}`}>Type</Label>
              <Input
                id={`type-${index}`}
                value={room.type}
                onChange={(e) => updateRoom(index, "type", e.target.value)}
                required
              />
            </div>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeRoom(index)}
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
