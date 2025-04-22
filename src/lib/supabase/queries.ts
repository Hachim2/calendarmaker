import { supabase } from './client';
import { Schedule, TimeSlot, Course, Class, Room, Teacher } from '@/lib/app.types';

type AnyRecord = Record<string, any>;

export async function getSchedule() {
  const { data, error } = await supabase
    .from('schedule')
    .select('*');
  
  if (error) throw error;
  return { data: data as AnyRecord[] };
}

export async function getTimeSlots() {
  const { data, error } = await supabase
    .from('time_slots')
    .select('*')
    .order('start_time');
  
  if (error) throw error;
  return { data: data as AnyRecord[] };
}

export async function getCourses() {
  const { data, error } = await supabase
    .from('courses')
    .select('*');
  
  if (error) throw error;
  return { data: data as AnyRecord[] };
}

export async function getClasses() {
  const { data, error } = await supabase
    .from('classes')
    .select('*');
  
  if (error) throw error;
  return { data: data as AnyRecord[] };
}

export async function getRooms() {
  const { data, error } = await supabase
    .from('rooms')
    .select('*');
  
  if (error) throw error;
  return { data: data as AnyRecord[] };
}

export async function getTeachers() {
  const { data, error } = await supabase
    .from('teachers')
    .select('*');
  
  if (error) throw error;
  return { data: data as AnyRecord[] };
} 