// components/dashboard/PlanGenerationToast.tsx
'use client';

import { Loader2, X } from 'lucide-react';
import { useState } from 'react';

interface PlanGenerationToastProps {
  generatedWeeks: number;
  totalWeeks: number;
  onDismiss?: () => void;
}

export function PlanGenerationToast({ 
  generatedWeeks, 
  totalWeeks,
  onDismiss 
}: PlanGenerationToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const progress = Math.round((generatedWeeks / totalWeeks) * 100);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-gradient-to-br from-blue-900/95 to-slate-900/95 backdrop-blur-xl border border-blue-500/50 rounded-xl shadow-2xl shadow-blue-500/20 max-w-sm">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h4 className="font-bold text-white text-sm">Generando tu plan</h4>
                <button
                  onClick={handleDismiss}
                  className="text-slate-400 hover:text-white transition-colors ml-2"
                  aria-label="Cerrar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-xs text-slate-400 mb-3">
                {generatedWeeks} de {totalWeeks} semanas completadas
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="text-right">
                <span className="text-2xl font-bold text-blue-400">{progress}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}