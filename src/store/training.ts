// src/store/training.ts
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Workout } from '@/types/training';

interface TrainingStore {
  currentWorkout: Workout | null;
  workoutHistory: Workout[];
  isLoading: boolean;

  setCurrentWorkout: (workout: Workout) => void;
  completeWorkout: (workoutId: string, feedback: string) => void;
  clearCurrentWorkout: () => void;
}

export const useTrainingStore = create<TrainingStore>()(
  persist(
    (set, get) => ({
      currentWorkout: null,
      workoutHistory: [],
      isLoading: false,

      setCurrentWorkout: (workout) => set({ currentWorkout: workout }),

      completeWorkout: (workoutId, feedback) => set((state) => {
        if (state.currentWorkout?.id === workoutId) {
          const completedWorkout = { ...state.currentWorkout, isCompleted: true, feedback };
          return {
            workoutHistory: [completedWorkout, ...state.workoutHistory],
            currentWorkout: null,
          };
        }
        return state;
      }),

      clearCurrentWorkout: () => set({ currentWorkout: null }),
    }),
    {
      name: 'sporvit-training-storage',
    }
  )
);