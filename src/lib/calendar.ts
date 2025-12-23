// src/lib/calendar.ts
export interface WeekInfo {
  weekNumber: number;
  year: number;
  month: number;
}

export function getCurrentWeekInfo(date: Date = new Date()): WeekInfo {
  const tempDate = new Date(date);
  tempDate.setHours(0, 0, 0, 0);
  
  // ISO week date calculation
  tempDate.setDate(tempDate.getDate() + 3 - (tempDate.getDay() + 6) % 7);
  const week1 = new Date(tempDate.getFullYear(), 0, 4);
  const weekNumber = 1 + Math.round(((tempDate.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  
  return {
    weekNumber,
    year: tempDate.getFullYear(),
    month: tempDate.getMonth() + 1,
  };
}

export function getCurrentWeekDates(startDate: Date): Date[] {
  const dates: Date[] = [];
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < 7; i++) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}