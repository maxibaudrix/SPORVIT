'use client';

import { isSameDay } from 'date-fns';
import { DayEvent } from '@/types/calendar';
import { useCalendarNavigation } from '@/hooks/useCalendarNavigation';
import { DayCell } from './DayCell';

interface MonthViewProps {
  events: DayEvent[];
}

export const MonthView = ({ events }: MonthViewProps) => {
  const navigation = useCalendarNavigation({ view: 'month' });
  const monthData = navigation.getMonthData();

  // Filtrar eventos por día
  const getEventsForDay = (date: Date) => {
    return events.filter((event) => isSameDay(event.date, date));
  };

  // Nombres de días de la semana
  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return (
    <div className="hidden md:block p-6">
      {/* Header días de la semana */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-xs font-bold text-slate-500 uppercase text-center py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid de semanas */}
      <div className="space-y-2">
        {monthData.weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-2">
            {week.map((day, dayIndex) => (
              <DayCell
                key={`${day.date.toISOString()}-${dayIndex}`}
                day={day}
                events={getEventsForDay(day.date)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
