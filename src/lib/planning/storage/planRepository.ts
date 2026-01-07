/**
 * Plan Repository
 *
 * Capa de acceso a datos para el sistema de caché.
 * Abstrae las operaciones de Prisma para facilitar testing y mantenimiento.
 */

import { prisma } from '@/lib/prisma';
import type { UserPlanningContext, WeekPlan } from '@/types/planning';

export interface CachedPlanInsert {
  exactHash: string;
  semanticHash: string;
  compoundKey: string;
  featureVector: number[];
  planData: WeekPlan;
  contextSnapshot: UserPlanningContext;
  source: 'ai' | 'adapted';
  originalPlanId?: string;
  userId: string;
}

export interface CachedPlan {
  id: string;
  exactHash: string;
  semanticHash: string;
  compoundKey: string;
  featureVector: number[];
  planData: WeekPlan;
  contextSnapshot: UserPlanningContext;
  source: 'ai' | 'adapted';
  userId: string;
  accessCount: number;
  createdAt: Date;
  lastAccessedAt: Date;
}

export interface CacheStats {
  totalPlans: number;
  uniqueArchetypes: number;
  avgAccessCount: number;
  aiGenerated: number;
  adapted: number;
  last30Days: {
    totalPlans: number;
    cacheHitRate: number;
  };
}

/**
 * Inserta un nuevo plan cacheado en la base de datos
 *
 * @param data - Datos del plan a cachear
 * @returns ID del plan insertado
 */
export async function insertCachedPlan(data: CachedPlanInsert): Promise<string> {
  const result = await prisma.cachedPlan.create({
    data: {
      exactHash: data.exactHash,
      semanticHash: data.semanticHash,
      compoundKey: data.compoundKey,
      featureVector: JSON.stringify(data.featureVector), // SQLite no soporta arrays
      planData: JSON.stringify(data.planData),
      contextSnapshot: JSON.stringify(data.contextSnapshot),
      source: data.source,
      originalPlanId: data.originalPlanId,
      userId: data.userId,
    },
  });

  return result.id;
}

/**
 * Busca un plan por hash exacto
 *
 * @param hash - Hash exacto del contexto
 * @returns Plan cacheado o null
 */
export async function findByExactHash(hash: string): Promise<CachedPlan | null> {
  const result = await prisma.cachedPlan.findUnique({
    where: { exactHash: hash },
  });

  if (!result) return null;

  return {
    id: result.id,
    exactHash: result.exactHash,
    semanticHash: result.semanticHash,
    compoundKey: result.compoundKey,
    featureVector: JSON.parse(result.featureVector) as number[],
    planData: JSON.parse(result.planData) as WeekPlan,
    contextSnapshot: JSON.parse(result.contextSnapshot) as UserPlanningContext,
    source: result.source as 'ai' | 'adapted',
    userId: result.userId,
    accessCount: result.accessCount,
    createdAt: result.createdAt,
    lastAccessedAt: result.lastAccessedAt,
  };
}

/**
 * Busca planes por hash semántico
 *
 * @param hash - Hash semántico
 * @param limit - Número máximo de resultados
 * @returns Array de planes cacheados
 */
export async function findBySemanticHash(
  hash: string,
  limit: number = 5
): Promise<CachedPlan[]> {
  const results = await prisma.cachedPlan.findMany({
    where: { semanticHash: hash },
    orderBy: { accessCount: 'desc' },
    take: limit,
  });

  return results.map((result) => ({
    id: result.id,
    exactHash: result.exactHash,
    semanticHash: result.semanticHash,
    compoundKey: result.compoundKey,
    featureVector: JSON.parse(result.featureVector) as number[],
    planData: JSON.parse(result.planData) as WeekPlan,
    contextSnapshot: JSON.parse(result.contextSnapshot) as UserPlanningContext,
    source: result.source as 'ai' | 'adapted',
    userId: result.userId,
    accessCount: result.accessCount,
    createdAt: result.createdAt,
    lastAccessedAt: result.lastAccessedAt,
  }));
}

/**
 * Busca planes por compound key con pre-filtros
 *
 * @param compoundKey - Clave compuesta para búsqueda rápida
 * @param goalType - Tipo de objetivo para filtrar
 * @param limit - Número máximo de resultados
 * @returns Array de planes cacheados
 */
