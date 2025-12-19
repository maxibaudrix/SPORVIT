// ============================================
// MEAL TYPES - Nutrition Plans & Execution
// ============================================

/**
 * Meal - Comida individual del plan nutricional
 * Puede ser modificada por el usuario después de la generación
 */
export interface Meal {
  id: string;
  userId: string;
  weeklyPlanId: string;
  date: string; // ISO 8601
  mealType: "breakfast" | "lunch" | "dinner" | "snack_1" | "snack_2";
  timing?: string; // "07:00", "13:00", etc.

  // Meal details
  name: string;
  description?: string;

  // Nutrition
  calories: number;
  protein: number; // gramos
  carbs: number; // gramos
  fat: number; // gramos
  fiber: number; // gramos

  // Ingredients (JSON)
  ingredients: Ingredient[];

  // Instructions (JSON)
  instructions: string[]; // pasos de preparación

  // Metadata
  prepTime?: number; // minutos
  cookTime?: number; // minutos
  difficulty?: "easy" | "medium" | "hard";
  tags?: string[]; // ["high_protein", "quick", "meal_prep"]

  // Tracking
  consumed: boolean;
  consumedAt?: string; // ISO 8601

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface Ingredient {
  id?: string; // Para ediciones
  name: string;
  amount: number;
  unit: "g" | "ml" | "unidad" | "taza" | "cucharada" | "cucharadita" | "oz";
  notes?: string; // "opcional", "al gusto", etc.
  category?: FoodCategory;
  macros?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

export type FoodCategory =
  | "protein"
  | "carbs"
  | "fats"
  | "vegetables"
  | "fruits"
  | "dairy"
  | "condiments"
  | "other";

/**
 * MealExecution - Registro de una comida consumida
 */
export interface MealExecution {
  id: string;
  userId: string;
  mealId: string;

  // Timing
  consumedAt: string; // ISO 8601

  // Actual amounts (si el usuario modificó cantidades)
  actualAmounts?: ActualIngredientAmount[];

  // Recalculated macros (si hubo modificación)
  actualMacros?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };

  // Notes
  notes?: string;
  satisfaction?: 1 | 2 | 3 | 4 | 5; // 1=muy insatisfecho, 5=muy satisfecho
  hungerBefore?: 1 | 2 | 3 | 4 | 5; // nivel de hambre antes
  hungerAfter?: 1 | 2 | 3 | 4 | 5; // nivel de hambre después

  createdAt: string;
}

export interface ActualIngredientAmount {
  ingredientIndex: number; // índice en el array de ingredientes
  actualAmount: number;
  actualUnit: string;
  notes?: string;
}

/**
 * DailyNutrition - Resumen nutricional de un día
 */
export interface DailyNutrition {
  userId: string;
  date: string; // ISO 8601

  // Targets del día
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  targetFiber: number;

  // Actual consumed
  actualCalories: number;
  actualProtein: number;
  actualCarbs: number;
  actualFat: number;
  actualFiber: number;

  // Diff
  diffCalories: number;
  diffProtein: number;
  diffCarbs: number;
  diffFat: number;

  // Status
  status: "on_track" | "under" | "over";
  compliancePercentage: number; // 0-100

  // Meals consumed
  mealsConsumed: number;
  totalMeals: number;
  mealsStatus: boolean[]; // array con estado de cada comida

  // Water tracking
  waterGlasses: number;
  targetWaterGlasses: number;
}

/**
 * MealTemplate - Plantillas predefinidas de comidas
 */
export interface MealTemplate {
  id: string;
  name: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack_1" | "snack_2";
  description?: string;

  // Nutrition (por porción)
  caloriesPerServing: number;
  proteinPerServing: number;
  carbsPerServing: number;
  fatPerServing: number;
  fiberPerServing: number;

  servings: number; // número de porciones que rinde

  ingredients: IngredientTemplate[];
  instructions: string[];

  prepTime?: number;
  cookTime?: number;
  difficulty?: "easy" | "medium" | "hard";

  // Metadata
  tags: string[]; // ["high_protein", "vegetarian", "quick"]
  dietaryInfo: string[]; // ["gluten_free", "dairy_free", "nut_free"]
  cuisine?: string; // "mediterranean", "asian", "mexican"
  mealPrepFriendly: boolean;

  // Ratings
  rating?: number; // 1-5
  ratingCount?: number;
}

export interface IngredientTemplate {
  name: string;
  amount: number;
  unit: string;
  category: FoodCategory;
  optional?: boolean;
  substitutions?: string[]; // ingredientes alternativos
}

/**
 * Meal Move/Edit Operations
 */
export interface MealMoveRequest {
  mealId: string;
  newDate: string; // ISO 8601
  newMealType?: "breakfast" | "lunch" | "dinner" | "snack_1" | "snack_2";
}

export interface MealEditRequest {
  mealId: string;
  updates: Partial<{
    name: string;
    description: string;
    timing: string;
    ingredients: Ingredient[];
    instructions: string[];
    tags: string[];
  }>;
}

export interface IngredientEditRequest {
  mealId: string;
  ingredientIndex: number;
  updates: Partial<Ingredient>;
}

export interface IngredientAmountEdit {
  mealId: string;
  ingredientIndex: number;
  newAmount: number;
  newUnit?: string;
}

export interface MealReplaceRequest {
  mealId: string;
  replacementMealId: string; // ID de meal template o meal de otro día
}

/**
 * Nutrition Stats
 */
export interface NutritionStats {
  userId: string;
  period: "week" | "month" | "all_time";
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601

