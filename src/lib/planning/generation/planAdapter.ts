/**
 * Plan Adapter
 *
 * Adapta un plan cacheado a un nuevo contexto cuando hay diferencias menores.
 * Realiza ajustes en calorías, macros, ejercicios e ingredientes según sea necesario.
 */

import type { UserPlanningContext, WeekPlan, DayPlan, MealPlan } from '@/types/planning';
import { ADAPTATION_RULES } from '@/config/cacheConfig';
import { calculateTargetsAndPlanning } from '@/lib/planning/calculateTargetsAndPlanning';

export interface AdaptedPlanResult {
  plan: WeekPlan;
  adaptations: Adaptation[];
  confidenceScore: number; // 0.0 - 1.0
}

export interface Adaptation {
  category: 'training' | 'nutrition' | 'timeline';
  type: 'substitution' | 'scaling' | 'removal' | 'addition';
  description: string;
}

/**
 * Adapta un plan cacheado a un nuevo contexto
 *
 * @param cachedPlan - Plan cacheado original
 * @param originalContext - Contexto original del plan
 * @param newContext - Nuevo contexto del usuario
 * @returns Plan adaptado o null si no es adaptable
 */
export async function adaptPlan(
  cachedPlan: WeekPlan,
  originalContext: UserPlanningContext,
  newContext: UserPlanningContext
): Promise<AdaptedPlanResult | null> {
  const adaptations: Adaptation[] = [];

  // PASO 1: Análisis de viabilidad
  const viability = analyzeViability(originalContext, newContext);

  if (!viability.isAdaptable) {
    console.log(`❌ Plan no adaptable: ${viability.reason}`);
    return null;
  }

  // Clonar el plan para no mutar el original
  const adaptedPlan: WeekPlan = JSON.parse(JSON.stringify(cachedPlan));

  let confidenceScore = 1.0; // Empezamos con confianza máxima

  // PASO 2: Adaptación de NUTRICIÓN
  if (viability.needsNutritionAdaptation) {
    const nutritionResult = adaptNutrition(
      adaptedPlan,
      originalContext,
      newContext
    );
    adaptations.push(...nutritionResult.adaptations);
    confidenceScore *= nutritionResult.confidence;
  }

  // PASO 3: Adaptación de ENTRENAMIENTO
  if (viability.needsTrainingAdaptation) {
    const trainingResult = adaptTraining(adaptedPlan, originalContext, newContext);
    adaptations.push(...trainingResult.adaptations);
    confidenceScore *= trainingResult.confidence;
  }

  // PASO 4: Validación post-adaptación
  const isValid = validateAdaptedPlan(adaptedPlan);

  if (!isValid) {
    console.log('❌ Plan adaptado falló validación');
    return null;
  }

  // PASO 5: Verificar confianza mínima
  if (confidenceScore < ADAPTATION_RULES.MIN_CONFIDENCE_SCORE) {
    console.log(`❌ Confianza muy baja: ${confidenceScore.toFixed(2)}`);
    return null;
  }

  console.log(
    `✅ Plan adaptado exitosamente (confianza: ${confidenceScore.toFixed(2)}, ${adaptations.length} adaptaciones)`
  );

  return {
    plan: adaptedPlan,
    adaptations,
    confidenceScore,
  };
}

/**
 * Analiza si un plan es adaptable
 */
