import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

/**
 * POST /api/planning/retry-week
 * Reintentar generación de una semana con error
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { weekNumber } = await req.json();

    if (!weekNumber) {
      return NextResponse.json(
        { error: 'weekNumber is required' },
        { status: 400 }
      );
    }

    // Verificar que la semana existe y tiene error
    const week = await prisma.weeklyPlan.findUnique({
      where: {
        userId_weekNumber: { userId, weekNumber },
      },
    });

    if (!week) {
      return NextResponse.json(
        { error: 'Week not found' },
        { status: 404 }
      );
    }

    if (week.generationStatus !== 'error') {
      return NextResponse.json(
        { error: 'Week is not in error state' },
        { status: 400 }
      );
    }

    // Marcar como pending para que el background job lo procese
    await prisma.weeklyPlan.update({
      where: { userId_weekNumber: { userId, weekNumber } },
      data: {
        generationStatus: 'pending',
        generationError: null,
      },
    });

    console.log(`[Retry Week] Week ${weekNumber} marked for retry`);

    // Disparar generación inmediata
    const generateUrl = new URL('/api/planning/generate-week', req.url);
    fetch(generateUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weekNumber }),
    }).catch((error) => {
      console.error('[Retry Week] Failed to trigger generation:', error);
    });

    return NextResponse.json({
      success: true,
      message: `Week ${weekNumber} retry initiated`,
    });

  } catch (error: any) {
    console.error('[Retry Week] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retry week' },
      { status: 500 }
    );
  }
}