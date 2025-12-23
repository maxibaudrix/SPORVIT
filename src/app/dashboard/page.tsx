'use client';

import { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useWeeklyPlan } from '@/hooks/useWeeklyPlan';
import { usePlanGenerationStatus } from '@/hooks/usePlanGenerationStatus';
import { DayEvent } from '@/types/calendar';
import { getWeekStart } from '@/lib/utils/calendar';
import { Loader2 } from 'lucide-react'; // Asegúrate de tener lucide-react instalado

import WeeklyCalendar from '@/components/ui/layout/dashboard/calendar/WeeklyCalendar';
import { WeekStatusIndicator } from '@/components/dashboard/WeekStatusIndicator';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [selectedEvent, setSelectedEvent] = useState<DayEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // ✅ 1. Memorizar la fecha de inicio de la semana actual
  const currentWeekStart = useMemo(() => {
    return getWeekStart(new Date());
  }, []);

  // ✅ 2. Hook de status de generación (Polling)
  const { 
    status: planStatus, 
    loading: statusLoading, 
    error: statusError 
  } = usePlanGenerationStatus();

  // ✅ 3. Hook del plan semanal
  const { 
    weekPlan, 
    isLoading: planLoading, 
    error: planError,
    refetch 
  } = useWeeklyPlan({ 
    weekStartDate: currentWeekStart, 
    userId: session?.user?.id 
  });

  // Handlers
  const handleEventClick = (event: DayEvent) => {
    setSelectedEvent(event);
    setSelectedDate(event.date);
  };

  const handleAddEvent = (date: Date) => {
    setSelectedEvent(null);
    setSelectedDate(date);
  };

  // ============================================
  // RENDERIZADO CONDICIONAL (Dentro de la función)
  // ============================================

  // 1. Estado de carga inicial de la sesión o el status
  if (statusLoading || !session?.user?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-emerald-500 mx-auto mb-4" />
          <p className="text-slate-400">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  // 2. Estado de error
  if (statusError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center bg-red-900/20 border border-red-500 rounded-xl p-8 max-w-md">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
          <p className="text-slate-300 mb-4">{statusError}</p>
          <a href="/onboarding/step-6-macros" className="inline-block px-6 py-2 bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors">
            Volver a intentar
          </a>
        </div>
      </div>
    );
  }

  // 3. Si no hay plan activo
  if (!planStatus) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-4">No hay plan activo</h2>
          <p className="text-slate-400 mb-6">Completa el onboarding para crear tu plan personalizado</p>
          <a href="/onboarding/step-1-biometrics" className="inline-block px-6 py-3 bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors">
            Crear mi plan
          </a>
        </div>
      </div>
    );
  }

  // 4. CONTENIDO PRINCIPAL
  return (
    <div className="h-full flex flex-col bg-slate-950 min-h-screen">
      {/* Banner de generación en progreso */}
      {!planStatus.isComplete && (
        <div className="bg-blue-900/20 border-b border-blue-500/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
              <div>
                <p className="text-white font-medium">Generando tu plan completo...</p>
                <p className="text-slate-400 text-sm">
                  {planStatus.generatedWeeks} de {planStatus.totalWeeks} semanas completadas
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-400">
                {Math.round((planStatus.generatedWeeks / planStatus.totalWeeks) * 100)}%
              </div>
            </div>
          </div>
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
        {/* Calendario */}
        <div className="flex-1 overflow-y-auto">
          {/* Aquí va tu componente de Calendario, asegúrate de pasarle el userId correctamente */}
          {/* <WeeklyCalendar 
              userId={session.user.id} 
              onEventClick={handleEventClick} 
              onAddEvent={handleAddEvent} 
          /> */}
          <div className="p-8 text-white">
            Calendario Semanal para: {session.user.id}
            {/* ... resto de tu UI ... */}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-80 border-l border-slate-800 bg-slate-900/50 p-4 overflow-y-auto hidden lg:block">
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">
              Estado de Semanas
            </h3>
            <div className="space-y-2">
              {planStatus.weeks.map((week) => (
                <div key={week.weekNumber} className="text-slate-300 text-sm">
                   Semana {week.weekNumber}: {week.status}
                </div>
              ))}
            </div>
            
            <div className="pt-6 border-t border-slate-800">
              <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Resumen</h3>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Generadas</span>
                <span className="text-emerald-400 font-bold">{planStatus.generatedWeeks}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}