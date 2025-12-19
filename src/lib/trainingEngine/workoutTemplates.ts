// src/lib/trainingEngine/workoutTemplates.ts
import { Exercise } from '@/types/training';

// Mock database de ejercicios (en producción vendría de Supabase)
const EXERCISE_DB: Exercise[] = [
  { id: 'pushups', name: 'Flexiones', muscleGroup: 'Chest', defaultSets: 3, defaultReps: '10-15', restSeconds: 60 },
  { id: 'squats', name: 'Sentadillas (Bodyweight)', muscleGroup: 'Legs', defaultSets: 4, defaultReps: '12-20', restSeconds: 90 },
  { id: 'lunges', name: 'Zancadas', muscleGroup: 'Legs', defaultSets: 3, defaultReps: '10 per leg', restSeconds: 60 },
  { id: 'plank', name: 'Plancha Abdominal', muscleGroup: 'Core', defaultSets: 3, defaultReps: '30-60 sec', restSeconds: 45 },
  { id: 'burpees', name: 'Burpees', muscleGroup: 'Full Body', defaultSets: 3, defaultReps: '10', restSeconds: 90 },
  { id: 'pullups', name: 'Dominadas', muscleGroup: 'Back', defaultSets: 3, defaultReps: '5-8', restSeconds: 120 },
];

export const WORKOUT_TEMPLATES = {
  FULL_BODY_BEGINNER: {
    title: 'Full Body Iniciación',
    description: 'Rutina de cuerpo completo ideal para empezar sin equipamiento.',
    difficulty: 'Beginner',
    duration: 30,
    exerciseIds: ['squats', 'pushups', 'lunges', 'plank']
  },
  HIIT_CARDIO: {
    title: 'HIIT Quema-Grasa',
    description: 'Alta intensidad para maximizar el gasto calórico.',
    difficulty: 'Intermediate',
    duration: 20,
    exerciseIds: ['burpees', 'squats', 'pushups', 'plank']
  },
  STRENGTH_CORE: {
    title: 'Fuerza y Core',
    description: 'Enfoque en fuerza básica y estabilidad.',
    difficulty: 'Intermediate',
    duration: 45,
    exerciseIds: ['pullups', 'pushups', 'squats', 'plank']
  }
};

export const getExercisesByIds = (ids: string[]): Exercise[] => {
  return ids.map(id => EXERCISE_DB.find(e => e.id === id)).filter(Boolean) as Exercise[];
};