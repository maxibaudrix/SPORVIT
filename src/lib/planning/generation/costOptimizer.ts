/**
 * Cost Optimizer
 *
 * Toma decisiones económicas sobre cuándo usar AI vs Caché.
 * Implementa un sistema de scoring para optimizar costos manteniendo calidad.
 */

import type { UserPlanningContext } from '@/types/planning';
import type { CachedPlanMatch } from './similarityMatcher';
import { CACHE_CONFIG, isPeakHour } from '@/config/cacheConfig';
import { getTodayAICalls, getMonthlySpend } from '../storage/analyticsLogger';
import { getCacheStats } from './cacheManager';

export interface Decision {
  useAI: boolean;
  reason: string;
  strategy: 'ai' | 'cache_direct' | 'cache_adapted';
  estimatedCostUsd: number;
  fallbackStrategy?: 'best_match' | 'second_best' | 'fail';
  scoringBreakdown?: Record<string, number>;
}

export interface UserTier {
  tier: 'free' | 'premium' | 'enterprise';
  isFirstPlan: boolean;
}

/**
 * Decide si usar AI o caché basado en múltiples factores
 *
 * @param context - Contexto del usuario
 * @param matches - Matches de caché encontrados
 * @param userTier - Tier del usuario
 * @returns Decisión con estrategia y razones
 */
export async function shouldUseAI(
  context: UserPlanningContext,
  matches: CachedPlanMatch[],
  userTier: UserTier = { tier: 'free', isFirstPlan: false }
): Promise<Decision> {
  let score = 0;
  const breakdown: Record<string, number> = {};

  // ========== PASO 1: Restricciones HARD (override todo) ==========

  const aiCallsToday = await getTodayAICalls();
  if (aiCallsToday >= CACHE_CONFIG.DAILY_AI_LIMIT) {
    return {
      useAI: false,
      strategy: 'cache_direct',
      reason: 'Daily AI limit reached',
      estimatedCostUsd: 0,
      fallbackStrategy: 'best_match',
    };
  }

  const monthlyCost = await getMonthlySpend();
  if (monthlyCost >= CACHE_CONFIG.MONTHLY_BUDGET_USD) {
    return {
      useAI: false,
      strategy: 'cache_direct',
      reason: 'Monthly budget exceeded',
      estimatedCostUsd: 0,
      fallbackStrategy: 'best_match',
    };
  }

  // ========== PASO 2: Ajustes por usuario ==========

  if (userTier.tier === 'premium') {
    score += 30;
    breakdown.premium_user = 30;
  } else if (userTier.tier === 'enterprise') {
    score += 40;
    breakdown.enterprise_user = 40;
  }

  if (userTier.isFirstPlan) {
    score += 20;
    breakdown.first_plan = 20;
  }

  // ========== PASO 3: Ajustes por calidad de match ==========

  const bestMatch = matches.length > 0 ? matches[0] : null;

  if (!bestMatch) {
    // No hay caché disponible, usar AI
    score += 50;
    breakdown.no_cache = 50;
  } else {
    if (bestMatch.score > 0.95) {
      score -= 40; // Cache excelente, no necesitamos AI
      breakdown.excellent_cache = -40;
    } else if (bestMatch.score > 0.85) {
      score -= 20; // Cache bueno
      breakdown.good_cache = -20;
    } else if (bestMatch.score > 0.75) {
      score -= 10; // Cache aceptable
      breakdown.acceptable_cache = -10;
    } else {
      score += 30; // Cache dudoso, mejor AI
      breakdown.poor_cache = 30;
    }
  }

  // ========== PASO 4: Ajustes por complejidad ==========

  if (context.objective.hasCompetition) {
    score += 15;
    breakdown.has_competition = 15;
  }

  if (context.nutrition.intolerances.length > 2) {
    score += 10;
    breakdown.multiple_intolerances = 10;
  }

  if (context.nutrition.excludedFoods.length > 5) {
    score += 10;
    breakdown.many_exclusions = 10;
  }

  if (context.training.experienceLevel === 'advanced') {
    score += 10;
    breakdown.advanced_level = 10;
  }

  // ========== PASO 5: Ajustes por estado del caché ==========

  const cacheStats = await getCacheStats();
  const totalCachedPlans = cacheStats?.totalPlans || 0;

  if (totalCachedPlans < 100) {
    // Necesitamos más datos en el caché
    score += 25;
    breakdown.cache_cold = 25;
  }

  if (matches.length < 5) {
    // Pocos matches para este arquetipo
    score += 15;
    breakdown.few_matches = 15;
  }

  // ========== PASO 6: Ajustes por horario ==========

  if (isPeakHour()) {
    // En horas pico, preferir caché para reducir latencia
    score -= 15;
    breakdown.peak_hour = -15;
  }

  // ========== DECISIÓN FINAL ==========

  const estimatedCostUsd = CACHE_CONFIG.COST_PER_GENERATION_USD;

  if (score > 50) {
    return {
      useAI: true,
      strategy: 'ai',
      reason: buildReason('High score favors AI generation', score, breakdown),
      estimatedCostUsd,
      scoringBreakdown: breakdown,
    };
  }

  if (score > 20) {
    // Score medio: intentar adaptar caché
    if (bestMatch && bestMatch.score > 0.75) {
      return {
        useAI: false,
        strategy: 'cache_adapted',
        reason: buildReason('Medium score with good cache match - adapt', score, breakdown),
        estimatedCostUsd: 0,
        scoringBreakdown: breakdown,
      };
    } else {
      // No hay buen match, usar AI
      return {
        useAI: true,
        strategy: 'ai',
        reason: buildReason('Medium score but no good cache - use AI', score, breakdown),
        estimatedCostUsd,
        scoringBreakdown: breakdown,
      };
    }
  }

  // Score bajo: usar caché directo
  return {
    useAI: false,
    strategy: 'cache_direct',
    reason: buildReason('Low score favors cache', score, breakdown),
    estimatedCostUsd: 0,
    fallbackStrategy: bestMatch ? 'best_match' : 'fail',
    scoringBreakdown: breakdown,
  };
}

