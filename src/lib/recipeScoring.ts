// ============================================
// RECIPE CONTEXTUAL SCORING ALGORITHM
// ============================================

import { Recipe } from './recipeTypes';
import {
  UserContext,
  RecipeScoreResult,
  MealSlot,
  TimeCategory,
  TIME_CATEGORIES,
} from '@/types/recipeFilters';

// ============================================
// CONFIGURACIÓN DE PESOS
// ============================================

const SCORE_WEIGHTS = {
  goalScore: 3.0,          // Peso x3: Lo más importante
  mealTimingScore: 2.0,    // Peso x2: Muy importante
  calorieScore: 2.0,       // Peso x2: Muy importante
  macroScore: 1.5,         // Peso x1.5: Importante
  timeScore: 1.0,          // Peso x1: Moderado
  ingredientScore: 0.5,    // Peso x0.5: Nice to have
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Verifica si una receta contiene alérgenos del usuario
 */
function hasAllergens(recipe: Recipe, allergens: string[]): boolean {
  if (!allergens || allergens.length === 0) return false;

  const searchText = `${recipe.description} ${recipe.keywords} ${recipe.recipeIngredient.join(' ')}`.toLowerCase();

  return allergens.some(allergen => {
    const allergenLower = allergen.toLowerCase();
    return searchText.includes(allergenLower);
  });
}

/**
 * Verifica si una receta contiene ingredientes prohibidos por intolerancias o restricciones
 */
function hasProhibitedIngredients(
  recipe: Recipe,
  intolerances: string[],
  dietaryRestrictions: string[],
  medicalConditions: string[]
): boolean {
  const searchText = `${recipe.description} ${recipe.keywords} ${recipe.recipeIngredient.join(' ')}`.toLowerCase();

  // Verificar intolerancias
  if (intolerances && intolerances.length > 0) {
    if (intolerances.some(item => searchText.includes(item.toLowerCase()))) {
      return true;
    }
  }

  // Verificar restricciones dietéticas
  if (dietaryRestrictions && dietaryRestrictions.length > 0) {
    const prohibitedIngredients: Record<string, string[]> = {
      vegetariano: ['carne', 'pollo', 'pescado', 'cerdo', 'res', 'pavo'],
      vegano: ['carne', 'pollo', 'pescado', 'huevo', 'leche', 'queso', 'mantequilla', 'yogur'],
      halal: ['cerdo', 'bacon', 'alcohol'],
    };

    for (const restriction of dietaryRestrictions) {
      const prohibited = prohibitedIngredients[restriction.toLowerCase()];
      if (prohibited && prohibited.some(item => searchText.includes(item))) {
        return true;
      }
    }
  }

  // Verificar condiciones médicas
  if (medicalConditions && medicalConditions.length > 0) {
    // Por ejemplo, si tiene diabetes, evitar recetas altas en azúcar
    if (medicalConditions.some(c => c.toLowerCase() === 'diabetes')) {
      if (recipe.nutrition_alerts && recipe.nutrition_alerts.some(alert =>
        alert.includes('sugar') || alert.includes('azúcar')
      )) {
        return true;
      }
    }
    // Si tiene hipertensión, evitar recetas altas en sodio
    if (medicalConditions.some(c => c.toLowerCase() === 'hipertensión')) {
      if (recipe.nutrition_alerts && recipe.nutrition_alerts.some(alert =>
        alert.includes('sodium') || alert.includes('sodio')
      )) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Verifica si la receta coincide con el momento del día
 */
function matchesMealTiming(recipe: Recipe, mealSlot: MealSlot): boolean {
  const categoryLower = recipe.recipeCategory.toLowerCase();

  const mealTimingMap: Record<MealSlot, string[]> = {
    breakfast: ['desayuno', 'breakfast'],
    lunch: ['almuerzo', 'comida', 'lunch'],
    dinner: ['cena', 'dinner'],
    snack: ['snack', 'aperitivo', 'merienda'],
    snack_1: ['snack', 'aperitivo', 'merienda'],
    snack_2: ['snack', 'aperitivo', 'merienda'],
    pre_workout: ['snack', 'pre-entreno', 'energético'],
    post_workout: ['snack', 'post-entreno', 'proteico'],
  };

  const matchTerms = mealTimingMap[mealSlot];
  return matchTerms.some(term => categoryLower.includes(term));
}

/**
 * Calcula el score de calorías (cuanto más cerca del target, mejor)
 */
function calculateCalorieScore(
  recipeCalories: number,
  targetCalories: number
): number {
  const deviation = Math.abs(recipeCalories - targetCalories);
  // Penalizar por cada 50 kcal de desviación
  const score = Math.max(0, 20 - (deviation / 50));
  return score;
}

/**
 * Calcula el score de proteínas
 */
function calculateProteinScore(
  recipeProtein: number,
  targetProtein: number
): number {
  const deviation = Math.abs(recipeProtein - targetProtein);
  // Penalizar por cada 5g de desviación
  const score = Math.max(0, 20 - (deviation / 5));
  return score;
}

/**
 * Verifica si la receta contiene ingredientes preferidos
 */
function containsPreferredIngredients(
  recipe: Recipe,
  preferredIngredients: string[]
): boolean {
  if (!preferredIngredients || preferredIngredients.length === 0) return false;

  const ingredientsText = recipe.recipeIngredient.join(' ').toLowerCase();
  return preferredIngredients.some(ingredient =>
    ingredientsText.includes(ingredient.toLowerCase())
  );
}

/**
 * Calcula el score de tiempo de preparación
 */
function calculateTimeScore(
  recipe: Recipe,
  preferredTime: TimeCategory
): number {
  // Parsear tiempo total
  const timeMatch = recipe.totalTime?.match(/PT(\d+)M/) || recipe.totalTime?.match(/PT(\d+)H/);
  let totalMinutes = 0;

  if (timeMatch) {
    totalMinutes = recipe.totalTime.includes('H')
      ? parseInt(timeMatch[1]) * 60
      : parseInt(timeMatch[1]);
  }

  // Si no se especifica preferencia, dar score medio
  if (preferredTime === 'any') return 10;

  // Encontrar la categoría que corresponde a este tiempo
  const timeConfig = TIME_CATEGORIES.find(tc => tc.category === preferredTime);
  if (!timeConfig) return 10;

  // Si el tiempo de la receta está dentro de la categoría preferida, dar score alto
  if (totalMinutes <= timeConfig.maxMinutes) {
    return 10;
  }

  // Penalizar si excede la categoría preferida
  const excess = totalMinutes - timeConfig.maxMinutes;
  return Math.max(0, 10 - (excess / 10));
}

// ============================================
// ALGORITMO PRINCIPAL DE SCORING
// ============================================

/**
 * Calcula el score contextual de una receta para un usuario específico
 */
export function calculateRecipeScore(
  recipe: Recipe,
  userContext: UserContext
): RecipeScoreResult {
  let totalScore = 0;
  const breakdown = {
    safetyScore: 0,
    goalScore: 0,
    mealTimingScore: 0,
    calorieScore: 0,
    macroScore: 0,
    timeScore: 0,
    ingredientScore: 0,
  };

  // ============================================
  // 1. SAFETY SCORE (Seguridad) - Score binario: 0 o 100
  // ============================================

  // Verificar alérgenos
  if (hasAllergens(recipe, userContext.safetyProfile.allergies)) {
    // Receta descartada por alérgenos
    breakdown.safetyScore = 0;
    return {
      recipe,
      totalScore: 0,
      label: null,
      breakdown,
    };
  }

  // Verificar ingredientes prohibidos
  if (hasProhibitedIngredients(
    recipe,
    userContext.safetyProfile.intolerances,
    userContext.safetyProfile.dietaryRestrictions,
    userContext.safetyProfile.medicalConditions
  )) {
    // Receta descartada por restricciones
    breakdown.safetyScore = 0;
    return {
      recipe,
      totalScore: 0,
      label: null,
      breakdown,
    };
  }

  // Si llegamos aquí, la receta es segura
  breakdown.safetyScore = 100;

  // ============================================
  // 2. GOAL SCORE (Objetivo nutricional) - Peso x3
  // ============================================

  if (recipe.nutrition_score) {
    let goalScore = 0;
    switch (userContext.goal) {
      case 'cut':
        goalScore = recipe.nutrition_score.cut || recipe.nutrition_score.general;
        break;
      case 'bulk':
        goalScore = recipe.nutrition_score.bulk || recipe.nutrition_score.general;
        break;
      case 'maintenance':
        goalScore = recipe.nutrition_score.general;
        break;
    }
    breakdown.goalScore = goalScore;
    totalScore += goalScore * SCORE_WEIGHTS.goalScore;
  } else {
    // Si no hay nutrition_score, dar un score neutral
    breakdown.goalScore = 10;
    totalScore += 10 * SCORE_WEIGHTS.goalScore;
  }

  // ============================================
  // 3. MEAL TIMING SCORE (Momento del día) - Peso x2
  // ============================================

  if (matchesMealTiming(recipe, userContext.mealSlot)) {
    breakdown.mealTimingScore = 20;
    totalScore += 20 * SCORE_WEIGHTS.mealTimingScore;
  } else {
    breakdown.mealTimingScore = 5;
    totalScore += 5 * SCORE_WEIGHTS.mealTimingScore;
  }

  // ============================================
  // 4. CALORIE SCORE (Calorías) - Peso x2
  // ============================================

  const recipeCalories = recipe.nutrition?.calories || 0;
  const calorieScore = calculateCalorieScore(recipeCalories, userContext.targetCalories);
  breakdown.calorieScore = calorieScore;
  totalScore += calorieScore * SCORE_WEIGHTS.calorieScore;

  // ============================================
  // 5. MACRO SCORE (Macronutrientes) - Peso x1.5
  // ============================================

  const recipeProtein = recipe.nutrition?.protein_g || 0;
  const proteinScore = calculateProteinScore(recipeProtein, userContext.targetProtein);
  breakdown.macroScore = proteinScore;
  totalScore += proteinScore * SCORE_WEIGHTS.macroScore;

  // ============================================
  // 6. TIME SCORE (Tiempo de preparación) - Peso x1
  // ============================================

  const timeScore = calculateTimeScore(recipe, userContext.preferredTime);
  breakdown.timeScore = timeScore;
  totalScore += timeScore * SCORE_WEIGHTS.timeScore;

  // ============================================
  // 7. INGREDIENT SCORE (Ingredientes preferidos) - Peso x0.5
  // ============================================

  if (containsPreferredIngredients(recipe, userContext.preferredIngredients)) {
    breakdown.ingredientScore = 5;
    totalScore += 5 * SCORE_WEIGHTS.ingredientScore;
  } else {
    breakdown.ingredientScore = 0;
  }

  // ============================================
  // NORMALIZACIÓN Y LABEL
  // ============================================

  // Normalizar el score a 0-100
  const maxPossibleScore =
    20 * SCORE_WEIGHTS.goalScore +
    20 * SCORE_WEIGHTS.mealTimingScore +
    20 * SCORE_WEIGHTS.calorieScore +
    20 * SCORE_WEIGHTS.macroScore +
    10 * SCORE_WEIGHTS.timeScore +
    5 * SCORE_WEIGHTS.ingredientScore;

  const normalizedScore = Math.min(100, (totalScore / maxPossibleScore) * 100);

  // Determinar el label
  let label: '⭐ Ideal para ti' | '🎯 Buena opción' | null = null;
  if (normalizedScore >= 80) {
    label = '⭐ Ideal para ti';
  } else if (normalizedScore >= 60) {
    label = '🎯 Buena opción';
  }

  return {
    recipe,
    totalScore: Math.round(normalizedScore),
    label,
    breakdown,
  };
}

// ============================================
// FILTRADO Y ORDENAMIENTO
// ============================================

/**
 * Filtra y ordena recetas según el contexto del usuario
 */
export function filterAndScoreRecipes(
  recipes: Recipe[],
  userContext: UserContext
): RecipeScoreResult[] {
  // Calcular score para cada receta
  const scored = recipes
    .map(recipe => calculateRecipeScore(recipe, userContext))
    // Filtrar recetas con score 0 (no seguras)
    .filter(result => result.totalScore > 0);

  // Ordenar por score descendente
  scored.sort((a, b) => b.totalScore - a.totalScore);

  return scored;
}

/**
 * Calcula automáticamente el rango calórico para un slot de comida
 */
export function calculateCalorieRange(
  tdee: number,
  mealPercentage: number
): { min: number; max: number } {
  const targetCalories = tdee * (mealPercentage / 100);
  const margin = targetCalories * 0.2; // ±20%

  return {
    min: Math.round(targetCalories - margin),
    max: Math.round(targetCalories + margin),
  };
}

/**
 * Detecta automáticamente el slot de comida según la hora actual
 */
export function detectMealSlot(): MealSlot {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 11) return 'breakfast';
  if (hour >= 11 && hour < 16) return 'lunch';
  if (hour >= 16 && hour < 19) return 'snack';
  if (hour >= 19 && hour < 23) return 'dinner';

  // Por defecto, lunch
  return 'lunch';
}
