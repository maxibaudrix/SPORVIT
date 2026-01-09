// lib/recipeUtils.ts
import fs from 'fs';
import path from 'path';

export interface RecipeIngredient {
  raw: string;
  canonical: string;
  matched: boolean;
}

export interface RecipeQuality {
  seo_ready: boolean;
  nutrition_ready: boolean;
  instructions_level: string;
}

export interface NutritionInfo {
  "@type": string;
  per_serving: boolean;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
  sat_fat_g: number;
  cholesterol_mg: number;
}

export interface NutritionScore {
  general: number;
  cut: number;
  bulk: number;
  endurance: number;
}

export interface NutritionQuality {
  per_serving: boolean;
  confidence: string;
  data_source: string;
  match_type: string;
}

export interface Recipe {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  image: string;
  recipeCategory: string;
  description: string;
  summary: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  recipeYield: string;
  recipeIngredient: string[];
  recipeInstructions: string[];
  keywords: string;
  tiempo_clasificado: string;
  slug: string;
  ingredients_normalized: RecipeIngredient[];
  needs_review: boolean;
  quality: RecipeQuality;
  nutrition: NutritionInfo | null;  // Agregar
  nutrition_score?: NutritionScore;  // Agregar (opcional porque no todas las tienen)
  nutrition_alerts?: string[];  // Agregar
  nutrition_quality?: NutritionQuality;  // Agregar
}

// Función para convertir tiempo ISO8601 a minutos legibles
export function parseISODuration(duration: string): string {
  if (!duration) return 'N/A';
  
  const match = duration.match(/PT(\d+)M/);
  if (match && match[1]) {
    const minutes = parseInt(match[1]);
    if (minutes === 0) return 'Sin cocción';
    if (minutes < 60) return `${minutes} min`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) return `${hours}h`;
    return `${hours}h ${remainingMinutes}min`;
  }
  
  return duration;
}

// Función para obtener todas las recetas
export async function getAllRecipes(): Promise<Recipe[]> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'recipes_final_v1.3.json');
    
    if (!fs.existsSync(filePath)) {
      console.error('Archivo de recetas no encontrado en:', filePath);
      return [];
    }

    // Leer el archivo como texto
    let fileContents = fs.readFileSync(filePath, 'utf8');
    
    // Reemplazar NaN con null (válido en JSON)
    fileContents = fileContents.replace(/:\s*NaN/g, ': null');
    
    const recipes: Recipe[] = JSON.parse(fileContents);
    
    return recipes;
  } catch (error) {
    console.error('Error al leer las recetas:', error);
    return [];
  }
}

// Función para obtener una receta por slug
export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const recipes = await getAllRecipes();
  return recipes.find(recipe => recipe.slug === slug) || null;
}

// Función para obtener recetas filtradas por categoría
export async function getRecipesByCategory(category: string): Promise<Recipe[]> {
  const recipes = await getAllRecipes();
  
  if (category === 'Todas') {
    return recipes;
  }
  
  return recipes.filter(recipe => {
    const recipeCategory = recipe.recipeCategory.toLowerCase();
    const searchCategory = category.toLowerCase();
    
    // Mapeo de categorías para mejor coincidencia
    const categoryMap: { [key: string]: string[] } = {
      'desayunos': ['desayuno', 'breakfast'],
      'comidas': ['almuerzo', 'comida', 'lunch'],
      'cenas': ['cena', 'dinner'],
      'snacks': ['snack', 'aperitivo', 'tentempié'],
      'postres': ['postre', 'dessert'],
      'batidos': ['batido', 'smoothie', 'licuado']
    };
    
    if (categoryMap[searchCategory]) {
      return categoryMap[searchCategory].some(term => recipeCategory.includes(term));
    }
    
    return recipeCategory.includes(searchCategory);
  });
}

// Función para buscar recetas por término
export async function searchRecipes(query: string): Promise<Recipe[]> {
  if (!query || query.trim() === '') {
    return getAllRecipes();
  }
  
  const recipes = await getAllRecipes();
  const searchTerm = query.toLowerCase().trim();
  
  return recipes.filter(recipe => {
    return (
      recipe.name.toLowerCase().includes(searchTerm) ||
      recipe.description.toLowerCase().includes(searchTerm) ||
      recipe.keywords.toLowerCase().includes(searchTerm) ||
      recipe.recipeIngredient.some(ingredient => 
        ingredient.toLowerCase().includes(searchTerm)
      )
    );
  });
}

// Función para obtener recetas destacadas (recetas con mejor calidad)
export async function getFeaturedRecipes(limit: number = 1): Promise<Recipe[]> {
  const recipes = await getAllRecipes();
  
  // Filtrar recetas de alta calidad
  const qualityRecipes = recipes.filter(recipe => 
    recipe.quality.seo_ready && 
    recipe.image && 
    recipe.recipeIngredient.length > 0
  );
  
  // Ordenar por cantidad de ingredientes (recetas más completas)
  const sortedRecipes = qualityRecipes.sort((a, b) => 
    b.recipeIngredient.length - a.recipeIngredient.length
  );
  
  return sortedRecipes.slice(0, limit);
}

// Función para obtener recetas relacionadas
export async function getRelatedRecipes(currentSlug: string, limit: number = 3): Promise<Recipe[]> {
  const currentRecipe = await getRecipeBySlug(currentSlug);
  if (!currentRecipe) return [];
  
  const allRecipes = await getAllRecipes();
  
  // Filtrar la receta actual
  const otherRecipes = allRecipes.filter(recipe => recipe.slug !== currentSlug);
  
  // Buscar recetas de la misma categoría
  const sameCategory = otherRecipes.filter(recipe => 
    recipe.recipeCategory === currentRecipe.recipeCategory
  );
  
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }
  
  // Si no hay suficientes de la misma categoría, completar con otras
  return [...sameCategory, ...otherRecipes.slice(0, limit - sameCategory.length)];
}

// Función para obtener el conteo total de recetas
export async function getRecipesCount(): Promise<number> {
  const recipes = await getAllRecipes();
  return recipes.length;
}

// Función para mapear categorías del JSON a categorías de la UI
export function mapCategoryToUI(category: string): string {
  const lowerCategory = category.toLowerCase();
  
  if (lowerCategory.includes('desayuno') || lowerCategory.includes('breakfast')) {
    return 'Desayunos';
  }
  if (lowerCategory.includes('almuerzo') || lowerCategory.includes('comida') || lowerCategory.includes('lunch')) {
    return 'Comidas';
  }
  if (lowerCategory.includes('cena') || lowerCategory.includes('dinner')) {
    return 'Cenas';
  }
  if (lowerCategory.includes('snack') || lowerCategory.includes('aperitivo')) {
    return 'Snacks';
  }
  if (lowerCategory.includes('postre') || lowerCategory.includes('dessert')) {
    return 'Postres';
  }
  if (lowerCategory.includes('batido') || lowerCategory.includes('smoothie')) {
    return 'Batidos';
  }
  
  return 'Otras';
}