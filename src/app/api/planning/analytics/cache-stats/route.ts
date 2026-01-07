/**
 * Cache Stats API Endpoint
 *
 * GET /api/planning/analytics/cache-stats
 *
 * Retorna estadísticas del sistema de caché:
 * - Total de planes cacheados
 * - Cache hit rate
 * - Ahorro de costos
 * - Performance metrics
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getCacheStats } from '@/lib/planning/generation/cacheManager';
import { getCachePerformance, getWeeklyReport } from '@/lib/planning/storage/analyticsLogger';

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // TODO: En producción, verificar que el usuario sea admin
    // if (session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    // Obtener estadísticas del caché
    const cacheStats = await getCacheStats();

    // Obtener performance de la última semana
    const weeklyPerformance = await getCachePerformance('week');

    // Obtener reporte semanal completo
    const weeklyReport = await getWeeklyReport();

    // Calcular métricas derivadas
    const cacheHitRate = cacheStats
      ? ((cacheStats.totalPlans - weeklyPerformance.aiCalls) / cacheStats.totalPlans) * 100
      : 0;

    const costSavingsPercentage =
      weeklyPerformance.totalCost > 0
        ? (weeklyPerformance.costSavings / (weeklyPerformance.costSavings + weeklyPerformance.totalCost)) * 100
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        // Estadísticas del caché
        cache: {
          totalPlans: cacheStats?.totalPlans || 0,
          uniqueArchetypes: cacheStats?.uniqueArchetypes || 0,
          avgAccessCount: cacheStats?.avgAccessCount || 0,
          aiGenerated: cacheStats?.aiGenerated || 0,
          adapted: cacheStats?.adapted || 0,
          last30Days: cacheStats?.last30Days || { totalPlans: 0, cacheHitRate: 0 },
        },

        // Performance semanal
        weeklyPerformance: {
          totalRequests: weeklyPerformance.totalRequests,
          aiCalls: weeklyPerformance.aiCalls,
          cacheExactHits: weeklyPerformance.cacheExactHits,
          cacheAdaptedHits: weeklyPerformance.cacheAdaptedHits,
          avgResponseTime: Math.round(weeklyPerformance.avgResponseTime),
          totalCost: weeklyPerformance.totalCost.toFixed(4),
          costSavings: weeklyPerformance.costSavings.toFixed(4),
          cacheHitRate: cacheHitRate.toFixed(2),
          costSavingsPercentage: costSavingsPercentage.toFixed(2),
        },

        // Reporte semanal
        weeklyReport: {
          period: {
            start: weeklyReport.startDate,
            end: weeklyReport.endDate,
          },
          metrics: {
            totalRequests: weeklyReport.totalRequests,
            aiPercentage: weeklyReport.aiPercentage.toFixed(2),
            cacheHitRate: weeklyReport.cacheHitRate.toFixed(2),
            avgSimilarityScore: weeklyReport.avgSimilarityScore.toFixed(3),
            successRate: weeklyReport.successRate.toFixed(2),
          },
          costs: {
            total: weeklyReport.totalCost.toFixed(4),
            saved: weeklyReport.costSaved.toFixed(4),
          },
          performance: {
            avgResponseTime: Math.round(weeklyReport.avgResponseTime),
          },
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error fetching cache stats:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estadísticas',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
