// src/components/ui/layout/dashboard/sidebar/CalculatorWrapper.tsx
'use client';

import { ArrowLeft } from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';
import { getCalculatorById } from '@/config/calculators';

// ============ FASE 1: MVP ============
import BMICalculator from '@/app/calculators/imc/BMICalculator';
import OneRMCalculator from '@/app/calculators/1rm/OneRMCalculator';
import MacroCalculator from '@/app/calculators/macros/MacroCalculator';
import CaloricDeficitCalculator from '@/app/calculators/deficit/CaloricDeficitCalculator';
import HarrisBenedictCalculator from '@/app/calculators/harris-benedict/HarrisBenedictCalculator';

// ============ FASE 2: Esenciales ============
import ProteinCalculator from '@/app/calculators/protein/ProteinCalculator';
import TrainingPaceCalculator from '@/app/calculators/running-pace/TrainingPaceCalculator';
import HRZonesCalculator from '@/app/calculators/heart-rate-zones/HRZonesCalculator';
import BodyFatCalculator from '@/app/calculators/body-fat/BodyFatCalculator';
import WaterIntakeCalculator from '@/app/calculators/water/WaterIntakeCalculator';

// ============ FASE 3: Avanzadas ============
import VO2MaxCalculator from '@/app/calculators/vo2max/VO2MaxCalculator';
import FTPCalculator from '@/app/calculators/ftp/FTPCalculator';
import FFMICalculator from '@/app/calculators/ffmi/FFMICalculator';
import TrainingVolumeCalculator from '@/app/calculators/training-volume/TrainingVolumeCalculator';
import ProgressionCalculator from '@/app/calculators/progression/ProgressionCalculator';

const CALCULATOR_COMPONENTS: Record<string, React.ComponentType<{compact?: boolean}>> = {
  // Fase 1
  'imc': BMICalculator,
  '1rm': OneRMCalculator,
  'macros': MacroCalculator,
  'deficit': CaloricDeficitCalculator,
  'harris-benedict': HarrisBenedictCalculator,
  
  // Fase 2
  'protein': ProteinCalculator,
  'running-pace': TrainingPaceCalculator,
  'heart-rate-zones': HRZonesCalculator,
  'body-fat': BodyFatCalculator,
  'water': WaterIntakeCalculator,
  
  // Fase 3
  'vo2max': VO2MaxCalculator,
  'ftp': FTPCalculator,
  'ffmi': FFMICalculator,
  'training-volume': TrainingVolumeCalculator,
  'progression': ProgressionCalculator,
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
        <CalculatorComponent compact={true} />
      </div>
    </div>
  );
}