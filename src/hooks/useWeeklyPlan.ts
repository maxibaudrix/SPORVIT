'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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

  // ✅ 1. Estabilizamos la fecha: obtenemos el inicio de semana y lo pasamos a String.
  // Al usar el tiempo (getTime) como dependencia del useMemo, evitamos que React
  // crea que la fecha es "nueva" en cada renderizado de objeto.
  const startDateISO = useMemo(() => {
    const start = getWeekStart(weekStartDate);
    return formatDateISO(start);
  }, [weekStartDate.getTime()]);

  const fetchWeeklyPlan = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Usamos una fecha base estable para las funciones de ayuda
      const startDateObj = getWeekStart(new Date(startDateISO + 'T12:00:00'));
      
      const response = await fetch(
        `/api/dashboard/weekly-plan?startDate=${startDateISO}`
      );

      if (!response.ok) {
        throw new Error('Error al cargar el plan semanal');
      }

      const data = await response.json();
      
      // ✅ 2. Definimos el plan final (vacio o transformado)
      let finalPlan: WeekPlan;

      if (!data.days || Object.keys(data.days).length === 0) {
        finalPlan = createEmptyWeekPlan(startDateObj);
      } else {
        // ✅ 3. Aquí es donde se define 'plan' correctamente
        finalPlan = transformApiDataToWeekPlan(data, startDateObj);
      }
      
      setWeekPlan(finalPlan);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      console.error('[useWeeklyPlan] Error:', err);
    } finally {
      setIsLoading(false);
    }
    // ✅ Dependencias estables: Evitamos que cambie la referencia de la función fetch
  }, [startDateISO, userId]); 

  // ✅ 4. El efecto solo se dispara si la función memorizada cambia
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
 * Crea una estructura de semana vacía para días sin plan generado
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
 * Transforma los datos de la API al formato que requiere el Calendario/Dashboard
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

    // Si no hay entrenos ni comidas, agregamos un evento visual de descanso
    if (events.length === 0) {
      events.push(createRestEvent(date));
    }

    return {
      date,
      dayOfWeek: date.toLocaleDateString('es-ES', { weekday: 'long' }),
      events: events.sort((a, b) => (a.startTime || '').localeCompare(b.startTime || '')),
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
    type: 'workout' as const,
    workoutType: workout.workoutType,
    title: workout.title,
    description: workout.description,
    durationMinutes: workout.durationMinutes,
    estimatedCalories: workout.estimatedCalories,
    completed: workout.completed,
    completedAt: workout.completedAt ? new Date(workout.completedAt) : undefined,
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
    type: 'meal' as const,
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