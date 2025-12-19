// src/store/diary.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// --- Interfaces de Datos ---

interface DiaryMeal {
  id: string;
  productId: string;
  productName: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  servingSize: number;
  calories: number;
  macros: { protein: number; carbs: number; fats: number };
  time: string;
}

interface DiaryExercise {
  id: string;
  name: string;
  sets: string;
  completed: boolean;
}

// --- Estado General y Acciones ---

interface DiaryState {
  selectedDate: string; // YYYY-MM-DD
  meals: DiaryMeal[];
  workout: {
    scheduled: boolean;
    exercises: DiaryExercise[];
  };
  waterIntake: number; // número de vasos

  // Actions
  setDate: (date: string) => void;
  addMeal: (meal: DiaryMeal) => void;
  removeMeal: (mealId: string) => void;
  toggleExercise: (exerciseId: string) => void;
  incrementWater: () => void;
  decrementWater: () => void;
  loadDayData: (date: string) => Promise<void>;

  // Computed/Selectors
  getTotalCalories: () => number;
  getTotalMacros: () => { protein: number; carbs: number; fats: number };
}

// --- Implementación del Store ---

export const useDiaryStore = create<DiaryState>()(
  // Utilizamos persist para que al menos el consumo de agua se mantenga,
  // aunque la carga de datos es principalmente desde el backend.
  persist(
    (set, get) => ({
      // Estado Inicial
      selectedDate: new Date().toISOString().split('T')[0], // Fecha de hoy por defecto
      meals: [],
      workout: { scheduled: false, exercises: [] },
      waterIntake: 0,

      // --- Actions ---

      setDate: (date) => set({ selectedDate: date }),

      addMeal: (meal) => set((state) => ({
        meals: [...state.meals, meal]
      })),

      removeMeal: (mealId) => set((state) => ({
        meals: state.meals.filter(m => m.id !== mealId)
      })),

      toggleExercise: (exerciseId) => set((state) => ({
        workout: {
          ...state.workout,
          exercises: state.workout.exercises.map(ex =>
            ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
          )
        }
      })),

      incrementWater: () => set((state) => ({
        // Límite máximo de 15 vasos (ejemplo)
        waterIntake: Math.min(state.waterIntake + 1, 15)
      })),

      decrementWater: () => set((state) => ({
        waterIntake: Math.max(state.waterIntake - 1, 0)
      })),

      // Carga los datos del día desde el backend
      loadDayData: async (date) => {
        try {
            const response = await fetch(`/api/diary?date=${date}`);
            
            if (!response.ok) {
                // Si la respuesta no es OK, podríamos limpiar el estado o lanzar un error.
                console.error("Error al cargar datos del diario:", response.statusText);
                set({ meals: [], workout: { scheduled: false, exercises: [] }, waterIntake: 0 });
                return;
            }
            
            const data = await response.json();
            
            // Asumiendo que data tiene la estructura { meals, workout, waterIntake }
            set({
              meals: data.meals || [],
              workout: data.workout || { scheduled: false, exercises: [] },
              waterIntake: data.waterIntake || 0
            });
        } catch (error) {
            console.error("Fallo en la conexión al cargar datos del diario:", error);
            // Si la conexión falla, se mantiene el estado actual o se limpia.
            set({ meals: [], workout: { scheduled: false, exercises: [] }, waterIntake: 0 });
        }
      },

      // --- Computed/Selectors ---

      getTotalCalories: () => {
        const state = get();
        return state.meals.reduce((sum, meal) => sum + meal.calories, 0);
      },

      getTotalMacros: () => {
        const state = get();
        return state.meals.reduce(
          (totals, meal) => ({
            protein: totals.protein + meal.macros.protein,
            carbs: totals.carbs + meal.macros.carbs,
            fats: totals.fats + meal.macros.fats
          }),
          { protein: 0, carbs: 0, fats: 0 } // Inicializa los totales
        );
      }
    }),
    {
      name: 'diary-storage',
      // Parcializa el estado: solo persistimos el consumo de agua y la fecha.
      // Los datos sensibles o grandes (meals, workout) se cargan del backend.
      partialize: (state) => ({ 
        waterIntake: state.waterIntake,
        selectedDate: state.selectedDate
      })
    }
  )
);