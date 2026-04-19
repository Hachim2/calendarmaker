export interface ScheduleItem {
  course_id: string
  time_slot_id: string
  room_id: string
}

export interface ScheduleGenerationResult {
  success: boolean
  message: string
  schedule: ScheduleItem[]
  classSchedules: Record<string, any>
  teacherSchedules: Record<string, any>
}

function teacherDisplayName(teacher: any): string {
  if (!teacher) return "Inconnu"
  return teacher.name || `${teacher.first_name || ""} ${teacher.last_name || ""}`.trim() || "Inconnu"
}

function slotDurationMinutes(slot: any): number {
  const [sh, sm] = slot.start_time.split(":").map(Number)
  const [eh, em] = slot.end_time.split(":").map(Number)
  return eh * 60 + em - (sh * 60 + sm)
}

export function generateSchedule(formData: any): ScheduleGenerationResult {
  const { courses, timeSlots, rooms, classes, teachers } = formData

  if (!courses?.length || !timeSlots?.length || !rooms?.length || !classes?.length) {
    return {
      success: false,
      message: "Données insuffisantes pour générer un emploi du temps.",
      schedule: [],
      classSchedules: {},
      teacherSchedules: {},
    }
  }

  const schedule: ScheduleItem[] = []

  const roomAvailability: Record<string, Record<string, boolean>> = {}
  const teacherAvailability: Record<string, Record<string, boolean>> = {}
  const classAvailability: Record<string, Record<string, boolean>> = {}

  rooms.forEach((room: any, i: number) => {
    const roomId = room.id || `room-${i}`
    roomAvailability[roomId] = {}
    timeSlots.forEach((slot: any, j: number) => {
      roomAvailability[roomId][slot.id || `time-slot-${j}`] = true
    })
  })

  teachers.forEach((teacher: any, i: number) => {
    const teacherId = teacher.id || `teacher-${i}`
    teacherAvailability[teacherId] = {}
    timeSlots.forEach((slot: any, j: number) => {
      teacherAvailability[teacherId][slot.id || `time-slot-${j}`] = true
    })
  })

  classes.forEach((cls: any, i: number) => {
    const classId = cls.id || `class-${i}`
    classAvailability[classId] = {}
    timeSlots.forEach((slot: any, j: number) => {
      classAvailability[classId][slot.id || `time-slot-${j}`] = true
    })
  })

  const sortedCourses = [...courses].sort((a, b) => (b.hoursPerWeek || 0) - (a.hoursPerWeek || 0))

  for (const course of sortedCourses) {
    const courseId = course.id || `course-${courses.indexOf(course)}`
    const teacherId = course.teacher_id
    const classId = course.class_id

    if (!classId) continue

    // Convert hours/week to minutes to schedule
    const minutesToSchedule = (course.hoursPerWeek || 1) * 60
    let scheduledMinutes = 0

    while (scheduledMinutes < minutesToSchedule) {
      const dayDistribution: Record<string, number> = {}
      timeSlots.forEach((slot: any) => {
        if (!dayDistribution[slot.day_of_week]) dayDistribution[slot.day_of_week] = 0
      })

      schedule.forEach((item) => {
        const slot = timeSlots.find((s: any, j: number) => (s.id || `time-slot-${j}`) === item.time_slot_id)
        const itemCourse = courses.find((c: any, j: number) => (c.id || `course-${j}`) === item.course_id)
        if (slot && itemCourse && itemCourse.class_id === classId) {
          dayDistribution[slot.day_of_week] = (dayDistribution[slot.day_of_week] || 0) + 1
        }
      })

      const sortedTimeSlots = [...timeSlots]
        .sort((a, b) => {
          const aMin = Number(a.start_time.split(":")[0]) * 60 + Number(a.start_time.split(":")[1])
          const bMin = Number(b.start_time.split(":")[0]) * 60 + Number(b.start_time.split(":")[1])
          return aMin - bMin
        })
        .sort((a, b) => (dayDistribution[a.day_of_week] || 0) - (dayDistribution[b.day_of_week] || 0))

      let assigned = false

      for (const timeSlot of sortedTimeSlots) {
        const timeSlotId = timeSlot.id || `time-slot-${timeSlots.indexOf(timeSlot)}`

        // Skip if teacher assigned but unavailable
        if (teacherId && teacherAvailability[teacherId] && !teacherAvailability[teacherId][timeSlotId]) continue

        if (!classAvailability[classId]?.[timeSlotId]) continue

        const availableRooms = rooms
          .filter((room: any, i: number) => {
            const roomId = room.id || `room-${i}`
            return roomAvailability[roomId]?.[timeSlotId] && room.capacity >= (course.capacity || 0)
          })
          .sort((a: any, b: any) => a.capacity - b.capacity)

        if (availableRooms.length > 0) {
          const room = availableRooms[0]
          const roomId = room.id || `room-${rooms.indexOf(room)}`

          schedule.push({ course_id: courseId, time_slot_id: timeSlotId, room_id: roomId })

          if (teacherId && teacherAvailability[teacherId]) {
            teacherAvailability[teacherId][timeSlotId] = false
          }
          classAvailability[classId][timeSlotId] = false
          roomAvailability[roomId][timeSlotId] = false

          scheduledMinutes += slotDurationMinutes(timeSlot)
          assigned = true
          break
        }
      }

      if (!assigned) {
        console.warn(`Impossible d'assigner le cours ${course.subject} pour la classe ${classId}`)
        break
      }
    }
  }

  const classSchedules: Record<string, any> = {}
  classes.forEach((cls: any, i: number) => {
    const classId = cls.id || `class-${i}`
    classSchedules[classId] = generateCalendarForClass(classId, schedule, courses, timeSlots, rooms, teachers)
  })

  const teacherSchedules: Record<string, any> = {}
  teachers.forEach((teacher: any, i: number) => {
    const teacherId = teacher.id || `teacher-${i}`
    teacherSchedules[teacherId] = generateCalendarForTeacher(teacherId, schedule, courses, timeSlots, rooms, classes)
  })

  return {
    success: true,
    message: "Emploi du temps généré avec succès",
    schedule,
    classSchedules,
    teacherSchedules,
  }
}

