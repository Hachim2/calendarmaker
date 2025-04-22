// Données de test pour un collège type

export const mockSchool = {
  name: "Collège Victor Hugo",
  address: "12 rue des Écoles, 75001 Paris",
  phone: "01 23 45 67 89",
  email: "contact@college-vhugo.fr"
}

export const mockRooms = [
  { id: "R1", name: "101", capacity: 30, type: "standard" },
  { id: "R2", name: "102", capacity: 30, type: "standard" },
  { id: "R3", name: "103", capacity: 30, type: "standard" },
  { id: "R4", name: "104", capacity: 30, type: "standard" },
  { id: "R5", name: "105", capacity: 30, type: "standard" },
  { id: "R6", name: "201", capacity: 30, type: "standard" },
  { id: "R7", name: "202", capacity: 30, type: "standard" },
  { id: "R8", name: "203", capacity: 30, type: "standard" },
  { id: "R9", name: "Lab1", capacity: 25, type: "science" },
  { id: "R10", name: "Lab2", capacity: 25, type: "science" },
  { id: "R11", name: "Info1", capacity: 20, type: "informatique" },
  { id: "R12", name: "Gym", capacity: 60, type: "sport" },
  { id: "R13", name: "Art", capacity: 25, type: "art" },
  { id: "R14", name: "Musique", capacity: 30, type: "musique" },
  { id: "R15", name: "CDI", capacity: 50, type: "cdi" }
]

export const mockClasses = [
  // 6ème
  { id: "C1", level: "6e A", name: "6e A", levelName: "6e", className: "A", capacity: 25 },
  { id: "C2", level: "6e B", name: "6e B", levelName: "6e", className: "B", capacity: 25 },
  { id: "C3", level: "6e C", name: "6e C", levelName: "6e", className: "C", capacity: 25 },
  // 5ème
  { id: "C4", level: "5e A", name: "5e A", levelName: "5e", className: "A", capacity: 28 },
  { id: "C5", level: "5e B", name: "5e B", levelName: "5e", className: "B", capacity: 28 },
  { id: "C6", level: "5e C", name: "5e C", levelName: "5e", className: "C", capacity: 28 },
  // 4ème
  { id: "C7", level: "4e A", name: "4e A", levelName: "4e", className: "A", capacity: 27 },
  { id: "C8", level: "4e B", name: "4e B", levelName: "4e", className: "B", capacity: 27 },
  { id: "C9", level: "4e C", name: "4e C", levelName: "4e", className: "C", capacity: 27 },
  // 3ème
  { id: "C10", level: "3e A", name: "3e A", levelName: "3e", className: "A", capacity: 26 },
  { id: "C11", level: "3e B", name: "3e B", levelName: "3e", className: "B", capacity: 26 },
  { id: "C12", level: "3e C", name: "3e C", levelName: "3e", className: "C", capacity: 26 }
]

export const mockTeachers = [
  { id: "T1", name: "Mme Martin", subjects: ["Mathématiques"], availability: "full" },
  { id: "T2", name: "M. Bernard", subjects: ["Mathématiques"], availability: "full" },
  { id: "T3", name: "Mme Dubois", subjects: ["Français"], availability: "full" },
  { id: "T4", name: "M. Thomas", subjects: ["Français"], availability: "full" },
  { id: "T5", name: "Mme Robert", subjects: ["Histoire-Géo"], availability: "full" },
  { id: "T6", name: "M. Richard", subjects: ["Histoire-Géo"], availability: "full" },
  { id: "T7", name: "Mme Petit", subjects: ["Anglais"], availability: "full" },
  { id: "T8", name: "M. Durand", subjects: ["Anglais"], availability: "full" },
  { id: "T9", name: "Mme Leroy", subjects: ["SVT"], availability: "full" },
  { id: "T10", name: "M. Moreau", subjects: ["SVT"], availability: "full" },
  { id: "T11", name: "Mme Simon", subjects: ["Physique-Chimie"], availability: "full" },
  { id: "T12", name: "M. Laurent", subjects: ["Physique-Chimie"], availability: "full" },
  { id: "T13", name: "Mme Michel", subjects: ["Technologie"], availability: "full" },
  { id: "T14", name: "M. Garcia", subjects: ["EPS"], availability: "full" },
  { id: "T15", name: "Mme Martinez", subjects: ["EPS"], availability: "full" },
  { id: "T16", name: "M. David", subjects: ["Arts Plastiques"], availability: "part" },
  { id: "T17", name: "Mme Roux", subjects: ["Education Musicale"], availability: "part" },
  { id: "T18", name: "M. Vincent", subjects: ["Espagnol"], availability: "full" },
  { id: "T19", name: "Mme Fournier", subjects: ["Allemand"], availability: "part" },
  { id: "T20", name: "M. Morel", subjects: ["Latin"], availability: "part" }
]

