"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface SchoolFormProps {
  formData: any
  updateFormData: (data: any) => void
}

export function SchoolForm({ formData, updateFormData }: SchoolFormProps) {
  const [school, setSchool] = useState(formData.school || {})

  const handleChange = (field: string, value: string) => {
    const updated = { ...school, [field]: value }
    setSchool(updated)
    updateFormData(updated)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom de l'école *</Label>
        <Input
          id="name"
          value={school.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Ex: Collège Jean Moulin"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adresse</Label>
        <Textarea
          id="address"
          value={school.address || ""}
          onChange={(e) => handleChange("address", e.target.value)}
          placeholder="Adresse complète de l'établissement"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          type="tel"
          value={school.phone || ""}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="Ex: 01 23 45 67 89"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={school.email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="Ex: contact@college-jeanmoulin.fr"
        />
      </div>
    </div>
  )
}
