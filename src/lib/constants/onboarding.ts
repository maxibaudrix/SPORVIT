// src/lib/constants/onboarding.ts
export const ACTIVITY_LEVELS = {
  sedentary: 'sedentary',
  light: 'light',
  moderate: 'moderate',
  very_active: 'very_active',
  extra_active: 'extra_active',
} as const;

export const GOALS = {
  lose_weight: 'lose_weight',
  maintain: 'maintain',
  gain_muscle: 'gain_muscle',
} as const;

// Mapeo inverso para cálculos
export const ACTIVITY_LEVEL_MAP = {
  sedentary: 'SEDENTARY',
  light: 'LIGHTLY_ACTIVE',
  moderate: 'MODERATELY_ACTIVE',
  very_active: 'VERY_ACTIVE',
  extra_active: 'EXTREMELY_ACTIVE',
} as const;

export const GOAL_MAP = {
  lose_weight: 'LOSE_WEIGHT',
  maintain: 'MAINTAIN',
  gain_muscle: 'GAIN_MUSCLE',
} as const;

export type ActivityLevelForm = keyof typeof ACTIVITY_LEVELS;
export type GoalForm = keyof typeof GOALS;
export type ActivityLevelCalc = keyof typeof ACTIVITY_LEVEL_MAP;
export type GoalCalc = keyof typeof GOAL_MAP;