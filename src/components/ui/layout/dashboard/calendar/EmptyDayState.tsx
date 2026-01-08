'use client';

import { Calendar } from 'lucide-react';

export const EmptyDayState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      {/* Icono con círculo de fondo */}
      <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-3">
        <Calendar className="w-8 h-8 text-slate-500" />
      </div>

      {/* Texto */}
      <p className="text-sm text-slate-500">
        Sin eventos
        <br />
        programados
      </p>
    </div>
  );
};
