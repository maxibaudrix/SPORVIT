'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import {
  BiometricsData,
  GoalData,
  TrainingData,
  DietData,
  ActivityData,
  OnboardingData, // ✅ IMPORTAR
} from '@/types/onboarding';

interface OnboardingStore {
  // Estado interno
  data: OnboardingData;
  currentStep: number;

  // HYBRID ONBOARDING STATE
  onboardingType: 'basic' | 'complete';
  completedModules: {
    trainingDetailed: boolean;
    nutritionDetailed: boolean;
  };
  pendingRegeneration: boolean;

  // GETTERS (computed properties)
  biometrics?: BiometricsData;
  goal?: GoalData;
  activity?: ActivityData;
  training?: TrainingData;
  lifestyle?: any;
  diet?: DietData;
  startDate?: string;
  calculatedMacros?: OnboardingData['calculatedMacros'];

  // ACTIONS
  setBiometrics: (data: BiometricsData) => void;
  setGoal: (data: GoalData) => void;
  setActivity: (data: ActivityData) => void;
  setTraining: (data: TrainingData) => void;
  setLifestyle: (data: any) => void;
  setDiet: (data: DietData) => void;
  setStartDate: (date: string) => void;
  setCalculatedMacros: (macros: OnboardingData['calculatedMacros']) => void;

  // HYBRID ONBOARDING ACTIONS
  setOnboardingType: (type: 'basic' | 'complete') => void;
  setCompletedModules: (modules: { trainingDetailed: boolean; nutritionDetailed: boolean }) => void;
  setPendingRegeneration: (pending: boolean) => void;

  // Navigation
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;

  // Reset
  resetOnboarding: () => void;
}

const initialState: OnboardingData = {
  biometrics: undefined,
  goal: undefined,
  activity: undefined,
  training: undefined,
  lifestyle: undefined,
  diet: undefined,
  startDate: undefined,
  calculatedMacros: undefined,
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      // Estado base
      data: initialState,
      currentStep: 1,

      // HYBRID ONBOARDING STATE
      onboardingType: 'basic',
      completedModules: {
        trainingDetailed: false,
        nutritionDetailed: false,
      },
      pendingRegeneration: false,

      // GETTERS DERIVADOS
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
      get startDate() {
        return get().data.startDate;
      },
      get calculatedMacros() {
        return get().data.calculatedMacros;
      },

      // SETTERS
      setBiometrics: (biometrics) => {
        console.log('[Store] Saving biometrics:', biometrics);
        set((state) => ({
          data: { ...state.data, biometrics },
        }));
        console.log('[Store] After save:', get());
      },

      setGoal: (goal) => {
        console.log('[Store] Saving goal:', goal);
        set((state) => ({
          data: { ...state.data, goal },
        }));
      },

      setActivity: (activity) => {
        console.log('[Store] Saving activity:', activity);
        set((state) => ({
          data: { ...state.data, activity },
        }));
      },

      setTraining: (training) => {
        console.log('[Store] Saving training:', training);
        set((state) => ({
          data: { ...state.data, training },
        }));
      },

      setLifestyle: (lifestyle) =>
        set((state) => ({
          data: { ...state.data, lifestyle },
        })),

      setDiet: (diet) => {
        console.log('[Store] Saving diet:', diet);
        set((state) => ({
          data: { ...state.data, diet },
        }));
      },

      setStartDate: (startDate) => {
        console.log('[Store] Saving startDate:', startDate);
        set((state) => ({
          data: { ...state.data, startDate },
        }));
      },

      setCalculatedMacros: (calculatedMacros) =>
        set((state) => ({
          data: { ...state.data, calculatedMacros },
        })),

      // HYBRID ONBOARDING ACTIONS
      setOnboardingType: (onboardingType) => {
        console.log('[Store] Setting onboarding type:', onboardingType);
        set({ onboardingType });
      },

      setCompletedModules: (completedModules) => {
        console.log('[Store] Setting completed modules:', completedModules);
        set({ completedModules });
      },

      setPendingRegeneration: (pendingRegeneration) => {
        console.log('[Store] Setting pending regeneration:', pendingRegeneration);
        set({ pendingRegeneration });
      },

      // NAVEGACIÓN
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

      // RESET
      resetOnboarding: () =>
        set({
          data: initialState,
          currentStep: 1,
          onboardingType: 'basic',
          completedModules: {
            trainingDetailed: false,
            nutritionDetailed: false,
          },
          pendingRegeneration: false,
        }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        data: state.data,
        onboardingType: state.onboardingType,
        completedModules: state.completedModules,
        pendingRegeneration: state.pendingRegeneration,
      }),
    }
  )
);