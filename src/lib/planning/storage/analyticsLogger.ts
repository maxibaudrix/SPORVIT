/**
 * Analytics Logger
 *
 * Registra todas las decisiones del sistema de caché para análisis posterior.
 * Permite generar reportes y métricas de eficiencia.
 */

import { prisma } from '@/lib/prisma';

export interface PlanGenerationEvent {
  userId: string;
  decision: 'ai' | 'cache_exact' | 'cache_adapted';
  cachedPlanId?: string;
  similarityScore?: number;
  reasons: string[];
  responseTimeMs: number;
  estimatedCostUsd: number;
  actualCostUsd?: number;
  success: boolean;
  errorMessage?: string;
}

export interface CachePerformanceStats {
  period: 'day' | 'week' | 'month';
  totalRequests: number;
  aiCalls: number;
  cacheExactHits: number;
  cacheAdaptedHits: number;
  avgResponseTime: number;
  totalCost: number;
  costSavings: number;
}

export interface WeeklyReport {
  startDate: Date;
  endDate: Date;
  totalRequests: number;
  aiPercentage: number;
  cacheHitRate: number;
  avgSimilarityScore: number;
  totalCost: number;
  costSaved: number;
  avgResponseTime: number;
  successRate: number;
}

/**
 * Registra un evento de generación de plan
 *
 * @param event - Datos del evento a registrar
 */
export async function logPlanGeneration(event: PlanGenerationEvent): Promise<void> {
  try {
    await prisma.planGenerationLog.create({
      data: {
        userId: event.userId,
        decision: event.decision,
        cachedPlanId: event.cachedPlanId,
        similarityScore: event.similarityScore,
        decisionReasons: JSON.stringify(event.reasons),
        estimatedCostUsd: event.estimatedCostUsd,
        actualCostUsd: event.actualCostUsd || event.estimatedCostUsd,
        responseTimeMs: event.responseTimeMs,
        success: event.success,
        errorMessage: event.errorMessage,
      },
    });
  } catch (error) {
    // No fallar el flujo principal si falla el logging
    console.error('Error logging plan generation:', error);
  }
}

/**
 * Obtiene estadísticas de performance del caché
 *
 * @param period - Período a analizar
 * @returns Estadísticas agregadas
 */
export async function getCachePerformance(
  period: 'day' | 'week' | 'month' = 'week'
): Promise<CachePerformanceStats> {
  const now = new Date();
  const startDate = new Date(now);

  switch (period) {
    case 'day':
      startDate.setDate(now.getDate() - 1);
      break;
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setDate(now.getDate() - 30);
      break;
  }

  const logs = await prisma.planGenerationLog.findMany({
    where: {
      createdAt: {
        gte: startDate,
      },
    },
  });

  const totalRequests = logs.length;
  const aiCalls = logs.filter((log) => log.decision === 'ai').length;
  const cacheExactHits = logs.filter((log) => log.decision === 'cache_exact').length;
  const cacheAdaptedHits = logs.filter((log) => log.decision === 'cache_adapted').length;

  const avgResponseTime =
    totalRequests > 0
      ? logs.reduce((sum, log) => sum + log.responseTimeMs, 0) / totalRequests
      : 0;

  const totalCost = logs.reduce((sum, log) => sum + (log.actualCostUsd || 0), 0);

  // Costo potencial si todo fuera AI
  const potentialCost = totalRequests * 0.08; // Costo por generación AI

  const costSavings = potentialCost - totalCost;

  return {
    period,
    totalRequests,
    aiCalls,
    cacheExactHits,
    cacheAdaptedHits,
    avgResponseTime,
    totalCost,
    costSavings,
  };
}

/**
 * Genera un reporte semanal de eficiencia
 *
 * @returns Reporte con métricas clave
 */
