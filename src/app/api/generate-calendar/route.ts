import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"

export async function POST(request: Request) {
  try {
    const { classId, formData } = await request.json()

    if (!classId) {
      return NextResponse.json({ error: "Class ID is required" }, { status: 400 })
    }

    // Récupérer les données nécessaires
    const { data: classData, error: classError } = await supabase.from("classes").select("*").eq("id", classId).single()

    if (classError) {
      return NextResponse.json({ error: "Failed to fetch class data" }, { status: 500 })
    }

    // Récupérer l'emploi du temps pour cette classe
    const { data: scheduleData, error: scheduleError } = await supabase
      .from("schedule")
      .select(`
        *,
        courses(*),
        time_slots(*)
      `)
      .eq("courses.class_id", classId)

    if (scheduleError) {
      return NextResponse.json({ error: "Failed to fetch schedule data" }, { status: 500 })
    }

    // Générer le calendrier
    const calendar = generateCalendarFromSchedule(scheduleData, formData)

    // Sauvegarder le calendrier généré
    const { data: savedCalendar, error: saveError } = await supabase
      .from("generated_calendars")
      .insert([
        {
          class_id: classId,
          calendar: calendar,
        },
      ])
      .select()

    if (saveError) {
      return NextResponse.json({ error: "Failed to save generated calendar" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      calendar: savedCalendar[0],
    })
  } catch (error) {
    console.error("Error generating calendar:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateCalendarFromSchedule(scheduleData: any, formData: any) {
  // Logique de génération du calendrier
  // Cette fonction serait plus complexe dans une application réelle

  // Grouper par jour
  const days = [...new Set(formData.timeSlots.map((slot: any) => slot.day_of_week))]
  const calendar: any = {}

  days.forEach((day) => {
    calendar[day] = []

    // Obtenir tous les créneaux pour ce jour
    const daySlots = formData.timeSlots.filter((slot: any) => slot.day_of_week === day)

    daySlots.forEach((slot) => {
      // Trouver les cours programmés pour ce créneau
      const scheduledItems = formData.schedule.filter((item: any) => {
        const timeSlotId = slot.id || `time-slot-${formData.timeSlots.indexOf(slot)}`
        return item.time_slot_id === timeSlotId
      })

      if (scheduledItems.length > 0) {
        scheduledItems.forEach((item: any) => {
          const course = formData.courses.find(
            (c: any) => c.id === item.course_id || `course-${formData.courses.indexOf(c)}` === item.course_id,
          )

          const room = formData.rooms.find(
            (r: any) => r.id === item.room_id || `room-${formData.rooms.indexOf(r)}` === item.room_id,
          )

          calendar[day].push({
            subject: course?.subject || "Inconnu",
            start: slot.start_time,
            end: slot.end_time,
            room: room?.name || "Inconnue",
          })
        })
      } else {
        calendar[day].push({
          subject: "",
          start: slot.start_time,
          end: slot.end_time,
          room: "",
        })
      }
    })

    // Trier par heure de début
    calendar[day].sort((a: any, b: any) => a.start.localeCompare(b.start))
  })

  return calendar
}
