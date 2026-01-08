'use client';

import { useMemo } from 'react';
import { isSameDay } from 'date-fns';
import { DayEvent } from '@/types/calendar';
import { useCalendarNavigation } from '@/hooks/useCalendarNavigation';
import { DayColumnNew } from './DayColumnNew';

interface WeekViewProps {
  events: DayEvent[];
}

export const WeekView = ({ events }: WeekViewProps) => {
  const navigation = useCalendarNavigation({ view: 'week' });
  const weekData = navigation.getWeekData();

  // Filtrar eventos por día
  const getEventsForDay = (date: Date) => {
    return events.filter((event) => isSameDay(event.date, date));
  };

  return (
    <div className="hidden md:grid md:grid-cols-7 gap-4 p-6">
      {weekData.days.map((day, index) => (
        <DayColumnNew
          key={`${day.date.toISOString()}-${index}`}
          day={day}
          events={getEventsForDay(day.date)}
        />
      ))}
    </div>
  );
};
