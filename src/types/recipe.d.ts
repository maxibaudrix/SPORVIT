// src/types/recipe.d.ts

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface InstructionStep {
  stepNumber: number;
  description: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  
  ingredients: Ingredient[];
  instructions: InstructionStep[];
  
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  
  tags: string[];
}