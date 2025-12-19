// src/app/recipes/from-pantry/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import AppShell from '@/components/shared/layout/AppShell';
import { usePantryStore } from '@/store/pantry';
import { Recipe } from '@/types/recipe';
import { generateRecipesFromPantry } from '@/lib/recipeEngine/generateRecipe';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { Button } from '@/components/ui/Button';

export default function RecipeGeneratorPage() {
  const { items } = usePantryStore();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
        // En una app real, aquí llamaríamos a /api/recipes/generate
        const generated = await generateRecipesFromPantry(items);
        setRecipes(generated);
    } catch (error) {
        console.error("Error generating recipes", error);
    } finally {
        setLoading(false);
    }
  };

  // Generar automáticamente al entrar si hay items
  useEffect(() => {
    if (items.length > 0 && recipes.length === 0) {
        handleGenerate();
    }
  }, []);

  return (
    <AppShell title="Generador de Recetas">
      <div className="max-w-6xl mx-auto p-4">
        
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg text-gray-600">Basado en tus {items.length} ingredientes de la despensa</h2>
            <Button onClick={handleGenerate} disabled={loading}>
                {loading ? 'Cocinando ideas...' : 'Regenerar'}
            </Button>
        </div>

        {loading ? (
            <div className="flex h-64 items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map(recipe => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
                {recipes.length === 0 && !loading && (
                    <p className="col-span-full text-center text-gray-500">No pudimos generar recetas. Intenta añadir más ingredientes variados.</p>
                )}
            </div>
        )}
      </div>
    </AppShell>
  );
}