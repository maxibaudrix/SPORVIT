'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { useOnboardingStore } from '@/store/onboarding';
import { useRouter } from 'next/navigation';

interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CompleteProfileModal({ isOpen, onClose }: CompleteProfileModalProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'training' | 'diet' | 'regenerating'>('training');
  const [isRegenerating, setIsRegenerating] = useState(false);

  const { training, diet, setTraining, setDiet, setCompletedModules, setPendingRegeneration } =
    useOnboardingStore();

  if (!isOpen) return null;

  const handleTrainingComplete = (trainingData: any) => {
    setTraining(trainingData);
    setCompletedModules({
      trainingDetailed: true,
      nutritionDetailed: false,
    });
    setCurrentStep('diet');
  };

  const handleDietComplete = (dietData: any) => {
    setDiet(dietData);
    setCompletedModules({
      trainingDetailed: true,
      nutritionDetailed: true,
    });
    setCurrentStep('regenerating');
    regeneratePlan();
  };

  const regeneratePlan = async () => {
    setIsRegenerating(true);
    setPendingRegeneration(true);

    try {
      const response = await fetch('/api/planning/regenerate-personalized', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: new Date().toISOString().split('T')[0],
        }),
      });

      if (!response.ok) {
        throw new Error('Error regenerating plan');
      }

      const result = await response.json();
      console.log('[CompleteProfileModal] Plan regenerated:', result);

      setPendingRegeneration(false);

      // Show success and redirect
      setTimeout(() => {
        onClose();
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('[CompleteProfileModal] Error:', error);
      alert('Error al regenerar el plan. Por favor intenta de nuevo.');
      setIsRegenerating(false);
      setPendingRegeneration(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        {/* Modal */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Completa tu perfil</h2>
                <p className="text-sm text-slate-400">
                  Obtén un plan más personalizado
                </p>
              </div>
            </div>
            {!isRegenerating && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            )}
          </div>

          {/* Progress */}
          <div className="px-6 py-4 border-b border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep === 'training'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {currentStep === 'training' ? '1' : <CheckCircle2 className="w-4 h-4" />}
                </div>
                <span
                  className={`text-sm font-medium ${
                    currentStep === 'training' ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  Entrenamiento
                </span>
              </div>

              <div className="flex-1 h-0.5 bg-slate-800 mx-2">
                <div
                  className={`h-full ${
                    currentStep !== 'training' ? 'bg-emerald-500' : 'bg-slate-800'
                  } transition-all`}
                ></div>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep === 'diet'
                      ? 'bg-emerald-500 text-white'
                      : currentStep === 'regenerating'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {currentStep === 'regenerating' ? <CheckCircle2 className="w-4 h-4" /> : '2'}
                </div>
                <span
                  className={`text-sm font-medium ${
                    currentStep === 'diet' ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  Nutrición
                </span>
              </div>

              <div className="flex-1 h-0.5 bg-slate-800 mx-2">
                <div
                  className={`h-full ${
                    currentStep === 'regenerating' ? 'bg-emerald-500' : 'bg-slate-800'
                  } transition-all`}
                ></div>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep === 'regenerating'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  3
                </div>
                <span
                  className={`text-sm font-medium ${
                    currentStep === 'regenerating' ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  Generar
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 overflow-y-auto max-h-[60vh]">
            {currentStep === 'training' && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4">
                  Detalles de Entrenamiento
                </h3>
                <p className="text-slate-400 mb-6">
                  Para personalizar tu plan de entrenamiento, necesitamos estos detalles adicionales. Esto te llevará al paso 4 del onboarding.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => router.push('/onboarding/step-4-training-level')}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                  >
                    Completar Ahora
                  </button>
                  <button
                    onClick={handleSkip}
                    className="px-6 py-3 bg-slate-800 text-slate-300 font-medium rounded-xl hover:bg-slate-700 transition-all"
                  >
                    Más tarde
                  </button>
                </div>
              </div>
            )}

            {currentStep === 'diet' && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4">
                  Preferencias de Nutrición
                </h3>
                <p className="text-slate-400 mb-6">
                  Ahora vamos a personalizar tu plan nutricional con tus preferencias y restricciones dietéticas.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => router.push('/onboarding/step-5-diet')}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                  >
                    Completar Ahora
                  </button>
                  <button
                    onClick={handleSkip}
                    className="px-6 py-3 bg-slate-800 text-slate-300 font-medium rounded-xl hover:bg-slate-700 transition-all"
                  >
                    Más tarde
                  </button>
                </div>
              </div>
            )}

            {currentStep === 'regenerating' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  {isRegenerating ? (
                    <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {isRegenerating ? 'Regenerando tu plan...' : '¡Plan actualizado!'}
                </h3>
                <p className="text-slate-400">
                  {isRegenerating
                    ? 'Estamos personalizando tu plan con los nuevos detalles'
                    : 'Tu plan ha sido actualizado con éxito'}
                </p>
              </div>
            )}
          </div>

          {/* Footer Info */}
          {currentStep !== 'regenerating' && (
            <div className="px-6 py-4 bg-slate-950 border-t border-slate-800">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400 text-sm">💡</span>
                </div>
                <div>
                  <p className="text-xs text-slate-400">
                    <strong className="text-blue-400">Tip:</strong> Completar tu perfil te ayudará a obtener planes de entrenamiento y nutrición más precisos y adaptados a tus necesidades.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
