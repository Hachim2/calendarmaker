// Types pour l'algorithme de génération d'emplois du temps
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

/**
 * Algorithme de génération d'emplois du temps
 * Génère un emploi du temps optimal pour toutes les classes et tous les enseignants
 */
export function generateSchedule(formData: any): ScheduleGenerationResult {
  const { courses, timeSlots, rooms, classes, teachers, curriculum } = formData

  // Initialiser l'emploi du temps vide
  const schedule: ScheduleItem[] = []

  // Créer des maps pour suivre les disponibilités
  const roomAvailability: Record<string, Record<string, boolean>> = {}
  const teacherAvailability: Record<string, Record<string, boolean>> = {}
  const classAvailability: Record<string, Record<string, boolean>> = {}

  // Initialiser les disponibilités
  rooms.forEach((room: any, i: number) => {
    const roomId = room.id || `room-${i}`
    roomAvailability[roomId] = {}
    timeSlots.forEach((slot: any, j: number) => {
      const slotId = slot.id || `time-slot-${j}`
      roomAvailability[roomId][slotId] = true
    })
  })

  teachers.forEach((teacher: any, i: number) => {
    const teacherId = teacher.id || `teacher-${i}`
    teacherAvailability[teacherId] = {}
    timeSlots.forEach((slot: any, j: number) => {
      const slotId = slot.id || `time-slot-${j}`
      teacherAvailability[teacherId][slotId] = true
    })
  })

  classes.forEach((cls: any, i: number) => {
    const classId = cls.id || `class-${i}`
    classAvailability[classId] = {}
    timeSlots.forEach((slot: any, j: number) => {
      const slotId = slot.id || `time-slot-${j}`
      classAvailability[classId][slotId] = true
    })
  })

  // Trier les cours par ordre de priorité (par exemple, par nombre d'heures décroissant)
  const sortedCourses = [...courses].sort((a, b) => (b.hoursPerWeek || 0) - (a.hoursPerWeek || 0))

  // Pour chaque cours, trouver un créneau et une salle disponibles
  for (const course of sortedCourses) {
    const courseId = course.id || `course-${courses.indexOf(course)}`
    const teacherId = course.teacher_id
    const classId = course.class_id

    // Nombre d'heures à planifier pour ce cours
    const hoursToSchedule = course.hoursPerWeek || 1
    let scheduledHours = 0

    // Planifier le nombre d'heures requis
    while (scheduledHours < hoursToSchedule) {
      // Trouver un créneau disponible pour ce cours
      let assigned = false

      // Essayer d'abord les créneaux du matin, puis ceux de l'après-midi
      const sortedTimeSlots = [...timeSlots].sort((a, b) => {
        // Convertir les heures en minutes depuis minuit
        const aMinutes = Number.parseInt(a.start_time.split(":")[0]) * 60 + Number.parseInt(a.start_time.split(":")[1])
        const bMinutes = Number.parseInt(b.start_time.split(":")[0]) * 60 + Number.parseInt(b.start_time.split(":")[1])
        return aMinutes - bMinutes
      })

      // Répartir les cours sur différents jours de la semaine
      const dayDistribution: Record<string, number> = {}
      timeSlots.forEach((slot: any) => {
        if (!dayDistribution[slot.day_of_week]) {
          dayDistribution[slot.day_of_week] = 0
        }
      })

      // Calculer le nombre actuel de cours par jour pour cette classe
      schedule.forEach((item) => {
        const slot = timeSlots.find(
          (s: any, j: number) => s.id === item.time_slot_id || `time-slot-${j}` === item.time_slot_id,
        )
        const itemCourse = courses.find(
          (c: any, j: number) => c.id === item.course_id || `course-${j}` === item.course_id,
        )

        if (slot && itemCourse && itemCourse.class_id === classId) {
          dayDistribution[slot.day_of_week]++
        }
      })

      // Trier les créneaux par jour avec le moins de cours en premier
      const sortedByDistribution = [...sortedTimeSlots].sort((a, b) => {
        return (dayDistribution[a.day_of_week] || 0) - (dayDistribution[b.day_of_week] || 0)
      })

      for (const timeSlot of sortedByDistribution) {
        const timeSlotId = timeSlot.id || `time-slot-${timeSlots.indexOf(timeSlot)}`

        // Vérifier si l'enseignant est disponible à ce créneau
        if (!teacherAvailability[teacherId][timeSlotId]) continue

        // Vérifier si la classe est disponible à ce créneau
        if (!classAvailability[classId][timeSlotId]) continue

        // Trouver une salle disponible avec une capacité suffisante
        const availableRooms = rooms.filter((room: any, i: number) => {
          const roomId = room.id || `room-${i}`
          return roomAvailability[roomId][timeSlotId] && room.capacity >= (course.capacity || 0)
        })

        // Trier les salles par capacité croissante (pour optimiser l'utilisation des salles)
        const sortedRooms = [...availableRooms].sort((a, b) => a.capacity - b.capacity)

        if (sortedRooms.length > 0) {
          const room = sortedRooms[0]
          const roomId = room.id || `room-${rooms.indexOf(room)}`

          // Assigner le cours à ce créneau et cette salle
          schedule.push({
            course_id: courseId,
            time_slot_id: timeSlotId,
            room_id: roomId,
          })

          // Marquer le créneau comme indisponible pour l'enseignant, la classe et la salle
          teacherAvailability[teacherId][timeSlotId] = false
          classAvailability[classId][timeSlotId] = false
          roomAvailability[roomId][timeSlotId] = false

          // Incrémenter le compteur de cours pour ce jour
          dayDistribution[timeSlot.day_of_week]++

          assigned = true
          scheduledHours++
          break
        }
      }

      if (!assigned) {
        // Si on n'a pas pu assigner ce cours, on pourrait essayer des stratégies alternatives
        // Par exemple, chercher un autre enseignant pour la même matière
        // Ou diviser le cours en plusieurs sessions plus courtes
        console.warn(`Impossible d'assigner le cours ${course.subject} pour la classe ${classId}`)
        break // Sortir de la boucle pour éviter une boucle infinie
      }
    }
  }

  // Générer les emplois du temps par classe
  const classSchedules: Record<string, any> = {}
  classes.forEach((cls: any, i: number) => {
    const classId = cls.id || `class-${i}`
    classSchedules[classId] = generateCalendarForClass(classId, schedule, courses, timeSlots, rooms, teachers)
  })

  // Générer les emplois du temps par enseignant
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

/**
 * Génère un calendrier pour une classe spécifique
 */
function generateCalendarForClass(
  classId: string,
  schedule: ScheduleItem[],
  courses: any[],
  timeSlots: any[],
  rooms: any[],
  teachers: any[],
) {
  // Filtrer les éléments de l'emploi du temps pour cette classe
  const classScheduleItems = schedule.filter((item) => {
    const course = courses.find((c: any, j: number) => c.id === item.course_id || `course-${j}` === item.course_id)
    return course && (course.class_id === classId || `class-${courses.indexOf(course)}` === classId)
  })

  // Grouper par jour
  const days = [...new Set(timeSlots.map((slot: any) => slot.day))]
  const calendar: Record<string, any[]> = {}

  days.forEach((day) => {
    calendar[day] = []

    // Obtenir tous les créneaux pour ce jour
    const daySlots = timeSlots.filter((slot: any) => slot.day === day)

    daySlots.forEach((slot) => {
      const slotId = slot.id || `time-slot-${timeSlots.indexOf(slot)}`

      // Trouver le cours programmé pour ce créneau
      const scheduledItem = classScheduleItems.find((item) => item.time_slot_id === slotId)

      if (scheduledItem) {
        const course = courses.find(
          (c: any, j: number) => c.id === scheduledItem.course_id || `course-${j}` === scheduledItem.course_id,
        )

        const room = rooms.find(
          (r: any, j: number) => r.id === scheduledItem.room_id || `room-${j}` === scheduledItem.room_id,
        )

        const teacher = teachers.find((t: any) => t.id === course?.teacher_id)

        calendar[day].push({
          subject: course?.subject || "Inconnu",
          start: slot.start_time,
          end: slot.end_time,
          room: room?.name || "Inconnue",
          teacher: teacher?.name || "Inconnu",
        })
      } else {
        calendar[day].push({
          subject: "",
          start: slot.start_time,
          end: slot.end_time,
          room: "",
          teacher: "",
        })
      }
    })

    // Trier par heure de début
    calendar[day].sort((a, b) => {
      const aTime = a.start.split(":").map(Number)
      const bTime = b.start.split(":").map(Number)
      return aTime[0] * 60 + aTime[1] - (bTime[0] * 60 + bTime[1])
    })
  })

  return calendar
}

/**
 * Génère un calendrier pour un enseignant spécifique
 */
function generateCalendarForTeacher(
  teacherId: string,
  schedule: ScheduleItem[],
  courses: any[],
  timeSlots: any[],
  rooms: any[],
  classes: any[],
) {
  // Filtrer les éléments de l'emploi du temps pour cet enseignant
  const teacherScheduleItems = schedule.filter((item) => {
    const course = courses.find((c: any, j: number) => c.id === item.course_id || `course-${j}` === item.course_id)
    return course && course.teacher_id === teacherId
  })

  // Grouper par jour
  const days = [...new Set(timeSlots.map((slot: any) => slot.day_of_week))]
  const calendar: Record<string, any[]> = {}

  days.forEach((day) => {
    calendar[day] = []

    // Obtenir tous les créneaux pour ce jour
    const daySlots = timeSlots.filter((slot: any) => slot.day_of_week === day)

    daySlots.forEach((slot) => {
      const slotId = slot.id || `time-slot-${timeSlots.indexOf(slot)}`

      // Trouver le cours programmé pour ce créneau
      const scheduledItem = teacherScheduleItems.find((item) => item.time_slot_id === slotId)

      if (scheduledItem) {
        const course = courses.find(
          (c: any, j: number) => c.id === scheduledItem.course_id || `course-${j}` === scheduledItem.course_id,
        )

        const room = rooms.find(
          (r: any, j: number) => r.id === scheduledItem.room_id || `room-${j}` === scheduledItem.room_id,
        )

        const cls = classes.find((c: any) => c.id === course?.class_id)

        calendar[day].push({
          subject: course?.subject || "Inconnu",
          start: slot.start_time,
          end: slot.end_time,
          room: room?.name || "Inconnue",
          class: cls?.level || "Inconnue",
        })
      } else {
        calendar[day].push({
          subject: "",
          start: slot.start_time,
          end: slot.end_time,
          room: "",
          class: "",
        })
      }
    })

    // Trier par heure de début
    calendar[day].sort((a, b) => a.start.localeCompare(b.start))
  })

  return calendar
}
