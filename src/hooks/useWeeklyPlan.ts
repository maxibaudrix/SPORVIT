'use client';

import { useState, useEffect, useCallback } from 'react';
import { WeekPlan, DayPlan, DayEvent } from '@/types/calendar';
import { getWeekDays, formatDateISO, getWeekStart, getISOWeek } from '@/lib/utils/calendar';

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

  // ✅ 1. Estabilizamos la fecha convirtiéndola a string (evita bucle infinito)
  const startDateISO = formatDateISO(getWeekStart(weekStartDate));

  const fetchWeeklyPlan = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Necesitamos el objeto Date original para las funciones de ayuda
      const startDateObj = getWeekStart(weekStartDate);
      
      const response = await fetch(
        `/api/dashboard/weekly-plan?startDate=${startDateISO}`
      );

      if (!response.ok) {
        throw new Error('Error al cargar el plan semanal');
      }

      const data = await response.json();
      
      // ✅ 2. Manejo de semana vacía
      if (!data.days || Object.keys(data.days).length === 0) {
        const emptyPlan = createEmptyWeekPlan(startDateObj);
        setWeekPlan(emptyPlan);
        return;
      }
      
      // ✅ 3. Definición correcta de 'plan' (Solución al error Cannot find name 'plan')
      const plan: WeekPlan = transformApiDataToWeekPlan(data, startDateObj);
      
      setWeekPlan(plan);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      console.error('Error fetching weekly plan:', err);
    } finally {
      setIsLoading(false);
    }
    // ✅ Dependencias estables: userId y el string de la fecha
  }, [startDateISO, userId, weekStartDate]); 

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
 * Crea una estructura de semana vacía (Modo Manual)
 */
function createEmptyWeekPlan(startDate: Date): WeekPlan {
  const weekDays = getWeekDays(startDate);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);

  return {
    weekNumber: getISOWeek(startDate),
    startDate,
    endDate,
    days: weekDays.map(date => ({
      date,
      dayOfWeek: date.toLocaleDateString('es-ES', { weekday: 'long' }),
      events: [] 
    }))
  };
}

/**
 * Transforma los datos crudos de la API al formato WeekPlan de la interfaz
 */
function transformApiDataToWeekPlan(data: any, startDate: Date): WeekPlan {
  const weekDays = getWeekDays(startDate);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);

  const days: DayPlan[] = weekDays.map((date) => {
    const dateISO = formatDateISO(date);
    const dayData = data.days?.[dateISO] || { workouts: [], meals: [] };
    
    const events: DayEvent[] = [
      ...transformWorkouts(dayData.workouts || []),
      ...transformMeals(dayData.meals || []),
    ];

    // Agregar evento de descanso si no hay nada planeado
    if (events.length === 0) {
      events.push(createRestEvent(date));
    }

    return {
      date,
      dayOfWeek: date.toLocaleDateString('es-ES', { weekday: 'long' }),
      events: events.sort((a, b) => {
        if (a.startTime && b.startTime) {
          return a.startTime.localeCompare(b.startTime);
        }
        if (a.type === 'workout' && b.type === 'meal') return -1;
        if (a.type === 'meal' && b.type === 'workout') return 1;
        return 0;
      }),
    };
  });

  return {
    weekNumber: data.weekNumber || getISOWeek(startDate),
    startDate,
    endDate,
    days,
  };
}

function transformWorkouts(workouts: any[]): DayEvent[] {
  return workouts.map((workout: any) => ({
    id: workout.id,
    userId: workout.userId,
    date: new Date(workout.date),
    type: 'workout',
    workoutType: workout.workoutType,
    title: workout.title,
    description: workout.description,
    durationMinutes: workout.durationMinutes,
    estimatedCalories: workout.estimatedCalories,
    completed: workout.completed,
    completedAt: workout.completedAt ? new Date(workout.completedAt) : undefined,
    actualDurationMin: workout.actualDurationMin,
    actualCalories: workout.actualCalories,
    startTime: workout.startTime,
    endTime: workout.endTime,
    createdAt: new Date(workout.createdAt),
  }));
}

function transformMeals(meals: any[]): DayEvent[] {
  return meals.map((meal: any) => ({
    id: meal.id,
    userId: meal.userId,
    date: new Date(meal.date),
    type: 'meal',
    mealType: meal.mealType,
    title: meal.title || meal.mealType,
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