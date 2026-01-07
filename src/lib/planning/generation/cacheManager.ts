/**
 * Cache Manager
 *
 * Gestiona el ciclo de vida de los planes cacheados:
 * - Guardado de planes generados
 * - Búsqueda de matches exactos
 * - Búsqueda de matches semánticos
 * - Actualización de contadores de acceso
 */

import type { UserPlanningContext, WeekPlan } from '@/types/planning';
import { generateAllHashes } from '../hashing/contextHasher';
import { extractFeatures } from '../hashing/featureExtractor';
import * as planRepository from '../storage/planRepository';
import type { CachedPlan } from '../storage/planRepository';

export interface PlanMetadata {
  source: 'ai' | 'adapted';
  originalPlanId?: string;
  tokensUsed?: number;
  durationMs?: number;
}

/**
 * Guarda un plan en el caché
 *
 * @param plan - Plan completo a cachear
 * @param context - Contexto del usuario
 * @param metadata - Metadata adicional
 * @returns ID del plan guardado
 */
export async function savePlan(
  plan: WeekPlan,
  context: UserPlanningContext,
  metadata: PlanMetadata
): Promise<string> {
  try {
    // Generar hashes del contexto
    const { exactHash, semanticHash, compoundKey } = generateAllHashes(context);

    // Extraer feature vector
    const featureVector = extractFeatures(context);

    // Guardar en base de datos
    const planId = await planRepository.insertCachedPlan({
      exactHash,
      semanticHash,
      compoundKey,
      featureVector,
      planData: plan,
      contextSnapshot: context,
      source: metadata.source,
      originalPlanId: metadata.originalPlanId,
      userId: context.meta.userId,
    });

    console.log(`✅ Plan cacheado exitosamente: ${planId} (${metadata.source})`);

    return planId;
  } catch (error) {
    console.error('Error saving plan to cache:', error);
    throw error;
  }
}

/**
 * Busca un plan con match exacto
 *
 * @param context - Contexto del usuario
 * @returns Plan cacheado o null
 */
export async function findExactMatch(
  context: UserPlanningContext
): Promise<WeekPlan | null> {
  try {
    const { exactHash } = generateAllHashes(context);

    const cachedPlan = await planRepository.findByExactHash(exactHash);

    if (!cachedPlan) {
      return null;
    }

    // Incrementar contador de accesos
    await planRepository.updateAccessCount(cachedPlan.id);

    console.log(`🎯 Cache exact match encontrado: ${cachedPlan.id}`);

    return cachedPlan.planData;
  } catch (error) {
    console.error('Error finding exact match:', error);
    return null;
  }
}

/**
 * Busca planes con match semántico
 *
 * @param context - Contexto del usuario
 * @param limit - Número máximo de resultados
 * @returns Array de planes similares
 */
export async function findSemanticMatches(
  context: UserPlanningContext,
  limit: number = 5
): Promise<CachedPlan[]> {
  try {
    const { semanticHash } = generateAllHashes(context);

    const matches = await planRepository.findBySemanticHash(semanticHash, limit);

    console.log(`🔍 Encontrados ${matches.length} matches semánticos`);

    return matches;
  } catch (error) {
    console.error('Error finding semantic matches:', error);
    return [];
  }
}

/**
 * Busca planes por compound key con filtros adicionales
 *
 * @param context - Contexto del usuario
 * @param limit - Número máximo de resultados
 * @returns Array de planes candidatos
 */
export async function findByCompoundKey(
  context: UserPlanningContext,
  limit: number = 10
): Promise<CachedPlan[]> {
  try {
    const { compoundKey } = generateAllHashes(context);
    const goalType = context.objective.primaryGoal;

    const matches = await planRepository.findByCompoundKey(compoundKey, goalType, limit);

    console.log(`📊 Encontrados ${matches.length} matches por compound key`);

    return matches;
  } catch (error) {
    console.error('Error finding by compound key:', error);
    return [];
  }
}

/**
 * Incrementa el contador de accesos de un plan
 *
 * @param planId - ID del plan
 */
export async function incrementAccessCount(planId: string): Promise<void> {
  try {
    await planRepository.updateAccessCount(planId);
  } catch (error) {
    console.error('Error incrementing access count:', error);
  }
}

/**
 * Obtiene estadísticas del caché
 *
 * @returns Estadísticas agregadas
 */
export async function getCacheStats() {
  try {
    const stats = await planRepository.getCacheStats();
    return stats;
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return null;
  }
}

/**
 * Limpia planes antiguos no utilizados
 * Se recomienda ejecutar como cron job diario
 *
 * @param olderThanDays - Días de antigüedad
 * @returns Número de planes eliminados
 */
export async function cleanupOldPlans(olderThanDays: number = 90): Promise<number> {
  try {
    const deleted = await planRepository.deleteOldPlans(olderThanDays);
    console.log(`🗑️ Limpieza de caché: ${deleted} planes antiguos eliminados`);
    return deleted;
  } catch (error) {
    console.error('Error cleaning up old plans:', error);
    return 0;
  }
}

/**
 * Pre-carga un plan en el caché (para arquetipos populares)
 *
 * @param plan - Plan a pre-cargar
 * @param context - Contexto sintético del arquetipo
 * @param userId - ID del usuario que lo genera (puede ser admin)
 * @returns ID del plan guardado
 */
export async function preloadPlan(
  plan: WeekPlan,
  context: UserPlanningContext,
  userId: string
): Promise<string> {
  // Crear un contexto modificado con el userId correcto
  const modifiedContext = {
    ...context,
    meta: {
      ...context.meta,
      userId,
    },
  };

  return savePlan(plan, modifiedContext, {
    source: 'ai',
  });
}

/**
 * Verifica si existe un plan cacheado para un contexto
 *
 * @param context - Contexto del usuario
 * @returns true si existe un match exacto
 */
export async function hasCachedPlan(context: UserPlanningContext): Promise<boolean> {
  const { exactHash } = generateAllHashes(context);
  const cached = await planRepository.findByExactHash(exactHash);
  return cached !== null;
}
