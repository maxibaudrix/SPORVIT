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
  type: 'meal';
  mealType: MealType;
  title?: string;
  totalCalories: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
  notes?: string;
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
