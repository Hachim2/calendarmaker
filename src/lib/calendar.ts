import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export async function saveGeneratedCalendar(calendarData: any, classId: number) {
  const { error } = await supabase
    .from('calendars')
    .upsert({
      title: `Calendrier Classe ${classId}`,
      description: 'Calendrier généré automatiquement',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    })
  
  if (error) throw error
} 