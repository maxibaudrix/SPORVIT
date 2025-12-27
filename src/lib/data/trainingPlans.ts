// src/lib/data/trainingPlans.ts

import normalizedData from '@/../data/training_templates_es_normalized.json';
import webData from '@/../data/training_templates_es_4weeks_web.json';
import exerciseCatalogData from '@/../data/exercise_catalog.json';

// Type assertion para que TypeScript reconozca la estructura
const normalized = normalizedData as any[];
const web = webData as any[];
const exerciseCatalog = exerciseCatalogData as any[];

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

// ============================================
// NUEVOS TYPES PARA PROGRAMAS AGRUPADOS
// ============================================

export interface SemanaPlan {
  numero: number;
  titulo: string;
  descripcion: string;
  plan: {
    [key: string]: Exercise[];
  };
  originalPlanId: string;
}

export interface ProgramaPlan {
  id: string;
  slug: string;
  metadata: {
    objetivo: string;
    nivel: string;
    duracion_total_semanas: number;
    dias_por_semana: number;
    equipo: string[];
    tags: string[];
  };
  semanas: SemanaPlan[];
  meta: {
    title: string;
    description: string;
  };
  stats: {
    totalEjercicios: number;
    duracionPromedioDia: number;
  };
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
  const programs = groupPlansIntoPrograms();
  const ejerciciosUnicos = new Set<string>();
  
  plans.forEach(plan => {
    Object.values(plan.plan).forEach(exercises => {
      exercises.forEach(ex => ejerciciosUnicos.add(ex.ejercicio));
    });
  });

