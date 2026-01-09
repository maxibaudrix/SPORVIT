import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

/**
 * GET /api/planning/check
 * Verifica si el usuario tiene un plan de entrenamiento o datos de onboarding existentes
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Buscar si existe onboarding data o planes generados para este usuario
    const [onboardingData, generatedPlans, weeklyPlans] = await Promise.all([
      prisma.onboardingData.findUnique({
        where: {
          userId: session.user.id,
        },
        select: {
          id: true,
          createdAt: true,
          status: true,
          onboardingType: true,
        },
      }),
      prisma.generatedPlan.findFirst({
        where: {
          userId: session.user.id,
          status: 'active',
        },
        select: {
          id: true,
          createdAt: true,
          planType: true,
          status: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.weeklyPlan.findFirst({
        where: {
          userId: session.user.id,
          status: 'active',
        },
        select: {
          id: true,
          createdAt: true,
          weekNumber: true,
          status: true,
        },
        orderBy: {
          startDate: 'desc',
        },
      }),
    ]);

    const hasPlan = !!(onboardingData || generatedPlans || weeklyPlans);

    return NextResponse.json({
      hasPlan,
      onboarding: onboardingData ? {
        id: onboardingData.id,
        createdAt: onboardingData.createdAt,
        status: onboardingData.status,
        type: onboardingData.onboardingType,
      } : null,
      generatedPlan: generatedPlans ? {
        id: generatedPlans.id,
        createdAt: generatedPlans.createdAt,
        planType: generatedPlans.planType,
        status: generatedPlans.status,
      } : null,
      weeklyPlan: weeklyPlans ? {
        id: weeklyPlans.id,
        createdAt: weeklyPlans.createdAt,
        weekNumber: weeklyPlans.weekNumber,
        status: weeklyPlans.status,
      } : null,
    });
  } catch (error) {
    console.error('[API Planning Check] Error:', error);
    return NextResponse.json(
      { error: 'Error al verificar plan existente' },
      { status: 500 }
    );
  }
}
