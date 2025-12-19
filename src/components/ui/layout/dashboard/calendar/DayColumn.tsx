'use client';

import { DayPlan, DayEvent } from '@/types/calendar';
import { formatDateShort, getDayName, isToday } from '@/lib/utils/calendar';
import EventCard from './EventCard';
import EmptySlot from './EmptySlot';

interface DayColumnProps {
  dayPlan: DayPlan;
  onEventClick: (event: DayEvent) => void;
  onAddEvent: (date: Date) => void;
}

export default function DayColumn({ 
  dayPlan, 
  onEventClick, 
  onAddEvent 
}: DayColumnProps) {
  const { date, dayOfWeek, events } = dayPlan;
  const isCurrentDay = isToday(date);

  // Filter out rest events for display purposes (we'll show them differently)
  const workouts = events.filter(e => e.type === 'workout');
  const meals = events.filter(e => e.type === 'meal');
  const hasEvents = workouts.length > 0 || meals.length > 0;

  return (
    <div className={`
      flex-1 min-w-[200px] 
      border-r border-slate-800 last:border-r-0
      ${isCurrentDay ? 'bg-emerald-950/10' : ''}
    `}>
      {/* Day header */}
      <div className={`
        sticky top-0 z-10 
        px-4 py-3 
        border-b border-slate-800
        ${isCurrentDay ? 'bg-emerald-950/20' : 'bg-slate-950/95'}
        backdrop-blur-sm
      `}>
        <div className="flex flex-col items-center">
          <span className={`
            text-xs font-medium uppercase tracking-wide
            ${isCurrentDay ? 'text-emerald-400' : 'text-slate-500'}
          `}>
            {getDayName(date, true)}
          </span>
          
          <div className={`
            mt-1 flex items-center justify-center
            w-10 h-10 rounded-full
            ${isCurrentDay 
              ? 'bg-emerald-500 text-white' 
              : 'text-slate-300'
            }
          `}>
            <span className={`
              text-lg font-bold
              ${isCurrentDay ? 'text-white' : 'text-slate-200'}
            `}>
              {date.getDate()}
            </span>
          </div>

          <span className="text-xs text-slate-600 mt-1">
            {formatDateShort(date)}
          </span>
        </div>
      </div>

      {/* Events container */}
      <div className="p-3 space-y-3 min-h-[500px]">
        {/* Workouts section */}
        {workouts.length > 0 && (
          <div className="space-y-2">
            {workouts.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => onEventClick(event)}
              />
            ))}
          </div>
        )}

        {/* Meals section */}
        {meals.length > 0 && (
          <div className="space-y-2">
            {meals.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => onEventClick(event)}
              />
            ))}
          </div>
        )}

        {/* Rest day indicator */}
        {workouts.length === 0 && (
          <div className="flex items-center justify-center py-4">
            <span className="text-xs text-slate-600 italic">
              Día de descanso
            </span>
          </div>
        )}

        {/* Empty slot to add events */}
        {hasEvents ? (
          <EmptySlot
            date={date}
            onClick={() => onAddEvent(date)}
          />
        ) : (
          <div className="pt-2">
            <EmptySlot
              date={date}
              onClick={() => onAddEvent(date)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
