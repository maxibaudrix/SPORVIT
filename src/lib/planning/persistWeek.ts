import { prisma } from "@/lib/db";
import type { UserPlanningContext, WeekPlan, PartialWeekResponse } from "@/types/planning";

/**
 * Persiste UNA semana del plan en la base de datos
 */
export async function persistWeek(
  context: UserPlanningContext,
  weekOutput: WeekPlan | PartialWeekResponse,
  weekNumber: number
): Promise<void> {
  try {
    // 1. Validar si es respuesta parcial (Fix TS: as unknown)
    if ('type' in weekOutput && weekOutput.type === 'partial') {
      const partialResponse = weekOutput as unknown as PartialWeekResponse;
      throw new Error(`Week ${weekNumber} generation was partial: ${partialResponse.status}`);
    }

    const week = weekOutput as WeekPlan;
    const userId = context.meta.userId;

    console.log(`[persistWeek] Starting persistence for week ${weekNumber}...`);

    // 2. Usar transacción para atomicidad
    await prisma.$transaction(async (tx) => {
      // 3. Guardar/actualizar semana
      const weekStartDate = new Date(week.startDate);
      const weekEndDate = new Date(week.endDate);

      await tx.weeklyPlan.upsert({
        where: {
          userId_weekNumber: {
            userId,
            weekNumber,
          },
        },
        create: {
          userId,
          weekNumber,
          startDate: weekStartDate,
          endDate: weekEndDate,
          planJson: JSON.stringify(week),
          status: 'active',
          generationStatus: 'generated',
          generatedAt: new Date(),
        },
        update: {
          planJson: JSON.stringify(week),
          generationStatus: 'generated',
          generatedAt: new Date(),
          generationError: null,
        },
      });

      // 4. Guardar workouts y meals de cada día
      for (const day of week.days) {
        const dayDate = new Date(day.date);

        if (day.isTrainingDay && day.workout) {
          const existingWorkout = await tx.workout.findFirst({
            where: { userId, date: dayDate },
          });

          const workoutData = {
            workoutType: day.workout.type,
            title: `${day.workout.type} - ${day.workout.focus || 'Training'}`,
            description: day.workout.description || '',
            durationMinutes: day.workout.duration,
          };

          if (existingWorkout) {
            await tx.workout.update({
              where: { id: existingWorkout.id },
              data: workoutData,
            });
          } else {
            await tx.workout.create({
              data: {
                ...workoutData,
                user: { connect: { id: userId } },
                date: dayDate,
                estimatedCalories: day.workout.intensity === 'high' ? 500 : 
                                  day.workout.intensity === 'moderate' ? 350 : 200,
                completed: false,
              },
            });
          }
        }

        if (day.nutrition?.meals) {
          // Nota: Aquí podrías querer borrar comidas previas del mismo día 
          // si permites re-generar para evitar duplicados.
          for (const meal of day.nutrition.meals) {
            await tx.meal.create({
              data: {
                user: { connect: { id: userId } },
                date: dayDate,
                mealType: meal.mealType,
                totalCalories: meal.calories,
                totalProteinG: meal.protein,
                totalCarbsG: meal.carbs,
                totalFatG: meal.fat,
                totalFiberG: meal.fiber || 0,
                notes: `${meal.name}\n${meal.description || ''}`,
              },
            });
          }
        }
      }

      // 5. Actualizar UserProfile y UserGoals (solo en semana 1)
      if (weekNumber === 1) {
        console.log('[persistWeek] Updating user profile and goals...');

        // Fix Prisma: Convertir string "30_60" a Int y asegurar valores
        const sessionDurationMinutes = typeof context.training.sessionDuration === 'string' 
          ? (context.training.sessionDuration === "30_60" ? 45 : 75)
          : context.training.sessionDuration;

        await tx.userProfile.upsert({
          where: { userId },
          create: {
            user: { connect: { id: userId } },
            age: context.biometrics.age,
            gender: context.biometrics.gender,
            heightCm: context.biometrics.height,
            currentWeight: context.biometrics.weight,
            bodyFatPercentage: context.biometrics.bodyFatPercentage,
            activityLevel: context.activity.dailyActivityLevel,
            workoutDaysPerWeek: context.training.daysPerWeek || 3,
            trainingLevel: context.training.experienceLevel || 'beginner',
            trainingTypes: context.training.sportType || 'fitness',
            sessionDuration: Number(sessionDurationMinutes) || 60,
          },
          update: {
            age: context.biometrics.age,
            gender: context.biometrics.gender,
            heightCm: context.biometrics.height,
            currentWeight: context.biometrics.weight,
            bodyFatPercentage: context.biometrics.bodyFatPercentage,
            activityLevel: context.activity.dailyActivityLevel,
            workoutDaysPerWeek: context.training.daysPerWeek || 3,
            sessionDuration: Number(sessionDurationMinutes) || 60,
          },
        });

        await tx.userGoals.upsert({
          where: { userId },
          create: {
            user: { connect: { id: userId } },
            goalType: context.objective.primaryGoal,
            targetWeight: context.biometrics.weight,
            targetDate: context.objective.targetDate ? new Date(context.objective.targetDate) : undefined,
            // Protección contra NaN
            targetCalories: Math.round(context.targets.calories.trainingDay || 0),
            targetProteinG: Math.round(context.targets.macros.protein || 0),
            targetCarbsG: Math.round(context.targets.macros.carbs || 0),
            targetFatG: Math.round(context.targets.macros.fat || 0),
            targetFiberG: Math.round(context.targets.macros.fiber || 30),
            bmr: 0,
            tdee: 0,
            dietType: context.nutrition.dietType,
            allergies: context.nutrition.allergies?.join(', ') || '',
          },
          update: {
            targetCalories: Math.round(context.targets.calories.trainingDay || 0),
            targetProteinG: Math.round(context.targets.macros.protein || 0),
            targetCarbsG: Math.round(context.targets.macros.carbs || 0),
            targetFatG: Math.round(context.targets.macros.fat || 0),
            targetFiberG: Math.round(context.targets.macros.fiber || 30),
          },
        });
      }
    });

    console.log(`[persistWeek] Week ${weekNumber} persisted successfully`);

  } catch (error: any) {
    console.error(`[persistWeek] Error persisting week ${weekNumber}:`, error);
    throw new Error(`Failed to persist week ${weekNumber}: ${error.message}`);
  }
}