  return {
    totalPlanes: plans.length,
    totalProgramas: programs.length,
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
 * Agrupa planes por objetivo (mantiene compatibilidad)
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

// ============================================
// FUNCIONES DE AGRUPACIÓN DE PROGRAMAS
// ============================================

/**
 * Detecta si un slug contiene número de semana
 * Ejemplos:
 * - "plan-resistencia-principiante-semana-1" → 1
 * - "plan-fuerza-avanzado-semana-3" → 3
 * - "plan-hiit-basico" → null
 */
export function detectWeekNumber(slug: string): number | null {
  const patterns = [
    /semana[-_](\d+)/i,
    /week[-_](\d+)/i,
    /sem[-_](\d+)/i,
    /s(\d+)$/i
  ];

  for (const pattern of patterns) {
    const match = slug.match(pattern);
    if (match) {
      return parseInt(match[1]);
    }
  }

  return null;
}

/**
 * Obtiene el slug base de un plan (sin número de semana)
 * Ejemplos:
 * - "plan-resistencia-principiante-semana-1" → "plan-resistencia-principiante"
 * - "plan-fuerza-avanzado-semana-3" → "plan-fuerza-avanzado"
 */
export function getBaseSlug(slug: string): string {
  return slug
    .replace(/[-_]semana[-_]\d+/i, '')
    .replace(/[-_]week[-_]\d+/i, '')
    .replace(/[-_]sem[-_]\d+/i, '')
    .replace(/[-_]s\d+$/i, '');
}

/**
 * Genera título descriptivo para cada semana
 */
function generateWeekTitle(weekNumber: number, totalWeeks: number, objetivo: string): string {
  const titlesByObjective: Record<string, string[]> = {
    'resistencia': [
      'Adaptación Aeróbica',
      'Construcción de Base',
      'Intensificación Progresiva',
      'Consolidación'
    ],
    'fuerza': [
      'Adaptación Anatómica',
      'Desarrollo de Fuerza',
      'Fase de Potencia',
      'Recuperación Activa'
    ],
    'hipertrofia': [
      'Fase de Volumen',
      'Intensificación',
      'Sobrecarga Máxima',
      'Recuperación y Crecimiento'
    ],
    'perdida_grasa': [
      'Adaptación Metabólica',
      'Intensificación',
      'Máximo Déficit',
      'Recuperación Activa'
    ],
    'perdida_peso': [
      'Adaptación Metabólica',
      'Intensificación',
      'Máximo Déficit',
      'Recuperación Activa'
    ],
    'ganancia_muscular': [
      'Fase de Volumen',
      'Intensificación',
      'Sobrecarga Máxima',
      'Recuperación y Crecimiento'
    ],
    'salud_general': [
      'Inicio Saludable',
      'Progresión Gradual',
      'Consolidación',
      'Mantenimiento Activo'
    ]
  };

  const titles = titlesByObjective[objetivo] || [
    'Fase Inicial',
    'Fase de Desarrollo',
    'Fase Intensiva',
    'Fase de Consolidación'
  ];

  return titles[weekNumber - 1] || `Semana ${weekNumber}`;
}

/**
 * FUNCIÓN PRINCIPAL: Agrupa planes individuales en programas completos
 */
export function groupPlansIntoPrograms(): ProgramaPlan[] {
  const allPlans = getAllPlans();
  const programsMap = new Map<string, TrainingPlan[]>();

  // Paso 1: Agrupar planes por slug base
  allPlans.forEach(plan => {
    const weekNumber = detectWeekNumber(plan.slug);
    
    // Solo agrupar planes que tengan número de semana
    if (weekNumber !== null) {
      const baseSlug = getBaseSlug(plan.slug);
      
      if (!programsMap.has(baseSlug)) {
        programsMap.set(baseSlug, []);
      }
      
      programsMap.get(baseSlug)!.push(plan);
    }
  });

  // Paso 2: Convertir a ProgramaPlan[]
  const programs: ProgramaPlan[] = [];

  programsMap.forEach((plans, baseSlug) => {
    // Ordenar por número de semana
    const sortedPlans = plans.sort((a, b) => {
      const weekA = detectWeekNumber(a.slug) || 0;
      const weekB = detectWeekNumber(b.slug) || 0;
      return weekA - weekB;
    });

    const firstPlan = sortedPlans[0];
    const totalWeeks = sortedPlans.length;

    // Crear semanas
    const semanas: SemanaPlan[] = sortedPlans.map((plan, index) => {
      const weekNumber = index + 1;
      
      return {
        numero: weekNumber,
        titulo: generateWeekTitle(weekNumber, totalWeeks, firstPlan.metadata.objetivo),
        descripcion: plan.meta.description,
        plan: plan.plan,
        originalPlanId: plan.id
      };
    });

    // Calcular estadísticas del programa
    let totalEjercicios = 0;
    let totalDuracion = 0;
    let diasConEjercicios = 0;

    sortedPlans.forEach(plan => {
      Object.values(plan.plan).forEach(exercises => {
        if (exercises.length > 0) {
          totalEjercicios += exercises.length;
          diasConEjercicios++;
          
          exercises.forEach(ex => {
            if (ex.duracion_min) {
              totalDuracion += ex.duracion_min;
            }
          });
        }
      });
    });

    const duracionPromedioDia = diasConEjercicios > 0 
      ? Math.round(totalDuracion / diasConEjercicios) 
      : 45;

    // Recopilar equipo único de todas las semanas
    const equipoSet = new Set<string>();
    sortedPlans.forEach(plan => {
      plan.metadata.equipo.forEach(eq => equipoSet.add(eq));
    });

    // Generar metadata del programa
    const programTitle = firstPlan.meta.title
      .replace(/[-_]?\s*semana\s*\d+/gi, '')
      .replace(/\s*-\s*$/gi, '')
      .replace(/pérdida_grasa/gi, 'Pérdida de Grasa')
      .replace(/perdida_grasa/gi, 'Pérdida de Grasa')
      .replace(/perdida_peso/gi, 'Pérdida de Peso')
      .replace(/ganancia_muscular/gi, 'Ganancia Muscular')
      .replace(/salud_general/gi, 'Salud General')
      .replace(/_/g, ' ')
      .trim();

    // Mapeo de nombres amigables para objetivos
    const objetivoNames: Record<string, string> = {
      'perdida_grasa': 'Pérdida de Grasa',
      'perdida_peso': 'Pérdida de Peso',
      'ganancia_muscular': 'Ganancia Muscular',
      'salud_general': 'Salud General',
      'resistencia': 'Resistencia',
      'fuerza': 'Fuerza',
      'hipertrofia': 'Hipertrofia',
      'definicion': 'Definición',
      'rendimiento': 'Rendimiento'
    };

    const objetivoNombre = objetivoNames[firstPlan.metadata.objetivo] || firstPlan.metadata.objetivo;

    // Mapeo de nombres amigables para niveles
    const nivelNames: Record<string, string> = {
      'principiante': 'Principiante',
      'intermedio': 'Intermedio',
      'avanzado': 'Avanzado'
    };

    const nivelNombre = nivelNames[firstPlan.metadata.nivel] || firstPlan.metadata.nivel;

    const programDescription = `Programa completo de ${totalWeeks} semanas de ${objetivoNombre.toLowerCase()} para nivel ${nivelNombre.toLowerCase()}. Incluye ${totalEjercicios} ejercicios distribuidos progresivamente para maximizar resultados.`;

    programs.push({
      id: `prog-${baseSlug}`,
      slug: baseSlug,
      metadata: {
        objetivo: firstPlan.metadata.objetivo,
        nivel: firstPlan.metadata.nivel,
        duracion_total_semanas: totalWeeks,
        dias_por_semana: firstPlan.metadata.dias_por_semana,
        equipo: Array.from(equipoSet),
        tags: firstPlan.metadata.tags
      },
      semanas,
      meta: {
        title: programTitle,
        description: programDescription
      },
      stats: {
        totalEjercicios,
        duracionPromedioDia
      }
    });
  });

  return programs;
}

/**
 * Obtiene un programa completo por su slug
 */
export function getProgramBySlug(slug: string): ProgramaPlan | null {
  const programs = groupPlansIntoPrograms();
  return programs.find(prog => prog.slug === slug) || null;
}

/**
 * Obtiene programas filtrados
 */
export function filterPrograms(filters: {
  objetivo?: string;
  nivel?: string;
  duracion?: number;
}): ProgramaPlan[] {
  let programs = groupPlansIntoPrograms();

  if (filters.objetivo && filters.objetivo !== 'todos') {
    programs = programs.filter(prog => prog.metadata.objetivo === filters.objetivo);
  }

  if (filters.nivel && filters.nivel !== 'todos') {
    programs = programs.filter(prog => prog.metadata.nivel === filters.nivel);
  }

  if (filters.duracion) {
    programs = programs.filter(prog => prog.metadata.duracion_total_semanas === filters.duracion);
  }

  return programs;
}

/**
 * Obtiene programas similares
 */
export function getSimilarPrograms(currentProgram: ProgramaPlan, limit: number = 3): ProgramaPlan[] {
  const allPrograms = groupPlansIntoPrograms();
  
  return allPrograms
    .filter(prog => 
      prog.metadata.objetivo === currentProgram.metadata.objetivo &&
      prog.slug !== currentProgram.slug
    )
    .slice(0, limit);
}