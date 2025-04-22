import { z } from 'zod';
import { Database } from '@/lib/database.types';

export type Calendar = Database['public']['Tables']['calendars']['Row'];
export type CalendarEvent = Database['public']['Tables']['calendar_events']['Row'];
export type Entity = Database['public']['Tables']['entities']['Row'];
export type CalendarEntityAssignment = Database['public']['Tables']['calendar_entity_assignments']['Row'];
export type EventEntityAssignment = Database['public']['Tables']['event_entity_assignments']['Row'];

export type EntityType = 'teacher' | 'class' | 'student' | 'staff';

export type RecurringPattern = {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: string;
  endAfterOccurrences?: number;
  daysOfWeek?: number[]; // 0 (Sunday) to 6 (Saturday)
  dayOfMonth?: number;
  monthOfYear?: number;
  nthDayOfMonth?: number; // e.g., 2nd Tuesday of the month
  excludeDates?: string[]; // ISO date strings for excluded dates
};

export type CalendarView = 'day' | 'week' | 'month' | 'list';

export type CalendarWithEvents = Calendar & {
  events: CalendarEvent[];
};

export type CalendarWithEntities = Calendar & {
  entities: Entity[];
};

export type EventWithEntities = CalendarEvent & {
  entities: Entity[];
};

export type EntityWithCalendars = Entity & {
  calendars: Calendar[];
};

export type EntityWithEvents = Entity & {
  events: CalendarEvent[];
};

// Zod Schemas for Validation

export const recurringPatternSchema = z.object({
  type: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  interval: z.number().min(1),
  endDate: z.string().optional(),
  endAfterOccurrences: z.number().optional(),
  daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
  dayOfMonth: z.number().min(1).max(31).optional(),
  monthOfYear: z.number().min(1).max(12).optional(),
  nthDayOfMonth: z.number().optional(),
  excludeDates: z.array(z.string()).optional()
});

export const calendarSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  academic_year: z.string().optional(),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  is_template: z.boolean().optional()
});

export const calendarEventSchema = z.object({
  calendar_id: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  all_day: z.boolean().optional(),
  color: z.string().optional(),
  recurring_pattern: recurringPatternSchema.optional()
});

export const entitySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['teacher', 'class', 'student', 'staff']),
  details: z.record(z.any()).optional()
});

export const calendarEntityAssignmentSchema = z.object({
  calendar_id: z.string().uuid(),
  entity_id: z.string().uuid()
});

export const eventEntityAssignmentSchema = z.object({
  event_id: z.string().uuid(),
  entity_id: z.string().uuid()
}); 