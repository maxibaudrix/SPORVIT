// src/types/onboarding.d.ts

// ============================================
// PASO 1: BIOMÉTRICOS
// ============================================
export interface BiometricsData {
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  height: number; // cm
  weight: number; // kg
  bodyFatPercentage?: number;
}

// ============================================
// PASO 2: OBJETIVO
// ============================================
export interface GoalData {
  goalType: 'LOSE' | 'GAIN' | 'MAINTAIN' | 'RECOMP';
  targetWeight?: number;
  goalSpeed?: 'SLOW' | 'MODERATE' | 'AGGRESSIVE';
}

// ============================================
// PASO 3: ACTIVIDAD DIARIA (NEAT)
// ============================================
export interface ActivityData {
  activityLevel:
    | 'SEDENTARY'
    | 'LIGHTLY_ACTIVE'
    | 'MODERATELY_ACTIVE'
    | 'VERY_ACTIVE'
    | 'SUPER_ACTIVE';

  sittingHours?: "" | "LESS_THAN_4H" | "4H_6H" | "6H_8H" | "MORE_THAN_8H";

  workType?: "" | "DESK" | "MIXED" | "ACTIVE" | "PHYSICAL";
}

// ============================================
// PASO 4: NIVEL DE ENTRENAMIENTO
// ============================================
export interface TrainingData {
  trainingLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  trainingFrequency: '1_2' | '3_4' | '5_6' | 'DOUBLE';
  trainingTypes: string[];
  sessionDuration: 'UNDER_30' | '30_60' | '60_90' | 'OVER_90';
  intensity: 'LOW' | 'MODERATE' | 'HIGH';
}

// ============================================
// PASO 5: DIETA
// ============================================
export interface DietData {
  dietType:
    | 'NONE'
    | 'OMNIVORE'
    | 'VEGETARIAN'
    | 'VEGAN'
    | 'PESCETARIAN'
    | 'KETO'
    | 'PALEO'
    | 'MEDITERRANEAN'
    | 'LOW_CARB'
    | 'CARNIVORE'
    | 'OTHER';

  allergies?: string[];
  excludedIngredients?: string[];
}

// ============================================
// DATOS COMPLETOS DEL ONBOARDING
// ============================================
export interface OnboardingData {
  biometrics?: BiometricsData;
  goal?: GoalData;
  activity?: ActivityData;       // ✅ agregado
  training?: TrainingData;
  lifestyle?: LifestyleData;
  diet?: DietData;
  

  calculatedMacros?: {
    bmr: number;
    tdee: number;
    targetCalories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}
