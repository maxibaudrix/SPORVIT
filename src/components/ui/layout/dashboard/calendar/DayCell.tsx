'use client';

import { CalendarDate, DayEvent } from '@/types/calendar';
import { useDailyModal } from '@/hooks/useDailyModal';

interface DayCellProps {
  day: CalendarDate;
  events: DayEvent[];
}

export const DayCell = ({ day, events }: DayCellProps) => {
  const { openModal } = useDailyModal();

  // Agrupar eventos por tipo para los dots
  const workouts = events.filter((e) => e.type === 'workout');
  const meals = events.filter((e) => e.type === 'meal');
  const rest = events.filter((e) => e.type === 'rest');

  // Dots a mostrar (max 3)
  const dots = [
    ...workouts.slice(0, 1).map(() => ({ type: 'workout', color: 'bg-red-500' })),
    ...meals.slice(0, 1).map(() => ({ type: 'meal', color: 'bg-orange-500' })),
    ...rest.slice(0, 1).map(() => ({ type: 'rest', color: 'bg-blue-500' })),
  ].slice(0, 3);

  const overflowCount = events.length > 3 ? events.length - 3 : 0;

  return (
    <button
      onClick={() => openModal(day.date)}
      className={`
        aspect-square p-2 rounded-lg border transition-all
        flex flex-col h-full
        ${
          day.isToday
            ? 'border-emerald-500 bg-emerald-500/5 ring-2 ring-emerald-500/20'
            : 'border-slate-800 hover:border-slate-600 hover:bg-slate-800/30'
        }
        ${!day.isCurrentMonth ? 'opacity-40' : ''}
      `}
    >
      {/* Número del día */}
      <div
        className={`text-sm font-bold ${
          day.isToday ? 'text-emerald-500' : 'text-white'
        }`}
      >
        {day.dayNumber}
      </div>

      {/* Dots indicadores al bottom */}
      {events.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1 items-center justify-center">
          {dots.map((dot, index) => (
            <div
              key={`${dot.type}-${index}`}
              className={`w-1.5 h-1.5 rounded-full ${dot.color}`}
            />
          ))}
          {overflowCount > 0 && (
            <span className="text-[10px] text-slate-400 font-medium ml-0.5">
              +{overflowCount}
            </span>
          )}
        </div>
      )}
    </button>
  );
};
