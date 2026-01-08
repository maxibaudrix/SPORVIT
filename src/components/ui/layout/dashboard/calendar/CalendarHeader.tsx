'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendarView } from '@/hooks/useCalendarView';

interface CalendarHeaderProps {
  title: string;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

export const CalendarHeader = ({
  title,
  onPrevious,
  onNext,
  onToday,
}: CalendarHeaderProps) => {
  const { view, setView } = useCalendarView();

  return (
    <div className="sticky top-0 z-20 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Sección izquierda: Navegación y título */}
        <div className="flex items-center gap-4">
          {/* Botones navegación */}
          <div className="flex items-center gap-2">
            <button
              onClick={onPrevious}
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={onNext}
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Título */}
          <h2 className="text-xl md:text-2xl font-bold text-white capitalize">
            {title}
          </h2>

          {/* Botón Hoy */}
          <button
            onClick={onToday}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Hoy
          </button>
        </div>

        {/* Sección derecha: Toggle Semana/Mes (solo desktop) */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900 rounded-lg p-1">
          <button
            onClick={() => setView('week')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              view === 'week'
                ? 'bg-emerald-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => setView('month')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              view === 'month'
                ? 'bg-emerald-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Mes
          </button>
        </div>
      </div>
    </div>
  );
};
