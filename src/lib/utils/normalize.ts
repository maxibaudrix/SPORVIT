// src/lib/utils/normalize.ts
import { ACTIVITY_LEVEL_MAP, GOAL_MAP } from '../constants/onboarding';

export const normalizeActivityLevel = (
  level: string
): 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE' | 'EXTREMELY_ACTIVE' => {
  return (ACTIVITY_LEVEL_MAP as any)[level] || 'SEDENTARY';
};

export const normalizeGoal = (
  goal: string
): 'LOSE_WEIGHT' | 'MAINTAIN' | 'GAIN_MUSCLE' => {
  return (GOAL_MAP as any)[goal] || 'MAINTAIN';
};