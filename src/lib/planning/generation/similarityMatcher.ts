/**
 * Similarity Matcher
 *
 * Motor de búsqueda semántica para encontrar planes similares.
 * Usa vectorización de features y cosine similarity para ranking.
 */

import type { UserPlanningContext } from '@/types/planning';
import { extractFeatures } from '../hashing/featureExtractor';
import { getFeatureWeights } from '../hashing/featureExtractor';
import { weightedCosineSimilarity } from '../hashing/vectorizer';
import * as cacheManager from './cacheManager';
import type { CachedPlan } from '../storage/planRepository';
import { CACHE_CONFIG } from '@/config/cacheConfig';

export interface CachedPlanMatch {
  planId: string;
  score: number; // 0.0 - 1.0
  plan: any; // WeekPlan
  originalContext: UserPlanningContext;
  differences: ContextDifferences;
}

export interface ContextDifferences {
  age?: number;
  weight?: number;
  timeline?: number;
  intolerances?: string[];
  excludedFoods?: string[];
  differentDietType?: boolean;
  differentGoal?: boolean;
  differentLevel?: boolean;
  daysPerWeekDiff?: number;
}

/**
 * Encuentra planes similares en el caché
 *
 * @param context - Contexto del usuario
 * @param limit - Número máximo de resultados
 * @returns Array de matches ordenados por score descendente
 */
export async function findSimilar(
  context: UserPlanningContext,
  limit: number = 5
): Promise<CachedPlanMatch[]> {
  try {
    // PASO 1: Pre-filtro rápido usando compound key
    // Esto reduce el espacio de búsqueda significativamente
    const candidates = await cacheManager.findByCompoundKey(context, 20);

    if (candidates.length === 0) {
      console.log('🔍 No se encontraron candidatos en pre-filtro');
      return [];
    }

    console.log(`🔍 Pre-filtro: ${candidates.length} candidatos encontrados`);

    // PASO 2: Extraer feature vector del nuevo contexto
    const newVector = extractFeatures(context);
    const weights = getFeatureWeights();

    // PASO 3: Calcular similarity para cada candidato
    const matches: CachedPlanMatch[] = [];

    for (const candidate of candidates) {
      // Calcular similarity base
      let score = weightedCosineSimilarity(newVector, candidate.featureVector, weights);

      // PASO 4: Aplicar penalizaciones
      const penalties = calculatePenalties(context, candidate.contextSnapshot);
      score += penalties.total;

      // Asegurar que el score esté en rango [0, 1]
      score = Math.max(0, Math.min(1, score));

      // Filtrar scores muy bajos
      if (score < CACHE_CONFIG.SIMILARITY_THRESHOLD_LOW) {
        continue;
      }

      // Calcular diferencias entre contextos
      const differences = calculateDifferences(context, candidate.contextSnapshot);

      matches.push({
        planId: candidate.id,
        score,
        plan: candidate.planData,
        originalContext: candidate.contextSnapshot,
        differences,
      });
    }

    // PASO 5: Ordenar por score descendente y tomar top N
    matches.sort((a, b) => b.score - a.score);
    const topMatches = matches.slice(0, limit);

    console.log(
      `✅ Similarity matching: ${topMatches.length} matches (scores: ${topMatches.map((m) => m.score.toFixed(2)).join(', ')})`
    );

    return topMatches;
  } catch (error) {
    console.error('Error finding similar plans:', error);
    return [];
  }
}

/**
 * Calcula penalizaciones por incompatibilidades
 *
 * @param newContext - Contexto nuevo
 * @param cachedContext - Contexto cacheado
 * @returns Objeto con penalizaciones
 */
function calculatePenalties(
  newContext: UserPlanningContext,
  cachedContext: UserPlanningContext
): { total: number; breakdown: Record<string, number> } {
  const penalties: Record<string, number> = {};
  let total = 0;

  // Penalización por tipo de dieta diferente
  if (newContext.nutrition.dietType !== cachedContext.nutrition.dietType) {
    const penalty = CACHE_CONFIG.PENALTIES.DIFFERENT_DIET_TYPE;
    penalties.diet_type = penalty;
    total += penalty;
  }

  // Penalización por días por semana diferentes
  if (newContext.training.daysPerWeek !== cachedContext.training.daysPerWeek) {
    const penalty = CACHE_CONFIG.PENALTIES.DIFFERENT_DAYS_PER_WEEK;
    penalties.days_per_week = penalty;
    total += penalty;
  }

  // Penalización por competición diferente
  if (newContext.objective.hasCompetition !== cachedContext.objective.hasCompetition) {
    const penalty = CACHE_CONFIG.PENALTIES.DIFFERENT_HAS_COMPETITION;
    penalties.has_competition = penalty;
    total += penalty;
  }

  // Penalización por intolerancias conflictivas
  const newIntolerances = new Set(newContext.nutrition.intolerances);
  const cachedIntolerances = new Set(cachedContext.nutrition.intolerances);

  // Si el nuevo contexto tiene intolerancias que el cached no tiene,
  // puede haber ingredientes incompatibles en el plan
  const conflictingIntolerances = Array.from(newIntolerances).filter(
    (int) => !cachedIntolerances.has(int)
  );

  if (conflictingIntolerances.length > 0) {
    const penalty = CACHE_CONFIG.PENALTIES.CONFLICTING_INTOLERANCES;
    penalties.intolerances = penalty;
    total += penalty;
  }

  // Penalización por objetivo diferente (muy importante)
  if (newContext.objective.primaryGoal !== cachedContext.objective.primaryGoal) {
    penalties.goal = -0.25; // Penalización fuerte
    total += -0.25;
  }

  // Penalización por nivel de experiencia con diferencia > 1
  const levelMap = { beginner: 0, intermediate: 1, advanced: 2 };
  const newLevel = levelMap[newContext.training.experienceLevel];
  const cachedLevel = levelMap[cachedContext.training.experienceLevel];
  const levelDiff = Math.abs(newLevel - cachedLevel);

  if (levelDiff > 1) {
    penalties.experience_gap = -0.20;
    total += -0.20;
  }

  return { total, breakdown: penalties };
}

