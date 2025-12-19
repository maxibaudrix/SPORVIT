import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import type { PlanGenerationStatus } from '@/types/planning';

export async function GET(req: NextRequest) {
  try {
    console.log('[Planning Status] Request received'); // ✅ NUEVO
    
    const session = await auth();
    console.log('[Planning Status] Session:', session?.user?.id); // ✅ NUEVO
    
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

    console.log('[Planning Status] Weeks found:', weeks.length); // ✅ NUEVO

    if (weeks.length === 0) {
      console.log('[Planning Status] Returning empty response'); // ✅ NUEVO
      const emptyResponse: PlanGenerationStatus = {
        totalWeeks: 0,
        generatedWeeks: 0,
        pendingWeeks: 0,
        weeks: [],
        isComplete: false,
      };
      return NextResponse.json(emptyResponse); // ✅ DEBE SER 200, NO 404
    }

    const totalWeeks = weeks.length;
    const generatedWeeks = weeks.filter(w => w.generationStatus === 'generated').length;
    const pendingWeeks = weeks.filter(w => w.generationStatus === 'pending').length;

    console.log('[Planning Status] Returning plan status:', { totalWeeks, generatedWeeks }); // ✅ NUEVO

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
    console.error('[Planning Status] Error:', error); // YA EXISTE
    return NextResponse.json(
      { error: 'Failed to get plan status' },
      { status: 500 }
    );
  }
}