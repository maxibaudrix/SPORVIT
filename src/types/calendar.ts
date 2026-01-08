// Calendar Event Types
export type EventType = 'workout' | 'meal' | 'rest';

export type WorkoutType = 
  | 'running' 
  | 'cycling' 
  | 'strength' 
  | 'swimming' 
  | 'yoga' 
  | 'stretching';

export type MealType = 
  | 'meal' 
  | 'snack' 
  | 'pre_workout' 
  | 'post_workout';

// Base Event
export interface CalendarEvent {
  id: string;
  userId: string;
  date: Date;
  type: EventType;
  startTime?: string; // HH:mm format
  endTime?: string;   // HH:mm format
  createdAt: Date;
}

// Workout Event
export interface WorkoutEvent extends CalendarEvent {
  type: 'workout';
  workoutType: WorkoutType;
  title: string;
  description?: string;
  durationMinutes: number;
  estimatedCalories: number;
  completed: boolean;
  completedAt?: Date;
  actualDurationMin?: number;
  actualCalories?: number;
  // Workout specific fields
  series?: number;
  repetitions?: number;
  notes?: string;
}

// Meal Event
export interface MealEvent extends CalendarEvent {
  id: string;
  type: 'meal';
  date: Date;
  mealType: string;
  title?: string; // ⬅️ AÑADIR ESTA LÍNEA
  totalCalories: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
  totalFiberG?: number;
}

// Rest Day Event
export interface RestEvent extends CalendarEvent {
  type: 'rest';
  title: string;
}

// Union type for all events
export type DayEvent = WorkoutEvent | MealEvent | RestEvent;

// Week Plan
export interface WeekPlan {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  days: DayPlan[];
}

// Day Plan
export interface DayPlan {
  date: Date;
  dayOfWeek: string;
  events: DayEvent[];
}

// Calendar State
export interface CalendarState {
  currentWeek: number;
  currentYear: number;
  selectedDate: Date | null;
  selectedEvent: DayEvent | null;
  isLoading: boolean;
  error: string | null;
}

// Week selector info
export interface WeekInfo {
  weekNumber: number;
  year: number;
  startDate: Date;
  endDate: Date;
  label: string; // "SEMANA X · DD MMM - DD MMM"
}

// ========================================
// NEW CALENDAR SYSTEM TYPES
// ========================================

// Tipos de vista del calendario (para el nuevo sistema)
export type CalendarView = 'week' | 'month';

// Representación de un día en el calendario
export interface CalendarDate {
  date: Date;               // Fecha completa
  dayNumber: number;        // Número del día (1-31)
  dayName: string;          // Nombre abreviado (Lun, Mar, etc)
  isToday: boolean;         // True si es el día actual
  isCurrentMonth: boolean;  // True si pertenece al mes actual (útil en vista mensual)
}

// Estructura de datos para vista semanal
export interface WeekData {
  weekNumber: number;       // Número de semana del año
  year: number;
  days: CalendarDate[];     // Array de 7 días (L-D)
}

// Estructura de datos para vista mensual
export interface MonthData {
  month: number;            // 0-11 (enero-diciembre)
  year: number;
  weeks: CalendarDate[][];  // Array de semanas, cada semana es array de 7 días
}
