'use client';

import { useEffect, useState } from 'react';
import { DayEvent } from '@/types/calendar';
import { useCalendarState } from '@/hooks/useCalendarState';
import { useWeeklyPlan } from '@/hooks/useWeeklyPlan';
import { useCalendarView } from '@/hooks/useCalendarView';
import { useCalendarNavigation } from '@/hooks/useCalendarNavigation';
import WeekSelector from './WeekSelector';
import WeeklyDatePicker from './WeeklyDatePicker';
import DailyDetailView from '@/components/ui/layout/dashboard/DailyDetailView';
import { CalendarHeader } from './CalendarHeader';
import { WeekView } from './WeekView';
import { MonthView } from './MonthView';
import { AddEventButton } from './AddEventButton';
import { DailyModal } from './DailyModal';
import { Loader2 } from 'lucide-react';

interface WeeklyCalendarProps {
  userId: string;
}

export default function WeeklyCalendar({
  userId,
}: WeeklyCalendarProps) {
  // Estado de vista (week/month) del nuevo sistema
  const { view } = useCalendarView();
  const navigation = useCalendarNavigation({ view });
  const {
    goToNextWeek,
    goToPreviousWeek,
    goToToday,
  } = useCalendarState();

  // Estados para la fecha y eventos seleccionados
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState<DayEvent[]>([]);

  // 🚨 HARDCODED TEMPORALMENTE - Semana del 29 de diciembre 2025
  const weekStartDate = new Date('2025-12-29T00:00:00');
  console.log('🚨 [WeeklyCalendar] FECHA HARDCODEADA:', weekStartDate.toISOString());

  // Fetch weekly plan
  const { weekPlan, isLoading, error, refetch } = useWeeklyPlan({
    weekStartDate,
    userId,
  });

  // Auto-seleccionar día actual al cargar
  useEffect(() => {
    if (weekPlan && !selectedDate) {
      const today = new Date();
      const todayInWeek = weekPlan.days.find(d =>
        d.date.toDateString() === today.toDateString()
      );

      if (todayInWeek) {
        setSelectedDate(today);
        setSelectedDayEvents(todayInWeek.events);
      } else {
        // Si hoy no está en la semana, seleccionar el primer día
        setSelectedDate(weekPlan.days[0].date);
        setSelectedDayEvents(weekPlan.days[0].events);
      }
    }
  }, [weekPlan, selectedDate]);

  // Handler para selección de fecha desde WeeklyDatePicker
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);

    // Encontrar los eventos del día seleccionado
    if (weekPlan) {
      const selectedDayPlan = weekPlan.days.find(
        d => d.date.toDateString() === date.toDateString()
      );
      setSelectedDayEvents(selectedDayPlan?.events || []);
    }
  };

  // Handlers para navegación de días en DailyDetailPanel
  const handlePreviousDay = () => {
    if (!selectedDate || !weekPlan) return;
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);

    const prevDayPlan = weekPlan.days.find(
      d => d.date.toDateString() === prevDay.toDateString()
    );

    if (prevDayPlan) {
      setSelectedDate(prevDay);
      setSelectedDayEvents(prevDayPlan.events);
    }
  };

  const handleNextDay = () => {
    if (!selectedDate || !weekPlan) return;
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const nextDayPlan = weekPlan.days.find(
      d => d.date.toDateString() === nextDay.toDateString()
    );

    if (nextDayPlan) {
      setSelectedDate(nextDay);
      setSelectedDayEvents(nextDayPlan.events);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  if (!weekPlan) {
    return <EmptyState />;
  }

  // Convertir DayEvent[] a CalendarEvent[] para las nuevas vistas
  const calendarEvents: DayEvent[] = weekPlan?.days.flatMap(day => day.events) || [];

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* DESKTOP: Nuevo sistema con header y toggle week/month */}
      <div className="hidden md:block">
        <CalendarHeader
          title={navigation.getHeaderTitle()}
          onPrevious={navigation.goToPrevious}
          onNext={navigation.goToNext}
          onToday={navigation.goToToday}
        />

        {/* Vista desktop según toggle */}
        {view === 'week' ? (
          <WeekView events={calendarEvents} />
        ) : (
          <MonthView events={calendarEvents} />
        )}

        {/* Modal Daily */}
        <DailyModal />
      </div>

      {/* MOBILE: Vista vertical actual (SIN MODIFICAR) */}
      <div className="md:hidden flex flex-col h-full">
        {/* Week selector */}
        <WeekSelector
          currentDate={weekStartDate}
          onPreviousWeek={goToPreviousWeek}
          onNextWeek={goToNextWeek}
          onToday={goToToday}
        />

        {/* Weekly Date Picker */}
        <WeeklyDatePicker
          days={weekPlan.days}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />

        {/* Daily Detail View - Integrado */}
        {selectedDate && (
          <div className="flex-1 overflow-y-auto pb-8">
            <DailyDetailView
              date={selectedDate}
              events={selectedDayEvents}
              onPreviousDay={handlePreviousDay}
              onNextDay={handleNextDay}
            />
          </div>
        )}

        {/* FAB Mobile */}
        <AddEventButton date={new Date()} variant="fab" />
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