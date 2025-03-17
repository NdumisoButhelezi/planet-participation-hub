
import { addWeeks, format, isAfter, isBefore, isEqual, startOfDay } from "date-fns";

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
 * Calculates a user's 8-week program schedule based on registration date
 */
export function calculateProgramSchedule(registrationDate: Date): WeeklySchedule {
  const today = startOfDay(new Date());
  const startDate = startOfDay(registrationDate);
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
export function formatDate(date: Date): string {
  return format(date, "MMM d, yyyy");
}
