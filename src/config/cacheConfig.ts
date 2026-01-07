/**
 * Configuración central del sistema híbrido AI+Caché
 *
 * Este archivo contiene todos los parámetros configurables del sistema
 * de caché inteligente para generación de planes.
 */

export const CACHE_CONFIG = {
  // Similarity thresholds
  SIMILARITY_THRESHOLD_HIGH: 0.90,
  SIMILARITY_THRESHOLD_MEDIUM: 0.80,
  SIMILARITY_THRESHOLD_LOW: 0.75,

  // Cost limits
  DAILY_AI_LIMIT: 50,
  MONTHLY_BUDGET_USD: 500,
  COST_PER_GENERATION_USD: 0.08,  // Gemini es más barato que Claude
  COST_PER_1K_TOKENS: 0.0001,     // Gemini Flash pricing

  // Cache strategy
  PREFETCH_TOP_ARCHETYPES: true,
  ARCHETYPE_THRESHOLD: 10,
  CACHE_TTL_DAYS: 90,
  COMPRESSION_ENABLED: true,

  // Feature weights (para similarity)
  FEATURE_WEIGHTS: {
    objective: 2.0,      // El objetivo es lo más importante
    training: 1.5,       // Nivel de experiencia y días/semana
    biometrics: 1.0,     // Edad, peso, altura
    nutrition: 0.8,      // Tipo de dieta es menos crítico (adaptable)
  },

  // Bucketing para semantic hash
  AGE_BUCKETS: [18, 26, 36, 46, 56, 100],
  WEIGHT_BUCKET_SIZE_KG: 5,
  TIMELINE_BUCKETS: [4, 9, 13, 17],

  // Peak hours (24h format) - horarios de mayor demanda
  PEAK_HOURS: [[12, 14], [20, 22]],

  // Penalties for similarity scoring
  PENALTIES: {
    DIFFERENT_DIET_TYPE: -0.15,
    DIFFERENT_DAYS_PER_WEEK: -0.10,
    DIFFERENT_HAS_COMPETITION: -0.20,
    CONFLICTING_INTOLERANCES: -0.30,
  },
} as const;

export const MODEL_CONFIG = {
  // Gemini model configuration
  GEMINI_MODEL: 'gemini-2.0-flash-exp',
  GEMINI_FALLBACK_MODELS: ['gemini-1.5-flash-latest', 'gemini-1.5-flash'],
  MAX_TOKENS: 8000,
  TEMPERATURE: 0.7,
  TIMEOUT_MS: 90000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 2000,
} as const;

export const ADAPTATION_RULES = {
  // Criterios de NO adaptación (retornar null si se cumplen)
  NON_ADAPTABLE: {
    GOAL_TYPE_DIFFERENT: true,              // cut ≠ bulk
    DIET_TYPE_INCOMPATIBLE: true,           // vegan ≠ carnivore
    EXPERIENCE_LEVEL_GAP: 2,                // beginner ≠ advanced
    WEIGHT_DIFFERENCE_KG: 15,               // >15kg de diferencia
    TIMELINE_DIFFERENCE_WEEKS: 6,           // >6 semanas de diferencia
  },

  // Compatibilidad de dietas
  DIET_COMPATIBILITY: {
    'omnivore': ['omnivore', 'flexitarian'],
    'vegetarian': ['vegetarian', 'flexitarian', 'omnivore'],
    'vegan': ['vegan', 'vegetarian'],
    'paleo': ['paleo', 'omnivore'],
    'keto': ['keto', 'low_carb', 'omnivore'],
    'mediterranean': ['mediterranean', 'omnivore'],
    'flexitarian': ['flexitarian', 'omnivore', 'vegetarian'],
  } as Record<string, string[]>,

  // Threshold de confianza para adaptación
  MIN_CONFIDENCE_SCORE: 0.70,
} as const;

// Helper functions
export function isPeakHour(date: Date = new Date()): boolean {
  const hour = date.getHours();
  return CACHE_CONFIG.PEAK_HOURS.some(([start, end]) => hour >= start && hour < end);
}

export function getAgeBucket(age: number): number {
  const buckets = CACHE_CONFIG.AGE_BUCKETS;
  for (let i = 0; i < buckets.length - 1; i++) {
    if (age >= buckets[i] && age < buckets[i + 1]) {
      return buckets[i];
    }
  }
  return buckets[buckets.length - 2]; // Último bucket válido
}

export function getWeightBucket(weight: number): number {
  const bucketSize = CACHE_CONFIG.WEIGHT_BUCKET_SIZE_KG;
  return Math.floor(weight / bucketSize) * bucketSize;
}

export function getTimelineBucket(weeks: number): number {
  const buckets = CACHE_CONFIG.TIMELINE_BUCKETS;
  for (let i = 0; i < buckets.length - 1; i++) {
    if (weeks >= buckets[i] && weeks < buckets[i + 1]) {
      return buckets[i];
    }
  }
  return buckets[buckets.length - 1];
}
