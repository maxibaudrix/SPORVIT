// src/lib/data/trainingPlans.ts

import normalized from '@/data/training_templates_es_normalized.json';
import web from '@/data/training_templates_es_4weeks_web.json';
import exerciseCatalog from '@/data/exercise_catalog.json';

// ============================================
// TYPES
// ============================================
export interface Exercise {
  ejercicio: string;
  series?: number;
  repeticiones?: number;
  descanso_seg?: number;
  duracion_min?: number;
  descripcion: string;
  tipo?: string[];
  dificultad?: string;
  musculos_trabajados?: string[];
  slug?: string;
}

export interface TrainingPlan {
  id: string;
  slug: string;
  locale: string;
  metadata: {
    objetivo: string;
    nivel: string;
    duracion_semanas: number;
    dias_por_semana: number;
    equipo: string[];
    tags: string[];
    semana_actual?: number;
  };
  plan: {
    [key: string]: Exercise[];
  };
  meta: {
    title: string;
    description: string;
  };
  resumen_semana?: string;
  url?: string;
}

export interface ExerciseDetail {
  exercise_id: string;
  name: string;
  tipo: string[];
  descripcion: string;
  musculos_trabajados: string[];
  dificultad: string;
  video_url: string | null;
  slug: string;
}

// ============================================
// CACHE (para optimizar en producción)
// ============================================
let cachedPlans: TrainingPlan[] | null = null;
let cachedExercises: Map<string, ExerciseDetail> | null = null;

// ============================================
// MAIN FUNCTIONS
// ============================================

/**
 * Obtiene TODOS los planes de entrenamiento
 * Combina normalized + web y elimina duplicados
 */
export function getAllPlans(): TrainingPlan[] {
  if (cachedPlans) return cachedPlans;

  const allPlans = [...normalized, ...web] as TrainingPlan[];
  
  // Eliminar duplicados por slug
  const uniquePlans = Array.from(
    new Map(allPlans.map(plan => [plan.slug, plan])).values()
  );

  cachedPlans = uniquePlans;
  return uniquePlans;
}

/**
 * Obtiene un plan por su slug
 */
export function getPlanBySlug(slug: string): TrainingPlan | null {
  const plans = getAllPlans();
  return plans.find(plan => plan.slug === slug) || null;
}

/**
 * Obtiene planes filtrados por objetivo
 */
export function getPlansByObjetivo(objetivo: string): TrainingPlan[] {
  const plans = getAllPlans();
  return plans.filter(plan => plan.metadata.objetivo === objetivo);
}

/**
 * Obtiene planes similares (mismo objetivo, diferente plan)
 */
export function getSimilarPlans(currentPlan: TrainingPlan, limit: number = 3): TrainingPlan[] {
  const plans = getAllPlans();
  return plans
    .filter(plan => 
      plan.metadata.objetivo === currentPlan.metadata.objetivo &&
      plan.slug !== currentPlan.slug
    )
    .slice(0, limit);
}

/**
 * Busca planes por query text
 */
