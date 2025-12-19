// src/store/onboarding.ts
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

/**
 * Contrato público del store
 * Los componentes NO deben acceder a `data` directamente
 */
interface OnboardingStore {
  // Estado interno (NO usar directamente en componentes)
  data: OnboardingData;
  currentStep: number;

  // ============
  // GETTERS (API pública)
  // ============
  biometrics?: BiometricsData;
  goal?: GoalData;
  activity?: ActivityData;
  training?: TrainingData;
  lifestyle?: any;
  diet?: DietData;
  calculatedMacros?: OnboardingData['calculatedMacros'];

  // ============
  // ACTIONS
  // ============
  setBiometrics: (data: BiometricsData) => void;
  setGoal: (data: GoalData) => void;
  setActivity: (data: ActivityData) => void;
  setTraining: (data: TrainingData) => void;
  setLifestyle: (data: any) => void;
  setDiet: (data: DietData) => void;
  setCalculatedMacros: (
    macros: OnboardingData['calculatedMacros']
  ) => void;

  // Navegación
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;

  // Reset
  resetOnboarding: () => void;
}

// ====================
// Estado inicial
// ====================
const initialState: OnboardingData = {
  biometrics: undefined,
  goal: undefined,
  activity: undefined,
  training: undefined,
  lifestyle: undefined,
  diet: undefined,
  calculatedMacros: undefined,
};

// ====================
// Store
// ====================
export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      // ----------------
      // Estado base
      // ----------------
      data: initialState,
      currentStep: 1,

      // ----------------
      // GETTERS DERIVADOS
      // ----------------
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

      // ----------------
      // SETTERS POR SECCIÓN
      // ----------------
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

      setLifestyle: (lifestyle) =>
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

      // ----------------
      // NAVEGACIÓN
      // ----------------
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

      // ----------------
      // RESET
      // ----------------
      resetOnboarding: () =>
        set({
          data: initialState,
          currentStep: 1,
        }),
    }),
    {
      name: 'onboarding-storage',
      // Persistimos SOLO los datos, nunca el step
      partialize: (state) => ({
        data: state.data,
      }),
    }
  )
);
