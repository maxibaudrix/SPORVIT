// ============================================
// USER PLANNING CONTEXT (CONTRATO PRINCIPAL)
// ============================================

export interface UserPlanningContext {
  meta: {
    userId: string;
    createdAt: string; // ISO 8601
    version: "1.0";
    locale: string;
  };

  startPreferences: {
    startDate: string; // ISO 8601
    weekStartsOn: "monday";
  };

  biometrics: {
    age: number;
    gender: "male" | "female" | "other";
    weight: number; // kg
    height: number; // cm
    bodyFatPercentage?: number;
  };

  objective: {
    primaryGoal: "cut" | "bulk" | "maintain" | "recomp" | "performance";
    targetTimeline: number; // semanas
    hasCompetition: boolean;
    competitionType?: string;
    targetDate?: string; // ISO 8601
    motivation?: string;
  };

  activity: {
    country: string;
    timezone: string;
    dailyActivityLevel: "sedentary" | "light" | "moderate" | "active";
    dailySteps: "under-3k" | "3k-6k" | "6k-10k" | "10k-plus";
    availableDays: string[]; // ["monday", "wednesday", "friday"]
    preferredTimes: string[]; // ["morning", "evening"]
  };

  training: {
    experienceLevel: "beginner" | "intermediate" | "advanced";
    sportType: string;
    sportSubtype?: string;
    daysPerWeek: number;
    sessionDuration: number; // minutos
    trainingLocation: string[]; // ["gym", "home"]
    availableEquipment: string[]; // ["dumbbells", "barbell"]
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

  targets: {
    calories: {
      trainingDay: number;
      restDay: number;
    };
    macros: {
      protein: number; // gramos
      carbs: number; // gramos
      fat: number; // gramos
      fiber?: number; // gramos
    };
  };

  planning: {
    blockSize: number; // semanas por bloque
    totalBlocks: number;
    phases: {
      base: number; // semanas
      build: number;
      peak: number;
      taper: number;
      recovery: number;
    };
  };
}

// ============================================
// CALCULATION RESULT (OUTPUT DE CÁLCULOS)
// ============================================

export interface CalculationResult {
  trainingDayCalories: number;
  restDayCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  blockSize: number;
  totalBlocks: number;
  phases: {
    base: number;
    build: number;
    peak: number;
    taper: number;
    recovery: number;
  };
}

// ============================================
// COMPLETE PLANNING OUTPUT (RESPUESTA DE AI)
// ============================================

export interface CompletePlanningOutput {
  totalWeeks: number;
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  weeks: WeekPlan[];
  overallStats: OverallStats;
}

export interface WeekPlan {
  weekNumber: number;
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  phase: "base" | "build" | "peak" | "taper" | "recovery";
  days: DayPlan[];
  weeklyStats: WeeklyStats;
}

export interface DayPlan {
  date: string; // ISO 8601
  dayOfWeek: string; // "monday", "tuesday", etc.
  dayNumber: number; // 1-7
  isTrainingDay: boolean;
  workout?: WorkoutPlan;
  nutrition: NutritionPlan;
}

export interface WorkoutPlan {
  type: "strength" | "cardio" | "hiit" | "rest" | "active_recovery";
  phase: string;
  focus?: "full_body" | "upper" | "lower" | "push" | "pull";
  duration: number; // minutos
  intensity: "low" | "moderate" | "high";
  description: string;
  exercises?: Exercise[];
  warmup?: {
    description: string;
    duration: number;
  };
  cooldown?: {
    description: string;
    duration: number;
  };
  notes?: string;
}

export interface Exercise {
  name: string;
  category: "compound" | "isolation" | "cardio";
  muscleGroup: string;
  sets: number;
  reps: number | string; // puede ser "AMRAP", "12-15", etc.
  rest: number; // segundos
  tempo?: string; // "2-0-2-0"
  notes?: string;
  videoId?: string;
}

export interface NutritionPlan {
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  targetFiber: number;
  meals: MealPlan[];
  hydration?: {
    targetWater: number; // ml
    notes?: string;
  };
}

export interface MealPlan {
  mealType: "breakfast" | "lunch" | "dinner" | "snack_1" | "snack_2";
  timing?: string; // "07:00"
  name: string;
  description?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  ingredients: Ingredient[];
  instructions?: string[];
  prepTime?: number; // minutos
  cookTime?: number; // minutos
  difficulty?: "easy" | "medium" | "hard";
  tags?: string[]; // ["high_protein", "quick", "meal_prep"]
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: "g" | "ml" | "unidad" | "taza" | "cucharada";
  notes?: string;
}

export interface WeeklyStats {
  totalCalories: number;
  avgDailyCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  trainingDays: number;
  restDays: number;
  totalTrainingMinutes: number;
  avgIntensity: string;
}

export interface OverallStats {
  totalTrainingDays: number;
  totalRestDays: number;
  totalTrainingHours: number;
  avgWeeklyCalories: number;
  phaseDistribution: {
    base: number;
    build: number;
    peak: number;
    taper: number;
    recovery: number;
  };
}

// ============================================
// SKELETON (ESTRUCTURA LIGERA PARA DASHBOARD)
// ============================================

export interface PlanSkeleton {
  totalWeeks: number;
  currentWeek: number;
  startDate: string;
  endDate: string;
  skeleton: WeekSkeleton[];
}

export interface WeekSkeleton {
  weekNumber: number;
  startDate: string;
  endDate: string;
  phase: string;
  days: DaySkeleton[];
}

export interface DaySkeleton {
  date: string;
  dayOfWeek: string;
  hasWorkout: boolean;
  workoutType?: string;
  workoutDuration?: number;
  targetCalories: number;
}

// ============================================
// DAY DETAIL (DETALLE COMPLETO DE UN DÍA)
// ============================================

export interface DayDetail {
  date: string;
  dayOfWeek: string;
  weekNumber: number;
  phase: string;
  workout?: WorkoutDetail;
  nutrition: NutritionDetail;
  tracking?: DayTracking;
}

export interface WorkoutDetail extends WorkoutPlan {
  id: string;
}

export interface NutritionDetail extends NutritionPlan {
  meals: MealDetail[];
}

export interface MealDetail extends MealPlan {
  id: string;
}

export interface DayTracking {
  workoutCompleted: boolean;
  mealsCompleted: boolean[];
  waterGlasses: number;
  notes?: string;
}

// ============================================
// VALIDATION RESULT (RESULTADO DE VALIDACIONES)
// ============================================

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  code: string;
  message: string;
  field?: string;
}

export interface ValidationWarning {
  code: string;
  message: string;
  suggestion?: string;
}

// ============================================
// MACROS CALCULATION RESULT
// ============================================

export interface MacrosCalculationResult {
  date: string;
  actual: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  target: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  diff: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  status: "on_track" | "under" | "over";
}