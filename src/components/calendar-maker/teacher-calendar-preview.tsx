"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/lib/hooks/use-toast"
import { FileDown, Printer, CalendarDays } from "lucide-react"
import type { ScheduleGenerationResult } from "@/lib/schedule-generator"
import { exportCalendarToPdf } from "@/lib/export-pdf"

interface TeacherCalendarPreviewProps {
  formData: any
  generatedSchedule: ScheduleGenerationResult | null
  isAuthenticated: boolean
}

const DAY_ORDER = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]

const SUBJECT_COLORS: Record<string, string> = {
  "Mathématiques": "bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-200",
  "Français": "bg-rose-100 border-rose-300 text-rose-800 dark:bg-rose-900/30 dark:border-rose-700 dark:text-rose-200",
  "Histoire-Géographie": "bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-200",
  "Anglais": "bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-200",
  "SVT": "bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-200",
  "Physique-Chimie": "bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-200",
  "EPS": "bg-orange-100 border-orange-300 text-orange-800 dark:bg-orange-900/30 dark:border-orange-700 dark:text-orange-200",
}

function subjectColor(subject: string): string {
  return SUBJECT_COLORS[subject] ?? "bg-slate-100 border-slate-300 text-slate-700 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200"
}

function teacherDisplayName(teacher: any): string {
  if (!teacher) return "Inconnu"
  return teacher.name || `${teacher.first_name || ""} ${teacher.last_name || ""}`.trim() || "Inconnu"
}

export function TeacherCalendarPreview({ formData, generatedSchedule, isAuthenticated }: TeacherCalendarPreviewProps) {
  const { toast } = useToast()
  const [selectedTeacher, setSelectedTeacher] = useState<string>("")

  const teachers = formData?.teachers || []

  const calendar = selectedTeacher ? generatedSchedule?.teacherSchedules?.[selectedTeacher] ?? {} : {}

  const sortedDays = Object.keys(calendar).sort(
    (a, b) => (DAY_ORDER.indexOf(a) ?? 99) - (DAY_ORDER.indexOf(b) ?? 99),
  )

  const selectedTeacherObj = teachers.find(
    (t: any) => t.id === selectedTeacher || `teacher-${teachers.indexOf(t)}` === selectedTeacher,
  )
  const selectedTeacherName = selectedTeacherObj ? teacherDisplayName(selectedTeacherObj) : "Enseignant"

  const handleExportPdf = () => {
    if (!selectedTeacher || !sortedDays.length) {
      toast({ title: "Rien à exporter", description: "Sélectionnez un enseignant avec un calendrier.", variant: "destructive" })
      return
    }
    exportCalendarToPdf({
      title: selectedTeacherName,
      subtitle: selectedTeacherObj?.subject ? `Matière : ${selectedTeacherObj.subject}` : undefined,
      schoolName: formData?.school?.name,
      calendar,
      showTeacher: false,
      showClass: true,
    })
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1 max-w-xs">
        <Label>Enseignant</Label>
        <Select
          value={selectedTeacher}
          onValueChange={(v) => setSelectedTeacher(v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un enseignant" />
          </SelectTrigger>
          <SelectContent>
            {teachers.map((teacher: any, i: number) => (
              <SelectItem key={i} value={teacher.id || `teacher-${i}`}>
                {teacherDisplayName(teacher)}
                {teacher.subject ? ` — ${teacher.subject}` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedTeacher && sortedDays.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">
              {selectedTeacherName}
              {selectedTeacherObj?.subject ? (
                <span className="ml-2 text-sm font-normal text-muted-foreground">— {selectedTeacherObj.subject}</span>
              ) : null}
            </h3>
            <div className="flex gap-2 no-print">
              <Button variant="outline" size="sm" onClick={handleExportPdf}>
                <FileDown className="h-4 w-4 mr-1" />
                Exporter PDF
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportPdf}>
                <Printer className="h-4 w-4 mr-1" />
                Imprimer
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 print:grid-cols-3">
            {sortedDays.map((day) => (
              <div key={day} className="border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 py-2 font-medium text-sm">
                  {day}
                </div>
                <div className="divide-y">
                  {(calendar[day] as any[]).map((slot: any, i: number) => (
                    <div
                      key={i}
                      className={`px-3 py-2.5 ${slot.subject ? "" : "bg-slate-50 dark:bg-slate-900/50"}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums">
                          {slot.start} – {slot.end}
                        </span>
                        <div className="flex gap-1">
                          {slot.room && (
                            <span className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">
                              {slot.room}
                            </span>
                          )}
                          {slot.class && (
                            <span className="text-xs bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 px-1.5 py-0.5 rounded text-indigo-700 dark:text-indigo-300">
                              {slot.class}
                            </span>
                          )}
                        </div>
                      </div>
                      {slot.subject ? (
                        <div className={`rounded px-2 py-1.5 border text-sm ${subjectColor(slot.subject)}`}>
                          <div className="font-semibold">{slot.subject}</div>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 dark:text-slate-600 italic">Libre</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : selectedTeacher ? (
        <div className="text-center py-12 border rounded-lg bg-muted/10">
          <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Aucun cours planifié pour cet enseignant.</p>
        </div>
      ) : null}
    </div>
  )
}
