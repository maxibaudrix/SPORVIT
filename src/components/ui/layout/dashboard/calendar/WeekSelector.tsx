'use client';

import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { getWeekInfoForDate } from '@/lib/utils/calendar';

interface WeekSelectorProps {
  currentDate: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
}

export default function WeekSelector({
  currentDate,
  onPreviousWeek,
  onNextWeek,
  onToday,
}: WeekSelectorProps) {
  const weekInfo = getWeekInfoForDate(currentDate);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
      {/* Week label */}
      <div className="flex items-center gap-3">
        <Calendar className="w-5 h-5 text-emerald-400" />
        <h2 className="text-lg font-bold text-white">
          {weekInfo.label}
        </h2>
      </div>

      {/* Navigation controls */}
      <div className="flex items-center gap-2">
        {/* Today button */}
        <button
          onClick={onToday}
          className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          Hoy
        </button>

        {/* Previous week */}
        <button
          onClick={onPreviousWeek}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Semana anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Next week */}
        <button
          onClick={onNextWeek}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Semana siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
