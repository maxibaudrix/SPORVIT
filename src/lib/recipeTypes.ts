// src/lib/recipeTypes.ts
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
  nutrition: NutritionInfo | null;
  nutrition_score?: NutritionScore;
  nutrition_alerts?: string[];
  nutrition_quality?: NutritionQuality;
}