'use client';

import { Plus } from 'lucide-react';
import { useDailyModal } from '@/hooks/useDailyModal';

interface AddEventButtonProps {
  date: Date;
  variant?: 'inline' | 'fab';
}

export const AddEventButton = ({ date, variant = 'inline' }: AddEventButtonProps) => {
  const { openModal } = useDailyModal();

  if (variant === 'fab') {
    return (
      <button
        onClick={() => openModal(date)}
        className="fixed bottom-6 right-6 md:hidden w-14 h-14 bg-emerald-500 hover:bg-emerald-600 rounded-full shadow-2xl shadow-emerald-500/30 flex items-center justify-center z-30 transition-all active:scale-95"
        aria-label="Agregar evento"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>
    );
  }

  return (
    <button
      onClick={() => openModal(date)}
      className="w-full border-2 border-dashed border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/5 rounded-xl py-3 transition-all flex items-center justify-center gap-2 text-slate-400 hover:text-emerald-400"
    >
      <Plus className="w-4 h-4" />
      <span className="text-sm font-medium">Agregar</span>
    </button>
  );
};