export async function findByCompoundKey(
  compoundKey: string,
  goalType?: string,
  limit: number = 10
): Promise<CachedPlan[]> {
  const where: any = { compoundKey };

  // Si se especifica goalType, filtrar por él en el JSON
  // Nota: SQLite no tiene operadores JSON nativos como PostgreSQL
  // Por lo tanto, hacemos el filtrado en memoria después de la query

  const results = await prisma.cachedPlan.findMany({
    where,
    orderBy: { accessCount: 'desc' },
    take: limit * 2, // Traemos más para filtrar después
  });

  let filtered = results.map((result) => ({
    id: result.id,
    exactHash: result.exactHash,
    semanticHash: result.semanticHash,
    compoundKey: result.compoundKey,
    featureVector: JSON.parse(result.featureVector) as number[],
    planData: JSON.parse(result.planData) as WeekPlan,
    contextSnapshot: JSON.parse(result.contextSnapshot) as UserPlanningContext,
    source: result.source as 'ai' | 'adapted',
    userId: result.userId,
    accessCount: result.accessCount,
    createdAt: result.createdAt,
    lastAccessedAt: result.lastAccessedAt,
  }));

  // Filtrar por goalType si se especificó
  if (goalType) {
    filtered = filtered.filter((plan) => plan.contextSnapshot.objective.primaryGoal === goalType);
  }

  return filtered.slice(0, limit);
}

/**
 * Incrementa el contador de accesos de un plan
 *
 * @param planId - ID del plan
 */
export async function updateAccessCount(planId: string): Promise<void> {
  await prisma.cachedPlan.update({
    where: { id: planId },
    data: {
      accessCount: { increment: 1 },
      lastAccessedAt: new Date(),
    },
  });
}

/**
 * Obtiene estadísticas del caché
 *
 * @returns Estadísticas agregadas
 */
export async function getCacheStats(): Promise<CacheStats> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Estadísticas generales
  const totalPlans = await prisma.cachedPlan.count();

  const plans = await prisma.cachedPlan.findMany({
    select: {
      semanticHash: true,
      source: true,
      accessCount: true,
      createdAt: true,
    },
  });

  // Unique semantic hashes (arquetipos)
  const uniqueSemanticHashes = new Set(plans.map((p) => p.semanticHash));

  // Promedio de access count
  const avgAccessCount = plans.length > 0
    ? plans.reduce((sum, p) => sum + p.accessCount, 0) / plans.length
    : 0;

  // Contadores por source
  const aiGenerated = plans.filter((p) => p.source === 'ai').length;
  const adapted = plans.filter((p) => p.source === 'adapted').length;

  // Estadísticas últimos 30 días
  const recentPlans = plans.filter((p) => p.createdAt >= thirtyDaysAgo);
  const recentTotal = recentPlans.length;

  // Cache hit rate (planes con accessCount > 1)
  const plansReused = plans.filter((p) => p.accessCount > 1).length;
  const cacheHitRate = totalPlans > 0 ? plansReused / totalPlans : 0;

  return {
    totalPlans,
    uniqueArchetypes: uniqueSemanticHashes.size,
    avgAccessCount,
    aiGenerated,
    adapted,
    last30Days: {
      totalPlans: recentTotal,
      cacheHitRate,
    },
  };
}

/**
 * Elimina planes antiguos (cleanup job)
 *
 * @param olderThanDays - Días de antigüedad
 * @returns Número de planes eliminados
 */
export async function deleteOldPlans(olderThanDays: number): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

  const result = await prisma.cachedPlan.deleteMany({
    where: {
      createdAt: { lt: cutoffDate },
      accessCount: 0, // Solo borrar planes nunca usados
    },
  });

  return result.count;
}

/**
 * Obtiene todos los planes de un usuario
 *
 * @param userId - ID del usuario
 * @returns Array de planes
 */
export async function findByUserId(userId: string): Promise<CachedPlan[]> {
  const results = await prisma.cachedPlan.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return results.map((result) => ({
    id: result.id,
    exactHash: result.exactHash,
    semanticHash: result.semanticHash,
    compoundKey: result.compoundKey,
    featureVector: JSON.parse(result.featureVector) as number[],
    planData: JSON.parse(result.planData) as WeekPlan,
    contextSnapshot: JSON.parse(result.contextSnapshot) as UserPlanningContext,
    source: result.source as 'ai' | 'adapted',
    userId: result.userId,
    accessCount: result.accessCount,
    createdAt: result.createdAt,
    lastAccessedAt: result.lastAccessedAt,
  }));
}
