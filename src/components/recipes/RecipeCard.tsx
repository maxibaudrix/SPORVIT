// src/components/recipes/RecipeCard.tsx
import React from 'react';
import { Recipe } from '@/types/recipe';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // Asegúrate de que Card exista en UI fase 2
import { Button } from '@/components/ui/Button'; // Asegúrate de que Button exista
import { formatCalories } from '@/lib/utils/formatCalories'; // De fase 3

interface RecipeCardProps {
  recipe: Recipe;
  onSelect?: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect }) => {
  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-shadow duration-200">
      <div className="h-48 w-full bg-gray-200 rounded-t-xl flex items-center justify-center text-gray-400 overflow-hidden">
        {recipe.imageUrl ? (
            <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
        ) : (
            <span>No Image</span>
        )}
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-bold text-gray-800">{recipe.title}</CardTitle>
            <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">
                {formatCalories(recipe.macros.calories)}
            </span>
        </div>
        <CardDescription className="line-clamp-2">{recipe.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm text-gray-600">
            <span>⏱️ {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min</span>
            <span>💪 {recipe.macros.protein}g Prot</span>
            <span>🍞 {recipe.macros.carbs}g Carb</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
            {recipe.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">#{tag}</span>
            ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => onSelect?.(recipe)}>
            Ver Receta
        </Button>
      </CardFooter>
    </Card>
  );
};