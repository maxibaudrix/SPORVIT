// src/types/pantry.d.ts

export interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: 'Protein' | 'Carb' | 'Fat' | 'Vegetable' | 'Fruit' | 'Dairy' | 'Spice' | 'Other';
  expiryDate?: string; // ISO Date string
  caloriesPer100g?: number;
}