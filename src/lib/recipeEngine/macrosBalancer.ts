// src/lib/recipeEngine/macrosBalancer.ts
import { Recipe } from '@/types/recipe';

/**
 * Ajusta las cantidades de una receta para intentar acercarse a un objetivo de calorías.
 * Esta es una función lineal simple; en producción usaría un solver más complejo.
 */
export const balanceRecipeMacros = (recipe: Recipe, targetCalories: number): Recipe => {
  const currentCalories = recipe.macros.calories;
  
  if (currentCalories === 0) return recipe;

  const ratio = targetCalories / currentCalories;

  // Clona y ajusta
  const adjustedRecipe = { ...recipe };
  
  adjustedRecipe.ingredients = recipe.ingredients.map(ing => ({
    ...ing,
    amount: Number((ing.amount * ratio).toFixed(1)), // Redondear a 1 decimal
    calories: ing.calories ? Math.round(ing.calories * ratio) : undefined,
    protein: ing.protein ? Math.round(ing.protein * ratio) : undefined,
    carbs: ing.carbs ? Math.round(ing.carbs * ratio) : undefined,
    fat: ing.fat ? Math.round(ing.fat * ratio) : undefined,
  }));

  adjustedRecipe.macros = {
    calories: Math.round(recipe.macros.calories * ratio),
    protein: Math.round(recipe.macros.protein * ratio),
    carbs: Math.round(recipe.macros.carbs * ratio),
    fat: Math.round(recipe.macros.fat * ratio),
  };

  return adjustedRecipe;
};