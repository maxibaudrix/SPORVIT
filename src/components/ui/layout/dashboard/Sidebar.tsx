// components/ui/layout/dashboard/Sidebar.tsx
'use client';

import { useState } from 'react';
import { Calendar, Timer } from 'lucide-react';
import MonthlyCalendarWidget from './MonthlyCalendarWidget';
import TimerWidget from './TimerWidget';

export default function Sidebar() {
  const [showTimer, setShowTimer] = useState(false);

  return (
    <div className="h-full flex flex-col">
      {/* Calendario Mensual */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Vista Mensual
          </h3>
        </div>
        <MonthlyCalendarWidget />
      </div>

      {/* Timer Section */}
      <div className="p-4">
        <button
          onClick={() => setShowTimer(!showTimer)}
          className="w-full flex items-center justify-between px-4 py-3 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-white">Timer</span>
          </div>
          <span className="text-xs text-slate-500 group-hover:text-slate-400">
            {showTimer ? 'Ocultar' : 'Mostrar'}
          </span>
        </button>

        {showTimer && (
          <div className="mt-3">
            <TimerWidget />
          </div>
        )}
      </div>

      {/* Info Section (opcional) */}
      <div className="mt-auto p-4 border-t border-slate-800">
        <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
          <p className="text-xs text-emerald-400 font-medium mb-1">
            💡 Tip del día
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Mantén consistencia en tus horarios de comida para mejores resultados.
          </p>
        </div>
      </div>
    </div>
  );
}