export const mockCourses = [
  // 6ème
  { id: "CRS1", level: "6e", subject: "Mathématiques", hoursPerWeek: 4.5 },
  { id: "CRS2", level: "6e", subject: "Français", hoursPerWeek: 4.5 },
  { id: "CRS3", level: "6e", subject: "Histoire-Géo", hoursPerWeek: 3 },
  { id: "CRS4", level: "6e", subject: "Anglais", hoursPerWeek: 4 },
  { id: "CRS5", level: "6e", subject: "SVT", hoursPerWeek: 1.5 },
  { id: "CRS6", level: "6e", subject: "Technologie", hoursPerWeek: 1.5 },
  { id: "CRS7", level: "6e", subject: "Arts Plastiques", hoursPerWeek: 1 },
  { id: "CRS8", level: "6e", subject: "Education Musicale", hoursPerWeek: 1 },
  { id: "CRS9", level: "6e", subject: "EPS", hoursPerWeek: 4 },

  // 5ème (similaire à 6e avec quelques ajustements)
  { id: "CRS10", level: "5e", subject: "Mathématiques", hoursPerWeek: 3.5 },
  { id: "CRS11", level: "5e", subject: "Français", hoursPerWeek: 4.5 },
  { id: "CRS12", level: "5e", subject: "Histoire-Géo", hoursPerWeek: 3 },
  { id: "CRS13", level: "5e", subject: "Anglais", hoursPerWeek: 3 },
  { id: "CRS14", level: "5e", subject: "SVT", hoursPerWeek: 1.5 },
  { id: "CRS15", level: "5e", subject: "Physique-Chimie", hoursPerWeek: 1.5 },
  { id: "CRS16", level: "5e", subject: "Technologie", hoursPerWeek: 1.5 },
  { id: "CRS17", level: "5e", subject: "Arts Plastiques", hoursPerWeek: 1 },
  { id: "CRS18", level: "5e", subject: "Education Musicale", hoursPerWeek: 1 },
  { id: "CRS19", level: "5e", subject: "EPS", hoursPerWeek: 3 },
  { id: "CRS20", level: "5e", subject: "Latin", hoursPerWeek: 2, optional: true },

  // 4ème
  { id: "CRS21", level: "4e", subject: "Mathématiques", hoursPerWeek: 3.5 },
  { id: "CRS22", level: "4e", subject: "Français", hoursPerWeek: 4.5 },
  { id: "CRS23", level: "4e", subject: "Histoire-Géo", hoursPerWeek: 3 },
  { id: "CRS24", level: "4e", subject: "Anglais", hoursPerWeek: 3 },
  { id: "CRS25", level: "4e", subject: "SVT", hoursPerWeek: 1.5 },
  { id: "CRS26", level: "4e", subject: "Physique-Chimie", hoursPerWeek: 1.5 },
  { id: "CRS27", level: "4e", subject: "Technologie", hoursPerWeek: 1.5 },
  { id: "CRS28", level: "4e", subject: "Arts Plastiques", hoursPerWeek: 1 },
  { id: "CRS29", level: "4e", subject: "Education Musicale", hoursPerWeek: 1 },
  { id: "CRS30", level: "4e", subject: "EPS", hoursPerWeek: 3 },
  { id: "CRS31", level: "4e", subject: "Espagnol", hoursPerWeek: 2.5 },
  { id: "CRS32", level: "4e", subject: "Latin", hoursPerWeek: 2, optional: true },

  // 3ème
  { id: "CRS33", level: "3e", subject: "Mathématiques", hoursPerWeek: 3.5 },
  { id: "CRS34", level: "3e", subject: "Français", hoursPerWeek: 4.5 },
  { id: "CRS35", level: "3e", subject: "Histoire-Géo", hoursPerWeek: 3.5 },
  { id: "CRS36", level: "3e", subject: "Anglais", hoursPerWeek: 3 },
  { id: "CRS37", level: "3e", subject: "SVT", hoursPerWeek: 1.5 },
  { id: "CRS38", level: "3e", subject: "Physique-Chimie", hoursPerWeek: 1.5 },
  { id: "CRS39", level: "3e", subject: "Technologie", hoursPerWeek: 1.5 },
  { id: "CRS40", level: "3e", subject: "Arts Plastiques", hoursPerWeek: 1 },
  { id: "CRS41", level: "3e", subject: "Education Musicale", hoursPerWeek: 1 },
  { id: "CRS42", level: "3e", subject: "EPS", hoursPerWeek: 3 },
  { id: "CRS43", level: "3e", subject: "Espagnol", hoursPerWeek: 2.5 },
  { id: "CRS44", level: "3e", subject: "Latin", hoursPerWeek: 2, optional: true }
]

