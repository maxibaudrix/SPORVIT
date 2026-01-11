// ============================================
// RECIPE FILTERING SYSTEM TYPES
// ============================================

import { Recipe } from '@/lib/recipeTypes';

// ============================================
// NIVEL 1: Filtros Obligatorios (Safety First)
// ============================================

/**
 * Perfil de seguridad del usuario
 * Estos filtros se aplican automáticamente y NO se muestran en la UI
 */
export interface UserSafetyProfile {
  allergies: string[];           // ["gluten", "lácteos", "frutos secos"]
  intolerances: string[];        // ["lactosa"]
  medicalConditions: string[];   // ["diabetes", "hipertensión"]
  dietaryRestrictions: string[]; // ["vegetariano", "vegano", "halal"]
}

// ============================================
// NIVEL 2: Filtros Contextuales (Inteligentes)
// ============================================

/**
 * Tipo de comida/momento del día
 */
export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'snack_1' | 'snack_2' | 'pre_workout' | 'post_workout';

/**
 * Filtro de momento del día
 */
export interface MealTimingFilter {
  slot: MealSlot;
  autoDetected: boolean;  // true si se detectó por hora actual o contexto
}

/**
 * Objetivo nutricional del usuario
 */
export type NutritionalGoal = 'cut' | 'maintenance' | 'bulk';

/**
 * Filtro de objetivo nutricional
 */
export interface NutritionalGoalFilter {
  goal: NutritionalGoal;
  source: 'user_profile' | 'manual';
}

/**
 * Filtro de rango calórico
 */
export interface CalorieRangeFilter {
  min: number;
  max: number;
  autoCalculated: boolean;
  mealPercentage?: number;  // % del TDEE para ese slot
}

/**
 * Filtro de macronutrientes (Avanzado)
 */
export interface MacroTargetsFilter {
  protein_min?: number;    // g por porción
  carbs_max?: number;      // Opcional
  fat_max?: number;        // Opcional
  flexible: boolean;       // true = rango ±10%
}

// ============================================
// NIVEL 3: Filtros de Preferencias (UX)
// ============================================

/**
 * Clasificación de tiempo de preparación
 */
export type TimeCategory = 'quick' | 'moderate' | 'elaborate' | 'any';

/**
 * Filtro de tiempo de preparación
 */
export interface TimeFilter {
  category: TimeCategory;
  maxMinutes?: number;
  priority: 'low' | 'medium' | 'high';
}

/**
 * Filtro de ingredientes específicos
 */
export interface IngredientFilter {
  include: string[];     // ["pollo", "brócoli"]
  exclude: string[];     // ["tomate", "cebolla"]
}

/**
 * Tipo de score para filtro de calidad
 */
export type ScoreType = 'general' | 'goal-specific';

/**
 * Filtro de puntuación mínima
 */
export interface QualityFilter {
  minScore: number;      // 0-100
  scoreType: ScoreType;
}

// ============================================
// CONTEXTO COMPLETO DEL USUARIO
// ============================================

/**
 * Contexto completo del usuario para el filtrado inteligente
 */
export interface UserContext {
  // Safety profile (Nivel 1)
  safetyProfile: UserSafetyProfile;

  // Goal & targets (Nivel 2)
  goal: NutritionalGoal;
  tdee: number;
  targetCalories: number;      // Para la comida específica
  targetProtein: number;       // g
  targetCarbs: number;         // g
  targetFat: number;           // g

  // Meal context (Nivel 2)
  mealSlot: MealSlot;
  mealPercentage: number;      // % del TDEE para este slot

  // Preferences (Nivel 3)
  preferredTime: TimeCategory;
  preferredIngredients: string[];

  // User level
  userLevel: 'basic' | 'intermediate' | 'advanced';
}

// ============================================
// FILTROS ACTIVOS (Para UI)
// ============================================

/**
 * Estado completo de los filtros aplicados
 * Estos son los filtros que el usuario puede ver y modificar
 */
export interface ActiveFilters {
  // Nivel 2: Filtros contextuales
  mealTiming?: MealTimingFilter;
  nutritionalGoal?: NutritionalGoalFilter;
  calorieRange?: CalorieRangeFilter;
  macroTargets?: MacroTargetsFilter;

  // Nivel 3: Filtros de preferencias
  timeFilter?: TimeFilter;
  ingredientFilter?: IngredientFilter;
  qualityFilter?: QualityFilter;

