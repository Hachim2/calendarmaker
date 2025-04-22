/**
 * Supabase client configuration
 * 
 * This file exports a Supabase client instance for use throughout the application.
 * 
 * Important: Install the @supabase/supabase-js package:
 * npm install @supabase/supabase-js
 */

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Helper function to get user session
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error.message);
    return null;
  }
  return data.session;
};

// Helper function to get user
export const getUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting user:', error.message);
    return null;
  }
  return data.user;
};

export async function saveGeneratedCalendar(calendarData: any, classId: number) {
  const { error } = await supabase
    .from('calendars')
    .upsert({
      title: `Calendrier Classe ${classId}`,
      description: 'Calendrier généré automatiquement',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      data: calendarData,
      updated_at: new Date().toISOString()
    })
  
  if (error) throw error
}
