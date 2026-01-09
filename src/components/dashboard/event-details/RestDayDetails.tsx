'use client';

import { RestEvent } from '@/types/calendar';
import { BedDouble, Moon, Droplets, Footprints, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface RestDayDetailsProps {
  event: RestEvent;
  dailyCalories?: number;
}

export function RestDayDetails({ event, dailyCalories }: RestDayDetailsProps) {
  const formattedDate = format(event.date, "EEEE d 'de' MMMM", { locale: es });

  return (
    <div className="space-y-6">
      {/* Header con ícono grande */}
      <div className="flex flex-col items-center text-center py-8">
        <div className="w-24 h-24 rounded-full bg-slate-800/50 border-2 border-slate-700 flex items-center justify-center mb-6">
          <BedDouble className="w-12 h-12 text-slate-400" />
        </div>

        <h2 className="text-3xl font-bold text-white mb-2">
          DÍA DE DESCANSO
        </h2>

        <p className="text-slate-400 capitalize">
          {formattedDate}
        </p>
      </div>

      {/* Mensaje principal */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 text-center">
        <p className="text-lg text-slate-300 leading-relaxed">
          Hoy tu cuerpo se recupera
        </p>
        <p className="text-sm text-slate-500 mt-2">
          El descanso es parte fundamental de tu progreso
        </p>
      </div>

      {/* Recomendaciones */}
      <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4">
          Recomendaciones para hoy
        </h3>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50">
            <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
              <Moon className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <div className="text-white font-medium">Prioriza el sueño</div>
              <div className="text-sm text-slate-400 mt-1">
                Intenta dormir 8 horas para una recuperación óptima
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
              <Droplets className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <div className="text-white font-medium">Hidrátate bien</div>
              <div className="text-sm text-slate-400 mt-1">
                Mantén tu cuerpo hidratado durante todo el día
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <Footprints className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-white font-medium">Caminata ligera opcional</div>
              <div className="text-sm text-slate-400 mt-1">
                15-20 minutos para activar la circulación sin forzar
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50">
            <div className="w-8 h-8 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <div className="text-white font-medium">Estiramientos suaves</div>
              <div className="text-sm text-slate-400 mt-1">
                Movilidad articular y estiramientos pasivos
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calorías del día */}
      {dailyCalories && (
        <div className="p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-400 mb-1">Calorías objetivo hoy</div>
              <div className="text-3xl font-bold text-white">
                {dailyCalories.toLocaleString()}
                <span className="text-lg text-slate-400 ml-2">kcal</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Día de descanso - mantén tu nutrición
              </div>
            </div>
            <div className="w-16 h-16 rounded-full bg-orange-500/10 border-2 border-orange-500/30 flex items-center justify-center">
              <span className="text-2xl">🍽️</span>
            </div>
          </div>
        </div>
      )}

      {/* Nota informativa */}
      <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
        <div className="flex items-start gap-3">
          <div className="text-blue-400 mt-0.5">ℹ️</div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Los días de descanso son tan importantes como los días de entrenamiento.
            Tu cuerpo necesita tiempo para reparar tejidos, reponer energía y adaptarse al estímulo del ejercicio.
          </p>
        </div>
      </div>
    </div>
  );
}
