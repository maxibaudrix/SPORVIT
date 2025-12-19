import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

/**
 * GET /api/planning/debug
 * Información detallada para debugging (solo desarrollo)
 */
export async function GET(req: NextRequest) {
  // Solo disponible en desarrollo
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    );
  }

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Obtener toda la información
    const [onboarding, weeks, profile, goals, aiLogs, workouts, meals] = await Promise.all([
      prisma.onboardingData.findUnique({ where: { userId } }),
      prisma.weeklyPlan.findMany({ 
        where: { userId },
        orderBy: { weekNumber: 'asc' },
      }),
      prisma.userProfile.findUnique({ where: { userId } }),
      prisma.userGoals.findUnique({ where: { userId } }),
      prisma.aIGenerationLog.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.workout.count({ where: { userId } }),
      prisma.meal.count({ where: { userId } }),
    ]);

    return NextResponse.json({
      user: {
        id: userId,
        email: session.user.email,
      },
      onboarding: onboarding ? {
        status: onboarding.status,
        version: onboarding.version,
        createdAt: onboarding.createdAt,
        dataSize: onboarding.data.length,
      } : null,
      plan: {
        totalWeeks: weeks.length,
        weeks: weeks.map(w => ({
          weekNumber: w.weekNumber,
          status: w.generationStatus,
          generatedAt: w.generatedAt,
          error: w.generationError,
          dataSize: w.planJson.length,
        })),
      },
      profile: profile ? {
        age: profile.age,
        gender: profile.gender,
        weight: profile.currentWeight,
        activityLevel: profile.activityLevel,
      } : null,
      goals: goals ? {
        goalType: goals.goalType,
        targetCalories: goals.targetCalories,
      } : null,
      content: {
        workouts,
        meals,
      },
      aiLogs: aiLogs.map(log => ({
        requestType: log.requestType,
        success: log.success,
        error: log.error,
        createdAt: log.createdAt,
      })),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasGoogleAI: !!process.env.GOOGLE_AI_API_KEY,
      },
    });

  } catch (error: any) {
    console.error('[Debug] Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}