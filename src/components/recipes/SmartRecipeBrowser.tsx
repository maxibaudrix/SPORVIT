'use client';

import { useState, useEffect, useMemo } from 'react';
import { Recipe } from '@/lib/recipeTypes';
import { RecipeCard } from './RecipeCard';
import { FilterDrawer } from './FilterDrawer';
import { Search, Filter, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import type { ActiveFilters, RecipeScoreResult, MealSlot } from '@/types/recipeFilters';

interface SmartRecipeBrowserProps {
  onSelectRecipe: (recipe: Recipe) => void;
  initialMealSlot?: MealSlot;
}

export const SmartRecipeBrowser = ({ onSelectRecipe, initialMealSlot }: SmartRecipeBrowserProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [recipes, setRecipes] = useState<RecipeScoreResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [appliedFilters, setAppliedFilters] = useState<{ safety: string[]; contextual: string[]; preferences: string[] }>({
    safety: [],
    contextual: [],
    preferences: [],
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Filtros activos
  const [filters, setFilters] = useState<ActiveFilters>({
    mealTiming: initialMealSlot ? { slot: initialMealSlot, autoDetected: false } : undefined,
  });

  // Estado del drawer de filtros
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Ejecutar búsqueda cuando cambie el término o los filtros
  useEffect(() => {
    if (debouncedSearch || filters.mealTiming || filters.nutritionalGoal || filters.calorieRange) {
      searchRecipes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filters]);

  const searchRecipes = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/recipes/search-smart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: debouncedSearch,
          filters,
          limit: 50,
          offset: 0,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al buscar recetas');
      }

      const data = await response.json();

      if (data.success) {
        setRecipes(data.recipes);
        setTotalCount(data.total);
        setAppliedFilters(data.appliedFilters);
        setSuggestions(data.suggestions || []);
      } else {
        throw new Error(data.error || 'Error desconocido');
      }
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar recetas');
      setRecipes([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: ActiveFilters) => {
    setFilters(newFilters);
  };

  const handleClearAllFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  // Contar filtros activos
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.mealTiming) count++;
    if (filters.nutritionalGoal) count++;
    if (filters.calorieRange) count++;
    if (filters.timeFilter && filters.timeFilter.category !== 'any') count++;
    if (filters.ingredientFilter) {
      count += filters.ingredientFilter.include.length;
      count += filters.ingredientFilter.exclude.length;
    }
    if (filters.qualityFilter && filters.qualityFilter.minScore > 0) count++;
    if (filters.macroTargets) count++;
    return count;
  }, [filters]);

  // Labels para filtros contextuales
  const getMealSlotLabel = (slot: MealSlot): string => {
    const labels: Record<MealSlot, string> = {
      breakfast: '🌅 Desayuno',
      lunch: '🍽️ Comida',
      dinner: '🌙 Cena',
      snack: '🍪 Snack',
      snack_1: '🍪 Snack 1',
      snack_2: '🍪 Snack 2',
      pre_workout: '💪 Pre-entreno',
      post_workout: '⚡ Post-entreno',
    };
    return labels[slot];
  };

  const getGoalLabel = (goal: string): string => {
    const labels: Record<string, string> = {
      cut: '🔥 Déficit',
      maintenance: '⚖️ Mantenimiento',
      bulk: '📈 Superávit',
    };
    return labels[goal] || goal;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header con búsqueda */}
      <div className="mb-6 space-y-4">
        {/* Barra de búsqueda */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar recetas por nombre o ingrediente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Filtros contextuales pre-aplicados */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setShowFilterDrawer(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-sm font-medium whitespace-nowrap transition-all shadow-lg shadow-emerald-500/30"
          >
            <Filter className="w-4 h-4" />
            Filtros
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 bg-white text-emerald-600 rounded-full text-xs font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Chips de filtros activos */}
          {filters.mealTiming && (
            <div className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-full text-sm font-medium whitespace-nowrap">
              {getMealSlotLabel(filters.mealTiming.slot)}
            </div>
          )}

          {filters.nutritionalGoal && (
            <div className="px-4 py-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-full text-sm font-medium whitespace-nowrap">
              {getGoalLabel(filters.nutritionalGoal.goal)}
            </div>
          )}

          {filters.calorieRange && (
            <div className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-full text-sm font-medium whitespace-nowrap">
              {filters.calorieRange.min}-{filters.calorieRange.max} kcal
            </div>
          )}

          {activeFilterCount > 0 && (
            <button
              onClick={handleClearAllFilters}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full text-sm font-medium whitespace-nowrap transition-all"
            >
              Limpiar todo ×
            </button>
          )}
        </div>

        {/* Contador de resultados y filtros aplicados */}
        {(searchTerm || activeFilterCount > 0) && !loading && !error && (
          <div className="space-y-2">
            <div className="text-sm text-slate-400">
              {recipes.length === 0 ? (
                'No se encontraron recetas'
              ) : (
                <>
                  Mostrando {recipes.length} recetas
                  {totalCount > recipes.length && (
                    <span className="text-slate-500 ml-1">
                      (limitado a 50 resultados)
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Mostrar filtros aplicados */}
            {(appliedFilters.safety.length > 0 || appliedFilters.contextual.length > 0 || appliedFilters.preferences.length > 0) && (
              <div className="space-y-1">
                {appliedFilters.safety.length > 0 && (
                  <div className="text-xs text-green-400">
                    🛡️ Filtros de seguridad: {appliedFilters.safety.join(', ')}
                  </div>
                )}
                {appliedFilters.contextual.length > 0 && (
                  <div className="text-xs text-blue-400">
                    🎯 Filtros contextuales: {appliedFilters.contextual.join(', ')}
                  </div>
                )}
                {appliedFilters.preferences.length > 0 && (
                  <div className="text-xs text-purple-400">
                    ⚙️ Preferencias: {appliedFilters.preferences.join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Estado: Inicial (sin búsqueda) */}
      {!searchTerm && activeFilterCount === 0 && !loading && (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Búsqueda Inteligente de Recetas
          </h3>
          <p className="text-slate-400 max-w-md">
            Usa la barra de búsqueda o los filtros para encontrar recetas
            personalizadas según tu objetivo nutricional y preferencias.
          </p>
        </div>
      )}

      {/* Estado: Cargando */}
      {loading && (
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Analizando recetas...</p>
          </div>
        </div>
      )}

      {/* Estado: Error */}
      {error && !loading && (
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Error al cargar recetas
            </h3>
            <p className="text-slate-400 mb-4">{error}</p>
            <button
              onClick={() => searchRecipes()}
              className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {/* Grid de recetas */}
      {!loading && !error && recipes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
          {recipes.map((result) => (
            <div key={result.recipe.slug} className="relative">
              {/* Badge de scoring */}
              {result.label && (
                <div className="absolute top-2 left-2 z-10 px-3 py-1 bg-black/80 backdrop-blur-sm rounded-full border border-white/20">
                  <span className="text-xs font-bold text-white">{result.label}</span>
                </div>
              )}
              <RecipeCard
                recipe={result.recipe}
                onClick={() => onSelectRecipe(result.recipe)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Estado: Sin resultados */}
      {!loading && !error && recipes.length === 0 && (searchTerm || activeFilterCount > 0) && (
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No se encontraron recetas
            </h3>
            {suggestions.length > 0 ? (
              <div className="space-y-2">
                <p className="text-slate-400 mb-4">Intenta:</p>
                <ul className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-emerald-400">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-slate-400">
                Intenta con otros términos de búsqueda o ajusta los filtros.
              </p>
            )}
            <button
              onClick={handleClearAllFilters}
              className="mt-4 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      )}

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={showFilterDrawer}
        onClose={() => setShowFilterDrawer(false)}
        filters={filters}
        onChange={handleFiltersChange}
        resultCount={recipes.length}
      />
    </div>
  );
};
