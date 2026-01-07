/**
 * Context Hasher
 *
 * Genera hashes para identificar contextos de usuario de forma única
 * y para encontrar contextos similares (semantic hashing).
 */

import crypto from 'crypto';
import { UserPlanningContext } from '@/types/planning';
import { getAgeBucket, getWeightBucket, getTimelineBucket } from '@/config/cacheConfig';

/**
 * Genera un hash exacto del contexto completo
 * Mismo contexto → mismo hash (match perfecto)
 *
 * @param context - Contexto completo del usuario
 * @returns Hash SHA-256 de 64 caracteres
 */
export function generateExactHash(context: UserPlanningContext): string {
  // Serializar el contexto en formato canónico (ordenado)
  const canonicalJson = JSON.stringify(context, Object.keys(context).sort());

  // Generar hash SHA-256
  return crypto.createHash('sha256').update(canonicalJson).digest('hex');
}

/**
 * Genera un hash semántico basado en features clave
 * Usuarios similares → mismo hash (match semántico)
 *
 * @param context - Contexto del usuario
 * @returns Hash de features semánticas
 */
export function generateSemanticHash(context: UserPlanningContext): string {
  // Extraer solo los features clave que definen similitud
  const semanticFeatures = {
    // Objetivo (muy importante)
    goal: context.objective.primaryGoal,
    timeline: getTimelineBucket(context.objective.targetTimeline),
    hasCompetition: context.objective.hasCompetition,

    // Nivel de experiencia (importante)
    level: context.training.experienceLevel,

    // Volumen de entrenamiento
    daysPerWeek: context.training.daysPerWeek,
    sessionDuration: Math.round(context.training.sessionDuration / 15) * 15, // Bucket de 15min

    // Biometría (bucketizada)
    ageBucket: getAgeBucket(context.biometrics.age),
    weightBucket: getWeightBucket(context.biometrics.weight),
    gender: context.biometrics.gender,

    // Dieta
    dietType: context.nutrition.dietType,
    mealsPerDay: context.nutrition.mealsPerDay,

    // Tipo de deporte
    sportType: context.training.sportType,
  };

  // Serializar en formato determinista
  const canonicalJson = JSON.stringify(semanticFeatures, Object.keys(semanticFeatures).sort());

  // Generar hash
  return crypto.createHash('sha256').update(canonicalJson).digest('hex');
}

/**
 * Genera una clave compuesta para indexación rápida
 * Formato: "goal|level|days|diet|timeline"
 *
 * @param context - Contexto del usuario
 * @returns String compuesto para indexación
 */
export function generateCompoundKey(context: UserPlanningContext): string {
  const parts = [
    context.objective.primaryGoal,
    context.training.experienceLevel,
    context.training.daysPerWeek.toString(),
    context.nutrition.dietType,
    getTimelineBucket(context.objective.targetTimeline).toString(),
  ];

  return parts.join('|');
}

/**
 * Genera todos los hashes de un contexto
 *
 * @param context - Contexto del usuario
 * @returns Objeto con todos los hashes generados
 */
export function generateAllHashes(context: UserPlanningContext) {
  return {
    exactHash: generateExactHash(context),
    semanticHash: generateSemanticHash(context),
    compoundKey: generateCompoundKey(context),
  };
}

/**
 * Anonimiza un userId mediante hash
 *
 * @param userId - ID del usuario
 * @returns Hash base64 de 16 caracteres
 */
export function hashUserId(userId: string): string {
  return Buffer.from(userId).toString('base64').substring(0, 16);
}