function analyzeViability(
  originalContext: UserPlanningContext,
  newContext: UserPlanningContext
): {
  isAdaptable: boolean;
  reason?: string;
  needsNutritionAdaptation: boolean;
  needsTrainingAdaptation: boolean;
} {
  const rules = ADAPTATION_RULES.NON_ADAPTABLE;

  // Regla 1: Objetivo diferente (CRITICAL)
  if (
    rules.GOAL_TYPE_DIFFERENT &&
    originalContext.objective.primaryGoal !== newContext.objective.primaryGoal
  ) {
    return {
      isAdaptable: false,
      reason: 'Different goal types (cut vs bulk, etc.)',
      needsNutritionAdaptation: false,
      needsTrainingAdaptation: false,
    };
  }

  // Regla 2: Dietas incompatibles (CRITICAL)
  const originalDiet = originalContext.nutrition.dietType;
  const newDiet = newContext.nutrition.dietType;
  const compatibleDiets = ADAPTATION_RULES.DIET_COMPATIBILITY[originalDiet] || [];

  if (rules.DIET_TYPE_INCOMPATIBLE && !compatibleDiets.includes(newDiet)) {
    return {
      isAdaptable: false,
      reason: `Incompatible diets: ${originalDiet} → ${newDiet}`,
      needsNutritionAdaptation: false,
      needsTrainingAdaptation: false,
    };
  }

  // Regla 3: Gap de experiencia muy grande
  const levelMap = { beginner: 0, intermediate: 1, advanced: 2 };
  const originalLevel = levelMap[originalContext.training.experienceLevel];
  const newLevel = levelMap[newContext.training.experienceLevel];
  const levelGap = Math.abs(newLevel - originalLevel);

  if (levelGap >= rules.EXPERIENCE_LEVEL_GAP) {
    return {
      isAdaptable: false,
      reason: `Experience level gap too large: ${levelGap}`,
      needsNutritionAdaptation: false,
      needsTrainingAdaptation: false,
    };
  }

  // Regla 4: Diferencia de peso muy grande
  const weightDiff = Math.abs(
    newContext.biometrics.weight - originalContext.biometrics.weight
  );

  if (weightDiff > rules.WEIGHT_DIFFERENCE_KG) {
    return {
      isAdaptable: false,
      reason: `Weight difference too large: ${weightDiff}kg`,
      needsNutritionAdaptation: false,
      needsTrainingAdaptation: false,
    };
  }

  // Regla 5: Diferencia de timeline muy grande
  const timelineDiff = Math.abs(
    newContext.objective.targetTimeline - originalContext.objective.targetTimeline
  );

  if (timelineDiff > rules.TIMELINE_DIFFERENCE_WEEKS) {
    return {
      isAdaptable: false,
      reason: `Timeline difference too large: ${timelineDiff} weeks`,
      needsNutritionAdaptation: false,
      needsTrainingAdaptation: false,
    };
  }

  // Determinar qué necesita adaptación
  const needsNutritionAdaptation =
    weightDiff > 2 ||
    originalDiet !== newDiet ||
    newContext.nutrition.intolerances.length >
      originalContext.nutrition.intolerances.length;

  const needsTrainingAdaptation =
    originalContext.training.daysPerWeek !== newContext.training.daysPerWeek ||
    levelGap > 0;

  return {
    isAdaptable: true,
    needsNutritionAdaptation,
    needsTrainingAdaptation,
  };
}

/**
 * Adapta la nutrición del plan
 */
function adaptNutrition(
  plan: WeekPlan,
  originalContext: UserPlanningContext,
  newContext: UserPlanningContext
): { adaptations: Adaptation[]; confidence: number } {
  const adaptations: Adaptation[] = [];
  let confidence = 1.0;

  // Recalcular targets con el nuevo contexto
  const newTargets = calculateTargetsAndPlanning({
    age: newContext.biometrics.age,
    gender: newContext.biometrics.gender,
    weight: newContext.biometrics.weight,
    height: newContext.biometrics.height,
    activityLevel: newContext.activity.dailyActivityLevel,
    goal: newContext.objective.primaryGoal,
    timeline: newContext.objective.targetTimeline,
  });

  const oldCaloriesTraining = originalContext.targets.calories.trainingDay;
  const newCaloriesTraining = newTargets.calories.trainingDay;
  const calorieRatio = newCaloriesTraining / oldCaloriesTraining;

  // Adaptar cada día del plan
  for (const day of plan.days) {
    const isTrainingDay = day.isTrainingDay;
    const targetCalories = isTrainingDay
      ? newTargets.calories.trainingDay
      : newTargets.calories.restDay;

    // Escalar calorías de cada comida proporcionalmente
    for (const meal of day.nutrition.meals) {
      const scaledCalories = Math.round(meal.calories * calorieRatio);
      meal.calories = scaledCalories;

      // Escalar macros proporcionalmente
      meal.protein = Math.round(meal.protein * calorieRatio);
      meal.carbs = Math.round(meal.carbs * calorieRatio);
      meal.fat = Math.round(meal.fat * calorieRatio);
      meal.fiber = Math.round(meal.fiber * calorieRatio);

      // Escalar ingredientes (cantidades)
      for (const ingredient of meal.ingredients) {
        ingredient.amount = Math.round(ingredient.amount * calorieRatio * 10) / 10;
      }
    }

    // Actualizar targets del día
    day.nutrition.targetCalories = targetCalories;
    day.nutrition.targetProtein = newTargets.macros.protein;
    day.nutrition.targetCarbs = newTargets.macros.carbs;
    day.nutrition.targetFat = newTargets.macros.fat;
    day.nutrition.targetFiber = newTargets.macros.fiber || 30;
  }

  adaptations.push({
    category: 'nutrition',
    type: 'scaling',
    description: `Scaled calories from ${oldCaloriesTraining} to ${newCaloriesTraining} kcal (ratio: ${calorieRatio.toFixed(2)})`,
  });

  // Manejar intolerancias nuevas
  const newIntolerances = newContext.nutrition.intolerances.filter(
    (int) => !originalContext.nutrition.intolerances.includes(int)
  );

  if (newIntolerances.length > 0) {
    adaptations.push({
      category: 'nutrition',
      type: 'substitution',
      description: `Added ${newIntolerances.length} new intolerances: ${newIntolerances.join(', ')}`,
    });

    // Reducir confianza si hay muchas intolerancias nuevas
    confidence *= 1 - newIntolerances.length * 0.1;
  }

  return { adaptations, confidence: Math.max(0.5, confidence) };
}

