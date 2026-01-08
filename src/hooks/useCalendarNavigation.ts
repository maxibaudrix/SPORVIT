import { useState, useCallback } from 'react';
import {
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  isToday,
  format,
  addDays,
  getWeek,
  getMonth,
  getYear,
  eachDayOfInterval,
  startOfDay,
  isSameMonth,
} from 'date-fns';
import { es } from 'date-fns/locale';
import type { CalendarView, CalendarDate, WeekData, MonthData } from '@/types/calendar';

interface UseCalendarNavigationProps {
  view: CalendarView;
}

export const useCalendarNavigation = ({ view }: UseCalendarNavigationProps) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Navegación
  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentDate((prev) => {
      if (view === 'week') {
        return subWeeks(prev, 1);
      } else {
        return subMonths(prev, 1);
      }
    });
  }, [view]);

  const goToNext = useCallback(() => {
    setCurrentDate((prev) => {
      if (view === 'week') {
        return addWeeks(prev, 1);
      } else {
        return addMonths(prev, 1);
      }
    });
  }, [view]);

  // Convertir Date a CalendarDate
  const toCalendarDate = useCallback(
    (date: Date, referenceMonth?: number): CalendarDate => {
      return {
        date: startOfDay(date),
        dayNumber: parseInt(format(date, 'd')),
        dayName: format(date, 'EEE', { locale: es }),
        isToday: isToday(date),
        isCurrentMonth: referenceMonth !== undefined ? isSameMonth(date, new Date(getYear(currentDate), referenceMonth, 1)) : true,
      };
    },
    [currentDate]
  );

  // Obtener datos de la semana
  const getWeekData = useCallback((): WeekData => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Lunes
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 }); // Domingo

    const days = eachDayOfInterval({ start: weekStart, end: weekEnd }).map((date) =>
      toCalendarDate(date)
    );

    return {
      weekNumber: getWeek(currentDate, { weekStartsOn: 1 }),
      year: getYear(currentDate),
      days,
    };
  }, [currentDate, toCalendarDate]);

  // Obtener datos del mes
  const getMonthData = useCallback((): MonthData => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);

    // Obtener el primer día visible (puede ser del mes anterior)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    // Obtener el último día visible (puede ser del mes siguiente)
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    const currentMonth = getMonth(currentDate);

    // Dividir en semanas
    const weeks: CalendarDate[][] = [];
    for (let i = 0; i < allDays.length; i += 7) {
      const weekDays = allDays.slice(i, i + 7).map((date) =>
        toCalendarDate(date, currentMonth)
      );
      weeks.push(weekDays);
    }

    return {
      month: currentMonth,
      year: getYear(currentDate),
      weeks,
    };
  }, [currentDate, toCalendarDate]);

  // Obtener título formateado para el header
  const getHeaderTitle = useCallback((): string => {
    if (view === 'week') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

      // Si cruzan dos meses diferentes
      if (getMonth(weekStart) !== getMonth(weekEnd)) {
        return `${format(weekStart, 'MMM d', { locale: es })} - ${format(
          weekEnd,
          'MMM d, yyyy',
          { locale: es }
        )}`;
      }

      // Mismo mes
      return `${format(weekStart, 'MMMM d', { locale: es })} - ${format(
        weekEnd,
        'd, yyyy',
        { locale: es }
      )}`;
    } else {
      // Vista mensual
      return format(currentDate, 'MMMM yyyy', { locale: es });
    }
  }, [currentDate, view]);

  return {
    currentDate,
    goToToday,
    goToPrevious,
    goToNext,
    getWeekData,
    getMonthData,
    getHeaderTitle,
  };
};
