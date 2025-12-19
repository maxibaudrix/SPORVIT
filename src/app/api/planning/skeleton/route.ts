import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import type { PlanSkeletonWithStatus, WeekGenerationStatus } from '@/types/planning';

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
        generationStatus: true,
        generatedAt: true,
        generationError: true,
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
      // Si la semana está pendiente o generándose, retornar estructura básica
      if (week.generationStatus !== 'generated') {
        return {
          weekNumber: week.weekNumber,
          startDate: week.startDate.toISOString(),
          endDate: week.endDate.toISOString(),
          phase: 'pending',
          generationStatus: week.generationStatus as WeekGenerationStatus,
          days: [], // Sin días aún
        };
      }

      // Semana generada: parsear datos completos
      const planData = JSON.parse(week.planJson);
      
      return {
        weekNumber: week.weekNumber,
        startDate: week.startDate.toISOString(),
        endDate: week.endDate.toISOString(),
        phase: planData.phase || 'base',
        generationStatus: week.generationStatus as WeekGenerationStatus,
        generatedAt: week.generatedAt?.toISOString(),
        days: planData.days.map((day: any) => ({
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
    const response: PlanSkeletonWithStatus = {
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