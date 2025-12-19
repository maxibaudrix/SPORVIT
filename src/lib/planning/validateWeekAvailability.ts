import { prisma } from '@/lib/db';

export async function validateWeekAvailability(
  userId: string,
  weekNumber: number
): Promise<{
  available: boolean;
  status: string;
  message?: string;
}> {
  const week = await prisma.weeklyPlan.findUnique({
    where: {
      userId_weekNumber: { userId, weekNumber },
    },
    select: {
      generationStatus: true,
      generationError: true,
    },
  });

  if (!week) {
    return {
      available: false,
      status: 'not_found',
      message: 'Week not found',
    };
  }

  if (week.generationStatus === 'generated') {
    return {
      available: true,
      status: 'generated',
    };
  }

  if (week.generationStatus === 'generating') {
    return {
      available: false,
      status: 'generating',
      message: 'Week is being generated. Please wait...',
    };
  }

  if (week.generationStatus === 'error') {
    return {
      available: false,
      status: 'error',
      message: week.generationError || 'Generation failed',
    };
  }

  return {
    available: false,
    status: 'pending',
    message: 'Week has not been generated yet',
  };
}