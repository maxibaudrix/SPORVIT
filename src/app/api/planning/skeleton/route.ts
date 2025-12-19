import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import type { PlanSkeleton } from '@/types/planning';

/**
 * GET /api/planning/skeleton
 * 
 * Retorna estructura ligera del plan completo para renderizar calendario.
 * NO incluye detalles de ejercicios ni recetas.
 * Pensado para carga inicial rápida del dashboard.
 */
export async function GET(req: NextRequest) {
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

    // 2. Obtener todas las semanas del plan
    const weeklyPlans = await prisma.weeklyPlan.findMany({
      where: {
        userId,
        status: 'active',
      },
      orderBy: {
        weekNumber: 'asc',
      },
      select: {
        weekNumber: true,
        startDate: true,
        endDate: true,
        planJson: true,
      },
    });

    if (weeklyPlans.length === 0) {
      return NextResponse.json(
        { error: 'No active plan found' },
        { status: 404 }
      );
    }

    // 3. Construir skeleton
    const skeleton = weeklyPlans.map(week => {
      const planData = JSON.parse(week.planJson);
      
      return {
        weekNumber: week.weekNumber,
        startDate: week.startDate.toISOString(),
        endDate: week.endDate.toISOString(),
        phase: planData.phase || 'base',
        days: planData.days.map((day: any) => ({
          date: day.date,
          dayOfWeek: day.dayOfWeek,
          hasWorkout: day.isTrainingDay,
          workoutType: day.workout?.type || null,
          workoutDuration: day.workout?.duration || 0,
          targetCalories: day.nutrition?.targetCalories || 0,
        })),
      };
    });

    // 4. Determinar semana actual
    const today = new Date();
    const currentWeek = skeleton.findIndex(week => {
      const start = new Date(week.startDate);
      const end = new Date(week.endDate);
      return today >= start && today <= end;
    });

    // 5. Construir respuesta
    const response: PlanSkeleton = {
      totalWeeks: skeleton.length,
      currentWeek: currentWeek >= 0 ? currentWeek + 1 : 1,
      startDate: skeleton[0].startDate,
      endDate: skeleton[skeleton.length - 1].endDate,
      skeleton,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('[Planning Skeleton] Error:', error);
    return NextResponse.json(
      { error: 'Failed to load plan skeleton' },
      { status: 500 }
    );
  }
}