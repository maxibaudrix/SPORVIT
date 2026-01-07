/**
 * Orchestrator
 *
 * Cerebro central del sistema híbrido AI+Caché.
 * Decide el flujo completo: buscar en caché, adaptar, o generar con AI.
 */

import type { UserPlanningContext, WeekPlan } from '@/types/planning';
import * as cacheManager from './cacheManager';
import * as similarityMatcher from './similarityMatcher';
import * as costOptimizer from './costOptimizer';
import * as planAdapter from './planAdapter';
import * as aiGenerator from './aiGenerator';
import * as analyticsLogger from '../storage/analyticsLogger';

export interface PlanGenerationResult {
  plan: WeekPlan;
  source: 'ai' | 'cache_exact' | 'cache_adapted';
  metadata: {
    planId?: string;
    similarityScore?: number;
    costUsd: number;
    responseTimeMs: number;
    cachedPlanId?: string;
    adaptations?: planAdapter.Adaptation[];
    confidenceScore?: number;
    decision?: costOptimizer.Decision;
  };
}

/**
 * Genera un plan de forma inteligente (AI o Caché)
 *
 * @param context - Contexto completo del usuario
 * @param weekNumber - Número de semana a generar (default: 1)
 * @param userTier - Tier del usuario (afecta decisiones)
 * @returns Resultado con plan y metadata
 */
export async function generatePlan(
  context: UserPlanningContext,
  weekNumber: number = 1,
  userTier?: costOptimizer.UserTier
): Promise<PlanGenerationResult> {
  const startTime = Date.now();

  try {
    console.log(`\n🧠 ORCHESTRATOR: Generando semana ${weekNumber} para usuario ${context.meta.userId}`);

    // ========== PASO 1: Buscar match exacto ==========
    console.log('🔍 Paso 1: Buscando match exacto...');

    const exactMatch = await cacheManager.findExactMatch(context);

    if (exactMatch) {
      const responseTimeMs = Date.now() - startTime;

      console.log(`✅ Match exacto encontrado! (${responseTimeMs}ms)`);

      // Registrar decisión
      await analyticsLogger.logPlanGeneration({
        userId: context.meta.userId,
        decision: 'cache_exact',
        reasons: ['Exact hash match found'],
        responseTimeMs,
        estimatedCostUsd: 0,
        actualCostUsd: 0,
        success: true,
      });

      return {
        plan: exactMatch,
        source: 'cache_exact',
        metadata: {
          costUsd: 0,
          responseTimeMs,
        },
      };
    }

    console.log('❌ No hay match exacto');

    // ========== PASO 2: Buscar matches similares ==========
    console.log('🔍 Paso 2: Buscando matches similares...');

    const similarMatches = await similarityMatcher.findSimilar(context, 5);

    console.log(`📊 Encontrados ${similarMatches.length} matches similares`);

    // ========== PASO 3: Evaluar opciones con Cost Optimizer ==========
    console.log('💰 Paso 3: Evaluando opciones (Cost Optimizer)...');

    const decision = await costOptimizer.shouldUseAI(
      context,
      similarMatches,
      userTier
    );

    console.log(
      `📋 Decisión: ${decision.strategy} (${decision.reason})`
    );

    // ========== PASO 4: Ejecutar estrategia elegida ==========

    if (decision.strategy === 'ai') {
      // Generar con AI
      console.log('🤖 Paso 4: Generando con AI...');

      const aiResult = await aiGenerator.generateWithRetry(context, weekNumber);
      const responseTimeMs = Date.now() - startTime;

      // Guardar en caché para uso futuro
      const planId = await cacheManager.savePlan(aiResult.plan, context, {
        source: 'ai',
        tokensUsed: aiResult.metadata.tokensUsed,
        durationMs: aiResult.metadata.durationMs,
      });

      console.log(`✅ Plan generado con AI y cacheado: ${planId}`);

      // Registrar decisión
      await analyticsLogger.logPlanGeneration({
        userId: context.meta.userId,
        decision: 'ai',
        reasons: decision.reason.split(',').map((r) => r.trim()),
        responseTimeMs,
        estimatedCostUsd: decision.estimatedCostUsd,
        actualCostUsd: aiResult.metadata.costUsd,
        success: true,
      });

      return {
        plan: aiResult.plan,
        source: 'ai',
        metadata: {
          planId,
          costUsd: aiResult.metadata.costUsd,
          responseTimeMs,
          decision,
        },
      };
    }

    if (decision.strategy === 'cache_adapted') {
      // Adaptar del caché
      console.log('🔧 Paso 4: Adaptando plan desde caché...');

      const bestMatch = similarMatches[0];

      if (!bestMatch) {
        // No hay match para adaptar, fallback a AI
        console.log('⚠️ No hay match para adaptar, fallback a AI');
        return await generateWithAIFallback(context, weekNumber, startTime, decision);
      }

      // Intentar adaptación
      const adaptationResult = await planAdapter.adaptPlan(
        bestMatch.plan,
        bestMatch.originalContext,
        context
      );

      if (!adaptationResult) {
        // Adaptación falló, fallback a AI
        console.log('⚠️ Adaptación falló, fallback a AI');
        return await generateWithAIFallback(context, weekNumber, startTime, decision);
      }

      const responseTimeMs = Date.now() - startTime;

      // Guardar plan adaptado en caché
      const planId = await cacheManager.savePlan(adaptationResult.plan, context, {
        source: 'adapted',
        originalPlanId: bestMatch.planId,
      });

      console.log(
        `✅ Plan adaptado exitosamente: ${planId} (confianza: ${adaptationResult.confidenceScore.toFixed(2)})`
      );

      // Registrar decisión
      await analyticsLogger.logPlanGeneration({
        userId: context.meta.userId,
        decision: 'cache_adapted',
        cachedPlanId: bestMatch.planId,
        similarityScore: bestMatch.score,
        reasons: [
          ...decision.reason.split(',').map((r) => r.trim()),
          ...adaptationResult.adaptations.map((a) => a.description),
        ],
        responseTimeMs,
        estimatedCostUsd: 0,
        actualCostUsd: 0,
        success: true,
      });

      return {
        plan: adaptationResult.plan,
        source: 'cache_adapted',
        metadata: {
          planId,
          similarityScore: bestMatch.score,
          costUsd: 0,
          responseTimeMs,
          cachedPlanId: bestMatch.planId,
          adaptations: adaptationResult.adaptations,
          confidenceScore: adaptationResult.confidenceScore,
          decision,
        },
      };
    }

    if (decision.strategy === 'cache_direct') {
      // Usar caché directo (mejor match disponible)
      console.log('💾 Paso 4: Usando caché directo...');

      const bestMatch = similarMatches[0];

      if (!bestMatch) {
        // No hay caché disponible, fallback a AI
        console.log('⚠️ No hay caché disponible, fallback a AI');
        return await generateWithAIFallback(context, weekNumber, startTime, decision);
      }

      const responseTimeMs = Date.now() - startTime;

      // Incrementar contador de acceso
      await cacheManager.incrementAccessCount(bestMatch.planId);

      console.log(
        `✅ Usando plan cacheado: ${bestMatch.planId} (score: ${bestMatch.score.toFixed(2)})`
      );

      // Registrar decisión
      await analyticsLogger.logPlanGeneration({
        userId: context.meta.userId,
        decision: 'cache_exact', // Tratamos cache_direct como exact para analytics
        cachedPlanId: bestMatch.planId,
        similarityScore: bestMatch.score,
        reasons: decision.reason.split(',').map((r) => r.trim()),
        responseTimeMs,
        estimatedCostUsd: 0,
        actualCostUsd: 0,
        success: true,
      });

      return {
        plan: bestMatch.plan,
        source: 'cache_exact',
        metadata: {
          planId: bestMatch.planId,
          similarityScore: bestMatch.score,
          costUsd: 0,
          responseTimeMs,
          decision,
        },
      };
    }

    // No deberíamos llegar aquí
    throw new Error(`Unknown strategy: ${decision.strategy}`);
  } catch (error: any) {
    const responseTimeMs = Date.now() - startTime;

    console.error('❌ Error en orchestrator:', error);

    // Registrar error
    await analyticsLogger.logPlanGeneration({
      userId: context.meta.userId,
      decision: 'ai', // Asumimos que intentaba AI
      reasons: ['Error in orchestrator'],
      responseTimeMs,
      estimatedCostUsd: 0,
      success: false,
      errorMessage: error.message,
    });

    throw error;
  }
}

