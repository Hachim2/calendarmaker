export interface Schedule {
  id: string
  course_id: string
  time_slot_id: string
  room_id: string
  teacher_id: string
  class_id: string
  created_at: string
  updated_at: string
}

export interface TimeSlot {
  id: string
  start_time: string
  end_time: string
  day_of_week: number
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  name: string
  code: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface Class {
  id: string
  name: string
  level: string
  capacity: number
  created_at: string
  updated_at: string
}

export interface Room {
  id: string
  name: string
  capacity: number
  type: string
  created_at: string
  updated_at: string
}

export interface Teacher {
  id: string
  name: string
  email: string
  created_at: string
  updated_at: string
} 