/**
 * Calcula las diferencias entre dos contextos
 *
 * @param newContext - Contexto nuevo
 * @param cachedContext - Contexto cacheado
 * @returns Objeto con diferencias
 */
function calculateDifferences(
  newContext: UserPlanningContext,
  cachedContext: UserPlanningContext
): ContextDifferences {
  const diff: ContextDifferences = {};

  // Diferencia de edad
  const ageDiff = Math.abs(newContext.biometrics.age - cachedContext.biometrics.age);
  if (ageDiff > 0) {
    diff.age = ageDiff;
  }

  // Diferencia de peso
  const weightDiff = Math.abs(newContext.biometrics.weight - cachedContext.biometrics.weight);
  if (weightDiff > 0) {
    diff.weight = Math.round(weightDiff * 10) / 10; // 1 decimal
  }

  // Diferencia de timeline
  const timelineDiff = Math.abs(
    newContext.objective.targetTimeline - cachedContext.objective.targetTimeline
  );
  if (timelineDiff > 0) {
    diff.timeline = timelineDiff;
  }

  // Intolerancias adicionales
  const newIntolerances = new Set(newContext.nutrition.intolerances);
  const cachedIntolerances = new Set(cachedContext.nutrition.intolerances);
  const additionalIntolerances = Array.from(newIntolerances).filter(
    (int) => !cachedIntolerances.has(int)
  );
  if (additionalIntolerances.length > 0) {
    diff.intolerances = additionalIntolerances;
  }

  // Alimentos excluidos adicionales
  const newExcluded = new Set(newContext.nutrition.excludedFoods);
  const cachedExcluded = new Set(cachedContext.nutrition.excludedFoods);
  const additionalExcluded = Array.from(newExcluded).filter((food) => !cachedExcluded.has(food));
  if (additionalExcluded.length > 0) {
    diff.excludedFoods = additionalExcluded;
  }

  // Banderas de diferencias categóricas
  if (newContext.nutrition.dietType !== cachedContext.nutrition.dietType) {
    diff.differentDietType = true;
  }

  if (newContext.objective.primaryGoal !== cachedContext.objective.primaryGoal) {
    diff.differentGoal = true;
  }

  if (newContext.training.experienceLevel !== cachedContext.training.experienceLevel) {
    diff.differentLevel = true;
  }

  const daysDiff = newContext.training.daysPerWeek - cachedContext.training.daysPerWeek;
  if (daysDiff !== 0) {
    diff.daysPerWeekDiff = daysDiff;
  }

  return diff;
}

/**
 * Verifica si un plan es adaptable para un nuevo contexto
 *
 * @param differences - Diferencias entre contextos
 * @param score - Score de similitud
 * @returns true si es adaptable
 */
export function isAdaptable(differences: ContextDifferences, score: number): boolean {
  // Reglas de NO adaptación
  if (differences.differentGoal) {
    return false; // Objetivos diferentes no son adaptables
  }

  if (differences.weight && differences.weight > 15) {
    return false; // Más de 15kg de diferencia es demasiado
  }

  if (differences.timeline && differences.timeline > 6) {
    return false; // Más de 6 semanas de diferencia es demasiado
  }

  if (score < CACHE_CONFIG.SIMILARITY_THRESHOLD_LOW) {
    return false; // Score muy bajo
  }

  // Si todas las reglas pasan, es adaptable
  return true;
}

/**
 * Obtiene el mejor match disponible
 *
 * @param context - Contexto del usuario
 * @returns Mejor match o null
 */
export async function getBestMatch(
  context: UserPlanningContext
): Promise<CachedPlanMatch | null> {
  const matches = await findSimilar(context, 1);

  if (matches.length === 0) {
    return null;
  }

  return matches[0];
}
