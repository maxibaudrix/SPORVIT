/**
 * Feature Extractor
 *
 * Convierte un UserPlanningContext en un vector numérico de dimensión fija
 * para cálculo de similitud mediante operaciones vectoriales.
 */

import { UserPlanningContext } from '@/types/planning';

export interface FeatureVector {
  dimensions: number;
  values: number[];     // Todos normalizados 0-1
  labels: string[];     // Para debugging
}

/**
 * Extrae features numéricos del contexto
 *
 * @param context - Contexto del usuario
 * @returns Array de números normalizados entre 0 y 1
 */
export function extractFeatures(context: UserPlanningContext): number[] {
  const features: number[] = [];

  // ========== FEATURES FÍSICOS (índices 0-4) ==========
  // Peso: 1.0

  // 1. Edad normalizada
  features.push(context.biometrics.age / 100);

  // 2. Peso normalizado
  features.push(context.biometrics.weight / 150);

  // 3. Altura normalizada
  features.push(context.biometrics.height / 200);

  // 4. Género (one-hot encoding)
  features.push(context.biometrics.gender === 'male' ? 1.0 : 0.0);
  features.push(context.biometrics.gender === 'female' ? 1.0 : 0.0);

  // ========== FEATURES DE OBJETIVO (índices 5-11) ==========
  // Peso: 2.0 (más importante)

  // 5-8. Tipo de objetivo (one-hot)
  features.push(context.objective.primaryGoal === 'cut' ? 1.0 : 0.0);
  features.push(context.objective.primaryGoal === 'bulk' ? 1.0 : 0.0);
  features.push(context.objective.primaryGoal === 'maintain' ? 1.0 : 0.0);
  features.push(context.objective.primaryGoal === 'recomp' ? 1.0 : 0.0);
  features.push(context.objective.primaryGoal === 'performance' ? 1.0 : 0.0);

  // 9. Timeline normalizado
  features.push(context.objective.targetTimeline / 16);

  // 10. Tiene competición
  features.push(context.objective.hasCompetition ? 1.0 : 0.0);

  // ========== FEATURES DE ENTRENAMIENTO (índices 12-19) ==========
  // Peso: 1.5

  // 11-13. Nivel de experiencia (one-hot)
  features.push(context.training.experienceLevel === 'beginner' ? 1.0 : 0.0);
  features.push(context.training.experienceLevel === 'intermediate' ? 1.0 : 0.0);
  features.push(context.training.experienceLevel === 'advanced' ? 1.0 : 0.0);

  // 14. Días por semana normalizado
  features.push(context.training.daysPerWeek / 7);

  // 15. Duración de sesión normalizada
  features.push(context.training.sessionDuration / 120);

  // 16. Nivel de actividad diaria (encoded)
  const activityLevels = { sedentary: 0.25, light: 0.5, moderate: 0.75, active: 1.0 };
  features.push(activityLevels[context.activity.dailyActivityLevel] || 0.5);

  // 17. Tiene lesiones
  features.push(context.training.hasInjuries ? 1.0 : 0.0);

  // 18. Número de equipos disponibles (normalizado)
  features.push(Math.min(context.training.availableEquipment.length / 10, 1.0));

  // ========== FEATURES DE NUTRICIÓN (índices 20-27) ==========
  // Peso: 0.8

  // 19. Comidas por día normalizado
  features.push(context.nutrition.mealsPerDay / 6);

  // 20-24. Tipo de dieta (one-hot para los más comunes)
  features.push(context.nutrition.dietType === 'omnivore' ? 1.0 : 0.0);
  features.push(context.nutrition.dietType === 'vegetarian' ? 1.0 : 0.0);
  features.push(context.nutrition.dietType === 'vegan' ? 1.0 : 0.0);
  features.push(context.nutrition.dietType === 'paleo' ? 1.0 : 0.0);
  features.push(context.nutrition.dietType === 'keto' ? 1.0 : 0.0);

  // 25. Número de restricciones (normalizado)
  const totalRestrictions =
    context.nutrition.allergies.length +
    context.nutrition.intolerances.length +
    context.nutrition.excludedFoods.length;
  features.push(Math.min(totalRestrictions / 10, 1.0));

  // ========== FEATURES DE TARGETS (índices 28-30) ==========

  // 26. Calorías de entrenamiento (normalizado)
  features.push(Math.min(context.targets.calories.trainingDay / 3000, 1.0));

  // 27. Proteína normalizada
  features.push(Math.min(context.targets.macros.protein / 250, 1.0));

  // Total: 28 features

  return features;
}

/**
 * Extrae features con metadata (labels para debugging)
 *
 * @param context - Contexto del usuario
 * @returns FeatureVector con valores y labels
 */
export function extractFeatureVector(context: UserPlanningContext): FeatureVector {
  const values = extractFeatures(context);

  const labels = [
    // Físicos
    'age', 'weight', 'height', 'gender_male', 'gender_female',

    // Objetivo
    'goal_cut', 'goal_bulk', 'goal_maintain', 'goal_recomp', 'goal_performance',
    'timeline', 'has_competition',

    // Entrenamiento
    'level_beginner', 'level_intermediate', 'level_advanced',
    'days_per_week', 'session_duration', 'activity_level',
    'has_injuries', 'equipment_count',

    // Nutrición
    'meals_per_day',
    'diet_omnivore', 'diet_vegetarian', 'diet_vegan', 'diet_paleo', 'diet_keto',
    'restrictions_count',

    // Targets
    'calories_training', 'protein_target',
  ];

  return {
    dimensions: values.length,
    values,
    labels,
  };
}

/**
 * Genera weights por categoría para weighted similarity
 *
 * @returns Array de weights correspondiente a cada feature
 */
export function getFeatureWeights(): number[] {
  const weights: number[] = [];

  // Físicos (0-4): peso 1.0
  weights.push(...Array(5).fill(1.0));

  // Objetivo (5-11): peso 2.0
  weights.push(...Array(7).fill(2.0));

  // Entrenamiento (12-19): peso 1.5
  weights.push(...Array(8).fill(1.5));

  // Nutrición (20-27): peso 0.8
  weights.push(...Array(8).fill(0.8));

  // Targets (28-30): peso 1.0
  weights.push(...Array(3).fill(1.0));

  return weights;
}
