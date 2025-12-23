import type { UserPlanningContext } from "@/types/planning";
import { calculateTargetsAndPlanning } from "./calculateTargetsAndPlanning";

interface OnboardingCompleteData {
  startDate: string; // OBLIGATORIO
  biometrics: {
    age: number;
    gender: "male" | "female" | "other";
    weight: number;
    height: number;
    bodyFatPercentage?: number;
  };
  objective: {
    goalType: string;
    targetTimeline: number;
    hasCompetition?: boolean;
    competitionType?: string;
    targetDate?: string;
    motivation?: string;
  };
  activity: {
    country: string;
    timezone: string;
    activityLevel: string;
    dailySteps: string;
    availableDays: string[];
    preferredTimes: string[];
  };
  training: {
    level: string;
    sportType: string;
    sportSubtype?: string;
    daysPerWeek: number;
    sessionDuration: number;
    location: string[];
    equipment: string[];
    hasInjuries: boolean;
    injuryDetails?: string;
  };
  nutrition: {
    dietType: string;
    mealsPerDay: number;
    allergies: string[];
    intolerances: string[];
    excludedFoods: string[];
    cookingFrequency: string;
  };
}

/**
 * Construye el contrato limpio UserPlanningContext
 * desde los datos crudos del onboarding
 */
