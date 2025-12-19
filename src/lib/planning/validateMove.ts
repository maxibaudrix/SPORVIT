import { prisma } from "@/lib/db";
import type { ValidationResult } from "@/types/planning";

/**
 * Valida si un workout puede moverse a una nueva fecha
 */
export async function validateWorkoutMove(
  workoutId: string,
  newDate: string,
  userId: string
): Promise<ValidationResult> {
  const errors: ValidationResult["errors"] = [];
  const warnings: ValidationResult["warnings"] = [];

  const newDateObj = new Date(newDate);

  // 1. Verificar que no haya más de 2 workouts en el día destino
  const workoutsOnNewDate = await prisma.workout.count({
    where: {
      userId,
      date: newDateObj,
      workoutType: {
        not: "rest",
      },
      id: {
        not: workoutId, // Excluir el workout que se está moviendo
      },
    },
  });

  if (workoutsOnNewDate >= 2) {
    errors.push({
      code: "MAX_WORKOUTS_PER_DAY",
      message: "Ya hay 2 entrenamientos programados para ese día",
      field: "date",
    });
  }

  // 2. Verificar días consecutivos de entrenamiento
  const consecutiveDays = await checkConsecutiveTrainingDays(
    userId,
    newDateObj
  );

  if (consecutiveDays >= 5) {
    errors.push({
      code: "MAX_CONSECUTIVE_DAYS",
      message: "No puedes entrenar más de 5 días consecutivos",
      field: "date",
    });
  } else if (consecutiveDays === 4) {
    warnings.push({
      code: "HIGH_CONSECUTIVE_DAYS",
      message: "Este sería tu 5º día consecutivo de entrenamiento",
      suggestion: "Considera añadir un día de descanso",
    });
  }

  // 3. Verificar cambio de fase
  const workout = await prisma.workout.findUnique({
    where: { id: workoutId },
  });

  if (workout) {
    const originalPhase = await getPhaseForDate(userId, workout.date);
    const newPhase = await getPhaseForDate(userId, newDateObj);

    if (originalPhase !== newPhase) {
      warnings.push({
        code: "PHASE_MISMATCH",
        message: `Mover de fase ${originalPhase} a ${newPhase}`,
        suggestion: "Los workouts están diseñados para su fase específica",
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Valida si una comida puede moverse a una nueva fecha
 */
export async function validateMealMove(
  mealId: string,
  newDate: string,
  userId: string
): Promise<ValidationResult> {
  const errors: ValidationResult["errors"] = [];
  const warnings: ValidationResult["warnings"] = [];

  // Las comidas tienen menos restricciones que los workouts
  // Principalmente verificamos que no cause desequilibrios extremos

  const newDateObj = new Date(newDate);

  // Verificar macros del día destino después del movimiento
  const mealsOnNewDate = await prisma.meal.findMany({
    where: {
      userId,
      date: newDateObj,
      id: {
        not: mealId,
      },
    },
  });

  const meal = await prisma.meal.findUnique({
    where: { id: mealId },
  });

  if (meal) {
    const totalCaloriesAfterMove =
      mealsOnNewDate.reduce((sum, m) => sum + m.totalCalories, 0) + meal.totalCalories

    // Obtener target del día
    const userGoals = await prisma.userGoals.findUnique({
      where: { userId },
    });

    if (userGoals && totalCaloriesAfterMove > userGoals.targetCalories * 1.3) {
      warnings.push({
        code: "HIGH_CALORIES",
        message: "Este día superará el objetivo calórico en más del 30%",
        suggestion: "Considera ajustar las cantidades de las comidas",
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Función auxiliar: Cuenta días consecutivos de entrenamiento
 */
async function checkConsecutiveTrainingDays(
  userId: string,
  targetDate: Date
): Promise<number> {
  let consecutiveDays = 0;
  let currentDate = new Date(targetDate);
  currentDate.setDate(currentDate.getDate() - 1); // Empezar desde día anterior

  // Verificar hacia atrás
  for (let i = 0; i < 7; i++) {
    const hasWorkout = await prisma.workout.findFirst({
      where: {
        userId,
        date: currentDate,
        workoutType: {
          not: "rest",
        },
      },
    });

    if (hasWorkout) {
      consecutiveDays++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Verificar hacia adelante
  currentDate = new Date(targetDate);
  currentDate.setDate(currentDate.getDate() + 1);

  for (let i = 0; i < 7; i++) {
    const hasWorkout = await prisma.workout.findFirst({
      where: {
        userId,
        date: currentDate,
        workoutType: {
          not: "rest",
        },
      },
    });

    if (hasWorkout) {
      consecutiveDays++;
      currentDate.setDate(currentDate.getDate() + 1);
    } else {
      break;
    }
  }

  return consecutiveDays + 1; // +1 por el día target
}

/**
 * Función auxiliar: Obtiene la fase de entrenamiento para una fecha
 */
async function getPhaseForDate(
  userId: string,
  date: Date
): Promise<string | null> {
  const weeklyPlan = await prisma.weeklyPlan.findFirst({
    where: {
      userId,
      startDate: {
        lte: date,
      },
      endDate: {
        gte: date,
      },
    },
  });

  if (!weeklyPlan) return null;

  const planData = JSON.parse(weeklyPlan.planJson);
  return planData.phase || null;
}