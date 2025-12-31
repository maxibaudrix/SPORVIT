// components/ui/layout/dashboard/Sidebar.tsx
'use client';

import { useState } from 'react';
import { Calendar, Timer, ChevronDown, ChevronUp } from 'lucide-react';
import MonthlyCalendarWidget from './MonthlyCalendarWidget';
import TimerWidget from './TimerWidget';

export default function Sidebar() {
  const [showCalendar, setShowCalendar] = useState(true);
  const [showTimer, setShowTimer] = useState(false);

  return (
    <div className="h-full flex flex-col bg-slate-950/50">
      {/* Calendario Mensual - Colapsable */}
      <div className="border-b border-slate-800/50">
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-900/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Mes
            </h3>
          </div>
          {showCalendar ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          )}
        </button>
        {showCalendar && (
          <div className="px-2 pb-3">
            <MonthlyCalendarWidget />
          </div>
        )}
      </div>

      {/* Timer Section - Colapsable */}
      <div className="border-b border-slate-800/50">
        <button
          onClick={() => setShowTimer(!showTimer)}
          className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-900/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Timer className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-medium text-white">Timer</span>
          </div>
          {showTimer ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          )}
        </button>

        {showTimer && (
          <div className="px-2 pb-3">
            <TimerWidget />
          </div>
        )}
      </div>

      {/* Info Section Compacta */}
      <div className="mt-auto p-3">
        <div className="p-2 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
          <p className="text-[10px] text-emerald-400 font-medium mb-1">
            💡 Tip
          </p>
          <p className="text-[9px] text-slate-400 leading-tight">
            Mantén horarios consistentes
          </p>
        </div>
      </div>
    </div>
  );
}