'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  BiometricsData,
  GoalData,
  TrainingData,
  DietData,
  ActivityData,
  OnboardingData,
} from '@/types/onboarding';

interface OnboardingStore {
  // Estado interno
  data: OnboardingData;
  currentStep: number;

  // ============
  // GETTERS (propiedades computadas)
  // ============
  biometrics: BiometricsData | undefined;
  goal: GoalData | undefined;
  activity: ActivityData | undefined;
  training: TrainingData | undefined;
  lifestyle: any | undefined;
  diet: DietData | undefined;
  calculatedMacros: OnboardingData['calculatedMacros'] | undefined;

  // ============
  // ACTIONS
  // ============
  setBiometrics: (data: BiometricsData) => void;
  setGoal: (data: GoalData) => void;
  setActivity: (data: ActivityData) => void;
  setTraining: (data: TrainingData) => void;
  setLifestyle: (data: any) => void;
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
    (set, get) => ({
      // Estado base
      data: initialState,
      currentStep: 1,

      // ✅ GETTERS COMO PROPIEDADES (no como funciones get)
      get biometrics() {
        return get().data.biometrics;
      },
      get goal() {
        return get().data.goal;
      },
      get activity() {
        return get().data.activity;
      },
      get training() {
        return get().data.training;
      },
      get lifestyle() {
        return get().data.lifestyle;
      },
      get diet() {
        return get().data.diet;
      },
      get calculatedMacros() {
        return get().data.calculatedMacros;
      },

      // ✅ SETTERS
      setBiometrics: (biometrics) => {
        console.log('[Store] setBiometrics:', biometrics);
        set((state) => ({
          data: { ...state.data, biometrics },
        }));
      },

      setGoal: (goal) => {
        console.log('[Store] setGoal:', goal);
        set((state) => ({
          data: { ...state.data, goal },
        }));
      },

      setActivity: (activity) => {
        console.log('[Store] setActivity:', activity);
        set((state) => ({
          data: { ...state.data, activity },
        }));
      },

      setTraining: (training) => {
        console.log('[Store] setTraining:', training);
        set((state) => ({
          data: { ...state.data, training },
        }));
      },

      setLifestyle: (lifestyle) => {
        console.log('[Store] setLifestyle:', lifestyle);
        set((state) => ({
          data: { ...state.data, lifestyle },
        }));
      },

      setDiet: (diet) => {
        console.log('[Store] setDiet:', diet);
        set((state) => ({
          data: { ...state.data, diet },
        }));
      },

      setCalculatedMacros: (calculatedMacros) => {
        console.log('[Store] setCalculatedMacros:', calculatedMacros);
        set((state) => ({
          data: { ...state.data, calculatedMacros },
        }));
      },

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
        set({
          currentStep: step,
        }),

      // Reset
      resetOnboarding: () =>
        set({
          data: initialState,
          currentStep: 1,
        }),
    }),
    {
      name: 'onboarding-storage',
      partialize: (state) => ({
        data: state.data,
      }),
    }
  )
);