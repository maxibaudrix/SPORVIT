// src/lib/recipeEngine/filters.ts
import { Recipe } from '@/types/recipe';
import { UserProfile } from '@/types/user';

/**
 * Filtra recetas basándose en las restricciones dietéticas del usuario.
 */
export const filterRecipesByDiet = (recipes: Recipe[], userProfile: UserProfile | null): Recipe[] => {
  if (!userProfile) return recipes;

  const { dietType, allergies } = userProfile;
  // Conversión segura de allergies (si viene como string de SQLite o array)
  const userAllergies = Array.isArray(allergies) ? allergies : (allergies ? allergies.split(',') : []);

  return recipes.filter(recipe => {
    // 1. Filtrar por alergias (búsqueda simple en ingredientes)
    const hasAllergen = recipe.ingredients.some(ing => 
      userAllergies.some(allergy => ing.name.toLowerCase().includes(allergy.toLowerCase().trim()))
    );
    if (hasAllergen) return false;

    // 2. Filtrar por tipo de dieta (Lógica simplificada)
    if (dietType === 'VEGAN' && recipe.tags.includes('Meat')) return false;
    if (dietType === 'VEGETARIAN' && recipe.tags.includes('Meat')) return false;

    return true;
  });
};