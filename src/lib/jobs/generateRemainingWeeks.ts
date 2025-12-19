import { prisma } from '@/lib/db';
import { generateWeekPlan } from '@/lib/ai/generateWeekPlan';
import { persistWeek } from '@/lib/planning/persistWeek';
import type { UserPlanningContext } from '@/types/planning';

export async function generateRemainingWeeks(
  userId: string,
  context: UserPlanningContext,
  totalWeeks: number
): Promise<void> {
  console.log(`[Background] Starting generation of weeks 2-${totalWeeks}`);

  for (let weekNumber = 2; weekNumber <= totalWeeks; weekNumber++) {
    try {
      console.log(`[Background] Generating week ${weekNumber}...`);

      // Marcar como "generating"
      await prisma.weeklyPlan.update({
        where: { userId_weekNumber: { userId, weekNumber } },
        data: { generationStatus: 'generating' },
      });

      // Generar semana
      const weekOutput = await generateWeekPlan(context, weekNumber);

      // Persistir
      await persistWeek(context, weekOutput, weekNumber);

      console.log(`[Background] Week ${weekNumber} completed`);

      // Pequeña pausa entre generaciones
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error: any) {
      console.error(`[Background] Error generating week ${weekNumber}:`, error);

      // Marcar como error
      await prisma.weeklyPlan.update({
        where: { userId_weekNumber: { userId, weekNumber } },
        data: {
          generationStatus: 'error',
          generationError: error.message,
        },
      });

      // NO detener el proceso, continuar con siguiente semana
    }
  }

  console.log(`[Background] Finished generating weeks 2-${totalWeeks}`);
}