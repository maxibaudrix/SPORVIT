// src/store/onboarding.ts
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  BiometricsData, 
  GoalData, 
  TrainingData,
  DietData, 
  OnboardingData,
  ActivityData
} from '@/types/onboarding';

interface OnboardingStore {
  data: OnboardingData;
  currentStep: number;
  
  // Actions
  setBiometrics: (data: BiometricsData) => void;
  setGoal: (data: GoalData) => void;
  setActivity: (data: ActivityData) => void;
  setTraining: (data: TrainingData) => void;
  setDiet: (data: DietData) => void;
  setCalculatedMacros: (macros: OnboardingData['calculatedMacros']) => void;
  
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  resetOnboarding: () => void;
}

const initialState: OnboardingData = {
  biometrics: undefined,
  goal: undefined,
  activity: undefined,
  training: undefined,
  lifestyle: undefined,
  diet: undefined,
  calculatedMacros: undefined,
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      data: initialState,
      currentStep: 1,

      // Setters por sección
      setBiometrics: (biometrics) =>
        set((state) => ({
          data: { ...state.data, biometrics },
        })),

      setGoal: (goal) =>
        set((state) => ({
          data: { ...state.data, goal },
        })),

      setActivity: (activity) =>
        set((state) => ({
          data: { ...state.data, activity },
        })),

      setTraining: (training) =>
        set((state) => ({
          data: { ...state.data, training },
        })),

      setLifestyle: (lifestyle: any) =>
        set((state) => ({
          data: { ...state.data, lifestyle },
        })),

      setDiet: (diet) =>
        set((state) => ({
          data: { ...state.data, diet },
        })),

      setCalculatedMacros: (calculatedMacros) =>
        set((state) => ({
          data: { ...state.data, calculatedMacros },
        })),

      // Navegación
      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 6),
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 1),
        })),

      setStep: (step) =>
        set({ currentStep: step }),

      resetOnboarding: () =>
        set({
          data: initialState,
          currentStep: 1,
        }),
    }),
    {
      name: 'onboarding-storage',
      // Solo persistir los datos, no el step actual
      partialize: (state) => ({ data: state.data }),
    }
  )
);