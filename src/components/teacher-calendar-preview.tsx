"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

interface TeacherCalendarPreviewProps {
  formData: any
  isAuthenticated: boolean
}

export function TeacherCalendarPreview({ formData, isAuthenticated }: TeacherCalendarPreviewProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </CardContent>
      </Card>
    </div>
  )
} 