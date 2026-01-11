// src/lib/recipeUtils.ts
'use server';

import fs from 'fs';
import path from 'path';
import { Recipe } from './recipeTypes';

export async function getAllRecipes(): Promise<Recipe[]> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'recipes_final_v1.3.json');
    
    if (!fs.existsSync(filePath)) {
      console.error('Archivo de recetas no encontrado en:', filePath);
      return [];
    }

    let fileContents = fs.readFileSync(filePath, 'utf8');
    fileContents = fileContents.replace(/:\s*NaN/g, ': null');
    
    const recipes: Recipe[] = JSON.parse(fileContents);
    return recipes;
  } catch (error) {
    console.error('Error al leer las recetas:', error);
    return [];
  }
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const recipes = await getAllRecipes();
  return recipes.find(recipe => recipe.slug === slug) || null;
}

export async function getRecipesByCategory(category: string): Promise<Recipe[]> {
  const recipes = await getAllRecipes();
  if (category === 'Todas') return recipes;
  
  const searchTerm = category.toLowerCase();
  const categoryMap: { [key: string]: string[] } = {
    'desayunos': ['desayuno', 'breakfast'],
    'comidas': ['almuerzo', 'comida', 'lunch'],
    'cenas': ['cena', 'dinner'],
    'snacks': ['snack', 'aperitivo'],
    'postres': ['postre', 'dessert'],
    'batidos': ['batido', 'smoothie']
  };

  return recipes.filter(recipe => {
    const recipeCat = recipe.recipeCategory.toLowerCase();
    if (categoryMap[searchTerm]) {
      return categoryMap[searchTerm].some(term => recipeCat.includes(term));
    }
    return recipeCat.includes(searchTerm);
  });
}

export async function searchRecipes(query: string): Promise<Recipe[]> {
  if (!query || query.trim() === '') return getAllRecipes();
  const recipes = await getAllRecipes();
  const s = query.toLowerCase().trim();
  return recipes.filter(r => 
    r.name.toLowerCase().includes(s) || 
    r.description.toLowerCase().includes(s) ||
    r.recipeIngredient.some(i => i.toLowerCase().includes(s))
  );
}

export async function getFeaturedRecipes(limit: number = 1): Promise<Recipe[]> {
  const recipes = await getAllRecipes();
  const quality = recipes.filter(r => r.quality.seo_ready && r.image);
  return quality.sort((a, b) => b.recipeIngredient.length - a.recipeIngredient.length).slice(0, limit);
}

export async function getRelatedRecipes(currentSlug: string, limit: number = 3): Promise<Recipe[]> {
  const all = await getAllRecipes();
  const current = all.find(r => r.slug === currentSlug);
  if (!current) return [];
  
  const others = all.filter(r => r.slug !== currentSlug);
  const sameCat = others.filter(r => r.recipeCategory === current.recipeCategory);
  
  if (sameCat.length >= limit) return sameCat.slice(0, limit);
  return [...sameCat, ...others.slice(0, limit - sameCat.length)];
}

export async function getRecipesCount(): Promise<number> {
  const recipes = await getAllRecipes();
  return recipes.length;
}