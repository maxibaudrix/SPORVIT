// src/hooks/useCalendarState.ts
'use client';

import { create } from 'zustand';
import { getCurrentWeekInfo, getCurrentWeekDates } from '@/lib/calendar';

interface CalendarState {
  currentWeek: number;
  currentYear: number;
  currentMonth: number;
  selectedDate: Date | null;
  
  // Actions
  setSelectedDate: (date: Date | null) => void;
  goToNextWeek: () => void;
  goToPreviousWeek: () => void;
  goToToday: () => void;
  goToSpecificWeek: (weekNumber: number, year: number) => void;
  
  // Getters
  getCurrentDate: () => Date;
  getWeekDates: () => Date[];
}

export const useCalendarState = create<CalendarState>((set, get) => {
  // INICIALIZAR desde localStorage si existe un plan
  const initializeFromPlan = () => {
    if (typeof window === 'undefined') {
      const now = getCurrentWeekInfo();
      return {
        currentWeek: now.weekNumber,
        currentYear: now.year,
        currentMonth: now.month,
      };
    }

    try {
      // Buscar la fecha de inicio del plan en localStorage
      const onboardingData = localStorage.getItem('onboarding-storage');
      if (onboardingData) {
        const parsed = JSON.parse(onboardingData);
        const startDate = parsed?.state?.startDate;
        
        if (startDate) {
          const planStartDate = new Date(startDate);
          const weekInfo = getCurrentWeekInfo(planStartDate);
          
          console.log('📅 [CalendarState] Inicializando desde plan:', {
            startDate,
            weekNumber: weekInfo.weekNumber,
            year: weekInfo.year,
          });
          
          return {
            currentWeek: weekInfo.weekNumber,
            currentYear: weekInfo.year,
            currentMonth: planStartDate.getMonth() + 1,
          };
        }
      }
    } catch (error) {
      console.error('Error inicializando calendario:', error);
    }

    // Fallback: semana actual
    const now = getCurrentWeekInfo();
    return {
      currentWeek: now.weekNumber,
      currentYear: now.year,
      currentMonth: now.month,
    };
  };

  const initial = initializeFromPlan();

  return {
    ...initial,
    selectedDate: null,

    setSelectedDate: (date) => set({ selectedDate: date }),

    goToNextWeek: () => {
      const { currentWeek, currentYear } = get();
      const nextWeek = currentWeek + 1;
      
      // Si pasamos la semana 52/53, ir al año siguiente
      if (nextWeek > 52) {
        set({ 
          currentWeek: 1, 
          currentYear: currentYear + 1,
          currentMonth: 1 
        });
      } else {
        const date = get().getCurrentDate();
        date.setDate(date.getDate() + 7);
        set({ 
          currentWeek: nextWeek,
          currentMonth: date.getMonth() + 1
        });
      }
    },

    goToPreviousWeek: () => {
      const { currentWeek, currentYear } = get();
      const prevWeek = currentWeek - 1;
      
      // Si bajamos de semana 1, ir al año anterior
      if (prevWeek < 1) {
        set({ 
          currentWeek: 52, 
          currentYear: currentYear - 1,
          currentMonth: 12
        });
      } else {
        const date = get().getCurrentDate();
        date.setDate(date.getDate() - 7);
        set({ 
          currentWeek: prevWeek,
          currentMonth: date.getMonth() + 1
        });
      }
    },

    goToToday: () => {
      const now = getCurrentWeekInfo();
      set({
        currentWeek: now.weekNumber,
        currentYear: now.year,
        currentMonth: now.month,
        selectedDate: new Date(),
      });
    },

    goToSpecificWeek: (weekNumber, year) => {
      const date = get().getCurrentDate();
      set({
        currentWeek: weekNumber,
        currentYear: year,
        currentMonth: date.getMonth() + 1,
      });
    },

    getCurrentDate: () => {
      const { currentWeek, currentYear } = get();
      
      // Calcular la fecha del lunes de la semana seleccionada
      const jan4 = new Date(currentYear, 0, 4);
      const jan4Day = jan4.getDay() || 7; // domingo = 7
      const weekStart = new Date(jan4);
      weekStart.setDate(jan4.getDate() - jan4Day + 1 + (currentWeek - 1) * 7);
      
      return weekStart;
    },

    getWeekDates: () => {
      return getCurrentWeekDates(get().getCurrentDate());
    },
  };
});