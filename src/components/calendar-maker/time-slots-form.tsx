"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Wand2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TimeSlot {
  id?: string
  start_time: string
  end_time: string
  day_of_week: string
}

interface TimeSlotsFormProps {
  formData: any
  updateFormData: (data: any) => void
}

const DAYS_OF_WEEK = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number)
  return h * 60 + m
}

function minutesToTime(m: number): string {
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`
}

function generateWeekSlots(
  startTime: string,
  endTime: string,
  slotDuration: number,
  breakStart: string,
  breakEnd: string,
  selectedDays: string[],
): TimeSlot[] {
  const slots: TimeSlot[] = []
  const start = timeToMinutes(startTime)
  const end = timeToMinutes(endTime)
  const bStart = breakStart ? timeToMinutes(breakStart) : -1
  const bEnd = breakEnd ? timeToMinutes(breakEnd) : -1

  selectedDays.forEach((day) => {
    let cursor = start
    while (cursor + slotDuration <= end) {
      // Skip break
      if (bStart >= 0 && cursor >= bStart && cursor < bEnd) {
        cursor = bEnd
        continue
      }
      // Don't start a slot that overlaps break start
      if (bStart >= 0 && cursor < bStart && cursor + slotDuration > bStart) {
        cursor = bStart
        continue
      }
      slots.push({
        start_time: minutesToTime(cursor),
        end_time: minutesToTime(cursor + slotDuration),
        day_of_week: day,
      })
      cursor += slotDuration
    }
  })

  return slots
}

export function TimeSlotsForm({ formData, updateFormData }: TimeSlotsFormProps) {
  const { toast } = useToast()
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])

  // Generator state
  const [genStart, setGenStart] = useState("08:00")
  const [genEnd, setGenEnd] = useState("17:00")
  const [genDuration, setGenDuration] = useState(60)
  const [genBreakStart, setGenBreakStart] = useState("12:00")
  const [genBreakEnd, setGenBreakEnd] = useState("13:30")
  const [genDays, setGenDays] = useState<string[]>(["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"])

  useEffect(() => {
    if (formData.timeSlots?.length > 0) {
      setTimeSlots(formData.timeSlots)
    }
  }, [formData.timeSlots])

  const save = (slots: TimeSlot[]) => {
    setTimeSlots(slots)
    updateFormData(slots)
  }

  const handleChange = (index: number, field: keyof TimeSlot, value: string) => {
    const updated = timeSlots.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    save(updated)
  }

  const addTimeSlot = () => {
    save([...timeSlots, { start_time: "", end_time: "", day_of_week: "Lundi" }])
  }

  const removeTimeSlot = (index: number) => {
    save(timeSlots.filter((_, i) => i !== index))
  }

  const handleGenerate = () => {
    if (!genStart || !genEnd || genDuration <= 0 || genDays.length === 0) {
      toast({ title: "Paramètres invalides", description: "Vérifiez les champs du générateur.", variant: "destructive" })
      return
    }
    if (timeToMinutes(genEnd) <= timeToMinutes(genStart)) {
      toast({ title: "Erreur", description: "L'heure de fin doit être après l'heure de début.", variant: "destructive" })
      return
    }

    const generated = generateWeekSlots(genStart, genEnd, genDuration, genBreakStart, genBreakEnd, genDays)
    save(generated)
    toast({ title: "Créneaux générés", description: `${generated.length} créneaux créés pour ${genDays.length} jour(s).` })
  }

  const toggleDay = (day: string) => {
    setGenDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const validate = (slot: TimeSlot): string | null => {
    if (!slot.start_time || !slot.end_time) return "Horaires manquants"
    if (timeToMinutes(slot.end_time) <= timeToMinutes(slot.start_time)) return "Fin ≤ Début"
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    for (const slot of timeSlots) {
      const error = validate(slot)
      if (error) {
        toast({ title: "Erreur de validation", description: `Créneau ${slot.day_of_week} ${slot.start_time}: ${error}`, variant: "destructive" })
        return
      }
    }

    // Detect duplicates
    const seen = new Set<string>()
    for (const slot of timeSlots) {
      const key = `${slot.day_of_week}-${slot.start_time}`
      if (seen.has(key)) {
        toast({ title: "Doublon détecté", description: `${slot.day_of_week} à ${slot.start_time} apparaît plusieurs fois.`, variant: "destructive" })
        return
      }
      seen.add(key)
    }

    updateFormData(timeSlots)
    toast({ title: "Créneaux enregistrés", description: `${timeSlots.length} créneau(x) sauvegardés.` })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Generator */}
      <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 p-4 rounded-lg space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Wand2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-medium text-indigo-800 dark:text-indigo-300">Générateur automatique</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Début de journée</Label>
            <Input type="time" value={genStart} onChange={(e) => setGenStart(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Fin de journée</Label>
            <Input type="time" value={genEnd} onChange={(e) => setGenEnd(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Durée créneau (min)</Label>
            <Input type="number" min={15} step={15} value={genDuration} onChange={(e) => setGenDuration(Number(e.target.value))} />
          </div>
          <div className="space-y-1 col-span-2 md:col-span-1">
            <Label className="text-xs">Pause déjeuner</Label>
            <div className="flex gap-1">
              <Input type="time" value={genBreakStart} onChange={(e) => setGenBreakStart(e.target.value)} className="text-xs" />
              <Input type="time" value={genBreakEnd} onChange={(e) => setGenBreakEnd(e.target.value)} className="text-xs" />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Jours</Label>
          <div className="flex flex-wrap gap-2">
            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  genDays.includes(day)
                    ? "bg-indigo-500 text-white"
                    : "bg-white dark:bg-slate-800 border text-muted-foreground hover:bg-muted"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <Button type="button" onClick={handleGenerate} className="bg-indigo-500 hover:bg-indigo-600 text-white w-full">
          <Wand2 className="h-4 w-4 mr-2" />
          Générer les créneaux
        </Button>
      </div>

      {/* Manual slots */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">
            Créneaux ({timeSlots.length})
          </h3>
        </div>

        {/* Group by day for readability */}
        {DAYS_OF_WEEK.map((day) => {
          const daySlots = timeSlots
            .map((s, i) => ({ slot: s, idx: i }))
            .filter(({ slot }) => slot.day_of_week === day)
          if (daySlots.length === 0) return null
          return (
            <div key={day} className="border rounded-md overflow-hidden">
              <div className="bg-muted/40 px-4 py-2 font-medium text-sm">{day}</div>
              <div className="divide-y">
                {daySlots.map(({ slot, idx }) => {
                  const error = slot.start_time && slot.end_time ? validate(slot) : null
                  return (
                    <div key={idx} className="flex items-center gap-3 px-4 py-2">
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          type="time"
                          value={slot.start_time}
                          onChange={(e) => handleChange(idx, "start_time", e.target.value)}
                          className="w-28"
                        />
                        <span className="text-muted-foreground text-sm">→</span>
                        <Input
                          type="time"
                          value={slot.end_time}
                          onChange={(e) => handleChange(idx, "end_time", e.target.value)}
                          className="w-28"
                        />
                        <Select value={slot.day_of_week} onValueChange={(v) => handleChange(idx, "day_of_week", v)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DAYS_OF_WEEK.map((d) => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {error && <span className="text-destructive text-xs">{error}</span>}
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeTimeSlot(idx)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Slots without a recognized day */}
        {timeSlots
          .map((s, i) => ({ slot: s, idx: i }))
          .filter(({ slot }) => !DAYS_OF_WEEK.includes(slot.day_of_week))
          .map(({ slot, idx }) => (
            <div key={idx} className="flex items-center gap-3 p-3 border rounded-md">
              <Select value={slot.day_of_week} onValueChange={(v) => handleChange(idx, "day_of_week", v)}>
                <SelectTrigger className="w-32"><SelectValue placeholder="Jour" /></SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input type="time" value={slot.start_time} onChange={(e) => handleChange(idx, "start_time", e.target.value)} className="w-28" />
              <span className="text-muted-foreground text-sm">→</span>
              <Input type="time" value={slot.end_time} onChange={(e) => handleChange(idx, "end_time", e.target.value)} className="w-28" />
              <Button type="button" variant="ghost" size="sm" onClick={() => removeTimeSlot(idx)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
      </div>

      <Button type="button" variant="outline" onClick={addTimeSlot} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Ajouter un créneau manuellement
      </Button>

      <Button type="submit" className="w-full">
        Sauvegarder les créneaux
      </Button>
    </form>
  )
}
