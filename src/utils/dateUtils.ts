
import { addWeeks, format, isAfter, isBefore, isEqual, startOfDay, isValid, parseISO } from "date-fns";

export interface WeeklySchedule {
  startDate: Date;
  endDate: Date;
  currentWeek: number;
  totalWeeks: number;
  dueDate: Date;
  weeklyDueDates: { week: number; date: Date }[];
  progress: number;
  daysLeft: number;
}

/**
 * Safely parses a date value that could be a Date object or string
 */
export function safeParseDateValue(dateValue: Date | string | null | undefined): Date | null {
  if (!dateValue) return null;
  
  if (typeof dateValue === 'string') {
    try {
      const parsedDate = parseISO(dateValue);
      return isValid(parsedDate) ? parsedDate : null;
    } catch (error) {
      console.error("Error parsing date string:", error);
      return null;
    }
  }
  
  return dateValue instanceof Date && isValid(dateValue) ? dateValue : null;
}

/**
 * Calculates a user's 8-week program schedule based on registration date
 */
export function calculateProgramSchedule(registrationDate: Date | string): WeeklySchedule {
  // Ensure we have a valid date to work with
  const validDate = safeParseDateValue(registrationDate);
  if (!validDate) {
    throw new Error('Invalid registration date provided');
  }
  
  const today = startOfDay(new Date());
  const startDate = startOfDay(validDate);
  const totalWeeks = 8;
  
  // Calculate end date (8 weeks from registration)
  const endDate = addWeeks(startDate, totalWeeks);
  
  // Calculate which week the user is currently in
  let currentWeek = 0;
  let weeklyDueDates: { week: number; date: Date }[] = [];
  
  for (let i = 1; i <= totalWeeks; i++) {
    const weekDueDate = addWeeks(startDate, i);
    weeklyDueDates.push({ week: i, date: weekDueDate });
    
    if (isBefore(today, weekDueDate) || isEqual(today, weekDueDate)) {
      if (currentWeek === 0) currentWeek = i;
    }
  }
  
  // Cap at 8 if program is complete
  if (isAfter(today, endDate)) {
    currentWeek = totalWeeks;
  }
  
  // Calculate progress percentage
  const progress = Math.min(Math.round((currentWeek / totalWeeks) * 100), 100);
  
  // Calculate days left until program ends
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / msPerDay));
  
  return {
    startDate,
    endDate,
    currentWeek,
    totalWeeks,
    dueDate: endDate,
    weeklyDueDates,
    progress,
    daysLeft
  };
}

/**
 * Format a date in a user-friendly format
 */
export function formatDate(date: Date | string | null | undefined): string {
  const validDate = safeParseDateValue(date);
  if (!validDate) {
    return 'Invalid date';
  }
  
  try {
    return format(validDate, "MMM d, yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return 'Invalid date';
  }
}
