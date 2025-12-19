// src/components/onboarding/StepHeader.tsx
'use client';

import { Progress } from '@/components/ui/Progress';
import { Dumbbell } from 'lucide-react';

interface StepHeaderProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
}

export default function StepHeader({
  currentStep,
  totalSteps,
  title,
  description,
}: StepHeaderProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="px-8 pt-8 pb-6">
      {/* Logo Mini */}
      <div className="flex items-center justify-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/50">
          <Dumbbell className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-medium text-slate-400 mb-2">
          <span>Paso {currentStep} de {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Title & Description */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="text-slate-400 text-sm md:text-base">{description}</p>
      </div>
    </div>
  );
}