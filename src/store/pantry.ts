// src/store/pantry.ts
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PantryItem } from '@/types/pantry';

interface PantryStore {
  items: PantryItem[];
  isLoading: boolean;
  
  addItem: (item: Omit<PantryItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  setItems: (items: PantryItem[]) => void;
}

export const usePantryStore = create<PantryStore>()(
  persist(
    (set) => ({
      items: [],
      isLoading: false,

      addItem: (item) => set((state) => ({
        items: [...state.items, { ...item, id: Math.random().toString(36).substr(2, 9) }]
      })),

      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id)
      })),

      updateQuantity: (id, newQuantity) => set((state) => ({
        items: state.items.map((i) => 
          i.id === id ? { ...i, quantity: newQuantity } : i
        )
      })),

      setItems: (items) => set({ items }),
    }),
    {
      name: 'sporvit-pantry-storage', // nombre para localStorage
    }
  )
);