// src/app/training/today/page.tsx
'use client';

import React, { useEffect } from 'react';
import AppShell from '@/components/shared/layout/AppShell';
import { useTrainingStore } from '@/store/training';
import { useUserStore } from '@/store/user';
import { generateDailyWorkout } from '@/lib/trainingEngine/generateWorkout';
import { WorkoutCard } from '@/components/training/WorkoutCard';
import { ExerciseList } from '@/components/training/ExerciseList';
import { Button } from '@/components/ui/Button';

export default function TrainingPage() {
  const { currentWorkout, setCurrentWorkout, completeWorkout } = useTrainingStore();
  const { user } = useUserStore();
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
        const userGoal = user?.profile?.goal || 'MAINTAIN';
        const workout = await generateDailyWorkout(userGoal);
        setCurrentWorkout(workout);
    } catch (e) {
        console.error(e);
    } finally {
        setIsGenerating(false);
    }
  };

  // Generar automáticamente si no hay workout activo
  useEffect(() => {
    if (!currentWorkout) {
        handleGenerate();
    }
  }, []);

  const handleComplete = () => {
    if (currentWorkout) {
        completeWorkout(currentWorkout.id, "Me sentí bien, intensidad adecuada.");
    }
  };

  return (
    <AppShell title="Entrenamiento de Hoy">
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        
        {isGenerating && (
            <div className="text-center py-10">
                <p className="animate-pulse text-blue-600 font-medium">Diseñando tu rutina óptima...</p>
            </div>
        )}

        {!isGenerating && currentWorkout && (
            <>
                <WorkoutCard workout={currentWorkout} showActions={false} />
                
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Ejercicios</h3>
                    <ExerciseList exercises={currentWorkout.exercises} />
                </div>

                <div className="flex gap-3 pt-4">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleComplete}>
                        ✅ Marcar como Completado
                    </Button>
                    <Button variant="outline" onClick={handleGenerate}>
                        🔄 Regenerar Rutina
                    </Button>
                </div>
            </>
        )}

        {!isGenerating && !currentWorkout && (
            <div className="text-center">
                <Button onClick={handleGenerate}>Generar Rutina de Hoy</Button>
            </div>
        )}
      </div>
    </AppShell>
  );
}