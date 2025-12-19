import { WeekInfo } from '@/types/calendar';

/**
 * Get the start of week (Monday) for a given date
 */
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

/**
 * Get the end of week (Sunday) for a given date
 */
export function getWeekEnd(date: Date): Date {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  return weekEnd;
}

/**
 * Get ISO week number for a given date
 */
export function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/**
 * Get year for ISO week (handles edge cases at year boundaries)
 */
export function getISOWeekYear(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  return d.getUTCFullYear();
}

/**
 * Get all days in a week (Monday to Sunday)
 */
export function getWeekDays(weekStart: Date): Date[] {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(day.getDate() + i);
    days.push(day);
  }
  return days;
}

/**
 * Format date to YYYY-MM-DD (ISO date string)
 */
export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Format date to readable string (e.g., "20 ENE")
 */
export function formatDateShort(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase();
  return `${day} ${month}`;
}

/**
 * Format date range (e.g., "20 ENE - 26 ENE")
 */
export function formatDateRange(start: Date, end: Date): string {
  return `${formatDateShort(start)} - ${formatDateShort(end)}`;
}

/**
 * Get day name in Spanish
 */
export function getDayName(date: Date, short: boolean = false): string {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: short ? 'short' : 'long' 
  };
  return date.toLocaleDateString('es-ES', options);
}

/**
 * Get week info for current week
 */
export function getCurrentWeekInfo(): WeekInfo {
  const now = new Date();
  return getWeekInfoForDate(now);
}

/**
 * Get week info for a specific date
 */
export function getWeekInfoForDate(date: Date): WeekInfo {
  const weekNumber = getISOWeek(date);
  const year = getISOWeekYear(date);
  const startDate = getWeekStart(date);
  const endDate = getWeekEnd(date);
  const label = `SEMANA ${weekNumber} · ${formatDateRange(startDate, endDate)}`;

  return {
    weekNumber,
    year,
    startDate,
    endDate,
    label,
  };
}

/**
 * Navigate to next week
 */
export function getNextWeek(currentDate: Date): Date {
  const next = new Date(currentDate);
  next.setDate(next.getDate() + 7);
  return next;
}

/**
 * Navigate to previous week
 */
export function getPreviousWeek(currentDate: Date): Date {
  const prev = new Date(currentDate);
  prev.setDate(prev.getDate() - 7);
  return prev;
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return formatDateISO(date1) === formatDateISO(date2);
}

/**
 * Check if date is today
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * Get time slots for calendar (06:00 - 22:00)
 */
export function getTimeSlots(): string[] {
  const slots: string[] = [];
  for (let hour = 6; hour <= 22; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  return slots;
}

/**
 * Parse time string to minutes since midnight
 */
export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Convert minutes since midnight to time string
 */
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}
