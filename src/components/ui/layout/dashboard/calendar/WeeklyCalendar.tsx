'use client';

import { useEffect } from 'react';
import { WeekPlan, DayEvent } from '@/types/calendar';
import { useCalendarState } from '@/hooks/useCalendarState';
import { useWeeklyPlan } from '@/hooks/useWeeklyPlan';
import { getWeekStart } from '@/lib/utils/calendar';
import WeekSelector from './WeekSelector';
import DayColumn from './DayColumn';
import { Loader2 } from 'lucide-react';

interface WeeklyCalendarProps {
  userId: string;
  onEventClick: (event: DayEvent) => void;
  onAddEvent: (date: Date) => void;
}

export default function WeeklyCalendar({
  userId,
  onEventClick,
  onAddEvent,
}: WeeklyCalendarProps) {
  const {
    state,
    getCurrentDate,
    goToNextWeek,
    goToPreviousWeek,
    goToToday,
  } = useCalendarState();

  // Get the start of the current week
  const weekStartDate = getWeekStart(getCurrentDate());

  // Fetch weekly plan
  const { weekPlan, isLoading, error, refetch } = useWeeklyPlan({
    weekStartDate,
    userId,
  });

  // Refetch when week changes
  useEffect(() => {
    refetch();
  }, [state.currentWeek, state.currentYear, refetch]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  if (!weekPlan) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Week selector */}
      <WeekSelector
        currentDate={weekStartDate}
        onPreviousWeek={goToPreviousWeek}
        onNextWeek={goToNextWeek}
        onToday={goToToday}
      />

      {/* Calendar grid */}
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        <div className="flex min-w-max">
          {weekPlan.days.map((dayPlan) => (
            <DayColumn
              key={dayPlan.date.toISOString()}
              dayPlan={dayPlan}
              onEventClick={onEventClick}
              onAddEvent={onAddEvent}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-full min-h-[500px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        <p className="text-sm text-slate-400">Cargando plan semanal...</p>
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="flex items-center justify-center h-full min-h-[500px]">
      <div className="flex flex-col items-center gap-4 max-w-md text-center">
        <div className="w-12 h-12 rounded-full bg-red-950/50 border border-red-900/50 flex items-center justify-center">
          <span className="text-red-400 text-xl">⚠</span>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Error al cargar el plan
          </h3>
          <p className="text-sm text-slate-400">
            {error}
          </p>
        </div>

        <button
          onClick={onRetry}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex items-center justify-center h-full min-h-[500px]">
      <div className="flex flex-col items-center gap-4 max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
          <span className="text-3xl">📅</span>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Aún no tienes un plan
          </h3>
          <p className="text-sm text-slate-400">
            Completa el onboarding para generar tu plan personalizado de entrenamiento y nutrición.
          </p>
        </div>

        <button
          onClick={() => window.location.href = '/onboarding'}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
        >
          Ir al Onboarding
        </button>
      </div>
    </div>
  );
}
