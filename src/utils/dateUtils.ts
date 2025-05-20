
import { addWeeks, format, isAfter, isBefore, isEqual, startOfDay, isValid, parseISO, differenceInDays, addDays } from "date-fns";

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
  
  // If it's a Firebase Timestamp, it should have toDate() method
  if (dateValue instanceof Object && 'toDate' in dateValue && typeof dateValue.toDate === 'function') {
    try {
      return dateValue.toDate();
    } catch (error) {
      console.error("Error converting Firestore timestamp:", error);
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

/**
 * Calculate user engagement metrics
 * @param registrationDate The date the user registered
 * @param lastSubmissionDate The date of the user's last submission
 * @param submissionsCount Total number of submissions
 */
export function calculateUserEngagement(registrationDate: Date | string | null | undefined, lastSubmissionDate: Date | string | null | undefined, submissionsCount: number): { 
  activeFor: number; 
  submissionsPerWeek: number;
  daysSinceLastSubmission: number;
  isActive: boolean;
} {
  const validRegistrationDate = safeParseDateValue(registrationDate);
  const validLastSubmissionDate = safeParseDateValue(lastSubmissionDate);
  const today = new Date();
  
  if (!validRegistrationDate) {
    return { activeFor: 0, submissionsPerWeek: 0, daysSinceLastSubmission: 0, isActive: false };
  }
  
  // Calculate days active
  const activeForDays = differenceInDays(today, validRegistrationDate);
  
  // Calculate weeks active (minimum 1 week to avoid division by zero)
  const weeksActive = Math.max(1, Math.ceil(activeForDays / 7));
  
  // Calculate submissions per week
  const submissionsPerWeek = submissionsCount / weeksActive;
  
  // Calculate days since last submission
  const daysSinceLastSubmission = validLastSubmissionDate 
    ? differenceInDays(today, validLastSubmissionDate)
    : activeForDays;
  
  // User is considered active if they submitted something in the last 14 days
  const isActive = daysSinceLastSubmission <= 14;
  
  return {
    activeFor: activeForDays,
    submissionsPerWeek: parseFloat(submissionsPerWeek.toFixed(2)),
    daysSinceLastSubmission,
    isActive
  };
}

/**
 * Calculate time remaining before next submission is due
 * @param registrationDate User registration date
 * @param lastSubmissionDate Last submission date
 * @param submissionTimeExtension Any extra time granted (in days)
 */
export function calculateTimeToNextSubmission(registrationDate: Date | string | null | undefined, lastSubmissionDate: Date | string | null | undefined, submissionTimeExtension: number = 0): {
  daysToNextSubmission: number;
  nextSubmissionDate: Date | null;
  hasTimeExtension: boolean;
} {
  const validRegistrationDate = safeParseDateValue(registrationDate);
  const validLastSubmissionDate = safeParseDateValue(lastSubmissionDate);
  
  if (!validRegistrationDate) {
    return { daysToNextSubmission: 0, nextSubmissionDate: null, hasTimeExtension: false };
  }
  
  const today = new Date();
  
  // If no submissions yet, calculate from registration date + 7 days
  if (!validLastSubmissionDate) {
    const firstDueDate = addDays(validRegistrationDate, 7);
    const daysToFirstSubmission = Math.max(0, differenceInDays(firstDueDate, today));
    
    return {
      daysToNextSubmission: daysToFirstSubmission,
      nextSubmissionDate: firstDueDate,
      hasTimeExtension: submissionTimeExtension > 0
    };
  }
  
  // Standard submission interval is 7 days
  let nextDueDate = addDays(validLastSubmissionDate, 7);
  
  // Add any extensions
  if (submissionTimeExtension > 0) {
    nextDueDate = addDays(nextDueDate, submissionTimeExtension);
  }
  
  const daysToNextDue = Math.max(0, differenceInDays(nextDueDate, today));
  
  return {
    daysToNextSubmission: daysToNextDue,
    nextSubmissionDate: nextDueDate,
    hasTimeExtension: submissionTimeExtension > 0
  };
}
