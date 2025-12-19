'use client';

import { useState, useCallback } from 'react';
import { CalendarState, DayEvent } from '@/types/calendar';
import { 
  getCurrentWeekInfo, 
  getNextWeek, 
  getPreviousWeek,
  getWeekInfoForDate 
} from '@/lib/utils/calendar';

export function useCalendarState() {
  const [state, setState] = useState<CalendarState>(() => {
    const currentWeekInfo = getCurrentWeekInfo();
    return {
      currentWeek: currentWeekInfo.weekNumber,
      currentYear: currentWeekInfo.year,
      selectedDate: null,
      selectedEvent: null,
      isLoading: false,
      error: null,
    };
  });

  // Current week start date
  const getCurrentDate = useCallback(() => {
    return getCurrentWeekInfo().startDate;
  }, []);

  // Navigate to next week
  const goToNextWeek = useCallback(() => {
    setState(prev => {
      const currentDate = getCurrentDate();
      const nextWeekDate = getNextWeek(currentDate);
      const nextWeekInfo = getWeekInfoForDate(nextWeekDate);
      
      return {
        ...prev,
        currentWeek: nextWeekInfo.weekNumber,
        currentYear: nextWeekInfo.year,
      };
    });
  }, [getCurrentDate]);

  // Navigate to previous week
  const goToPreviousWeek = useCallback(() => {
    setState(prev => {
      const currentDate = getCurrentDate();
      const prevWeekDate = getPreviousWeek(currentDate);
      const prevWeekInfo = getWeekInfoForDate(prevWeekDate);
      
      return {
        ...prev,
        currentWeek: prevWeekInfo.weekNumber,
        currentYear: prevWeekInfo.year,
      };
    });
  }, [getCurrentDate]);

  // Go to specific week
  const goToWeek = useCallback((date: Date) => {
    const weekInfo = getWeekInfoForDate(date);
    setState(prev => ({
      ...prev,
      currentWeek: weekInfo.weekNumber,
      currentYear: weekInfo.year,
    }));
  }, []);

  // Go to today's week
  const goToToday = useCallback(() => {
    const todayInfo = getCurrentWeekInfo();
    setState(prev => ({
      ...prev,
      currentWeek: todayInfo.weekNumber,
      currentYear: todayInfo.year,
      selectedDate: new Date(),
    }));
  }, []);

  // Select a date
  const selectDate = useCallback((date: Date | null) => {
    setState(prev => ({
      ...prev,
      selectedDate: date,
      selectedEvent: null, // Clear event when selecting new date
    }));
  }, []);

  // Select an event
  const selectEvent = useCallback((event: DayEvent | null) => {
    setState(prev => ({
      ...prev,
      selectedEvent: event,
      selectedDate: event ? event.date : prev.selectedDate,
    }));
  }, []);

  // Clear selection
  const clearSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedDate: null,
      selectedEvent: null,
    }));
  }, []);

  // Set loading state
  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  // Set error state
  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  return {
    state,
    getCurrentDate,
    goToNextWeek,
    goToPreviousWeek,
    goToWeek,
    goToToday,
    selectDate,
    selectEvent,
    clearSelection,
    setLoading,
    setError,
  };
}
