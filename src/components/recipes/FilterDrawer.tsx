'use client';

import { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, Coffee, Utensils, Moon, Cookie, Zap } from 'lucide-react';
import type { ActiveFilters, MealSlot, NutritionalGoal, TimeCategory } from '@/types/recipeFilters';
import { GOAL_LABELS } from '@/types/recipeFilters';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ActiveFilters;
  onChange: (filters: ActiveFilters) => void;
  userLevel?: 'basic' | 'intermediate' | 'advanced';
  tdee?: number;
  resultCount?: number;
}

const MEAL_SLOTS: Array<{ value: MealSlot; label: string; icon: React.ReactNode }> = [
  { value: 'breakfast', label: 'Desayuno', icon: <Coffee className="w-5 h-5" /> },
  { value: 'lunch', label: 'Comida', icon: <Utensils className="w-5 h-5" /> },
  { value: 'dinner', label: 'Cena', icon: <Moon className="w-5 h-5" /> },
  { value: 'snack', label: 'Snack', icon: <Cookie className="w-5 h-5" /> },
  { value: 'pre_workout', label: 'Pre-entreno', icon: <Zap className="w-5 h-5" /> },
  { value: 'post_workout', label: 'Post-entreno', icon: <Zap className="w-5 h-5" /> },
];

const GOALS: Array<{ value: NutritionalGoal; label: string }> = [
  { value: 'cut', label: 'Déficit' },
  { value: 'maintenance', label: 'Mantenimiento' },
  { value: 'bulk', label: 'Superávit' },
];

const TIME_CATEGORIES: Array<{ value: TimeCategory; label: string }> = [
  { value: 'quick', label: '< 15 min' },
  { value: 'moderate', label: '15-30 min' },
  { value: 'elaborate', label: '> 30 min' },
];

