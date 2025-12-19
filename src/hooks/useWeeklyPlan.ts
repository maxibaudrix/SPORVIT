'use client';

import { useState, useEffect, useCallback } from 'react';
import { WeekPlan, DayPlan, DayEvent } from '@/types/calendar';
import { getWeekDays, formatDateISO, getWeekStart } from '@/lib/utils/calendar';

interface UseWeeklyPlanOptions {
  weekStartDate: Date;
  userId?: string;
}

interface UseWeeklyPlanReturn {
  weekPlan: WeekPlan | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useWeeklyPlan({ 
  weekStartDate, 
  userId 
}: UseWeeklyPlanOptions): UseWeeklyPlanReturn {
  const [weekPlan, setWeekPlan] = useState<WeekPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeeklyPlan = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const startDate = getWeekStart(weekStartDate);
      const startDateISO = formatDateISO(startDate);
      
      const response = await fetch(
        `/api/dashboard/weekly-plan?startDate=${startDateISO}`
      );

      if (!response.ok) {
        throw new Error('Error al cargar el plan semanal');
      }

      const data = await response.json();
      
      // Transform API data to WeekPlan format
      const plan: WeekPlan = transformApiDataToWeekPlan(data, startDate);
      
      setWeekPlan(plan);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      console.error('Error fetching weekly plan:', err);
    } finally {
      setIsLoading(false);
    }
  }, [weekStartDate, userId]);

  useEffect(() => {
    fetchWeeklyPlan();
  }, [fetchWeeklyPlan]);

  return {
    weekPlan,
    isLoading,
    error,
    refetch: fetchWeeklyPlan,
  };
}

/**
 * Transform API response data to WeekPlan format
 */
function transformApiDataToWeekPlan(data: any, startDate: Date): WeekPlan {
  const weekDays = getWeekDays(startDate);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);

  const days: DayPlan[] = weekDays.map((date, index) => {
    const dateISO = formatDateISO(date);
    const dayData = data.days?.[dateISO] || { workouts: [], meals: [] };
    
    const events: DayEvent[] = [
      ...transformWorkouts(dayData.workouts || []),
      ...transformMeals(dayData.meals || []),
    ];

    // Add rest event if no workouts for the day
    if (events.filter(e => e.type === 'workout').length === 0) {
      events.push(createRestEvent(date));
    }

    return {
      date,
      dayOfWeek: date.toLocaleDateString('es-ES', { weekday: 'long' }),
      events: events.sort((a, b) => {
        // Sort by startTime if available
        if (a.startTime && b.startTime) {
          return a.startTime.localeCompare(b.startTime);
        }
        // Workouts first, then meals
        if (a.type === 'workout' && b.type === 'meal') return -1;
        if (a.type === 'meal' && b.type === 'workout') return 1;
        return 0;
      }),
    };
  });

  return {
    weekNumber: data.weekNumber || 1,
    startDate,
    endDate,
    days,
  };
}

/**
 * Transform workout data from API to WorkoutEvent
 */
function transformWorkouts(workouts: any[]): DayEvent[] {
  return workouts.map((workout: any) => ({
    id: workout.id,
    userId: workout.userId,
    date: new Date(workout.date),
    type: 'workout' as const,
    workoutType: workout.workoutType,
    title: workout.title,
    description: workout.description,
    durationMinutes: workout.durationMinutes,
    estimatedCalories: workout.estimatedCalories,
    completed: workout.completed,
    completedAt: workout.completedAt ? new Date(workout.completedAt) : undefined,
    actualDurationMin: workout.actualDurationMin,
    actualCalories: workout.actualCalories,
    series: workout.series,
    repetitions: workout.repetitions,
    notes: workout.notes,
    startTime: workout.startTime,
    endTime: workout.endTime,
    createdAt: new Date(workout.createdAt),
  }));
}

/**
 * Transform meal data from API to MealEvent
 */
function transformMeals(meals: any[]): DayEvent[] {
  return meals.map((meal: any) => ({
    id: meal.id,
    userId: meal.userId,
    date: new Date(meal.date),
    type: 'meal' as const,
    mealType: meal.mealType,
    title: meal.title,
    totalCalories: meal.totalCalories,
    totalProteinG: meal.totalProteinG,
    totalCarbsG: meal.totalCarbsG,
    totalFatG: meal.totalFatG,
    notes: meal.notes,
    startTime: meal.startTime,
    endTime: meal.endTime,
    createdAt: new Date(meal.createdAt),
  }));
}

/**
 * Create a rest event for a day with no workouts
 */
function createRestEvent(date: Date): DayEvent {
  return {
    id: `rest-${formatDateISO(date)}`,
    userId: '',
    date,
    type: 'rest',
    title: 'Día de descanso',
    createdAt: new Date(),
  };
}
