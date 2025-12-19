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
    // 1. Validar si es respuesta parcial
    if ('partial' in weekOutput && weekOutput.partial) {
      const partialResponse = weekOutput as PartialWeekResponse;
      throw new Error(`Week ${weekNumber} generation was partial: ${partialResponse.reason}`);
    }
    const week = weekOutput as WeekPlan;
    const userId = context.meta.userId;

    console.log(`[persistWeek] Starting persistence for week ${weekNumber}...`);

    // 2. Usar transacción para atomicidad
    await prisma.$transaction(async (tx) => {
      // 3. Guardar/actualizar semana
      const weekStartDate = new Date(week.startDate);
      const weekEndDate = new Date(week.endDate);

      console.log(`[persistWeek] Saving week ${weekNumber}...`);

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
          generationError: null, // Limpiar error si existía
        },
      });

      console.log(`[persistWeek] Week ${weekNumber} saved`);

      // 4. Guardar workouts y meals de cada día
      for (const day of week.days) {
        const dayDate = new Date(day.date);

        // 4.1. Guardar workout si existe
        if (day.isTrainingDay && day.workout) {
          // Primero verificar si existe
          const existingWorkout = await tx.workout.findFirst({
            where: {
              userId,
              date: dayDate,
            },
          });

          if (existingWorkout) {
            await tx.workout.update({
              where: { id: existingWorkout.id },
              data: {
                workoutType: day.workout.type,
                title: `${day.workout.type} - ${day.workout.focus || 'Training'}`,
                description: day.workout.description || '',
                durationMinutes: day.workout.duration,
              },
            });
          } else {
            await tx.workout.create({
              data: {
                user: { connect: { id: userId } },
                date: dayDate,
                workoutType: day.workout.type,
                title: `${day.workout.type} - ${day.workout.focus || 'Training'}`,
                description: day.workout.description || '',
                durationMinutes: day.workout.duration,
                estimatedCalories: day.workout.intensity === 'high' ? 500 : 
                                  day.workout.intensity === 'moderate' ? 350 : 200,
                completed: false,
              },
            });
          }
        }

        // 4.2. Guardar meals del día
        if (day.nutrition?.meals) {
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

      console.log(`[persistWeek] Workouts and meals saved for week ${weekNumber}`);

      // 5. Actualizar UserProfile y UserGoals (solo en semana 1)
      if (weekNumber === 1) {
        console.log('[persistWeek] Updating user profile and goals...');

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
          },
        });

        await tx.userGoals.upsert({
          where: { userId },
          create: {
            user: { connect: { id: userId } },
            goalType: context.objective.primaryGoal,
            targetWeight: context.biometrics.weight, // Placeholder
            targetDate: context.objective.targetDate ? new Date(context.objective.targetDate) : undefined,
            targetCalories: context.targets.calories.trainingDay,
            targetProteinG: context.targets.macros.protein,
            targetCarbsG: context.targets.macros.carbs,
            targetFatG: context.targets.macros.fat,
            targetFiberG: context.targets.macros.fiber || 30,
            bmr: 0, // Placeholder - calcular si es necesario
            tdee: 0, // Placeholder - calcular si es necesario
            dietType: context.nutrition.dietType,
            allergies: context.nutrition.allergies?.join(', ') || '',
          },
          update: {
            targetCalories: context.targets.calories.trainingDay,
            targetProteinG: context.targets.macros.protein,
            targetCarbsG: context.targets.macros.carbs,
            targetFatG: context.targets.macros.fat,
            targetFiberG: context.targets.macros.fiber || 30,
          },
        });

        console.log('[persistWeek] User profile and goals updated');
      }
    });

    console.log(`[persistWeek] Week ${weekNumber} persisted successfully`);

  } catch (error: any) {
    console.error(`[persistWeek] Error persisting week ${weekNumber}:`, error);
    throw new Error(`Failed to persist week ${weekNumber}: ${error.message}`);
  }
}