'use client';

import { useState } from 'react';
import { SmartRecipeBrowser } from './SmartRecipeBrowser';
import { ManualRecipeForm, ManualRecipeData } from './ManualRecipeForm';
import type { Recipe } from '@/lib/recipeTypes';
import type { MealSlot } from '@/types/recipeFilters';

interface AddMealTabsProps {
  mealType: string;
  selectedDate: Date;
  onRecipeSelected: (recipe: Recipe) => void;
  onManualRecipeSubmit: (data: ManualRecipeData) => Promise<void>;
  onClose: () => void;
}

export const AddMealTabs = ({
  mealType,
  selectedDate,
  onRecipeSelected,
  onManualRecipeSubmit,
  onClose,
}: AddMealTabsProps) => {
  const [activeTab, setActiveTab] = useState<'search' | 'manual'>('search');

  // Mapear mealType a MealSlot para el filtro inteligente
  const getMealSlot = (type: string): MealSlot => {
    const mapping: Record<string, MealSlot> = {
      'breakfast': 'breakfast',
      'lunch': 'lunch',
      'dinner': 'dinner',
      'snack': 'snack',
      'snack_1': 'snack_1',
      'snack_2': 'snack_2',
      'pre_workout': 'pre_workout',
      'post_workout': 'post_workout',
    };
    return mapping[type] || 'lunch';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tabs Header */}
      <div className="flex-shrink-0 border-b border-slate-800">
        <div className="flex">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 px-6 py-4 font-medium text-sm transition-all ${
              activeTab === 'search'
                ? 'text-white bg-slate-800/50 border-b-2 border-emerald-500'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
            }`}
          >
            🔍 Buscar en Base de Datos
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 px-6 py-4 font-medium text-sm transition-all ${
              activeTab === 'manual'
                ? 'text-white bg-slate-800/50 border-b-2 border-emerald-500'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
            }`}
          >
            ✏️ Agregar Manual
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'search' ? (
          <div className="h-full overflow-y-auto p-6">
            <SmartRecipeBrowser
              onSelectRecipe={onRecipeSelected}
              initialMealSlot={getMealSlot(mealType)}
            />
          </div>
        ) : (
          <ManualRecipeForm
            onSubmit={onManualRecipeSubmit}
            onCancel={onClose}
            mealType={mealType}
          />
        )}
      </div>
    </div>
  );
};
