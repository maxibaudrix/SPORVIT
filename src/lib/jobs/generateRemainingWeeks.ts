// src/lib/jobs/generateRemainingWeeks.ts

import { prisma } from '@/lib/db';
import { persistWeek } from '@/lib/planning/persistWeek';
import { determinePhaseForWeek } from '@/lib/planning/determinePhase';
import { generateWeekInChunks } from '@/lib/ai/generateWeekInChunks'; 
import type { UserPlanningContext } from '@/types/planning';

/**
 * Proceso en segundo plano para generar las semanas restantes (2 a N)
 */
export async function generateRemainingWeeks(
  userId: string,
  context: UserPlanningContext,
  totalWeeks: number
): Promise<void> {
  console.log(`[Background] Starting generation of weeks 2-${totalWeeks}`);

  for (let weekNumber = 2; weekNumber <= totalWeeks; weekNumber++) {
    try {
      const phase = determinePhaseForWeek(weekNumber, context.planning.phases);
      console.log(`[Background] ⏳ Week ${weekNumber}/${totalWeeks} (Phase: ${phase})...`);
      
      const startTime = Date.now();

      // 1. Marcar como "generating" en la base de datos
      await prisma.weeklyPlan.update({
        where: { userId_weekNumber: { userId, weekNumber } },
        data: { generationStatus: 'generating' },
      });

      // 2. Generar semana por fragmentos (Chunks) ✅
      // Esto evita el error de "Unexpected end of JSON" al manejar respuestas largas
      const weekOutput = await generateWeekInChunks(context, weekNumber);

      // 3. Persistir los datos (Crea registros en Workout y Meal)
      await persistWeek(context, weekOutput, weekNumber);

      const duration = Date.now() - startTime;
      console.log(`[Background] ✅ Week ${weekNumber} completed in ${Math.round(duration/1000)}s`);

      // 4. Pausa de seguridad (Rate Limit Prevention) ✅
      // Gemini Free Tier requiere espacio entre peticiones pesadas
      if (weekNumber < totalWeeks) {
        console.log(`[Background] Sleeping 5s to respect API quotas...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }

    } catch (error: any) {
      console.error(`[Background] ❌ Error generating week ${weekNumber}:`, error.message);

      // Registrar el fallo en el registro de la semana
      try {
        await prisma.weeklyPlan.update({
          where: { userId_weekNumber: { userId, weekNumber } },
          data: {
            generationStatus: 'error',
            generationError: error.message || 'Error en la generación por fragmentos',
          },
        });

        // Registrar log técnico para depuración
        await prisma.aIGenerationLog.create({
          data: {
            userId,
            requestType: 'training_plan',
            promptTokens: 0,
            responseData: '',
            completionTokens: 0,
            durationMs: 0,
            success: false,
            error: `Background Week ${weekNumber}: ${error.message}`,
          },
        });
      } catch (updateError) {
        console.error(`[Background] Critical: Failed to update error status in DB`, updateError);
      }

      // IMPORTANTE: No cortamos el bucle. Si la semana 2 falla, intentamos la 3.
      // Pero añadimos una pausa extra si hubo error de cuota (429)
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        console.log(`[Background] Quota hit. Sleeping 30s...`);
        await new Promise(resolve => setTimeout(resolve, 30000));
      }
    }
  }

  console.log(`[Background] Finished processing all weeks for user ${userId}`);
}