// src/hooks/useCalendarState.ts
'use client';

import { create } from 'zustand';
import { getCurrentWeekInfo, getWeekInfoForDate, getWeekDays } from '@/lib/utils/calendar';

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
  // 🚨 HARDCODED TEMPORALMENTE - Fecha del plan generado
  const planStartDate = new Date('2025-12-29');
  const initialWeekInfo = getWeekInfoForDate(planStartDate);
  
  console.log('🚨 [CalendarState] Inicializado con fecha hardcodeada:', {
    startDate: '2025-12-29',
    weekNumber: initialWeekInfo.weekNumber,
    year: initialWeekInfo.year,
  });

  return {
    currentWeek: initialWeekInfo.weekNumber,
    currentYear: initialWeekInfo.year,
    currentMonth: 12,
    selectedDate: null,

    setSelectedDate: (date) => set({ selectedDate: date }),

    goToNextWeek: () => {
      const { currentWeek, currentYear } = get();
      const nextWeek = currentWeek + 1;
      
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
      const today = new Date();
      set({
        currentWeek: now.weekNumber,
        currentYear: now.year,
        currentMonth: today.getMonth() + 1,  // ✅ Calcular desde Date
        selectedDate: today,
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
      const jan4Day = jan4.getDay() || 7;
      const weekStart = new Date(jan4);
      weekStart.setDate(jan4.getDate() - jan4Day + 1 + (currentWeek - 1) * 7);
      
      return weekStart;
    },

    getWeekDates: () => {
      return getWeekDays(get().getCurrentDate());
    },
  };
});