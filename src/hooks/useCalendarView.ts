import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CalendarView } from '@/types/calendar';

interface CalendarViewStore {
  view: CalendarView;
  setView: (view: CalendarView) => void;
  toggleView: () => void;
}

export const useCalendarView = create<CalendarViewStore>()(
  persist(
    (set) => ({
      view: 'week',
      setView: (view) => set({ view }),
      toggleView: () =>
        set((state) => ({
          view: state.view === 'week' ? 'month' : 'week',
        })),
    }),
    {
      name: 'calendar-view-storage',
    }
  )
);
