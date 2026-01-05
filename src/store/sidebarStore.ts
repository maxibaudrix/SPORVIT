// src/store/sidebarStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SidebarTab = 'calendar' | 'timer' | 'calculators' | 'progress' | 'tracking' | null;

interface SidebarStore {
  // Estado del sidebar
  activeTab: SidebarTab;
  isOpen: boolean;
  
  // Calculadora activa
  activeCalculator: string | null;
  
  // Favoritos y recientes
  favoriteCalculators: string[];
  recentCalculators: string[];
  
  // Actions
  setActiveTab: (tab: SidebarTab) => void;
  toggleTab: (tab: SidebarTab) => void;
  closeSidebar: () => void;
  
  // Calculator actions
  openCalculator: (calculatorId: string) => void;
  closeCalculator: () => void;
  addToRecent: (calculatorId: string) => void;
  toggleFavorite: (calculatorId: string) => void;
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set, get) => ({
      // Initial state
      activeTab: null,
      isOpen: false,
      activeCalculator: null,
      favoriteCalculators: [],
      recentCalculators: [],

      // Set active tab
      setActiveTab: (tab) => {
        const currentTab = get().activeTab;
        set({
          activeTab: tab,
          isOpen: tab !== null,
          // Cerrar calculadora si cambiamos de tab
          activeCalculator: tab !== 'calculators' ? null : get().activeCalculator,
        });
      },

      // Toggle tab (click en tab activo = cerrar)
      toggleTab: (tab) => {
        const currentTab = get().activeTab;
        if (currentTab === tab) {
          set({
            activeTab: null,
            isOpen: false,
            activeCalculator: null,
          });
        } else {
          set({
            activeTab: tab,
            isOpen: true,
            activeCalculator: tab !== 'calculators' ? null : get().activeCalculator,
          });
        }
      },

      // Close sidebar
      closeSidebar: () => {
        set({
          activeTab: null,
          isOpen: false,
          activeCalculator: null,
        });
      },

      // Open calculator
      openCalculator: (calculatorId) => {
        set({
          activeCalculator: calculatorId,
          activeTab: 'calculators',
          isOpen: true,
        });
        get().addToRecent(calculatorId);
      },

      // Close calculator
      closeCalculator: () => {
        set({ activeCalculator: null });
      },

      // Add to recent (max 5)
      addToRecent: (calculatorId) => {
        const recent = get().recentCalculators;
        const filtered = recent.filter((id) => id !== calculatorId);
        set({
          recentCalculators: [calculatorId, ...filtered].slice(0, 5),
        });
      },

      // Toggle favorite
      toggleFavorite: (calculatorId) => {
        const favorites = get().favoriteCalculators;
        if (favorites.includes(calculatorId)) {
          set({
            favoriteCalculators: favorites.filter((id) => id !== calculatorId),
          });
        } else {
          set({
            favoriteCalculators: [...favorites, calculatorId],
          });
        }
      },
    }),
    {
      name: 'sidebar-storage',
      partialize: (state) => ({
        favoriteCalculators: state.favoriteCalculators,
        recentCalculators: state.recentCalculators,
      }),
    }
  )
);