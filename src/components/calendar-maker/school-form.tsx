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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateFormData(school)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom de l'école</Label>
        <Input
          id="name"
          value={school.name || ""}
          onChange={(e) => setSchool({ ...school, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adresse</Label>
        <Textarea
          id="address"
          value={school.address || ""}
          onChange={(e) => setSchool({ ...school, address: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          type="tel"
          value={school.phone || ""}
          onChange={(e) => setSchool({ ...school, phone: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={school.email || ""}
          onChange={(e) => setSchool({ ...school, email: e.target.value })}
          required
        />
      </div>
    </form>
  )
}
