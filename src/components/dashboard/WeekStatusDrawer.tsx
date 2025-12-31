// components/dashboard/WeekStatusDrawer.tsx
'use client';

import { useState } from 'react';
import { Calendar, ChevronRight, X } from 'lucide-react';
import { WeekStatusIndicator } from './WeekStatusIndicator';

// Tipo compatible con WeekStatusIndicator
type WeekGenerationStatus = 'pending' | 'generating' | 'generated' | 'error';

interface WeekStatus {
  weekNumber: number;
  status: WeekGenerationStatus;
  generatedAt?: string;
  error?: string;
}

interface WeekStatusDrawerProps {
  weeks: WeekStatus[];
  generatedWeeks: number;
}

export function WeekStatusDrawer({ weeks, generatedWeeks }: WeekStatusDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button - Fixed Bottom Left */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl shadow-lg transition-all hover:shadow-emerald-500/20 group"
      >
        <Calendar className="w-4 h-4 text-emerald-400" />
        <span className="text-sm font-medium text-white">
          Estado de Semanas
        </span>
        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full">
          {generatedWeeks}/{weeks.length}
        </span>
        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-400 transition-colors" />
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Drawer Panel */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom-full duration-300 max-h-[70vh] overflow-hidden">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Estado de Semanas</h3>
                    <p className="text-sm text-slate-400">
                      {generatedWeeks} de {weeks.length} semanas generadas
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-500"
                    style={{ width: `${(generatedWeeks / weeks.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Week List */}
              <div className="max-h-[50vh] overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
                {weeks.map((week) => (
                  <WeekStatusIndicator 
                    key={week.weekNumber}
                    weekNumber={week.weekNumber}
                    status={week.status}
                    error={week.error}
                  />
                ))}
              </div>

              {/* Footer Summary */}
              <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-emerald-400">
                    {weeks.filter(w => w.status === 'generated').length}
                  </div>
                  <div className="text-xs text-slate-500">Completadas</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">
                    {weeks.filter(w => w.status === 'generating').length}
                  </div>
                  <div className="text-xs text-slate-500">En proceso</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-500">
                    {weeks.filter(w => w.status === 'pending').length}
                  </div>
                  <div className="text-xs text-slate-500">Pendientes</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}