import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import type { DayDetail } from '@/types/planning';

/**
 * GET /api/planning/day/[date]
 * 
 * Retorna el detalle completo de un día específico:
 * - Workout con ejercicios
 * - Meals con ingredientes e instrucciones
 * - Tracking status
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    // 1. Autenticación
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const dateStr = params.date;

    // 2. Validar formato de fecha
    const targetDate = new Date(dateStr);
    if (isNaN(targetDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    // 3. Obtener la semana que contiene esta fecha
    const weeklyPlan = await prisma.weeklyPlan.findFirst({
      where: {
        userId,
        startDate: { lte: targetDate },
        endDate: { gte: targetDate },
      },
    });

    if (!weeklyPlan) {
      return NextResponse.json(
        { error: 'No plan found for this date' },
        { status: 404 }
      );
    }

    // 4. Parsear el plan y encontrar el día específico
    const planData = JSON.parse(weeklyPlan.planJson);
    const dayData = planData.days.find((d: any) => {
      const dayDate = new Date(d.date);
      return dayDate.toISOString().split('T')[0] === targetDate.toISOString().split('T')[0];
    });

    if (!dayData) {
      return NextResponse.json(
        { error: 'Day not found in plan' },
        { status: 404 }
      );
    }

    // 5. Obtener tracking del día (si existe)
    const workoutExecution = dayData.workout ? await prisma.workout.findFirst({
      where: {
        userId,
        date: targetDate,
        completed: true,
      },
    }) : null;

    const mealExecutions = await prisma.meal.findMany({
      where: {
        userId,
        date: targetDate,
      },
    });

    // 6. Construir respuesta
    const response: DayDetail = {
      date: dayData.date,
      dayOfWeek: dayData.dayOfWeek,
      weekNumber: weeklyPlan.weekNumber,
      phase: planData.phase,
      workout: dayData.workout ? {
        ...dayData.workout,
        id: `workout_${dateStr}`, // ID generado para referencia
      } : undefined,
      nutrition: {
        ...dayData.nutrition,
        meals: dayData.nutrition.meals.map((meal: any, index: number) => ({
          ...meal,
          id: `meal_${dateStr}_${index}`,
        })),
      },
      tracking: {
        workoutCompleted: !!workoutExecution,
        mealsCompleted: dayData.nutrition.meals.map((_: any, index: number) => {
          return mealExecutions.some(me => me.mealType === dayData.nutrition.meals[index].mealType);
        }),
        waterGlasses: 0, // TODO: Implementar tracking de agua
        notes: undefined,
      },
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('[Planning Day] Error:', error);
    return NextResponse.json(
      { error: 'Failed to load day details' },
      { status: 500 }
    );
  }
}