'use client';

import { useEffect } from 'react';
import { X, Dumbbell, Salad, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useDailyModal } from '@/hooks/useDailyModal';
import EventCard from './EventCard';

export const DailyModal = () => {
  const { isOpen, selectedDate, closeModal } = useDailyModal();

  // Mock events - en el futuro esto vendrá de props o de un fetch
  const events: any[] = [];

  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeModal]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !selectedDate) return null;

  const formattedDate = format(selectedDate, "EEEE d 'de' MMMM", { locale: es });

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={closeModal}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative bg-slate-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header sticky */}
          <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white capitalize">
                  {formattedDate}
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Gestiona tus eventos del día
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
                aria-label="Cerrar"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Body scrollable */}
          <div className="overflow-y-auto max-h-[calc(85vh-80px)] p-6">
            {/* Timeline de eventos */}
            {events.length > 0 ? (
              <div className="space-y-3 mb-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-3">
                  Eventos programados
                </h3>
                {events.map((event) => (
                  <EventCard key={event.id} event={event} onClick={() => {}} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 mb-6">
                <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                  <FileText className="w-10 h-10 text-slate-500" />
                </div>
                <p className="text-slate-400 text-center">
                  No hay eventos programados para este día
                </p>
              </div>
            )}

            {/* CTAs para agregar eventos */}
            <div className="border-t border-slate-800 pt-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4">
                Agregar nuevo evento
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* CTA Entrenamiento */}
                <button className="group p-6 rounded-xl bg-red-500/10 border border-red-500/30 hover:border-red-500/50 hover:bg-red-500/20 transition-all text-left">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Dumbbell className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Entrenamiento
                  </h3>
                  <p className="text-sm text-slate-400">
                    Programa una sesión de ejercicio
                  </p>
                </button>

                {/* CTA Comida */}
                <button className="group p-6 rounded-xl bg-orange-500/10 border border-orange-500/30 hover:border-orange-500/50 hover:bg-orange-500/20 transition-all text-left">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Salad className="w-6 h-6 text-orange-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">Comida</h3>
                  <p className="text-sm text-slate-400">
                    Registra una comida o snack
                  </p>
                </button>

                {/* CTA Nota */}
                <button className="group p-6 rounded-xl bg-blue-500/10 border border-blue-500/30 hover:border-blue-500/50 hover:bg-blue-500/20 transition-all text-left">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">Nota</h3>
                  <p className="text-sm text-slate-400">
                    Añade una nota o recordatorio
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
