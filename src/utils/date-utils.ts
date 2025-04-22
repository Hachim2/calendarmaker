import { format, parse, addDays, addMonths, addYears, differenceInDays, isSameDay, isWithinInterval, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, getDay } from 'date-fns';
import { RecurringPattern } from '@/types/calendar';

/**
 * Formats a date for display
 */
export function formatDisplayDate(date: Date | string, formatString = 'MMM d, yyyy'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatString);
}

/**
 * Formats a date for API requests
 */
export function formatApiDate(date: Date | string, formatString = 'yyyy-MM-dd'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatString);
}

/**
 * Formats a time for display
 */
export function formatDisplayTime(date: Date | string, formatString = 'h:mm a'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatString);
}

/**
 * Formats a full datetime for display
 */
export function formatDisplayDateTime(date: Date | string, formatString = 'MMM d, yyyy h:mm a'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatString);
}

/**
 * Parse a string date to a Date object
 */
export function parseDate(dateString: string, formatString = 'yyyy-MM-dd'): Date {
  return parse(dateString, formatString, new Date());
}

/**
 * Get a date range for a view (day, week, month)
 */
export function getDateRangeForView(date: Date, view: 'day' | 'week' | 'month'): { start: Date; end: Date } {
  switch (view) {
    case 'day':
      return {
        start: startOfDay(date),
        end: endOfDay(date),
      };
    case 'week':
      return {
        start: startOfWeek(date, { weekStartsOn: 0 }), // 0 = Sunday
        end: endOfWeek(date, { weekStartsOn: 0 }),
      };
    case 'month':
      return {
        start: startOfMonth(date),
        end: endOfMonth(date),
      };
    default:
      return {
        start: startOfDay(date),
        end: endOfDay(date),
      };
  }
}

/**
 * Generate recurring dates based on a recurring pattern
 * @param startDate The start date of the event
 * @param endDate The end date of the event (single occurrence)
 * @param pattern The recurring pattern
 * @param rangeStart The start of the date range to generate dates for
 * @param rangeEnd The end of the date range to generate dates for
 * @returns An array of date ranges for the recurring events
 */
export function generateRecurringDates(
  startDate: Date,
  endDate: Date,
  pattern: RecurringPattern,
  rangeStart: Date,
  rangeEnd: Date
): Array<{ start: Date; end: Date }> {
  const result: Array<{ start: Date; end: Date }> = [];
  const eventDuration = differenceInDays(endDate, startDate);
  
  // Define end condition
  const patternEndDate = pattern.endDate 
    ? new Date(pattern.endDate) 
    : pattern.endAfterOccurrences 
      ? undefined // Will handle this inside the loop
      : addYears(rangeEnd, 1); // Default to a year after the range end to ensure we capture all events in range
  
  let currentDate = new Date(startDate);
  let occurrences = 0;
  
  // Check if we're already past the end date
  if (patternEndDate && currentDate > patternEndDate) {
    return result;
  }
  
  // If the event starts after the range ends, return empty array
  if (currentDate > rangeEnd) {
    return result;
  }
  
  // Keep generating dates until we hit the end condition
  while (
    (patternEndDate ? currentDate <= patternEndDate : true) && 
    (pattern.endAfterOccurrences ? occurrences < pattern.endAfterOccurrences : true) &&
    currentDate <= rangeEnd
  ) {
    // Skip the event if it's in the excluded dates
    const isExcluded = pattern.excludeDates?.some(d => 
      isSameDay(currentDate, new Date(d))
    );
    
    // Add the event if it's within our range and not excluded
    if (
      !isExcluded && 
      isWithinInterval(currentDate, { start: rangeStart, end: rangeEnd })
    ) {
      const eventStart = new Date(currentDate);
      const eventEnd = addDays(eventStart, eventDuration);
      result.push({ start: eventStart, end: eventEnd });
    }
    
    // Move to next occurrence based on pattern
    switch (pattern.type) {
      case 'daily':
        currentDate = addDays(currentDate, pattern.interval);
        break;
        
      case 'weekly':
        // If specific days of week are specified
        if (pattern.daysOfWeek && pattern.daysOfWeek.length > 0) {
          const currentDayOfWeek = getDay(currentDate);
          const nextDayOfWeekIndex = pattern.daysOfWeek.findIndex(d => d > currentDayOfWeek);
          
          if (nextDayOfWeekIndex !== -1) {
            // Move to next day of week in the same week
            const daysToAdd = pattern.daysOfWeek[nextDayOfWeekIndex] - currentDayOfWeek;
            currentDate = addDays(currentDate, daysToAdd);
          } else {
            // Move to first day of week in the next week
            const daysToAdd = 7 - currentDayOfWeek + pattern.daysOfWeek[0] + (7 * (pattern.interval - 1));
            currentDate = addDays(currentDate, daysToAdd);
          }
        } else {
          // Simple weekly recurrence
          currentDate = addDays(currentDate, 7 * pattern.interval);
        }
        break;
        
      case 'monthly':
        currentDate = addMonths(currentDate, pattern.interval);
        break;
        
      case 'yearly':
        currentDate = addYears(currentDate, pattern.interval);
        break;
    }
    
    occurrences++;
    
    // Safety check to prevent infinite loops
    if (occurrences > 1000) {
      console.warn('Too many occurrences generated, stopping to prevent infinite loop');
      break;
    }
  }
  
  return result;
}

/**
 * Check if two date ranges overlap
 */
export function doDateRangesOverlap(
  range1Start: Date,
  range1End: Date,
  range2Start: Date,
  range2End: Date
): boolean {
  return (
    (range1Start <= range2End && range1End >= range2Start) ||
    (range2Start <= range1End && range2End >= range1Start)
  );
}

/**
 * Get the duration between two dates in a human-readable format
 */
export function getDurationDisplay(startDate: Date, endDate: Date): string {
  const durationInDays = differenceInDays(endDate, startDate);
  
  if (durationInDays === 0) {
    // Same day
    return formatDisplayDate(startDate, 'MMM d, yyyy');
  } else if (durationInDays < 1) {
    // Less than a day
    return `${formatDisplayDateTime(startDate)} - ${formatDisplayTime(endDate)}`;
  } else {
    // Multiple days
    return `${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`;
  }
} 