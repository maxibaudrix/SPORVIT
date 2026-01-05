import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { generateWeekPlan } from '@/lib/ai/generateWeekPlan';
import { persistWeek } from '@/lib/planning/persistWeek';
import { buildUserPlanningContext } from '@/lib/planning/buildUserPlanningContext';
import { withAIRateLimit } from '@/lib/lib_rate-limiter';

async function handlePOST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { weekNumber } = await req.json();

    if (!weekNumber || weekNumber < 1) {
      return NextResponse.json(
        { error: 'Invalid weekNumber' },
        { status: 400 }
      );
    }

    console.log(`[Generate Week] Starting generation for week ${weekNumber}`);

    // Verificar que la semana existe y está pendiente
    const existingWeek = await prisma.weeklyPlan.findUnique({
      where: {
        userId_weekNumber: { userId, weekNumber },
      },
    });

    if (!existingWeek) {
      return NextResponse.json(
        { error: 'Week not found' },
        { status: 404 }
      );
    }

    if (existingWeek.generationStatus === 'generated') {
      return NextResponse.json(
        { error: 'Week already generated' },
        { status: 409 }
      );
    }

    // Marcar como "generating"
    await prisma.weeklyPlan.update({
      where: { userId_weekNumber: { userId, weekNumber } },
      data: { generationStatus: 'generating' },
    });

    // Obtener contexto del onboarding
    const onboardingData = await prisma.onboardingData.findUnique({
      where: { userId },
    });

    if (!onboardingData) {
      throw new Error('Onboarding data not found');
    }

    const context = buildUserPlanningContext(
      JSON.parse(onboardingData.data),
      userId,
      'es'
    );

    // Generar semana
    const weekOutput = await generateWeekPlan(context, weekNumber);

    // Persistir
    await persistWeek(context, weekOutput, weekNumber);

    console.log(`[Generate Week] Week ${weekNumber} generated successfully`);

    return NextResponse.json({
      success: true,
      weekNumber,
      message: `Week ${weekNumber} generated successfully`,
    });

  } catch (error: any) {
    console.error('[Generate Week] Error:', error);

    // Marcar como error en DB
    try {
      const session = await auth();
      const { weekNumber } = await req.json();
      
      if (session?.user?.id && weekNumber) {
        await prisma.weeklyPlan.update({
          where: {
            userId_weekNumber: {
              userId: session.user.id,
              weekNumber,
            },
          },
          data: {
            generationStatus: 'error',
            generationError: error.message,
          },
        });
      }
    } catch (updateError) {
      console.error('[Generate Week] Failed to update error status:', updateError);
    }

    return NextResponse.json(
      { error: error.message || 'Failed to generate week' },
      { status: 500 }
    );
  }
}

// Apply AI rate limiting: 10 requests per hour
export const POST = withAIRateLimit(handlePOST);