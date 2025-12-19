'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, Clock } from 'lucide-react';
import { DayEvent } from '@/types/calendar';
import WeeklyCalendar from '@/components/ui/layout/dashboard/calendar/WeeklyCalendar';
import { usePlanGenerationStatus } from '@/hooks/usePlanGenerationStatus';
import { WeekStatusIndicator } from '@/components/dashboard/WeekStatusIndicator';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [selectedEvent, setSelectedEvent] = useState<DayEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Hook de polling de status de generación
  const { status: planStatus, loading: statusLoading, error: statusError } = usePlanGenerationStatus();

  // Handler for when an event is clicked
  const handleEventClick = (event: DayEvent) => {
    setSelectedEvent(event);
    setSelectedDate(event.date);
    console.log('Event clicked:', event);
  };

  // Handler for when "add event" is clicked
  const handleAddEvent = (date: Date) => {
    setSelectedEvent(null);
    setSelectedDate(date);
    console.log('Add event for date:', date);
  };

  // Loading state
  if (statusLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Cargando tu plan...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (statusError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center bg-red-900/20 border border-red-500 rounded-xl p-8 max-w-md">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
          <p className="text-slate-300 mb-4">{statusError}</p>
          <a 
            href="/onboarding/step-6-macros" 
            className="inline-block px-6 py-2 bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Volver a generar plan
          </a>
        </div>
      </div>
    );
  }

  // No plan state
  if (!planStatus) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-4">No hay plan activo</h2>
          <p className="text-slate-400 mb-6">Completa el onboarding para crear tu plan personalizado</p>
          <a 
            href="/onboarding/step-1-biometrics" 
            className="inline-block px-6 py-3 bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors font-semibold"
          >
            Crear mi plan
          </a>
        </div>
      </div>
    );
  }

  if (!session?.user?.id) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px]">
        <div className="text-center">
          <p className="text-slate-400">Cargando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-950">
      {/* Banner de generación en progreso */}
      {!planStatus.isComplete && (
        <div className="bg-blue-900/20 border-b border-blue-500/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
              <div>
                <p className="text-white font-medium">
                  Generando tu plan completo...
                </p>
                <p className="text-slate-400 text-sm">
                  {planStatus.generatedWeeks} de {planStatus.totalWeeks} semanas completadas
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-400">
                {Math.round((planStatus.generatedWeeks / planStatus.totalWeeks) * 100)}%
              </div>
              <div className="text-xs text-slate-500">Progreso</div>
            </div>
          </div>
          
          {/* Barra de progreso */}
          <div className="mt-3 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full transition-all duration-500"
              style={{ width: `${(planStatus.generatedWeeks / planStatus.totalWeeks) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main calendar view */}
        <div className="flex-1">
          <WeeklyCalendar
            userId={session.user.id}
            onEventClick={handleEventClick}
            onAddEvent={handleAddEvent}
          />
        </div>

        {/* Sidebar con status de semanas */}
        <aside className="w-80 border-l border-slate-800 bg-slate-900/50 p-4 overflow-y-auto">
          <div className="space-y-6">
            {/* Status de generación de semanas */}
            <div>
              <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">
                Estado de Semanas
              </h3>
              <div className="space-y-2">
                {planStatus.weeks.slice(0, 12).map((week) => (
                  <WeekStatusIndicator
                    key={week.weekNumber}
                    weekNumber={week.weekNumber}
                    status={week.status}
                    error={week.error}
                  />
                ))}
              </div>
            </div>

            {/* Estadísticas generales */}
            <div className="pt-6 border-t border-slate-800">
              <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">
                Resumen
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Total semanas</span>
                  <span className="text-white font-bold">{planStatus.totalWeeks}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Generadas</span>
                  <span className="text-emerald-400 font-bold">{planStatus.generatedWeeks}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Pendientes</span>
                  <span className="text-slate-500 font-bold">{planStatus.pendingWeeks}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}