'use client';

import { CalendarDate, DayEvent } from '@/types/calendar';
import EventCard from './EventCard';
import { EmptyDayState } from './EmptyDayState';
import { AddEventButton } from './AddEventButton';

interface DayColumnNewProps {
  day: CalendarDate;
  events: DayEvent[];
}

export const DayColumnNew = ({ day, events }: DayColumnNewProps) => {
  const hasEvents = events.length > 0;

  return (
    <div
      className={`
        min-h-[600px] rounded-xl p-4 border transition-all
        ${
          day.isToday
            ? 'bg-slate-900/30 border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-500/10'
            : 'bg-slate-900/30 border-slate-800 hover:border-slate-700'
        }
      `}
    >
      {/* Header del día */}
      <div className="border-b border-slate-800 pb-3 mb-4">
        <div className="text-xs text-slate-500 uppercase font-medium">
          {day.dayName}
        </div>
        <div
          className={`text-3xl font-black ${
            day.isToday ? 'text-emerald-500' : 'text-white'
          }`}
        >
          {day.dayNumber}
        </div>
      </div>

      {/* Lista de eventos */}
      <div className="space-y-2 mb-4">
        {hasEvents ? (
          events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <EmptyDayState />
        )}
      </div>

      {/* Botón agregar al final */}
      <AddEventButton date={day.date} variant="inline" />
    </div>
  );
};