  // Búsqueda por texto
  searchQuery?: string;
}

// ============================================
// SCORING CONTEXTUAL
// ============================================

/**
 * Resultado del scoring de una receta
 */
export interface RecipeScoreResult {
  recipe: Recipe;
  totalScore: number;          // 0-100
  label: '⭐ Ideal para ti' | '🎯 Buena opción' | null;
  breakdown: {
    safetyScore: number;       // 0 = descartada, 100 = segura
    goalScore: number;         // 0-100
    mealTimingScore: number;   // 0-100
    calorieScore: number;      // 0-100
    macroScore: number;        // 0-100
    timeScore: number;         // 0-100
    ingredientScore: number;   // 0-100
  };
}

// ============================================
// REQUEST/RESPONSE TYPES (API)
// ============================================

/**
 * Request para búsqueda de recetas con filtros
 */
export interface RecipeSearchRequest {
  // Texto de búsqueda
  query?: string;

  // Filtros activos
  filters: ActiveFilters;

  // Contexto del usuario (se puede obtener del backend también)
  userContext?: Partial<UserContext>;

  // Paginación
  limit?: number;
  offset?: number;
}

/**
 * Response de búsqueda de recetas
 */
export interface RecipeSearchResponse {
  success: boolean;
  recipes: RecipeScoreResult[];
  total: number;
  appliedFilters: {
    safety: string[];          // Filtros de seguridad aplicados
    contextual: string[];      // Filtros contextuales aplicados
    preferences: string[];     // Filtros de preferencias aplicados
  };
  suggestions?: string[];      // Sugerencias si no hay resultados
  error?: string;
}

// ============================================
// MEAL SLOT CONFIGURATION
// ============================================

/**
 * Configuración de porcentajes de TDEE por slot de comida
 */
export interface MealSlotConfig {
  slot: MealSlot;
  percentage: number;          // % del TDEE
  label: string;               // Label en español
  icon: string;                // Emoji o nombre de icono
  typicalTime: string;         // Hora típica (ej: "08:00")
}

/**
 * Configuración por defecto de slots de comida
 */
export const DEFAULT_MEAL_SLOTS: MealSlotConfig[] = [
  { slot: 'breakfast', percentage: 25, label: 'Desayuno', icon: '🌅', typicalTime: '08:00' },
  { slot: 'lunch', percentage: 35, label: 'Comida', icon: '🍽️', typicalTime: '14:00' },
  { slot: 'dinner', percentage: 30, label: 'Cena', icon: '🌙', typicalTime: '21:00' },
  { slot: 'snack', percentage: 10, label: 'Snack', icon: '🍪', typicalTime: '17:00' },
  { slot: 'snack_1', percentage: 5, label: 'Snack 1', icon: '🍪', typicalTime: '11:00' },
  { slot: 'snack_2', percentage: 5, label: 'Snack 2', icon: '🍪', typicalTime: '17:00' },
  { slot: 'pre_workout', percentage: 10, label: 'Pre-entreno', icon: '💪', typicalTime: '17:00' },
  { slot: 'post_workout', percentage: 15, label: 'Post-entreno', icon: '⚡', typicalTime: '19:00' },
];

// ============================================
// TIME CATEGORIES
// ============================================

/**
 * Configuración de categorías de tiempo
 */
export interface TimeCategoryConfig {
  category: TimeCategory;
  maxMinutes: number;
  label: string;
}

export const TIME_CATEGORIES: TimeCategoryConfig[] = [
  { category: 'quick', maxMinutes: 15, label: 'Rápido (< 15 min)' },
  { category: 'moderate', maxMinutes: 30, label: 'Moderado (15-30 min)' },
  { category: 'elaborate', maxMinutes: 60, label: 'Elaborado (30-60 min)' },
  { category: 'any', maxMinutes: Infinity, label: 'No importa' },
];

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Mapeo de mealType del catálogo a MealSlot
 */
export const MEAL_TYPE_TO_CATEGORY: Record<string, string> = {
  'breakfast': 'Desayunos',
  'lunch': 'Comidas',
  'dinner': 'Cenas',
  'snack': 'Snacks',
  'dessert': 'Postres',
  'smoothie': 'Batidos',
};

/**
 * Labels en español para objetivos nutricionales
 */
export const GOAL_LABELS: Record<NutritionalGoal, string> = {
  'cut': 'Déficit',
  'maintenance': 'Mantenimiento',
  'bulk': 'Superávit',
};
