import { prisma } from '@/lib/db';
import { generateWeekPlan } from '@/lib/ai/generateWeekPlan';
import { persistWeek } from '@/lib/planning/persistWeek';
import { determinePhaseForWeek } from '@/lib/planning/determinePhase';
import type { UserPlanningContext } from '@/types/planning';

export async function generateRemainingWeeks(
  userId: string,
  context: UserPlanningContext,
  totalWeeks: number
): Promise<void> {
  console.log(`[Background] Starting generation of weeks 2-${totalWeeks}`);

  for (let weekNumber = 2; weekNumber <= totalWeeks; weekNumber++) {
    try {
      const phase = determinePhaseForWeek(weekNumber, context.planning.phases);
      console.log(`[Background] Generating week ${weekNumber} (Phase: ${phase})...`);
      const startTime = Date.now();

      // Marcar como "generating"
      await prisma.weeklyPlan.update({
        where: { userId_weekNumber: { userId, weekNumber } },
        data: { generationStatus: 'generating' },
      });

      // Generar semana
      const weekOutput = await generateWeekPlan(context, weekNumber);

      // Persistir
      await persistWeek(context, weekOutput, weekNumber);

      const duration = Date.now() - startTime;
      console.log(`[Background] Week ${weekNumber} completed in ${duration}ms`);

      // Pequeña pausa entre generaciones (evitar rate limits)
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error: any) {
      console.error(`[Background] Error generating week ${weekNumber}:`, error);

      // Marcar como error y registrar log
      try {
        await prisma.weeklyPlan.update({
          where: { userId_weekNumber: { userId, weekNumber } },
          data: {
            generationStatus: 'error',
            generationError: error.message || 'Unknown error',
          },
        });

        // Log en AIGenerationLog
        await prisma.aIGenerationLog.create({
          data: {
            userId,
            requestType: 'training_plan',
            promptTokens: 0,
            responseData: '',
            completionTokens: 0,
            durationMs: 0,
            success: false,
            error: `Week ${weekNumber}: ${error.message}`,
          },
        });
      } catch (updateError) {
        console.error(`[Background] Failed to update error status:`, updateError);
      }

      // NO detener el proceso, continuar con siguiente semana
    }
  }

  console.log(`[Background] Finished generating weeks 2-${totalWeeks}`);
}