export const FilterDrawer = ({
  isOpen,
  onClose,
  filters,
  onChange,
  userLevel = 'basic',
  tdee = 2000,
  resultCount,
}: FilterDrawerProps) => {
  const [localFilters, setLocalFilters] = useState<ActiveFilters>(filters);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [newIncludeIngredient, setNewIncludeIngredient] = useState('');
  const [newExcludeIngredient, setNewExcludeIngredient] = useState('');

  // Sincronizar local filters cuando cambien los filters externos
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Lock scroll cuando esté abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleApply = () => {
    onChange(localFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: ActiveFilters = {};
    setLocalFilters(clearedFilters);
    onChange(clearedFilters);
  };

  const updateMealTiming = (slot: MealSlot) => {
    setLocalFilters(prev => ({
      ...prev,
      mealTiming: { slot, autoDetected: false },
    }));
  };

  const updateGoal = (goal: NutritionalGoal) => {
    setLocalFilters(prev => ({
      ...prev,
      nutritionalGoal: { goal, source: 'manual' },
    }));
  };

  const updateCalorieRange = (min: number, max: number) => {
    setLocalFilters(prev => ({
      ...prev,
      calorieRange: { min, max, autoCalculated: false },
    }));
  };

  const updateTimeFilter = (category: TimeCategory) => {
    setLocalFilters(prev => ({
      ...prev,
      timeFilter: { category, priority: 'medium' },
    }));
  };

  const addIncludeIngredient = () => {
    if (!newIncludeIngredient.trim()) return;

    setLocalFilters(prev => ({
      ...prev,
      ingredientFilter: {
        include: [...(prev.ingredientFilter?.include || []), newIncludeIngredient.trim()],
        exclude: prev.ingredientFilter?.exclude || [],
      },
    }));
    setNewIncludeIngredient('');
  };

  const removeIncludeIngredient = (ingredient: string) => {
    setLocalFilters(prev => ({
      ...prev,
      ingredientFilter: {
        include: (prev.ingredientFilter?.include || []).filter(i => i !== ingredient),
        exclude: prev.ingredientFilter?.exclude || [],
      },
    }));
  };

  const addExcludeIngredient = () => {
    if (!newExcludeIngredient.trim()) return;

    setLocalFilters(prev => ({
      ...prev,
      ingredientFilter: {
        include: prev.ingredientFilter?.include || [],
        exclude: [...(prev.ingredientFilter?.exclude || []), newExcludeIngredient.trim()],
      },
    }));
    setNewExcludeIngredient('');
  };

  const removeExcludeIngredient = (ingredient: string) => {
    setLocalFilters(prev => ({
      ...prev,
      ingredientFilter: {
        include: prev.ingredientFilter?.include || [],
        exclude: (prev.ingredientFilter?.exclude || []).filter(i => i !== ingredient),
      },
    }));
  };

  const updateQualityScore = (score: number) => {
    setLocalFilters(prev => ({
      ...prev,
      qualityFilter: { minScore: score, scoreType: 'goal-specific' },
    }));
  };

  if (!isOpen) return null;

  const calorieMin = localFilters.calorieRange?.min || 200;
  const calorieMax = localFilters.calorieRange?.max || 800;
  const qualityScore = localFilters.qualityFilter?.minScore || 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Ajustar Filtros</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Momento del día */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3">🍽️ Momento del día</h3>
            <div className="grid grid-cols-2 gap-2">
              {MEAL_SLOTS.map(slot => (
                <button
                  key={slot.value}
                  onClick={() => updateMealTiming(slot.value)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    localFilters.mealTiming?.slot === slot.value
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {slot.icon}
                  <span className="text-sm">{slot.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Objetivo */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3">🎯 Objetivo nutricional</h3>
            <div className="flex gap-2">
              {GOALS.map(goal => (
                <button
                  key={goal.value}
                  onClick={() => updateGoal(goal.value)}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                    localFilters.nutritionalGoal?.goal === goal.value
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {goal.label}
                </button>
              ))}
            </div>
          </div>

          {/* Calorías por ración */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3">🔥 Calorías por ración</h3>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={calorieMin}
                  onChange={(e) => updateCalorieRange(parseInt(e.target.value), calorieMax)}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={calorieMax}
                  onChange={(e) => updateCalorieRange(calorieMin, parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-2"
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white font-semibold">{calorieMin} kcal</span>
                <span className="text-slate-400">a</span>
                <span className="text-white font-semibold">{calorieMax} kcal</span>
              </div>
            </div>
          </div>

          {/* Tiempo de preparación */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3">⏱️ Tiempo de preparación</h3>
            <div className="space-y-2">
              {TIME_CATEGORIES.map(time => (
                <button
                  key={time.value}
                  onClick={() => updateTimeFilter(time.value)}
                  className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${
                    localFilters.timeFilter?.category === time.value
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {time.label}
                </button>
              ))}
              <button
                onClick={() => updateTimeFilter('any')}
                className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${
                  !localFilters.timeFilter || localFilters.timeFilter.category === 'any'
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                No importa
              </button>
            </div>
          </div>

          {/* Ingredientes */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3">🥕 Ingredientes</h3>

            {/* Incluir ingredientes */}
            <div className="mb-4">
              <label className="block text-xs text-slate-400 mb-2">Incluir</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newIncludeIngredient}
                  onChange={(e) => setNewIncludeIngredient(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addIncludeIngredient()}
                  placeholder="Ej: pollo, arroz..."
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  onClick={addIncludeIngredient}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  +
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {localFilters.ingredientFilter?.include.map(ing => (
                  <span
                    key={ing}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full text-sm"
                  >
                    {ing}
                    <button
                      onClick={() => removeIncludeIngredient(ing)}
                      className="hover:text-emerald-300 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Excluir ingredientes */}
            <div>
              <label className="block text-xs text-slate-400 mb-2">Excluir</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newExcludeIngredient}
                  onChange={(e) => setNewExcludeIngredient(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addExcludeIngredient()}
                  placeholder="Ej: tomate, cebolla..."
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  onClick={addExcludeIngredient}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  +
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {localFilters.ingredientFilter?.exclude.map(ing => (
                  <span
                    key={ing}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-400 rounded-full text-sm"
                  >
                    {ing}
                    <button
                      onClick={() => removeExcludeIngredient(ing)}
                      className="hover:text-red-300 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Puntuación mínima */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3">⭐ Calidad nutricional mínima</h3>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={qualityScore}
              onChange={(e) => updateQualityScore(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-slate-400">Score:</span>
              <span className="text-lg font-bold text-white">{qualityScore}/100</span>
            </div>
          </div>

          {/* Macros avanzados (solo para usuarios advanced) */}
          {userLevel === 'advanced' && (
            <div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <span className="text-sm font-bold text-white">
                  🔬 Filtros avanzados de macros
                </span>
                {showAdvanced ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {showAdvanced && (
                <div className="mt-4 space-y-4 p-4 bg-slate-800/30 border border-slate-700 rounded-xl">
                  <p className="text-xs text-slate-400">
                    Próximamente: Filtros precisos de proteína, carbohidratos y grasas
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-6 bg-slate-900/95 backdrop-blur-sm border-t border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={handleClear}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors"
            >
              Limpiar filtros
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
            >
              Aplicar {resultCount !== undefined && `(${resultCount})`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