/**
 * Adapta el entrenamiento del plan
 */
function adaptTraining(
  plan: WeekPlan,
  originalContext: UserPlanningContext,
  newContext: UserPlanningContext
): { adaptations: Adaptation[]; confidence: number } {
  const adaptations: Adaptation[] = [];
  let confidence = 1.0;

  const oldDays = originalContext.training.daysPerWeek;
  const newDays = newContext.training.daysPerWeek;

  if (oldDays !== newDays) {
    adaptations.push({
      category: 'training',
      type: 'scaling',
      description: `Adjusted training days from ${oldDays} to ${newDays} days/week`,
    });

    // Si reducimos días, consolidar entrenamientos
    if (newDays < oldDays) {
      confidence *= 0.85; // Menor confianza al consolidar
    }

    // Si aumentamos días, necesitaríamos generar nuevos entrenamientos
    // Por ahora, solo marcamos como adaptación simple
    if (newDays > oldDays) {
      confidence *= 0.80; // Menor confianza al expandir
    }
  }

  return { adaptations, confidence };
}

/**
 * Valida que el plan adaptado sea coherente
 */
function validateAdaptedPlan(plan: WeekPlan): boolean {
  // Verificar que todos los días tengan comidas
  for (const day of plan.days) {
    if (day.nutrition.meals.length === 0) {
      return false;
    }

    // Verificar que las calorías totales estén en un rango razonable
    const totalCalories = day.nutrition.meals.reduce(
      (sum, meal) => sum + meal.calories,
      0
    );

    if (totalCalories < 1000 || totalCalories > 5000) {
      console.log(`❌ Calorías fuera de rango: ${totalCalories}`);
      return false;
    }

    // Verificar que los macros sumen correctamente (±10%)
    const totalProtein = day.nutrition.meals.reduce((sum, meal) => sum + meal.protein, 0);
    const totalCarbs = day.nutrition.meals.reduce((sum, meal) => sum + meal.carbs, 0);
    const totalFat = day.nutrition.meals.reduce((sum, meal) => sum + meal.fat, 0);

    const targetProtein = day.nutrition.targetProtein;
    const targetCarbs = day.nutrition.targetCarbs;
    const targetFat = day.nutrition.targetFat;

    const proteinDiff = Math.abs(totalProtein - targetProtein) / targetProtein;
    const carbsDiff = Math.abs(totalCarbs - targetCarbs) / targetCarbs;
    const fatDiff = Math.abs(totalFat - targetFat) / targetFat;

    if (proteinDiff > 0.15 || carbsDiff > 0.15 || fatDiff > 0.15) {
      console.log('❌ Macros fuera de target (>15% diff)');
      return false;
    }
  }

  return true;
}

/**
 * Calcula la complejidad de adaptar un plan
 * Útil para cost optimizer
 *
 * @param originalContext - Contexto original
 * @param newContext - Nuevo contexto
 * @returns Complejidad 0.0 (simple) a 1.0 (muy complejo)
 */
export function calculateAdaptationComplexity(
  originalContext: UserPlanningContext,
  newContext: UserPlanningContext
): number {
  let complexity = 0;

  // Factor 1: Diferencia de peso (max 0.2)
  const weightDiff = Math.abs(
    newContext.biometrics.weight - originalContext.biometrics.weight
  );
  complexity += Math.min(weightDiff / 50, 0.2);

  // Factor 2: Dieta diferente (0.3 si es diferente)
  if (originalContext.nutrition.dietType !== newContext.nutrition.dietType) {
    complexity += 0.3;
  }

  // Factor 3: Intolerancias nuevas (0.1 por cada una, max 0.3)
  const newIntolerances = newContext.nutrition.intolerances.filter(
    (int) => !originalContext.nutrition.intolerances.includes(int)
  );
  complexity += Math.min(newIntolerances.length * 0.1, 0.3);

  // Factor 4: Días de entrenamiento diferentes (0.2 si es diferente)
  if (originalContext.training.daysPerWeek !== newContext.training.daysPerWeek) {
    complexity += 0.2;
  }

  return Math.min(complexity, 1.0);
}
