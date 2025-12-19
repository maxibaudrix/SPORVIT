// src/store/user.ts
'use client'; // NECESARIO para Zustand en Next.js

import { create } from 'zustand';
import { AuthenticatedUser } from '@/types/user'; // Asumiendo que este tipo existe

interface UserStore {
  user: AuthenticatedUser | null;
  hasCompletedOnboarding: boolean;
  
  // Acciones
  setUser: (user: AuthenticatedUser | null) => void;
  setProfileData: (profile: AuthenticatedUser['profile']) => void;
  // AÑADIDO: Acción para actualizar la data de objetivos
  setGoalsData: (goals: AuthenticatedUser['goals']) => void;
  setHasCompletedOnboarding: (status: boolean) => void;
}

/**
 * Tienda de Zustand para manejar el estado global del usuario autenticado y su perfil.
 */
export const useUserStore = create<UserStore>((set) => ({
  user: null,
  hasCompletedOnboarding: false, 
  
  // El perfil completo indica que el onboarding está hecho
  setUser: (user) => set({ user, hasCompletedOnboarding: user?.profile !== null }),
  
  setProfileData: (profile) => set((state) => {
    // Es crucial chequear si el usuario existe antes de actualizar
    if (!state.user) return state; 
    return {
      user: { ...state.user, profile },
      hasCompletedOnboarding: profile !== null,
    };
  }),

  // AÑADIDO: Implementación para actualizar la data de objetivos
  setGoalsData: (goals) => set((state) => {
    if (!state.user) return state; 
    return {
      user: { ...state.user, goals },
    };
  }),

  setHasCompletedOnboarding: (status) => set({ hasCompletedOnboarding: status }),
}));
