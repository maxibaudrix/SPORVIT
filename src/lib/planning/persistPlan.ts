import { prisma } from "@/lib/db";
import type { CompletePlanningOutput, UserPlanningContext } from "@/types/planning";

/**
 * Guarda el plan completo generado por AI en la base de datos
 * Este proceso es transaccional: todo o nada
 */
export async function persistPlan(
  context: UserPlanningContext,
  planOutput: CompletePlanningOutput
): Promise<void> {
  const userId = context.meta.userId;

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Guardar UserPlanningContext (snapshot)
      await tx.onboardingData.upsert({
        where: { userId },
        create: {
          userId,
          data: JSON.stringify(context),
          status: "completed",
          version: context.meta.version,
        },
        update: {
          data: JSON.stringify(context),
          status: "completed",
          version: context.meta.version,
          updatedAt: new Date(),
        },
      });

      // 2. Guardar cada semana del plan
      for (const week of planOutput.weeks) {
        // Guardar resumen de semana
        const weeklyPlan = await tx.weeklyPlan.create({
          data: {
            userId,
            weekNumber: week.weekNumber,
            startDate: new Date(week.startDate),
            endDate: new Date(week.endDate),
            planJson: JSON.stringify(week),
            status: "active",
          },
        });

        // 3. Guardar workouts y meals de cada día
        for (const day of week.days) {
          // Guardar workout si existe
          if (day.isTrainingDay && day.workout) {
            await tx.workout.create({
              data: {
                userId,
                date: new Date(day.date),
                workoutType: day.workout.type,
                title: `${day.workout.type} - ${day.workout.focus || "General"}`,
                description: day.workout.description,
                durationMinutes: day.workout.duration,
                estimatedCalories: 0, // Placeholder
                completed: false,
              },
            });
          }

          // Guardar meals del día
          for (const meal of day.nutrition.meals) {
            await tx.meal.create({
              data: {
                user: { connect: { id: userId } },
                date: new Date(day.date),
                mealType: meal.mealType,
                totalCalories: meal.calories,
                totalProteinG: meal.protein,
                totalCarbsG: meal.carbs,
                totalFatG: meal.fat,
                totalFiberG: meal.fiber || 0,
                notes: `${meal.name}\n${meal.description || ""}`,
              },
            });
          }
        }
      }

      // 4. Actualizar UserProfile
      await tx.userProfile.upsert({
        where: { userId },
        create: {
          userId,
          age: context.biometrics.age,
          gender: context.biometrics.gender,
          heightCm: context.biometrics.height,
          currentWeight: context.biometrics.weight,
          bodyFatPercentage: context.biometrics.bodyFatPercentage,
          activityLevel: context.activity.dailyActivityLevel,
          workoutDaysPerWeek: context.training.daysPerWeek,
          trainingLevel: context.training.experienceLevel,
          trainingTypes: context.training.sportType,
          sessionDuration: context.training.sessionDuration,
        },
        update: {
          age: context.biometrics.age,
          gender: context.biometrics.gender,
          heightCm: context.biometrics.height,
          currentWeight: context.biometrics.weight,
          bodyFatPercentage: context.biometrics.bodyFatPercentage,
          activityLevel: context.activity.dailyActivityLevel,
          workoutDaysPerWeek: context.training.daysPerWeek,
          trainingLevel: context.training.experienceLevel,
          trainingTypes: context.training.sportType,
          sessionDuration: context.training.sessionDuration,
          updatedAt: new Date(),
        },
      });

      // 5. Actualizar UserGoals
      await tx.userGoals.upsert({
        where: { userId },
        create: {
          user: { connect: { id: userId } },
          goalType: context.objective.primaryGoal,
          targetWeight: context.biometrics.weight, // Placeholder
          targetDate: context.objective.targetDate
            ? new Date(context.objective.targetDate)
            : null,
          targetCalories: context.targets.calories.trainingDay,
          targetProteinG: context.targets.macros.protein,
          targetCarbsG: context.targets.macros.carbs,
          targetFatG: context.targets.macros.fat,
          targetFiberG: context.targets.macros.fiber || 30,
          bmr: 0, // Se puede calcular después
          tdee: 0, // Se puede calcular después
          dietType: context.nutrition.dietType,
          allergies: JSON.stringify(context.nutrition.allergies),
        },
        update: {
          goalType: context.objective.primaryGoal,
          targetWeight: context.biometrics.weight,
          targetDate: context.objective.targetDate
            ? new Date(context.objective.targetDate)
            : null,
          targetCalories: context.targets.calories.trainingDay,
          targetProteinG: context.targets.macros.protein,
          targetCarbsG: context.targets.macros.carbs,
          targetFatG: context.targets.macros.fat,
          targetFiberG: context.targets.macros.fiber || 30,
          dietType: context.nutrition.dietType,
          allergies: JSON.stringify(context.nutrition.allergies),
          updatedAt: new Date(),
        },
      });
    });

    console.log(`[persistPlan] Plan saved successfully for user ${userId}`);
  } catch (error) {
    console.error("[persistPlan] Error saving plan:", error);
    throw new Error("Failed to persist plan to database");
  }
}