export function searchPlans(query: string): TrainingPlan[] {
  if (!query.trim()) return getAllPlans();
  
  const plans = getAllPlans();
  const lowerQuery = query.toLowerCase();
  
  return plans.filter(plan => 
    plan.meta.title.toLowerCase().includes(lowerQuery) ||
    plan.meta.description.toLowerCase().includes(lowerQuery) ||
    plan.metadata.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Filtrado avanzado de planes
 */
export interface PlanFilters {
  objetivo?: string;
  nivel?: string;
  duracion?: number;
  equipoRequerido?: string[];
  query?: string;
}

export function filterPlans(filters: PlanFilters): TrainingPlan[] {
  let plans = getAllPlans();

  if (filters.query) {
    const lowerQuery = filters.query.toLowerCase();
    plans = plans.filter(plan => 
      plan.meta.title.toLowerCase().includes(lowerQuery) ||
      plan.meta.description.toLowerCase().includes(lowerQuery)
    );
  }

  if (filters.objetivo && filters.objetivo !== 'todos') {
    plans = plans.filter(plan => plan.metadata.objetivo === filters.objetivo);
  }

  if (filters.nivel && filters.nivel !== 'todos') {
    plans = plans.filter(plan => plan.metadata.nivel === filters.nivel);
  }

  if (filters.duracion) {
    plans = plans.filter(plan => plan.metadata.duracion_semanas === filters.duracion);
  }

  if (filters.equipoRequerido && filters.equipoRequerido.length > 0) {
    plans = plans.filter(plan => 
      filters.equipoRequerido!.every(equipo => 
        plan.metadata.equipo.includes(equipo)
      )
    );
  }

  return plans;
}

/**
 * Obtiene todos los objetivos únicos
 */
export function getAllObjetivos(): string[] {
  const plans = getAllPlans();
  return Array.from(new Set(plans.map(plan => plan.metadata.objetivo)));
}

/**
 * Obtiene todos los niveles únicos
 */
export function getAllNiveles(): string[] {
  const plans = getAllPlans();
  return Array.from(new Set(plans.map(plan => plan.metadata.nivel)));
}

/**
 * Obtiene duraciones únicas (en semanas)
 */
export function getAllDuraciones(): number[] {
  const plans = getAllPlans();
  const duraciones = Array.from(new Set(plans.map(plan => plan.metadata.duracion_semanas)));
  return duraciones.sort((a, b) => a - b);
}

// ============================================
// EXERCISE CATALOG FUNCTIONS
// ============================================

/**
 * Obtiene catálogo de ejercicios como Map para búsqueda rápida
 */
export function getExerciseCatalog(): Map<string, ExerciseDetail> {
  if (cachedExercises) return cachedExercises;

  const catalog = new Map<string, ExerciseDetail>();
  
  (exerciseCatalog as ExerciseDetail[]).forEach(exercise => {
    // Indexar por nombre normalizado
    const normalizedName = exercise.name.toLowerCase().trim();
    catalog.set(normalizedName, exercise);
    
    // También por slug si existe
    if (exercise.slug) {
      catalog.set(exercise.slug, exercise);
    }
  });

  cachedExercises = catalog;
  return catalog;
}

/**
 * Obtiene detalles de un ejercicio por nombre
 */
export function getExerciseDetails(exerciseName: string): ExerciseDetail | null {
  const catalog = getExerciseCatalog();
  const normalizedName = exerciseName.toLowerCase().trim();
  return catalog.get(normalizedName) || null;
}

/**
 * Enriquece ejercicios de un plan con datos del catálogo
 */
export function enrichPlanExercises(plan: TrainingPlan): TrainingPlan {
  const catalog = getExerciseCatalog();
  
  const enrichedPlan = { ...plan };
  
  Object.keys(enrichedPlan.plan).forEach(day => {
    enrichedPlan.plan[day] = enrichedPlan.plan[day].map(exercise => {
      const details = catalog.get(exercise.ejercicio.toLowerCase().trim());
      
      if (details) {
        return {
          ...exercise,
          tipo: details.tipo,
          dificultad: details.dificultad,
          musculos_trabajados: details.musculos_trabajados,
          slug: details.slug,
          descripcion: exercise.descripcion || details.descripcion
        };
      }
      
      return exercise;
    });
  });
  
  return enrichedPlan;
}

// ============================================
// STATS & ANALYTICS
// ============================================

/**
 * Obtiene estadísticas generales del catálogo
 */
export function getCatalogStats() {
  const plans = getAllPlans();
  const ejerciciosUnicos = new Set<string>();
  
  plans.forEach(plan => {
    Object.values(plan.plan).forEach(exercises => {
      exercises.forEach(ex => ejerciciosUnicos.add(ex.ejercicio));
    });
  });

  return {
    totalPlanes: plans.length,
    totalObjetivos: getAllObjetivos().length,
    totalNiveles: getAllNiveles().length,
    totalEjerciciosUnicos: ejerciciosUnicos.size,
    totalEjerciciosCatalogo: exerciseCatalog.length
  };
}

/**
 * Obtiene los planes más populares (mock - implementar tracking después)
 */
export function getPopularPlans(limit: number = 6): TrainingPlan[] {
  const plans = getAllPlans();
  // TODO: Ordenar por vistas reales desde analytics
  return plans.slice(0, limit);
}

/**
 * Agrupa planes por objetivo
 */
export function groupPlansByObjetivo(): Record<string, TrainingPlan[]> {
  const plans = getAllPlans();
  const grouped: Record<string, TrainingPlan[]> = {};
  
  plans.forEach(plan => {
    const objetivo = plan.metadata.objetivo;
    if (!grouped[objetivo]) {
      grouped[objetivo] = [];
    }
    grouped[objetivo].push(plan);
  });
  
  return grouped;
}