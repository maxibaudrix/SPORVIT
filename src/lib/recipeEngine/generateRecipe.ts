// src/lib/recipeEngine/generateRecipe.ts
import { PantryItem } from '@/types/pantry';
import { Recipe } from '@/types/recipe';
import { RECIPE_TEMPLATES } from './templates';

/**
 * Función principal (Mock) que simula la generación de una receta usando IA
 * basándose en los items disponibles en la despensa.
 */
export const generateRecipesFromPantry = async (pantryItems: PantryItem[]): Promise<Recipe[]> => {
  
  // Simulamos un retardo de "pensamiento" de la IA
  await new Promise(resolve => setTimeout(resolve, 1500));

  if (pantryItems.length === 0) {
    return [];
  }

  // Lógica Mock: Crear una receta usando el primer ingrediente como protagonista
  const mainItem = pantryItems[0];
  const secondaryItem = pantryItems.length > 1 ? pantryItems[1] : { name: 'Arroz', quantity: 100, unit: 'g' };
  
  // Seleccionar un template aleatorio
  const template = RECIPE_TEMPLATES[Math.floor(Math.random() * RECIPE_TEMPLATES.length)];
  const title = template.name.replace('{protein}', mainItem.name).replace('{carb}', secondaryItem.name);

  const mockRecipe: Recipe = {
    id: Math.random().toString(36).substr(2, 9),
    title: title,
    description: `Una deliciosa y rápida opción utilizando tus sobras de ${mainItem.name}.`,
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    servings: 1,
    difficulty: 'Easy',
    tags: [...template.defaultTags, 'Pantry-Based'],
    ingredients: [
      { name: mainItem.name, amount: mainItem.quantity, unit: mainItem.unit, calories: 150, protein: 20, carbs: 0, fat: 5 },
      { name: secondaryItem.name, amount: 100, unit: 'g', calories: 130, protein: 2, carbs: 28, fat: 0 },
      { name: 'Aceite de Oliva', amount: 1, unit: 'cda', calories: 120, protein: 0, carbs: 0, fat: 14 },
      { name: 'Especias Varias', amount: 1, unit: 'cdta', calories: 5, protein: 0, carbs: 1, fat: 0 },
    ],
    instructions: [
      { stepNumber: 1, description: `Prepara ${mainItem.name} cortándolo en trozos pequeños.` },
      { stepNumber: 2, description: 'Calienta el aceite en una sartén a fuego medio.' },
      { stepNumber: 3, description: `Añade ${mainItem.name} y cocina hasta que esté dorado.` },
      { stepNumber: 4, description: `Incorpora ${secondaryItem.name} y mezcla bien.` },
      { stepNumber: 5, description: 'Sazona al gusto y sirve caliente.' },
    ],
    macros: {
      calories: 405,
      protein: 22,
      carbs: 29,
      fat: 19,
    }
  };

  return [mockRecipe];
};