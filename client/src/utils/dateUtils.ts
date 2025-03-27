import { format, formatDistanceToNow, isToday, isPast, isFuture, parseISO, addDays } from 'date-fns';

// Format a date into a readable string
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'EEEE, MMMM d, yyyy');
};

// Format a time into a readable string
export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'h:mm a');
};

// Format a date and time into a readable string
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) {
    return `Today at ${format(dateObj, 'h:mm a')}`;
  }
  
  return format(dateObj, 'MMM d, yyyy \'at\' h:mm a');
};

// Get relative time (e.g., "2 hours ago", "in 3 days")
export const getRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

// Check if a date is in the past
export const isDatePast = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isPast(dateObj);
};

// Check if a date is in the future
export const isDateFuture = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isFuture(dateObj);
};

// Calculate next dose date based on schedule
export const calculateNextDoseDate = (lastDoseDate: Date, schedule: string): Date => {
  switch (schedule.toLowerCase()) {
    case 'daily':
      return addDays(lastDoseDate, 1);
    case 'every other day':
      return addDays(lastDoseDate, 2);
    case 'weekly':
      return addDays(lastDoseDate, 7);
    default:
      return addDays(lastDoseDate, 1);
  }
};

// Calculate refill date based on remaining doses and schedule
export const calculateRefillDate = (remainingDoses: number, schedule: string): Date => {
  const today = new Date();
  
  switch (schedule.toLowerCase()) {
    case 'daily':
      return addDays(today, remainingDoses);
    case 'every other day':
      return addDays(today, remainingDoses * 2);
    case 'weekly':
      return addDays(today, remainingDoses * 7);
    default:
      return addDays(today, remainingDoses);
  }
};

// Get formatted schedule time string (e.g., "8:00 AM")
export const getScheduleTimeString = (time: string): string => {
  try {
    // Parse time string (expected format: "HH:mm")
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    
    return format(date, 'h:mm a');
  } catch (error) {
    console.error('Error parsing time string:', error);
    return time;
  }
};