export async function getWeeklyReport(): Promise<WeeklyReport> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 7);

  const logs = await prisma.planGenerationLog.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  const totalRequests = logs.length;

  if (totalRequests === 0) {
    return {
      startDate,
      endDate,
      totalRequests: 0,
      aiPercentage: 0,
      cacheHitRate: 0,
      avgSimilarityScore: 0,
      totalCost: 0,
      costSaved: 0,
      avgResponseTime: 0,
      successRate: 0,
    };
  }

  const aiCalls = logs.filter((log) => log.decision === 'ai').length;
  const cacheHits = logs.filter((log) => log.decision !== 'ai').length;
  const successfulLogs = logs.filter((log) => log.success).length;

  const aiPercentage = (aiCalls / totalRequests) * 100;
  const cacheHitRate = (cacheHits / totalRequests) * 100;

  // Similarity scores de los cache hits
  const similarityScores = logs
    .filter((log) => log.similarityScore !== null)
    .map((log) => log.similarityScore!);

  const avgSimilarityScore =
    similarityScores.length > 0
      ? similarityScores.reduce((sum, score) => sum + score, 0) / similarityScores.length
      : 0;

  const totalCost = logs.reduce((sum, log) => sum + (log.actualCostUsd || 0), 0);

  // Costo potencial si todo fuera AI
  const potentialCost = totalRequests * 0.08;
  const costSaved = potentialCost - totalCost;

  const avgResponseTime =
    logs.reduce((sum, log) => sum + log.responseTimeMs, 0) / totalRequests;

  const successRate = (successfulLogs / totalRequests) * 100;

  return {
    startDate,
    endDate,
    totalRequests,
    aiPercentage,
    cacheHitRate,
    avgSimilarityScore,
    totalCost,
    costSaved,
    avgResponseTime,
    successRate,
  };
}

/**
 * Obtiene los arquetipos más frecuentes sin caché
 * Útil para pre-generar planes
 *
 * @param limit - Número de arquetipos a retornar
 * @returns Array de arquetipos con frecuencia
 */
export async function getTopArchetypesWithoutCache(limit: number = 10) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const logs = await prisma.planGenerationLog.findMany({
    where: {
      decision: 'ai',
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
  });

  // Agrupar por características comunes (esto requeriría acceso al context)
  // Por ahora retornamos estadísticas básicas
  return {
    totalAICalls: logs.length,
    avgCost: logs.reduce((sum, log) => sum + (log.actualCostUsd || 0), 0) / logs.length,
    message: 'Feature requires context snapshot analysis - to be implemented',
  };
}

/**
 * Registra performance del caché en un período
 *
 * @param stats - Estadísticas a registrar
 */
export async function logCachePerformance(stats: CachePerformanceStats): Promise<void> {
  // Este método sería para guardar snapshots de performance
  // en una tabla separada si fuera necesario
  console.log('Cache Performance:', stats);
}

/**
 * Obtiene tendencias de uso por hora del día
 * Útil para identificar peak hours
 *
 * @returns Mapa de hora → número de requests
 */
export async function getUsageByHour(): Promise<Map<number, number>> {
  const logs = await prisma.planGenerationLog.findMany({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // últimos 7 días
      },
    },
    select: {
      createdAt: true,
    },
  });

  const hourMap = new Map<number, number>();

  logs.forEach((log) => {
    const hour = log.createdAt.getHours();
    hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
  });

  return hourMap;
}

/**
 * Obtiene el costo total acumulado del mes actual
 *
 * @returns Costo en USD
 */
export async function getMonthlySpend(): Promise<number> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const logs = await prisma.planGenerationLog.findMany({
    where: {
      createdAt: {
        gte: startOfMonth,
      },
    },
    select: {
      actualCostUsd: true,
    },
  });

  return logs.reduce((sum, log) => sum + (log.actualCostUsd || 0), 0);
}

/**
 * Obtiene el número de llamadas AI del día actual
 *
 * @returns Número de llamadas
 */
export async function getTodayAICalls(): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const count = await prisma.planGenerationLog.count({
    where: {
      decision: 'ai',
      createdAt: {
        gte: today,
      },
    },
  });

  return count;
}
