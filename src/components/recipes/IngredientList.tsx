// src/components/recipes/IngredientList.tsx
import React from 'react';
import { Ingredient } from '@/types/recipe';

interface IngredientListProps {
  ingredients: Ingredient[];
}

export const IngredientList: React.FC<IngredientListProps> = ({ ingredients }) => {
  return (
    <ul className="space-y-2">
      {ingredients.map((ing, index) => (
        <li key={index} className="flex justify-between items-center p-2 border-b border-gray-100 last:border-0">
          <span className="text-gray-700">{ing.name}</span>
          <span className="font-medium text-gray-900">
            {ing.amount} {ing.unit}
          </span>
        </li>
      ))}
    </ul>
  );
};