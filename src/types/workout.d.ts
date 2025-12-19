// ============================================
// WORKOUT TYPES - Training Plans & Execution
// ============================================

/**
 * Workout - Entrenamiento individual del plan
 * Puede ser modificado por el usuario después de la generación
 */
export interface Workout {
  id: string;
  userId: string;
  weeklyPlanId: string;
  date: string; // ISO 8601
  dayNumber: number; // 1-7

  // Workout metadata
  type: "strength" | "cardio" | "hiit" | "rest" | "active_recovery";
  phase: "base" | "build" | "peak" | "taper" | "recovery";
  focus?:
    | "full_body"
    | "upper"
    | "lower"
    | "push"
    | "pull"
    | "legs"
    | "cardio_endurance"
    | "cardio_intervals";
  duration: number; // minutos
  intensity: "low" | "moderate" | "high" | "very_high";
  description?: string;

  // Exercises (JSON)
  exercises: Exercise[];

  // Warmup/Cooldown
  warmup?: WarmupCooldown;
  cooldown?: WarmupCooldown;

  notes?: string;

  // Tracking
  completed: boolean;
  completedAt?: string; // ISO 8601

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface Exercise {
  id?: string; // Para ediciones
  name: string;
  category: "compound" | "isolation" | "cardio" | "mobility";
  muscleGroup:
    | "chest"
    | "back"
    | "legs"
    | "shoulders"
    | "arms"
    | "core"
    | "full_body"
    | "cardio";
  sets: number;
  reps: number | string; // 12 o "AMRAP" o "12-15"
  rest: number; // segundos entre series
  tempo?: string; // "2-0-2-0" (eccentric-pause-concentric-pause)
  weight?: string; // "RPE 8", "60% 1RM", "bodyweight", "50kg"
  notes?: string;
  videoId?: string; // YouTube ID
  alternatives?: string[]; // ejercicios alternativos
}

export interface WarmupCooldown {
  description: string;
  duration: number; // minutos
  exercises?: WarmupExercise[];
}

export interface WarmupExercise {
  name: string;
  duration?: number; // segundos
  reps?: number;
  notes?: string;
}

/**
 * WorkoutExecution - Registro de un entrenamiento completado
 */
export interface WorkoutExecution {
  id: string;
  userId: string;
  workoutId: string;

  // Timing
  completedAt: string; // ISO 8601
  actualDuration?: number; // minutos (si difiere del planeado)

  // Feeling
  overallFeeling?: "easy" | "moderate" | "hard" | "very_hard";
  rpe?: number; // Rate of Perceived Exertion (1-10)

  // Exercises performed (con valores reales)
  exercisesPerformed: ExercisePerformed[];

  // Notes
  notes?: string;

  createdAt: string;
}

export interface ExercisePerformed {
  exerciseId?: string; // Referencia al ejercicio del plan
  name: string;
  setsCompleted: number;
  actualReps: (number | string)[]; // reps por serie: [12, 10, 8, 8]
  actualWeight?: (number | string)[]; // peso por serie: [50, 50, 52.5, 52.5]
  actualRest?: number[]; // descanso real por serie (segundos)
  notes?: string;
  skipped?: boolean; // true si el ejercicio se saltó
  substitution?: {
    originalExercise: string;
    reason: string;
  };
}

/**
 * WorkoutTemplate - Plantillas predefinidas de entrenamientos
 */
export interface WorkoutTemplate {
  id: string;
  name: string;
  type: "strength" | "cardio" | "hiit" | "active_recovery";
  level: "beginner" | "intermediate" | "advanced";
  focus:
    | "full_body"
    | "upper"
    | "lower"
    | "push"
    | "pull"
    | "legs"
    | "cardio_endurance"
    | "cardio_intervals";
  duration: number; // minutos
  intensity: "low" | "moderate" | "high" | "very_high";
  description: string;
  exercises: Exercise[];
  warmup?: WarmupCooldown;
  cooldown?: WarmupCooldown;
  tags: string[]; // ["beginner_friendly", "no_equipment", "quick"]
  equipment: string[]; // ["dumbbells", "barbell", "none"]
}

/**
 * WorkoutStats - Estadísticas de entrenamientos
 */
export interface WorkoutStats {
  userId: string;
  period: "week" | "month" | "all_time";
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601

  totalWorkouts: number;
  totalMinutes: number;
  avgDuration: number;
  completionRate: number; // 0-100

  byType: {
    strength: number;
    cardio: number;
    hiit: number;
    activeRecovery: number;
  };

