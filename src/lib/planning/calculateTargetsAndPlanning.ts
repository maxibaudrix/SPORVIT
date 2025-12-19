import type { CalculationResult } from "@/types/planning";

interface OnboardingData {
  biometrics: {
    age: number;
    gender: "male" | "female" | "other";
    weight: number;
    height: number;
  };
  objective: {
    primaryGoal: "cut" | "bulk" | "maintain" | "recomp" | "performance";
    targetTimeline: number;
  };
  activity: {
    dailyActivityLevel: "sedentary" | "light" | "moderate" | "active";
  };
  training: {
    experienceLevel: "beginner" | "intermediate" | "advanced";
    daysPerWeek: number;
  };
}

/**
 * Calcula BMR usando fórmula Mifflin-St Jeor
 */
function calculateBMR(biometrics: OnboardingData["biometrics"]): number {
  const { age, gender, weight, height } = biometrics;

  if (gender === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    // female o other
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

/**
 * Calcula TDEE aplicando multiplicador de actividad
 */
function calculateTDEE(
  bmr: number,
  activityLevel: OnboardingData["activity"]["dailyActivityLevel"]
): number {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
  };

  return Math.round(bmr * multipliers[activityLevel]);
}

/**
 * Ajusta TDEE según objetivo
 */
function adjustForGoal(
  tdee: number,
  goal: OnboardingData["objective"]["primaryGoal"]
): number {
  const adjustments = {
    cut: 0.8, // -20%
    bulk: 1.15, // +15%
    maintain: 1.0,
    recomp: 0.95, // -5%
    performance: 1.05, // +5%
  };

  return Math.round(tdee * adjustments[goal]);
}

/**
 * Calcula calorías para días de entrenamiento
 */
function calculateTrainingDayCalories(adjustedTDEE: number): number {
  return Math.round(adjustedTDEE * 1.1); // +10% en días de entreno
}

/**
 * Calcula calorías para días de descanso
 */
function calculateRestDayCalories(adjustedTDEE: number): number {
  return Math.round(adjustedTDEE * 0.95); // -5% en días de descanso
}

/**
 * Calcula distribución de macronutrientes
 */
function calculateMacros(
  weight: number,
  calories: number,
  goal: OnboardingData["objective"]["primaryGoal"]
): {
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
} {
  // Proteína: 2-2.2g por kg de peso corporal
  const protein = Math.round(weight * 2.1);

  // Grasa: 25-30% de calorías totales
  const fatCalories = calories * 0.27;
  const fat = Math.round(fatCalories / 9); // 9 kcal por gramo de grasa

  // Carbohidratos: resto de calorías
  const proteinCalories = protein * 4; // 4 kcal por gramo
  const carbCalories = calories - proteinCalories - fatCalories;
  const carbs = Math.round(carbCalories / 4); // 4 kcal por gramo

  // Fibra: 14g por cada 1000 kcal
  const fiber = Math.round((calories / 1000) * 14);

  return { protein, carbs, fat, fiber };
}

/**
 * Calcula estructura de fases de entrenamiento
 */
function calculatePlanningBlocks(
  timeline: number,
  experienceLevel: OnboardingData["training"]["experienceLevel"]
): {
  blockSize: number;
  totalBlocks: number;
  phases: {
    base: number;
    build: number;
    peak: number;
    taper: number;
    recovery: number;
  };
} {
  // Tamaño de bloque según nivel
  const blockSizes = {
    beginner: 4, // bloques de 4 semanas
    intermediate: 4,
    advanced: 3, // bloques de 3 semanas (más intenso)
  };

  const blockSize = blockSizes[experienceLevel];
  const totalBlocks = Math.ceil(timeline / blockSize);

  // Distribución de fases según duración total
  let phases = {
    base: 0,
    build: 0,
    peak: 0,
    taper: 0,
    recovery: 0,
  };

  if (timeline <= 4) {
    // Plan corto: solo base
    phases.base = timeline;
  } else if (timeline <= 8) {
    // Plan mediano
    phases.base = 4;
    phases.build = timeline - 4;
  } else if (timeline <= 12) {
    // Plan estándar
    phases.base = 4;
    phases.build = 5;
    phases.peak = 2;
    phases.taper = 1;
  } else {
    // Plan largo
    phases.base = 4;
    phases.build = Math.floor(timeline * 0.5);
    phases.peak = Math.floor(timeline * 0.2);
    phases.taper = 1;
    phases.recovery = timeline - phases.base - phases.build - phases.peak - phases.taper;
  }

  return {
    blockSize,
    totalBlocks,
    phases,
  };
}

/**
 * FUNCIÓN PRINCIPAL: Calcula todos los targets y planning
 */
export function calculateTargetsAndPlanning(
  data: OnboardingData
): CalculationResult {
  // 1. Calcular TDEE
  const bmr = calculateBMR(data.biometrics);
  const tdee = calculateTDEE(bmr, data.activity.dailyActivityLevel);

  // 2. Ajuste por objetivo
  const adjustedTDEE = adjustForGoal(tdee, data.objective.primaryGoal);

  // 3. Calorías training vs rest
  const trainingDayCalories = calculateTrainingDayCalories(adjustedTDEE);
  const restDayCalories = calculateRestDayCalories(adjustedTDEE);

  // 4. Macros (basados en peso y calorías de entrenamiento)
  const macros = calculateMacros(
    data.biometrics.weight,
    trainingDayCalories,
    data.objective.primaryGoal
  );

  // 5. Planning blocks
  const planning = calculatePlanningBlocks(
    data.objective.targetTimeline,
    data.training.experienceLevel
  );

  return {
    trainingDayCalories,
    restDayCalories,
    macros,
    ...planning,
  };
}