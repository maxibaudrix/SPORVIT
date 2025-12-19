import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import type { PlanGenerationStatus } from '@/types/planning';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Obtener todas las semanas
    const weeks = await prisma.weeklyPlan.findMany({
      where: { userId },
      orderBy: { weekNumber: 'asc' },
      select: {
        weekNumber: true,
        generationStatus: true,
        generatedAt: true,
        generationError: true,
      },
    });

    if (weeks.length === 0) {
      return NextResponse.json(
        { error: 'No plan found' },
        { status: 404 }
      );
    }

    const totalWeeks = weeks.length;
    const generatedWeeks = weeks.filter(w => w.generationStatus === 'generated').length;
    const pendingWeeks = weeks.filter(w => w.generationStatus === 'pending').length;

    const response: PlanGenerationStatus = {
      totalWeeks,
      generatedWeeks,
      pendingWeeks,
      weeks: weeks.map(w => ({
        weekNumber: w.weekNumber,
        status: w.generationStatus as any,
        generatedAt: w.generatedAt?.toISOString(),
        error: w.generationError || undefined,
      })),
      isComplete: generatedWeeks === totalWeeks,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('[Planning Status] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get plan status' },
      { status: 500 }
    );
  }
}