export const mockTimeSlots = [
  // Lundi
  { id: "TS1", day: "Lundi", day_of_week: 1, start_time: "08:00", end_time: "09:00" },
  { id: "TS2", day: "Lundi", day_of_week: 1, start_time: "09:00", end_time: "10:00" },
  { id: "TS3", day: "Lundi", day_of_week: 1, start_time: "10:15", end_time: "11:15" },
  { id: "TS4", day: "Lundi", day_of_week: 1, start_time: "11:15", end_time: "12:15" },
  { id: "TS5", day: "Lundi", day_of_week: 1, start_time: "13:45", end_time: "14:45" },
  { id: "TS6", day: "Lundi", day_of_week: 1, start_time: "14:45", end_time: "15:45" },
  { id: "TS7", day: "Lundi", day_of_week: 1, start_time: "16:00", end_time: "17:00" },

  // Mardi
  { id: "TS8", day: "Mardi", day_of_week: 2, start_time: "08:00", end_time: "09:00" },
  { id: "TS9", day: "Mardi", day_of_week: 2, start_time: "09:00", end_time: "10:00" },
  { id: "TS10", day: "Mardi", day_of_week: 2, start_time: "10:15", end_time: "11:15" },
  { id: "TS11", day: "Mardi", day_of_week: 2, start_time: "11:15", end_time: "12:15" },
  { id: "TS12", day: "Mardi", day_of_week: 2, start_time: "13:45", end_time: "14:45" },
  { id: "TS13", day: "Mardi", day_of_week: 2, start_time: "14:45", end_time: "15:45" },
  { id: "TS14", day: "Mardi", day_of_week: 2, start_time: "16:00", end_time: "17:00" },

  // Mercredi
  { id: "TS15", day: "Mercredi", day_of_week: 3, start_time: "08:00", end_time: "09:00" },
  { id: "TS16", day: "Mercredi", day_of_week: 3, start_time: "09:00", end_time: "10:00" },
  { id: "TS17", day: "Mercredi", day_of_week: 3, start_time: "10:15", end_time: "11:15" },
  { id: "TS18", day: "Mercredi", day_of_week: 3, start_time: "11:15", end_time: "12:15" },

  // Jeudi
  { id: "TS19", day: "Jeudi", day_of_week: 4, start_time: "08:00", end_time: "09:00" },
  { id: "TS20", day: "Jeudi", day_of_week: 4, start_time: "09:00", end_time: "10:00" },
  { id: "TS21", day: "Jeudi", day_of_week: 4, start_time: "10:15", end_time: "11:15" },
  { id: "TS22", day: "Jeudi", day_of_week: 4, start_time: "11:15", end_time: "12:15" },
  { id: "TS23", day: "Jeudi", day_of_week: 4, start_time: "13:45", end_time: "14:45" },
  { id: "TS24", day: "Jeudi", day_of_week: 4, start_time: "14:45", end_time: "15:45" },
  { id: "TS25", day: "Jeudi", day_of_week: 4, start_time: "16:00", end_time: "17:00" },

  // Vendredi
  { id: "TS26", day: "Vendredi", day_of_week: 5, start_time: "08:00", end_time: "09:00" },
  { id: "TS27", day: "Vendredi", day_of_week: 5, start_time: "09:00", end_time: "10:00" },
  { id: "TS28", day: "Vendredi", day_of_week: 5, start_time: "10:15", end_time: "11:15" },
  { id: "TS29", day: "Vendredi", day_of_week: 5, start_time: "11:15", end_time: "12:15" },
  { id: "TS30", day: "Vendredi", day_of_week: 5, start_time: "13:45", end_time: "14:45" },
  { id: "TS31", day: "Vendredi", day_of_week: 5, start_time: "14:45", end_time: "15:45" },
  { id: "TS32", day: "Vendredi", day_of_week: 5, start_time: "16:00", end_time: "17:00" }
]

// Ajouter des liens entre les cours et les classes/enseignants
export const mockSchedule = mockCourses.map((course) => {
  const classLevel = course.level
  const subject = course.subject
  
  // Trouver une classe correspondante
  const matchingClass = mockClasses.find(c => c.levelName === classLevel)
  
  // Trouver un enseignant correspondant
  const matchingTeacher = mockTeachers.find(t => t.subjects.includes(subject))
  
  if (matchingClass && matchingTeacher) {
    return {
      ...course,
      class_id: matchingClass.id,
      teacher_id: matchingTeacher.id,
      capacity: matchingClass.capacity
    }
  }
  return course
})

// Fonction pour charger toutes les données de test
export const loadMockData = () => {
  return {
    school: mockSchool,
    rooms: mockRooms,
    classes: mockClasses,
    teachers: mockTeachers,
    courses: mockSchedule, // Utiliser les cours avec les liens
    timeSlots: mockTimeSlots,
    schedule: [], // L'emploi du temps sera généré plus tard
    holidays: [] // Ajout des vacances vides pour la compatibilité
  }
} 