import { prisma } from "@/lib/db";
import type { MacrosCalculationResult } from "@/types/planning";

/**
 * Recalcula los macros totales de un día después de ediciones
 * Suma todas las comidas del día y compara con targets
 */
export async function recalculateDayMacros(
  date: string,
  userId: string
): Promise<MacrosCalculationResult> {
  // 1. Obtener todas las comidas del día
  const meals = await prisma.meal.findMany({
    where: {
      userId,
      date: new Date(date),
    },
  });

  // 2. Sumar macros de todas las comidas
  const actual = meals.reduce(
    (acc, meal) => ({
    calories: acc.calories + meal.totalCalories,    // ✅
    protein: acc.protein + meal.totalProteinG,      // ✅
    carbs: acc.carbs + meal.totalCarbsG,            // ✅
    fat: acc.fat + meal.totalFatG,                  // ✅
    fiber: acc.fiber + 0,                           // ✅ (no existe en schema)
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  // 3. Determinar si es día de entrenamiento
  const hasWorkout = await prisma.workout.findFirst({
    where: {
      userId,
      date: new Date(date),
      workoutType: {
        not: "rest",
      },
    },
  });

  // 4. Obtener targets del usuario
  const userGoals = await prisma.userGoals.findUnique({
    where: { userId },
  });

  if (!userGoals) {
    throw new Error("User goals not found");
  }

  // 5. Seleccionar target según tipo de día
  const targetCalories = hasWorkout
    ? userGoals.targetCalories
    : Math.round(userGoals.targetCalories * 0.95);

  const target = {
    calories: targetCalories,
    protein: userGoals.targetProteinG,
    carbs: hasWorkout
      ? userGoals.targetCarbsG
      : Math.round(userGoals.targetCarbsG * 0.8),
    fat: userGoals.targetFatG,
    fiber: 30, // Default fiber target
  };

  // 6. Calcular diferencias
  const diff = {
    calories: actual.calories - target.calories,
    protein: actual.protein - target.protein,
    carbs: actual.carbs - target.carbs,
    fat: actual.fat - target.fat,
  };

  // 7. Determinar estado
  let status: "on_track" | "under" | "over";
  const caloriesDiffPercent = Math.abs(diff.calories) / target.calories;

  if (caloriesDiffPercent <= 0.05) {
    // Dentro del 5%
    status = "on_track";
  } else if (diff.calories < 0) {
    status = "under";
  } else {
    status = "over";
  }

  return {
    date,
    actual,
    target,
    diff,
    status,
  };
}

/**
 * Recalcula macros de una comida cuando se editan ingredientes
 */
export function recalculateMealMacros(
  originalMacros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  },
  originalAmount: number,
  newAmount: number
): {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
} {
  const ratio = newAmount / originalAmount;

  return {
    calories: Math.round(originalMacros.calories * ratio),
    protein: Math.round(originalMacros.protein * ratio * 10) / 10,
    carbs: Math.round(originalMacros.carbs * ratio * 10) / 10,
    fat: Math.round(originalMacros.fat * ratio * 10) / 10,
    fiber: Math.round(originalMacros.fiber * ratio * 10) / 10,
  };
}