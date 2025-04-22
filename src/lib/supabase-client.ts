import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function saveSchool(data: any) {
  const { error } = await supabase
    .from('schools')
    .upsert(data)
  if (error) throw error
}

export async function saveRooms(data: any) {
  const { error } = await supabase
    .from('rooms')
    .upsert(data)
  if (error) throw error
}

export async function saveClasses(data: any) {
  const { error } = await supabase
    .from('classes')
    .upsert(data)
  if (error) throw error
}

export async function saveTeachers(data: any) {
  const { error } = await supabase
    .from('teachers')
    .upsert(data)
  if (error) throw error
}

export async function saveCourses(data: any) {
  const { error } = await supabase
    .from('courses')
    .upsert(data)
  if (error) throw error
}

export async function saveTimeSlots(data: any) {
  const { error } = await supabase
    .from('time_slots')
    .upsert(data)
  if (error) throw error
}

export async function saveHolidays(data: any) {
  const { error } = await supabase
    .from('holidays')
    .upsert(data)
  if (error) throw error
} 