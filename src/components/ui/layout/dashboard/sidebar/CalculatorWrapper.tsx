// src/components/ui/layout/dashboard/sidebar/CalculatorWrapper.tsx
'use client';

import { ArrowLeft } from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';
import { getCalculatorById } from '@/config/calculators';

// Importar calculadoras Fase 1
import BMICalculator from '@/app/calculators/imc/BMICalculator';

const CALCULATOR_COMPONENTS: Record<string, React.ComponentType> = {
  'imc': BMICalculator,
};

export default function CalculatorWrapper() {
  const { activeCalculator, closeCalculator } = useSidebarStore();

  if (!activeCalculator) return null;

  const calculator = getCalculatorById(activeCalculator);
  const CalculatorComponent = CALCULATOR_COMPONENTS[activeCalculator];

  if (!calculator || !CalculatorComponent) {
    return (
      <div className="p-4 text-center text-slate-500">
        <p>Calculadora no encontrada</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-3 p-4 border-b border-slate-800">
        <button
          onClick={closeCalculator}
          className="p-1 hover:bg-slate-800 rounded transition-colors"
          title="Volver"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400" />
        </button>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white truncate">{calculator.name}</h3>
          <p className="text-xs text-slate-500 truncate">{calculator.description}</p>
        </div>
      </div>

      {/* Calculator Content */}
      <div className="flex-1 overflow-y-auto">
        <CalculatorComponent />
      </div>
    </div>
  );
}