/**
 * Construye un mensaje de razón legible
 *
 * @param baseReason - Razón base
 * @param totalScore - Score total
 * @param breakdown - Desglose de puntos
 * @returns String explicativo
 */
function buildReason(
  baseReason: string,
  totalScore: number,
  breakdown: Record<string, number>
): string {
  const factors = Object.entries(breakdown)
    .filter(([_, value]) => value !== 0)
    .map(([key, value]) => `${key}:${value > 0 ? '+' : ''}${value}`)
    .join(', ');

  return `${baseReason} (score: ${totalScore}, factors: ${factors})`;
}

/**
 * Evalúa si vale la pena adaptar un plan vs generar uno nuevo
 *
 * @param match - Match de caché
 * @param adaptationComplexity - Complejidad estimada (0-1)
 * @returns true si vale la pena adaptar
 */
export function shouldAdaptInsteadOfGenerate(
  match: CachedPlanMatch,
  adaptationComplexity: number
): boolean {
  // Si el match es muy bueno (>0.90) y la adaptación es simple (<0.3),
  // vale la pena adaptar
  if (match.score > 0.90 && adaptationComplexity < 0.3) {
    return true;
  }

  // Si el match es bueno (>0.80) y la adaptación es moderada (<0.5),
  // también vale la pena
  if (match.score > 0.80 && adaptationComplexity < 0.5) {
    return true;
  }

  // En otros casos, mejor generar nuevo
  return false;
}

/**
 * Calcula el ahorro estimado de usar caché vs AI
 *
 * @param cacheHits - Número de cache hits
 * @param aiCalls - Número de llamadas AI
 * @returns Ahorro en USD
 */
export function calculateCostSavings(cacheHits: number, aiCalls: number): number {
  const totalRequests = cacheHits + aiCalls;
  const actualCost = aiCalls * CACHE_CONFIG.COST_PER_GENERATION_USD;
  const potentialCost = totalRequests * CACHE_CONFIG.COST_PER_GENERATION_USD;

  return potentialCost - actualCost;
}

/**
 * Verifica si se puede realizar una llamada AI
 * (respeta límites diarios y mensuales)
 *
 * @returns true si se puede realizar
 */
export async function canMakeAICall(): Promise<boolean> {
  const aiCallsToday = await getTodayAICalls();
  const monthlyCost = await getMonthlySpend();

  return (
    aiCallsToday < CACHE_CONFIG.DAILY_AI_LIMIT &&
    monthlyCost < CACHE_CONFIG.MONTHLY_BUDGET_USD
  );
}
