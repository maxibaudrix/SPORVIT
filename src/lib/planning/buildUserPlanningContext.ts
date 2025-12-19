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
  onboardingData: OnboardingCompleteData,
  userId: string,
  locale: string = "es"
): UserPlanningContext {
  // Validar que startDate existe
  if (!onboardingData.startDate) {
    throw new Error("startDate is required in onboarding data");
  }

  // Calcular todos los targets y planning
  const calculations = calculateTargetsAndPlanning({
    biometrics: onboardingData.biometrics,
    objective: {
      primaryGoal: onboardingData.objective.goalType as any,
      targetTimeline: onboardingData.objective.targetTimeline,
    },
    activity: {
      dailyActivityLevel: onboardingData.activity.activityLevel as any,
    },
    training: {
      experienceLevel: onboardingData.training.level as any,
      daysPerWeek: onboardingData.training.daysPerWeek,
    },
  });

  // Construir contexto limpio
  const context: UserPlanningContext = {
    meta: {
      userId,
      createdAt: new Date().toISOString(),
      version: "1.0",
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
      primaryGoal: onboardingData.objective.goalType as any,
      targetTimeline: onboardingData.objective.targetTimeline,
      hasCompetition: onboardingData.objective.hasCompetition || false,
      competitionType: onboardingData.objective.competitionType,
      targetDate: onboardingData.objective.targetDate,
      motivation: onboardingData.objective.motivation,
    },

    activity: {
      country: onboardingData.activity.country,
      timezone: onboardingData.activity.timezone,
      dailyActivityLevel: onboardingData.activity.activityLevel as any,
      dailySteps: onboardingData.activity.dailySteps as any,
      availableDays: onboardingData.activity.availableDays,
      preferredTimes: onboardingData.activity.preferredTimes,
    },

    training: {
      experienceLevel: onboardingData.training.level as any,
      sportType: onboardingData.training.sportType,
      sportSubtype: onboardingData.training.sportSubtype,
      daysPerWeek: onboardingData.training.daysPerWeek,
      sessionDuration: onboardingData.training.sessionDuration,
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
        trainingDay: calculations.trainingDayCalories,
        restDay: calculations.restDayCalories,
      },
      macros: {
        protein: calculations.macros.protein,
        carbs: calculations.macros.carbs,
        fat: calculations.macros.fat,
        fiber: calculations.macros.fiber,
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