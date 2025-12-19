// src/lib/trainingEngine/intensityAdjuster.ts
import { WorkoutExercise } from '@/types/training';

/**
 * Ajusta la intensidad del ejercicio basado en el feedback previo del usuario (RPE).
 * Si el usuario sintió que fue muy fácil (RPE < 5), aumentamos reps o series.
 */
export const adjustExerciseIntensity = (exercise: WorkoutExercise, previousRpe?: number): WorkoutExercise => {
  const adjusted = { ...exercise };

  if (!previousRpe) return adjusted;

  // Lógica simple de sobrecarga progresiva
  if (previousRpe < 6) {
    // Fue muy fácil -> Aumentar volumen
    adjusted.targetSets = Math.min(adjusted.targetSets + 1, 5); // Max 5 series
  } else if (previousRpe > 9) {
    // Fue muy difícil (fallo) -> Reducir o mantener
    adjusted.targetSets = Math.max(adjusted.targetSets - 1, 2); // Min 2 series
  }

  return adjusted;
};