function generateCalendarForClass(
  classId: string,
  schedule: ScheduleItem[],
  courses: any[],
  timeSlots: any[],
  rooms: any[],
  teachers: any[],
) {
  const classScheduleItems = schedule.filter((item) => {
    const course = courses.find((c: any, j: number) => (c.id || `course-${j}`) === item.course_id)
    return course && course.class_id === classId
  })

  const days = [...new Set(timeSlots.map((slot: any) => slot.day_of_week))] as string[]
  const calendar: Record<string, any[]> = {}

  days.forEach((day) => {
    const daySlots = timeSlots
      .filter((slot: any) => slot.day_of_week === day)
      .sort((a: any, b: any) => {
        const aMin = Number(a.start_time.split(":")[0]) * 60 + Number(a.start_time.split(":")[1])
        const bMin = Number(b.start_time.split(":")[0]) * 60 + Number(b.start_time.split(":")[1])
        return aMin - bMin
      })

    calendar[day] = daySlots.map((slot) => {
      const slotId = slot.id || `time-slot-${timeSlots.indexOf(slot)}`
      const scheduledItem = classScheduleItems.find((item) => item.time_slot_id === slotId)

      if (scheduledItem) {
        const course = courses.find((c: any, j: number) => (c.id || `course-${j}`) === scheduledItem.course_id)
        const room = rooms.find((r: any, j: number) => (r.id || `room-${j}`) === scheduledItem.room_id)
        const teacher = teachers.find((t: any) => t.id === course?.teacher_id)

        return {
          subject: course?.subject || "Inconnu",
          start: slot.start_time,
          end: slot.end_time,
          room: room?.name || "Inconnue",
          teacher: teacherDisplayName(teacher),
        }
      }

      return { subject: "", start: slot.start_time, end: slot.end_time, room: "", teacher: "" }
    })
  })

  return calendar
}

function generateCalendarForTeacher(
  teacherId: string,
  schedule: ScheduleItem[],
  courses: any[],
  timeSlots: any[],
  rooms: any[],
  classes: any[],
) {
  const teacherScheduleItems = schedule.filter((item) => {
    const course = courses.find((c: any, j: number) => (c.id || `course-${j}`) === item.course_id)
    return course && course.teacher_id === teacherId
  })

  const days = [...new Set(timeSlots.map((slot: any) => slot.day_of_week))] as string[]
  const calendar: Record<string, any[]> = {}

  days.forEach((day) => {
    const daySlots = timeSlots
      .filter((slot: any) => slot.day_of_week === day)
      .sort((a: any, b: any) => a.start_time.localeCompare(b.start_time))

    calendar[day] = daySlots.map((slot) => {
      const slotId = slot.id || `time-slot-${timeSlots.indexOf(slot)}`
      const scheduledItem = teacherScheduleItems.find((item) => item.time_slot_id === slotId)

      if (scheduledItem) {
        const course = courses.find((c: any, j: number) => (c.id || `course-${j}`) === scheduledItem.course_id)
        const room = rooms.find((r: any, j: number) => (r.id || `room-${j}`) === scheduledItem.room_id)
        const cls = classes.find((c: any) => c.id === course?.class_id)

        return {
          subject: course?.subject || "Inconnu",
          start: slot.start_time,
          end: slot.end_time,
          room: room?.name || "Inconnue",
          class: cls?.level || "Inconnue",
        }
      }

      return { subject: "", start: slot.start_time, end: slot.end_time, room: "", class: "" }
    })
  })

  return calendar
}
