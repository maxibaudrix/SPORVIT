// types/planning.ts

/**
 * Estado de generación de una semana individual
 */
export type WeekGenerationStatus = 
  | 'pending'      // No ha comenzado
  | 'generating'   // En proceso
  | 'generated'    // Completada exitosamente
  | 'error';       // Error durante la generación

/**
 * Información de estado de una semana
 */
export interface WeekStatus {
  weekNumber: number;
  status: WeekGenerationStatus;
  generatedAt?: string;
  error?: string;
}

/**
 * Estado completo del plan de generación
 */
export interface PlanGenerationStatus {
  isComplete: boolean;
  generatedWeeks: number;
  totalWeeks: number;
  weeks: WeekStatus[];
}