  // Averages
  avgDailyCalories: number;
  avgDailyProtein: number;
  avgDailyCarbs: number;
  avgDailyFat: number;
  avgDailyFiber: number;

  // Compliance
  avgCompliance: number; // 0-100
  daysOnTrack: number;
  daysUnder: number;
  daysOver: number;

  // Meal completion
  totalMealsPlanned: number;
  totalMealsConsumed: number;
  mealCompletionRate: number; // 0-100

  // By meal type
  breakfastCompletionRate: number;
  lunchCompletionRate: number;
  dinnerCompletionRate: number;
  snackCompletionRate: number;

  // Trends
  caloriesTrend: "increasing" | "stable" | "decreasing";
  weightTrend?: "increasing" | "stable" | "decreasing";

  // Macro distribution
  avgMacroRatio: {
    proteinPercent: number; // % de calorías
    carbsPercent: number; // % de calorías
    fatPercent: number; // % de calorías
  };
}

/**
 * Shopping List
 */
export interface ShoppingList {
  id: string;
  userId: string;
  name: string;
  weekStartDate: string; // ISO 8601
  weekEndDate: string; // ISO 8601

  items: ShoppingItem[];

  // Metadata
  healthScore: number; // 0-100 (basado en calidad de ingredientes)
  estimatedCost?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: FoodCategory;
  checked: boolean;

  // Nutritional info (optional)
  nutriScore?: "A" | "B" | "C" | "D" | "E";
  ecoScore?: "A" | "B" | "C" | "D" | "E";

  // Origin (de qué comidas viene)
  fromMeals: string[]; // array de meal IDs

  notes?: string;
}

/**
 * Meal Swap Suggestions
 */
export interface MealSwapSuggestion {
  originalMealId: string;
  suggestions: MealTemplate[];
  reason:
    | "similar_macros"
    | "same_meal_type"
    | "dietary_preference"
    | "seasonal"
    | "user_favorite";
  macrosDiff: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

/**
 * Meal Filters & Queries
 */
export interface MealFilter {
  userId: string;
  startDate?: string; // ISO 8601
  endDate?: string; // ISO 8601
  mealType?: ("breakfast" | "lunch" | "dinner" | "snack_1" | "snack_2")[];
  consumed?: boolean;
  minCalories?: number;
  maxCalories?: number;
  minProtein?: number;
  tags?: string[];
  difficulty?: ("easy" | "medium" | "hard")[];
}

export interface MealQueryResult {
  meals: Meal[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Macro Calculator Helpers
 */
export interface MacroCalculation {
  ingredient: string;
  baseAmount: number; // cantidad base del ingrediente
  baseUnit: string;
  baseMacros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  newAmount: number; // nueva cantidad
  newUnit: string;
  newMacros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  multiplier: number; // factor de multiplicación
}

/**
 * Recipe types
 */
export interface Recipe {
  id: string;
  userId?: string; // null si es recipe global
  name: string;
  description?: string;

  // Nutrition per serving
  servings: number;
  caloriesPerServing: number;
  proteinPerServing: number;
  carbsPerServing: number;
  fatPerServing: number;
  fiberPerServing: number;

  ingredients: Ingredient[];
  instructions: string[];

  prepTime?: number;
  cookTime?: number;
  totalTime?: number;
  difficulty?: "easy" | "medium" | "hard";

  // Metadata
  tags: string[];
  cuisine?: string;
  mealTypes: ("breakfast" | "lunch" | "dinner" | "snack")[];
  dietaryInfo: string[];
  equipment?: string[]; // ["blender", "oven", "stovetop"]

  // Media
  imageUrl?: string;
  videoUrl?: string;

  // User interaction
  favorited?: boolean;
  rating?: number;
  ratingCount?: number;
  userNotes?: string;

  createdAt: string;
  updatedAt: string;
}

/**
 * Portion Calculator
 */
export interface PortionCalculation {
  originalServings: number;
  desiredServings: number;
  multiplier: number;
  scaledIngredients: Ingredient[];
  scaledMacros: {
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    totalFiber: number;
    perServing: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
    };
  };
}

/**
 * Meal Prep types
 */
export interface MealPrepPlan {
  id: string;
  userId: string;
  weekStartDate: string; // ISO 8601
  weekEndDate: string; // ISO 8601

  recipes: MealPrepRecipe[];
  shoppingList: ShoppingList;

  // Planning
  prepDate: string; // ISO 8601 - día de preparación
  estimatedPrepTime: number; // minutos totales
  estimatedCost?: number;

  // Storage
  storageInstructions: StorageInstruction[];

  createdAt: string;
  updatedAt: string;
}

export interface MealPrepRecipe {
  recipeId: string;
  recipe: Recipe;
  batchSize: number; // número de porciones a preparar
  assignedTo: MealAssignment[]; // a qué comidas se asigna
  prepOrder: number; // orden de preparación
}

export interface MealAssignment {
  date: string; // ISO 8601
  mealType: "breakfast" | "lunch" | "dinner" | "snack_1" | "snack_2";
  servings: number;
}

export interface StorageInstruction {
  recipeId: string;
  recipeName: string;
  storageMethod: "fridge" | "freezer" | "pantry";
  containerType: string; // "tupperware", "glass_jar", "freezer_bag"
  daysGood: number; // días que se mantiene fresco
  reheatingInstructions?: string;
}
