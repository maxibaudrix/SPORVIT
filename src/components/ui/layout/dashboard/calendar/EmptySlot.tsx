'use client';

import { Plus } from 'lucide-react';

interface EmptySlotProps {
  date: Date;
  timeSlot?: string;
  onClick: () => void;
}

export default function EmptySlot({ date, timeSlot, onClick }: EmptySlotProps) {
  return (
    <button
      onClick={onClick}
      className="
        group
        w-full p-4 
        border-2 border-dashed border-slate-800 
        rounded-lg 
        hover:border-emerald-500/50 hover:bg-slate-900/50
        transition-all
        flex items-center justify-center
      "
    >
      <div className="flex flex-col items-center gap-2">
        <div className="
          w-10 h-10 
          rounded-full 
          bg-slate-800 
          group-hover:bg-emerald-900/30 
          flex items-center justify-center
          transition-colors
        ">
          <Plus className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 transition-colors" />
        </div>
        
        <span className="text-xs text-slate-600 group-hover:text-slate-400 transition-colors">
          Agregar evento
        </span>
      </div>
    </button>
  );
}
