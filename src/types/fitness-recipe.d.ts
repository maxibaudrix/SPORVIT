// src/types/fitness-recipe.d.ts
// Tipos para recetas fitness siguiendo el formato Schema.org

export interface FitnessRecipeAuthor {
  '@type': 'Organization' | 'Person';
  name: string;
}

export interface FitnessRecipeImage {
  '@type': 'ImageObject';
  url: string;
  width: number;
  height: number;
}

export interface FitnessRecipeRating {
  '@type': 'AggregateRating';
  ratingValue: string;
  reviewCount: string;
}

export interface FitnessRecipeNutrition {
  '@type': 'NutritionInformation';
  calories: string;
  proteinContent: string;
  carbohydrateContent: string;
  fiberContent: string;
  sugarContent: string;
  fatContent: string;
  saturatedFatContent: string;
  sodiumContent: string;
}

export interface FitnessRecipeStep {
  '@type': 'HowToStep';
  position: number;
  text: string;
}

export interface FitnessRecipeSEO {
  title: string;
  metaDescription: string;
  focusKeyword: string;
}

export type RecipeCategory = 'desayuno' | 'almuerzo' | 'cena' | 'snack' | 'pre-entreno' | 'post-entreno';
export type RecipeDifficulty = 'fácil' | 'media' | 'difícil';
export type DietType =
  | 'https://schema.org/VegetarianDiet'
  | 'https://schema.org/VeganDiet'
  | 'https://schema.org/HighProteinDiet'
  | 'https://schema.org/LowCalorieDiet'
  | 'https://schema.org/LowFatDiet'
  | 'https://schema.org/LowLactoseDiet'
  | 'https://schema.org/GlutenFreeDiet'
  | 'https://schema.org/KetogenicDiet';

export interface FitnessRecipe {
  '@context': 'https://schema.org';
  '@type': 'Recipe';
  id: string;
  name: string;
  category: RecipeCategory;
  difficulty: RecipeDifficulty;
  prepTime: string; // ISO 8601 duration (e.g., "PT5M")
  cookTime: string; // ISO 8601 duration (e.g., "PT5M")
  totalTime: string; // ISO 8601 duration (e.g., "PT10M")
  recipeYield: string;
  description: string;
  keywords: string;
  author: FitnessRecipeAuthor;
  image: FitnessRecipeImage;
  aggregateRating?: FitnessRecipeRating;
  nutrition: FitnessRecipeNutrition;
  recipeIngredient: string[];
  recipeInstructions: FitnessRecipeStep[];
  suitableForDiet: DietType[];
  recipeCuisine: string;
  recipeCategory: string;
  tags: string[];
  seo: FitnessRecipeSEO;
}

export interface FitnessRecipeCollection {
  $schema: string;
  version: string;
  lastUpdated: string;
  language: string;
  recipes: FitnessRecipe[];
}

// Tipos para el formulario de generación
export interface FitnessGoals {
  objetivo: 'perder_grasa' | 'ganar_musculo' | 'mantener' | 'rendimiento';
  restricciones_dieteticas?: string[];
  alergias?: string[];
  calorias_objetivo?: number;
  proteina_objetivo?: number;
}

export interface RecipeGenerationRequest {
  ingredientes: string[];
  categoria: RecipeCategory;
  objetivos: FitnessGoals;
  porciones?: number;
}