export function buildUserPlanningContext(
  onboardingData: any,
  userId: string,
  locale: string = 'es'
): UserPlanningContext {
  
  // ✅ CONVERSIONES EXPLÍCITAS:
  const age = Number(onboardingData.biometrics?.age) || 0;
  const weight = Number(onboardingData.biometrics?.weight) || 0;
  const height = Number(onboardingData.biometrics?.height) || 0;
  const daysPerWeek = Number(onboardingData.training?.trainingFrequency) || 3;
  
  // ✅ CONVERSIÓN DE sessionDuration (string → number):
  let sessionDuration = 60; // default
  if (onboardingData.training?.sessionDuration) {
    const durationStr = String(onboardingData.training.sessionDuration);
    if (durationStr === 'UNDER_30') sessionDuration = 25;
    else if (durationStr === '30_60') sessionDuration = 45;
    else if (durationStr === '60_90') sessionDuration = 75;
    else if (durationStr === 'OVER_90') sessionDuration = 105;
    else sessionDuration = Number(durationStr) || 60;
   }
   
  // ✅ NORMALIZAR goalType a minúsculas
  const normalizedGoalType = (onboardingData.objective.goalType || 'maintain').toLowerCase();
  
  // ✅ MAPEAR goalType del onboarding al formato esperado
  const goalTypeMap: Record<string, "cut" | "bulk" | "maintain" | "recomp" | "performance"> = {
    'lose': 'cut',
    'gain': 'bulk',
    'maintain': 'maintain',
    'recomp': 'recomp',
    'performance': 'performance',
  };
  
  const mappedGoalType = goalTypeMap[normalizedGoalType] || 'maintain';

  console.log('[buildUserPlanningContext] onboardingData.objective:', onboardingData.objective);
  console.log('[buildUserPlanningContext] normalizedGoalType:', normalizedGoalType);
  console.log('[buildUserPlanningContext] mappedGoalType:', mappedGoalType);
  console.log('[buildUserPlanningContext] targetTimeline:', onboardingData.objective.targetTimeline);

  // ✅ MAPEAR activityLevel para que coincida con los multiplicadores y Prisma
    const activityLevelMap: Record<string, any> = {
      'sedentary': 'sedentary',
      'light': 'lightly_active',
      'moderate': 'moderately_active',
      'active': 'very_active',
    };

    const mappedActivityLevel = activityLevelMap[onboardingData.activity.activityLevel.toLowerCase()] || 'moderate';

  // Calcular todos los targets y planning
  const calculations = calculateTargetsAndPlanning({
    biometrics: onboardingData.biometrics,
    objective: {
      primaryGoal: mappedGoalType, // ✅ Usar el valor mapeado
      targetTimeline: onboardingData.objective.targetTimeline || 4,
    },
    activity: {
      dailyActivityLevel: mappedActivityLevel,
    },
    training: {
      experienceLevel: (onboardingData.training.level || 'beginner').toLowerCase() as any,
      daysPerWeek: onboardingData.training.daysPerWeek || 3,
    },
  });

  console.log('[buildUserPlanningContext] calculations result:', calculations);

  // ✅ VALIDAR que no haya NaN
  if (isNaN(calculations.trainingDayCalories) || 
      isNaN(calculations.restDayCalories) || 
      !calculations.blockSize) {
    
    console.error('[buildUserPlanningContext] ❌ Calculations returned NaN, using fallback');
    
    const weight = onboardingData.biometrics.weight || 70;
    const fallbackCalories = weight * 30;
    
    calculations.trainingDayCalories = Math.round(fallbackCalories * 1.1);
    calculations.restDayCalories = Math.round(fallbackCalories * 0.9);
    calculations.macros = {
      protein: Math.round(weight * 2),
      carbs: Math.round(fallbackCalories * 0.5 / 4),
      fat: Math.round(fallbackCalories * 0.25 / 9),
      fiber: 30,
    };
    calculations.blockSize = 4;
    calculations.totalBlocks = Math.ceil((onboardingData.objective.targetTimeline || 4) / 4);
    calculations.phases = {
      base: Math.floor((onboardingData.objective.targetTimeline || 4) * 0.5),
      build: Math.ceil((onboardingData.objective.targetTimeline || 4) * 0.3),
      peak: 0,
      taper: 0,
      recovery: Math.floor((onboardingData.objective.targetTimeline || 4) * 0.2),
    };
  }

  // Construir contexto limpio
  const context: UserPlanningContext = {
    meta: {
      userId,
      createdAt: new Date().toISOString(),
      version: "1.0",
      generationMode: "progressive", 
      generationStatus: "init", 
      locale,
    },

    startPreferences: {
      startDate: onboardingData.startDate,
      weekStartsOn: "monday",
    },

    biometrics: {
      age: onboardingData.biometrics.age,
      gender: onboardingData.biometrics.gender,
      weight: onboardingData.biometrics.weight,
      height: onboardingData.biometrics.height,
      bodyFatPercentage: onboardingData.biometrics.bodyFatPercentage,
    },

    objective: {
      primaryGoal: mappedGoalType, // ✅ Usar el valor mapeado
      targetTimeline: onboardingData.objective.targetTimeline,
      hasCompetition: onboardingData.objective.hasCompetition || false,
      competitionType: onboardingData.objective.competitionType,
      targetDate: onboardingData.objective.targetDate,
      motivation: onboardingData.objective.motivation,
    },

    activity: {
      country: onboardingData.activity.country,
      timezone: onboardingData.activity.timezone || 'Europe/Madrid',
      dailyActivityLevel: (onboardingData.activity.activityLevel || 'moderate').toLowerCase() as any,
      dailySteps: onboardingData.activity.dailySteps as any,
      availableDays: onboardingData.activity.availableDays,
      preferredTimes: onboardingData.activity.preferredTimes,
    },

    training: {
      experienceLevel: (onboardingData.training.level || 'beginner').toLowerCase() as any,
      sportType: onboardingData.training.sportType,
      sportSubtype: onboardingData.training.sportSubtype,
      daysPerWeek: onboardingData.training.daysPerWeek,
      sessionDuration: typeof onboardingData.training.sessionDuration === 'string' 
        ? (onboardingData.training.sessionDuration === "30_60" ? 45 : 75)
        : onboardingData.training.sessionDuration,
      trainingLocation: onboardingData.training.location,
      availableEquipment: onboardingData.training.equipment,
      hasInjuries: onboardingData.training.hasInjuries,
      injuryDetails: onboardingData.training.injuryDetails,
    },

    nutrition: {
      dietType: onboardingData.nutrition.dietType,
      mealsPerDay: onboardingData.nutrition.mealsPerDay,
      allergies: onboardingData.nutrition.allergies,
      intolerances: onboardingData.nutrition.intolerances,
      excludedFoods: onboardingData.nutrition.excludedFoods,
      cookingFrequency: onboardingData.nutrition.cookingFrequency,
    },

    targets: {
      calories: {
        trainingDay: Math.round(calculations.trainingDayCalories || 2000),
        restDay: Math.round(calculations.restDayCalories || 1800),
      },
      macros: {
        protein: Math.round(calculations.macros.protein || 0),
        carbs: Math.round(calculations.macros.carbs || 0),
        fat: Math.round(calculations.macros.fat || 0),
        fiber: Math.round(calculations.macros.fiber || 30),
      },
    },

    planning: {
      blockSize: calculations.blockSize,
      totalBlocks: calculations.totalBlocks,
      phases: calculations.phases,
    },
  };

  return context;
}