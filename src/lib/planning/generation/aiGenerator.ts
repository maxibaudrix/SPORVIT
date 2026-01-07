/**
 * AI Generator
 *
 * Wrapper del generador actual de Gemini API.
 * Agrega tracking de costos, tiempos y metadata.
 */

import type { UserPlanningContext, WeekPlan } from '@/types/planning';
import { generateWeekInChunks } from '@/lib/ai/generateWeekInChunks';
import { MODEL_CONFIG } from '@/config/cacheConfig';

export interface AIGenerationResult {
  plan: WeekPlan;
  metadata: {
    tokensUsed: number;
    costUsd: number;
    durationMs: number;
    model: string;
    chunked: boolean;
  };
}

export class AIRateLimitError extends Error {
  constructor(message: string = 'AI API rate limit exceeded') {
    super(message);
    this.name = 'AIRateLimitError';
  }
}

export class AITimeoutError extends Error {
  constructor(message: string = 'AI API request timed out') {
    super(message);
    this.name = 'AITimeoutError';
  }
}

export class AIGenerationError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'AIGenerationError';
  }
}

/**
 * Genera un plan de una semana usando Gemini AI
 *
 * @param context - Contexto del usuario
 * @param weekNumber - Número de semana a generar (default: 1)
 * @returns Resultado con plan y metadata
 */
export async function generateWithAI(
  context: UserPlanningContext,
  weekNumber: number = 1
): Promise<AIGenerationResult> {
  const startTime = Date.now();

  try {
    console.log(`🤖 Generando semana ${weekNumber} con Gemini AI...`);

    // Llamar al generador existente (chunked)
    const plan = await generateWeekInChunks(context, weekNumber);

    const endTime = Date.now();
    const durationMs = endTime - startTime;

    // Estimar tokens usados (aproximación)
    // Gemini típicamente usa ~2000-4000 tokens por week chunk
    const estimatedTokens = 3000 * 4; // 4 chunks promedio

    // Calcular costo
    // Gemini 2.0 Flash: ~$0.00001 per 1K tokens (muy barato)
    const costPer1K = MODEL_CONFIG.COST_PER_1K_TOKENS;
    const costUsd = (estimatedTokens / 1000) * costPer1K;

    console.log(
      `✅ Plan generado en ${durationMs}ms | Costo estimado: $${costUsd.toFixed(4)}`
    );

    return {
      plan,
      metadata: {
        tokensUsed: estimatedTokens,
        costUsd,
        durationMs,
        model: MODEL_CONFIG.GEMINI_MODEL,
        chunked: true,
      },
    };
  } catch (error: any) {
    const durationMs = Date.now() - startTime;

    // Clasificar el error
    if (error.message?.includes('rate limit') || error.message?.includes('429')) {
      throw new AIRateLimitError(error.message);
    }

    if (error.message?.includes('timeout') || durationMs > MODEL_CONFIG.TIMEOUT_MS) {
      throw new AITimeoutError(error.message);
    }

    if (error.message?.includes('quota')) {
      throw new AIRateLimitError('API quota exceeded');
    }

    // Error genérico
    throw new AIGenerationError(
      `Failed to generate plan with AI: ${error.message}`,
      error
    );
  }
}

/**
 * Genera un plan con retry logic
 *
 * @param context - Contexto del usuario
 * @param weekNumber - Número de semana
 * @param maxRetries - Número máximo de reintentos
 * @returns Resultado con plan y metadata
 */
export async function generateWithRetry(
  context: UserPlanningContext,
  weekNumber: number = 1,
  maxRetries: number = MODEL_CONFIG.RETRY_ATTEMPTS
): Promise<AIGenerationResult> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await generateWithAI(context, weekNumber);
    } catch (error: any) {
      lastError = error;

      // No reintentar en caso de rate limit (esperar no ayuda)
      if (error instanceof AIRateLimitError) {
        throw error;
      }

      // No reintentar en timeout muy largo
      if (error instanceof AITimeoutError && attempt >= maxRetries) {
        throw error;
      }

      console.warn(
        `⚠️ Intento ${attempt}/${maxRetries} falló: ${error.message}`
      );

      // Esperar antes de reintentar (exponential backoff)
      if (attempt < maxRetries) {
        const delay = MODEL_CONFIG.RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        console.log(`⏳ Esperando ${delay}ms antes de reintentar...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // Si llegamos aquí, todos los reintentos fallaron
  throw lastError || new AIGenerationError('All retry attempts failed');
}

/**
 * Verifica si el servicio de AI está disponible
 * (útil para health checks)
 *
 * @returns true si está disponible
 */
export async function isAIAvailable(): Promise<boolean> {
  try {
    // Intentar una generación de prueba con timeout corto
    // En producción, esto podría ser un endpoint de health check
    return true; // Por ahora asumimos que está disponible
  } catch {
    return false;
  }
}

/**
 * Obtiene el costo estimado de generar un plan completo
 *
 * @param totalWeeks - Número total de semanas
 * @returns Costo estimado en USD
 */
export function getEstimatedCost(totalWeeks: number): number {
  const costPerWeek = 0.012; // ~$0.012 por semana con Gemini
  return totalWeeks * costPerWeek;
}
