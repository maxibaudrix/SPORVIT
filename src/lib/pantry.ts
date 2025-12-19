// src/lib/pantry.ts
import { PantryItem } from '@/types/pantry';

/**
 * Agrupa items de la despensa por categoría para facilitar la visualización.
 */
export const groupPantryItemsByCategory = (items: PantryItem[]): Record<string, PantryItem[]> => {
  return items.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, PantryItem[]>);
};

/**
 * Calcula calorías totales estimadas en la despensa (aproximado).
 */
export const calculateTotalPantryCalories = (items: PantryItem[]): number => {
  return items.reduce((total, item) => {
    if (item.caloriesPer100g && item.unit === 'g') {
      return total + (item.caloriesPer100g * item.quantity / 100);
    }
    return total;
  }, 0);
};