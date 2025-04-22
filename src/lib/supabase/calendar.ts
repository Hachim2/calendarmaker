import { supabase } from './client'
import type { TablesInsert } from '@/lib/database.types'

export async function saveGeneratedCalendar(calendarData: any, classId: number) {
  const calendar: TablesInsert<'calendars'> = {
    title: `Calendrier Classe ${classId}`,
    description: 'Calendrier généré automatiquement',
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  }

  const { error } = await supabase
    .from('calendars')
    .upsert(calendar)
  
  if (error) throw error
} 