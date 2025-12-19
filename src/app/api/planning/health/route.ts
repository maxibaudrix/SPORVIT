import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

/**
 * GET /api/planning/health
 * Verifica el estado general del sistema de planificación
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Verificar onboarding
    const onboarding = await prisma.onboardingData.findUnique({
      where: { userId },
      select: { status: true, createdAt: true },
    });

    // Verificar plan
    const weeks = await prisma.weeklyPlan.findMany({
      where: { userId },
      select: {
        weekNumber: true,
        generationStatus: true,
        generatedAt: true,
      },
    });

    // Verificar contexto
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    const goals = await prisma.userGoals.findUnique({
      where: { userId },
      select: { id: true },
    });

    // Calcular estadísticas
    const stats = {
      totalWeeks: weeks.length,
      generated: weeks.filter(w => w.generationStatus === 'generated').length,
      generating: weeks.filter(w => w.generationStatus === 'generating').length,
      pending: weeks.filter(w => w.generationStatus === 'pending').length,
      errors: weeks.filter(w => w.generationStatus === 'error').length,
    };

    // Determinar estado general
    let status = 'healthy';
    const issues = [];

    if (!onboarding) {
      status = 'incomplete';
      issues.push('Onboarding not completed');
    }

    if (!profile || !goals) {
      status = 'incomplete';
      issues.push('User profile or goals missing');
    }

    if (stats.totalWeeks === 0) {
      status = 'no_plan';
      issues.push('No plan created');
    }

    if (stats.errors > 0) {
      status = 'degraded';
      issues.push(`${stats.errors} weeks failed to generate`);
    }

    if (stats.generating > 3) {
      status = 'generating';
      issues.push('Multiple weeks generating simultaneously');
    }

    return NextResponse.json({
      status,
      userId,
      onboarding: onboarding ? {
        status: onboarding.status,
        completedAt: onboarding.createdAt.toISOString(),
      } : null,
      plan: {
        exists: stats.totalWeeks > 0,
        stats,
        progress: stats.totalWeeks > 0 
          ? Math.round((stats.generated / stats.totalWeeks) * 100)
          : 0,
      },
      profile: {
        exists: !!profile,
        goalsExists: !!goals,
      },
      issues: issues.length > 0 ? issues : undefined,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('[Health Check] Error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}