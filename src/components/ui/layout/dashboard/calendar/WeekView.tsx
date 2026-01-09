'use client';

import { useMemo } from 'react';
import { isSameDay } from 'date-fns';
import { DayEvent, WeekData } from '@/types/calendar';
import { DayColumnNew } from './DayColumnNew';

interface WeekViewProps {
  events: DayEvent[];
  weekData: WeekData;
}

export const WeekView = ({ events, weekData }: WeekViewProps) => {
  // Filtrar eventos por día
  const getEventsForDay = (date: Date) => {
    const dayEvents = events.filter((event) => isSameDay(event.date, date));
    console.log(`📅 [WeekView] Events for ${date.toISOString().split('T')[0]}:`, dayEvents.length);
    return dayEvents;
  };

  console.log('📊 [WeekView] Total events:', events.length);
  console.log('📊 [WeekView] Week days:', weekData.days.map(d => d.date.toISOString().split('T')[0]));

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
