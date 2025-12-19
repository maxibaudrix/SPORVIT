// src/types/training.d.ts

export type MuscleGroup = 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Full Body';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  description?: string;
  videoUrl?: string;
  defaultSets: number;
  defaultReps: string; // string para rangos "8-12"
  restSeconds: number;
}

export interface WorkoutExercise extends Exercise {
  targetSets: number;
  targetReps: string;
  targetWeightKg?: number;
  actualSets?: number;
  actualReps?: string;
  actualWeightKg?: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
}

export interface Workout {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  durationMinutes: number;
  exercises: WorkoutExercise[];
  dateGenerated: string; // ISO Date
  isCompleted: boolean;
  feedback?: string;
}