/**
 * Fallback a generación con AI cuando otras estrategias fallan
 */
async function generateWithAIFallback(
  context: UserPlanningContext,
  weekNumber: number,
  startTime: number,
  originalDecision: costOptimizer.Decision
): Promise<PlanGenerationResult> {
  console.log('🔄 Ejecutando fallback a AI...');

  const aiResult = await aiGenerator.generateWithRetry(context, weekNumber);
  const responseTimeMs = Date.now() - startTime;

  // Guardar en caché
  const planId = await cacheManager.savePlan(aiResult.plan, context, {
    source: 'ai',
    tokensUsed: aiResult.metadata.tokensUsed,
    durationMs: aiResult.metadata.durationMs,
  });

  console.log(`✅ Fallback AI exitoso: ${planId}`);

  // Registrar decisión
  await analyticsLogger.logPlanGeneration({
    userId: context.meta.userId,
    decision: 'ai',
    reasons: ['Fallback to AI after cache strategy failed'],
    responseTimeMs,
    estimatedCostUsd: originalDecision.estimatedCostUsd,
    actualCostUsd: aiResult.metadata.costUsd,
    success: true,
  });

  return {
    plan: aiResult.plan,
    source: 'ai',
    metadata: {
      planId,
      costUsd: aiResult.metadata.costUsd,
      responseTimeMs,
    },
  };
}

/**
 * Genera múltiples semanas de forma eficiente
 * (Para uso en background jobs)
 *
 * @param context - Contexto del usuario
 * @param startWeek - Semana inicial
 * @param endWeek - Semana final
 * @returns Array de resultados
 */
export async function generateMultipleWeeks(
  context: UserPlanningContext,
  startWeek: number,
  endWeek: number
): Promise<PlanGenerationResult[]> {
  const results: PlanGenerationResult[] = [];

  for (let week = startWeek; week <= endWeek; week++) {
    try {
      const result = await generatePlan(context, week);
      results.push(result);

      // Pequeña pausa entre semanas
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error generando semana ${week}:`, error);
      throw error;
    }
  }

  return results;
}
