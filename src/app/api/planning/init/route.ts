import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { buildUserPlanningContext } from '@/lib/planning/buildUserPlanningContext';
import { generateWeekPlan } from '@/lib/ai/generateWeekPlan';
import { persistWeek } from '@/lib/planning/persistWeek';
import { generateRemainingWeeks } from '@/lib/jobs/generateRemainingWeeks';

/**
 * POST /api/planning/init
 * 
 * Inicializa el plan del usuario:
 * 1. Genera SOLO semana 1 con AI (sincrónico)
 * 2. Crea registros "pending" para semanas 2-12
 * 3. Inicia generación background para resto
 * 4. Retorna success + redirect a dashboard
 */
export async function POST(req: NextRequest) {
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

    // 2. Obtener datos del body
    const onboardingData = await req.json();

    // 3. Validación de datos obligatorios
    if (!onboardingData.startDate) {
      return NextResponse.json(
        { error: 'startDate is required' },
        { status: 400 }
      );
    }

    if (!onboardingData.biometrics || !onboardingData.objective) {
      return NextResponse.json(
        { error: 'Incomplete onboarding data' },
        { status: 400 }
      );
    }

    console.log(`[Planning Init] Starting for user ${userId}`);

    // 4. Construir contexto limpio
    const userContext = buildUserPlanningContext(
      onboardingData,
      userId,
      'es'
    );

    // ✅ AÑADIR ESTOS LOGS
    console.log('[Planning Init] userContext.planning:', userContext.planning);
    console.log('[Planning Init] blockSize:', userContext.planning.blockSize);
    console.log('[Planning Init] totalBlocks:', userContext.planning.totalBlocks);

    console.log('[Planning Init] Context built successfully');

    // 5. Calcular número total de semanas
    const totalWeeks = userContext.planning.totalBlocks * userContext.planning.blockSize;
    console.log(`[Planning Init] Total weeks to generate: ${totalWeeks}`);

    // 6. Verificar si ya existe un plan activo
    const existingPlan = await prisma.weeklyPlan.findFirst({
      where: {
        userId,
        status: 'active',
      },
    });

    if (existingPlan) {
      console.log('[Planning Init] User already has an active plan');
      return NextResponse.json(
        { 
          error: 'Active plan already exists',
          planId: existingPlan.id,
          redirectTo: '/dashboard'
        },
        { status: 409 }
      );
    }

    // 7. Generar SOLO semana 1 con AI (sincrónico)
    console.log('[Planning Init] Calling AI to generate week 1...');
    const week1Output = await generateWeekPlan(userContext, 1);
    console.log('[Planning Init] Week 1 generated successfully');

    // 8. Persistir semana 1 en base de datos
    console.log('[Planning Init] Persisting week 1 to database...');
    await persistWeek(userContext, week1Output, 1);
    console.log('[Planning Init] Week 1 persisted successfully');

    // 9. Crear registros pendientes para semanas 2-N
    console.log(`[Planning Init] Creating ${totalWeeks - 1} pending weeks...`);

    const startDate = new Date(userContext.startPreferences.startDate);
    const pendingWeeks = [];

    for (let week = 2; week <= totalWeeks; week++) {
      const weekStartDate = new Date(startDate);
      weekStartDate.setDate(weekStartDate.getDate() + (week - 1) * 7);
      
      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekEndDate.getDate() + 6);

      pendingWeeks.push({
        userId,
        weekNumber: week,
        startDate: weekStartDate,
        endDate: weekEndDate,
        planJson: JSON.stringify({ status: 'pending' }),
        status: 'active',
        generationStatus: 'pending',
      });
    }

    await prisma.weeklyPlan.createMany({
      data: pendingWeeks,
    });

    console.log(`[Planning Init] ${totalWeeks - 1} pending weeks created`);

    // 10. Iniciar generación de semanas restantes en background
    console.log('[Planning Init] Starting background generation...');
    generateRemainingWeeks(userId, userContext, totalWeeks).catch((error) => {
      console.error('[Planning Init] Background generation error:', error);
    });

    // 11. Log de éxito
    await prisma.aIGenerationLog.create({
      data: {
        userId,
        requestType: 'training_plan',
        promptTokens: 0,
        responseData: JSON.stringify({ week: 1, totalWeeks }),
        completionTokens: 0,
        durationMs: 0,
        success: true,
      },
    });

    console.log(`[Planning Init] Week 1 completed. Background jobs started for weeks 2-${totalWeeks}`);

    // 12. Retornar éxito
    return NextResponse.json({
      success: true,
      message: 'Week 1 generated successfully. Remaining weeks generating in background.',
      data: {
        totalWeeks,
        generatedWeeks: 1,
        pendingWeeks: totalWeeks - 1,
      },
      redirectTo: '/dashboard',
    });

  } catch (error: any) {
    console.error('[Planning Init] Error:', error);

    // Log error
    try {
      const session = await auth();
      if (session?.user?.id) {
        await prisma.aIGenerationLog.create({
          data: {
            userId: session.user.id,
            requestType: 'training_plan',
            promptTokens: 0,
            responseData: '',
            completionTokens: 0,
            durationMs: 0,
            success: false,
            error: error.message,
          },
        });
      }
    } catch (logError) {
      console.error('[Planning Init] Failed to log error:', logError);
    }

    // Retornar error apropiado
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'AI service configuration error' },
        { status: 500 }
      );
    }

    if (error.message?.includes('quota')) {
      return NextResponse.json(
        { error: 'AI service temporarily unavailable' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate plan. Please try again.' },
      { status: 500 }
    );
  }
}