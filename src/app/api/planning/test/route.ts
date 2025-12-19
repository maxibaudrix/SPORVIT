import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = session.user.id;

    // Verificar qué existe en la DB
    const [weeklyPlans, workouts, meals, onboarding] = await Promise.all([
      prisma.weeklyPlan.findMany({ where: { userId } }),
      prisma.workout.findMany({ where: { userId } }),
      prisma.meal.findMany({ where: { userId } }),
      prisma.onboardingData.findUnique({ where: { userId } }),
    ]);

    return NextResponse.json({
      userId,
      summary: {
        weeklyPlans: weeklyPlans.length,
        workouts: workouts.length,
        meals: meals.length,
        hasOnboarding: !!onboarding,
      },
      weeklyPlans: weeklyPlans.map(w => ({ 
        weekNumber: w.weekNumber, 
        status: w.generationStatus,
        generatedAt: w.generatedAt,
      })),
      statusBreakdown: {
        generated: weeklyPlans.filter(w => w.generationStatus === 'generated').length,
        generating: weeklyPlans.filter(w => w.generationStatus === 'generating').length,
        pending: weeklyPlans.filter(w => w.generationStatus === 'pending').length,
        error: weeklyPlans.filter(w => w.generationStatus === 'error').length,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}