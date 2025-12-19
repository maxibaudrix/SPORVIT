// src/store/meal-plan.ts
import { create } from 'zustand';

// --- Dependencias y Tipos ---
// Usamos el import de generator solo para los tipos, no para la ejecución de la función aquí.
import type { MealPlanEntry, WeeklyStats, PlanPreferences, RecipeSummary } from '@/lib/mealPlanEngine/generator';

export type { MealPlanEntry, PlanPreferences };

// --- Funciones de Utilidad de Fecha (Para manejo de semanas dinámicas) ---

// Obtiene la fecha de inicio (Lunes) y fin (Domingo) de una semana dada su string 'YYYY-WXX'
const getWeekRangeDates = (weekString: string) => {
    // Implementación simplificada para el mock: 
    // En un entorno real, usarías una librería como 'date-fns' o 'moment'
    // para calcular la fecha real basada en el formato ISO 8601 (YYYY-WXX).
    if (weekString === '2024-W48') return { start: '2024-11-25', end: '2024-12-01', label: '25 Nov - 01 Dic 2024' };
    if (weekString === '2024-W47') return { start: '2024-11-18', end: '2024-11-24', label: '18 Nov - 24 Nov 2024' };
    if (weekString === '2024-W49') return { start: '2024-12-02', end: '2024-12-08', label: '02 Dic - 08 Dic 2024' };
    return { start: '', end: '', label: 'Semana Desconocida' };
};

// MOCK: Retorna la semana actual en formato 'YYYY-WXX' (Asumimos W48 como actual)
const getCurrentWeekString = (): string => '2024-W48';

// MOCK: Retorna la semana anterior/siguiente
const navigateWeek = (current: string, direction: 'prev' | 'next'): string => {
    if (current === '2024-W48') return direction === 'next' ? '2024-W49' : '2024-W47';
    if (current === '2024-W47') return direction === 'next' ? '2024-W48' : '2024-W46'; // Ejemplo
    if (current === '2024-W49') return direction === 'next' ? '2024-W50' : '2024-W48'; // Ejemplo
    return getCurrentWeekString();
};

// --- Tipos e Interfaz del Store ---

interface MealPlanState {
    currentWeek: string; // YYYY-WXX
    weekLabel: string; // Ej: "25 Nov - 01 Dic 2024"
    weekPlan: MealPlanEntry[];
    weeklyStats: WeeklyStats;
    isLoading: boolean;
    error: string | null;

    // Actions
    navigateWeek: (direction: 'prev' | 'next') => void;
    fetchMealPlan: (week: string) => Promise<void>;
    generateAutoPlan: (preferences: PlanPreferences) => Promise<void>;
    assignRecipe: (date: string, mealType: keyof MealPlanEntry['meals'], recipeId: string | null) => Promise<void>;
}

// --- Implementación del Store ---

export const useMealPlanStore = create<MealPlanState>((set, get) => ({
    // Estado Inicial
    currentWeek: getCurrentWeekString(),
    weekLabel: getWeekRangeDates(getCurrentWeekString()).label,
    weekPlan: [],
    weeklyStats: {
        avgCalories: 0,
        avgMacros: { protein: 0, carbs: 0, fats: 0 }
    },
    isLoading: false,
    error: null,

    // --- Actions ---

    navigateWeek: (direction) => {
        const nextWeek = navigateWeek(get().currentWeek, direction);
        set({ 
            currentWeek: nextWeek,
            weekLabel: getWeekRangeDates(nextWeek).label,
            weekPlan: [], // Limpiar plan mientras se carga el nuevo
            weeklyStats: { avgCalories: 0, avgMacros: { protein: 0, carbs: 0, fats: 0 } },
        });
        // La llamada a fetchMealPlan se hace en el useEffect de la página al cambiar currentWeek
    },

    // Carga el plan de comidas desde el backend (Sin datos fijos/mocks en el store)
    fetchMealPlan: async (week) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/meal-plan?week=${week}`);
            if (!response.ok) throw new Error('Fallo al obtener el plan semanal.');

            const data = await response.json();
            set({
                weekPlan: data.plan || [],
                weeklyStats: data.weeklyStats || { avgCalories: 0, avgMacros: { protein: 0, carbs: 0, fats: 0 } },
                // Asegurar que la etiqueta de la semana se actualice
                weekLabel: getWeekRangeDates(data.week).label
            });
        } catch (err: any) {
            console.error(err);
            set({ error: err.message || 'Error desconocido al cargar el plan.' });
        } finally {
            set({ isLoading: false });
        }
    },

    // Genera un nuevo plan automáticamente (llamando al backend)
    generateAutoPlan: async (preferences) => {
        set({ isLoading: true, error: null });
        const week = get().currentWeek;
        
        try {
            const response = await fetch(`/api/meal-plan/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ week, preferences }),
            });
            
            if (!response.ok) throw new Error('Fallo al generar el plan automático.');
            
            const data = await response.json();
            set({
                weekPlan: data.plan,
                weeklyStats: data.weeklyStats
            });
            
        } catch (err: any) {
            console.error(err);
            set({ error: err.message || 'Error al generar el plan.' });
        } finally {
            set({ isLoading: false });
        }
    },

    // Asigna o quita una receta a una comida específica
    assignRecipe: async (date, mealType, recipeId) => {
        
        try {
            const endpoint = `/api/meal-plan`; // Ambos casos van al mismo route handler
            const method = recipeId ? 'PATCH' : 'DELETE';
            const payload = recipeId 
                ? { date, mealType, recipeId } 
                : { date, mealType };
                
            const response = await fetch(endpoint, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Fallo en la sincronización con el servidor.');
            }
            
            // Re-fetch del plan para obtener la receta completa asignada y las estadísticas actualizadas.
            await get().fetchMealPlan(get().currentWeek); 

        } catch (err: any) {
            console.error(err);
            // Mostrar error al usuario
            set({ error: 'Fallo al actualizar la receta: ' + err.message }); 
        }
    }
    
}));