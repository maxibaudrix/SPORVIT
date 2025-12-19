// src/components/onboarding/StepButtons.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, ArrowRight, Loader2, Check } from 'lucide-react';

interface StepButtonsProps {
  currentStep: number;
  nextPath: string;
  prevPath: string;
  isSubmitting: boolean;
  onNext: () => void;
  isLastStep: boolean;
}

export default function StepButtons({
  currentStep,
  nextPath,
  prevPath,
  isSubmitting,
  onNext,
  isLastStep,
}: StepButtonsProps) {
  const router = useRouter();

  return (
    <div className="flex justify-between pt-6 border-t border-slate-800 mt-8">
      {/* Botón Anterior */}
      <Button
        type="button"
        variant="outline"
        onClick={() => router.push(prevPath)}
        disabled={isSubmitting}
        className="bg-slate-900 border-slate-700 hover:bg-slate-800 text-white"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {currentStep === 1 ? 'Cancelar' : 'Anterior'}
      </Button>

      {/* Botón Siguiente/Finalizar */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/50 transition-all disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {isLastStep ? 'Guardando...' : 'Procesando...'}
          </>
        ) : isLastStep ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Finalizar
          </>
        ) : (
          <>
            Siguiente
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
}