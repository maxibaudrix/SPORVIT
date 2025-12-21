'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import {
  BiometricsData,
  GoalData,
  TrainingData,
  DietData,
  ActivityData,
} from '@/types/onboarding';

interface OnboardingStore {
  // ✅ Datos directos (sin data wrapper)
  biometrics?: BiometricsData;
  goal?: GoalData;
  activity?: ActivityData;
  training?: TrainingData;
  diet?: DietData;

  // Actions
  setBiometrics: (data: BiometricsData) => void;
  setGoal: (data: GoalData) => void;
  setActivity: (data: ActivityData) => void;
  setTraining: (data: TrainingData) => void;
  setDiet: (data: DietData) => void;
  
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      // Estado inicial
      biometrics: undefined,
      goal: undefined,
      activity: undefined,
      training: undefined,
      diet: undefined,

      // Setters
      setBiometrics: (biometrics) => {
        console.log('[Store] Saving biometrics:', biometrics);
        set({ biometrics });
        console.log('[Store] After save:', useOnboardingStore.getState());
      },

      setGoal: (goal) => {
        console.log('[Store] Saving goal:', goal);
        set({ goal });
      },

      setActivity: (activity) => {
        console.log('[Store] Saving activity:', activity);
        set({ activity });
      },

      setTraining: (training) => {
        console.log('[Store] Saving training:', training);
        set({ training });
      },

      setDiet: (diet) => {
        console.log('[Store] Saving diet:', diet);
        set({ diet });
      },

      reset: () => set({
        biometrics: undefined,
        goal: undefined,
        activity: undefined,
        training: undefined,
        diet: undefined,
      }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);