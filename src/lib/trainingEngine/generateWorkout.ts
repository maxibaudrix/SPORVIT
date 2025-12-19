// src/lib/trainingEngine/generateWorkout.ts
import { Workout, WorkoutExercise } from '@/types/training';
import { WORKOUT_TEMPLATES, getExercisesByIds } from './workoutTemplates';
import { adjustExerciseIntensity } from './intensityAdjuster';

/**
 * Genera una rutina de entrenamiento personalizada.
 * En el MVP, selecciona un template basado en el perfil del usuario.
 */
export const generateDailyWorkout = async (userGoal: string): Promise<Workout> => {
  
  // Simular retardo de "IA"
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Selección simple de template basada en objetivo
  let templateKey = 'FULL_BODY_BEGINNER';
  if (userGoal === 'LOSE_WEIGHT') templateKey = 'HIIT_CARDIO';
  if (userGoal === 'GAIN_MUSCLE') templateKey = 'STRENGTH_CORE';

  // @ts-ignore
  const template = WORKOUT_TEMPLATES[templateKey] || WORKOUT_TEMPLATES.FULL_BODY_BEGINNER;
  
  const baseExercises = getExercisesByIds(template.exerciseIds);

  // Convertir a WorkoutExercise y aplicar lógica de ajuste inicial
  const exercises: WorkoutExercise[] = baseExercises.map(ex => {
    const workoutEx: WorkoutExercise = {
      ...ex,
      targetSets: ex.defaultSets,
      targetReps: ex.defaultReps,
    };
    // Aquí podríamos buscar el historial del usuario y llamar a adjustExerciseIntensity
    return adjustExerciseIntensity(workoutEx); 
  });

  return {
    id: Math.random().toString(36).substr(2, 9),
    title: template.title,
    description: template.description,
    difficulty: template.difficulty,
    durationMinutes: template.duration,
    exercises: exercises,
    dateGenerated: new Date().toISOString(),
    isCompleted: false,
  };
};