  byIntensity: {
    low: number;
    moderate: number;
    high: number;
    veryHigh: number;
  };

  streak: {
    current: number; // días consecutivos
    longest: number; // racha más larga
  };

  // Progresión (para ejercicios específicos)
  exerciseProgression?: ExerciseProgression[];
}

export interface ExerciseProgression {
  exerciseName: string;
  dataPoints: ProgressionDataPoint[];
  trend: "increasing" | "stable" | "decreasing";
  totalVolume: number; // sets × reps × weight
  bestSet: {
    weight: number;
    reps: number;
    date: string;
  };
}

export interface ProgressionDataPoint {
  date: string; // ISO 8601
  sets: number;
  reps: number[];
  weight: number[];
  volume: number; // sets × reps × weight
  rpe?: number;
}

/**
 * Workout Move/Edit Operations
 */
export interface WorkoutMoveRequest {
  workoutId: string;
  newDate: string; // ISO 8601
}

export interface WorkoutEditRequest {
  workoutId: string;
  updates: Partial<{
    duration: number;
    intensity: "low" | "moderate" | "high" | "very_high";
    notes: string;
    exercises: Exercise[];
  }>;
}

export interface ExerciseEditRequest {
  workoutId: string;
  exerciseId: string;
  updates: Partial<Exercise>;
}

export interface ExerciseDeleteRequest {
  workoutId: string;
  exerciseId: string;
}

export interface ExerciseAddRequest {
  workoutId: string;
  exercise: Exercise;
  position?: number; // índice donde insertar (opcional)
}

/**
 * Workout Validation
 */
export interface WorkoutMoveValidation {
  valid: boolean;
  errors: WorkoutValidationError[];
  warnings: WorkoutValidationWarning[];
  suggestedAlternatives?: string[]; // fechas alternativas válidas
}

export interface WorkoutValidationError {
  code:
    | "MAX_CONSECUTIVE_DAYS"
    | "MAX_WORKOUTS_PER_DAY"
    | "REST_DAY_MANDATORY"
    | "INVALID_DATE"
    | "PHASE_LOCKED";
  message: string;
  details?: Record<string, unknown>;
}

export interface WorkoutValidationWarning {
  code:
    | "PHASE_MISMATCH"
    | "INTENSITY_SPIKE"
    | "VOLUME_SPIKE"
    | "BACK_TO_BACK_HARD"
    | "INSUFFICIENT_REST";
  message: string;
  severity: "low" | "medium" | "high";
}

/**
 * Workout Filters & Queries
 */
export interface WorkoutFilter {
  userId: string;
  startDate?: string; // ISO 8601
  endDate?: string; // ISO 8601
  type?: ("strength" | "cardio" | "hiit" | "rest" | "active_recovery")[];
  phase?: ("base" | "build" | "peak" | "taper" | "recovery")[];
  completed?: boolean;
  intensity?: ("low" | "moderate" | "high" | "very_high")[];
}

export interface WorkoutQueryResult {
  workouts: Workout[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Cardio-specific types
 */
export interface CardioWorkout extends Workout {
  type: "cardio";
  cardioDetails: {
    modality: "running" | "cycling" | "swimming" | "rowing" | "elliptical";
    targetDistance?: number; // metros o km
    targetPace?: string; // "5:00/km", "25 km/h"
    targetHeartRate?: number; // bpm
    intervals?: CardioInterval[];
    notes?: string;
  };
}

export interface CardioInterval {
  type: "warmup" | "work" | "rest" | "cooldown";
  duration: number; // minutos o segundos
  intensity: "low" | "moderate" | "high" | "max";
  targetPace?: string;
  targetHeartRate?: number; // bpm
  notes?: string;
}

/**
 * HIIT-specific types
 */
export interface HIITWorkout extends Workout {
  type: "hiit";
  hiitDetails: {
    protocol: "tabata" | "emom" | "amrap" | "circuit" | "custom";
    rounds: number;
    workDuration: number; // segundos
    restDuration: number; // segundos
    exercises: HIITExercise[];
  };
}

export interface HIITExercise {
  name: string;
  reps?: number; // si es por reps en lugar de tiempo
  notes?: string;
}

/**
 * Rest Day types
 */
export interface RestDay extends Workout {
  type: "rest" | "active_recovery";
  restDayDetails?: {
    activities: string[]; // ["stretching", "walking", "yoga"]
    recommendations: string[];
    targetSteps?: number;
    targetWater?: number; // ml
  };
}
