'use client';

import { useState, useMemo } from 'react';
import { Recipe } from '@/lib/recipeUtils';
import { RecipeCard } from './RecipeCard';
import { useRecipes } from '@/hooks/useRecipes';
import { Search, Filter, Loader2, AlertCircle } from 'lucide-react';

interface RecipeBrowserProps {
  onSelectRecipe: (recipe: Recipe) => void;
}

const CATEGORIES = [
  'Todas',
  'Desayunos',
  'Comidas',
  'Cenas',
  'Snacks',
  'Postres',
  'Batidos',
];

export const RecipeBrowser = ({ onSelectRecipe }: RecipeBrowserProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { recipes, loading, error, totalCount, search } = useRecipes();

  // Debounce search
  useMemo(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Ejecutar búsqueda cuando cambie el término o categoría
  useMemo(() => {
    if (debouncedSearch || selectedCategory !== 'Todas') {
      search(debouncedSearch, selectedCategory === 'Todas' ? '' : selectedCategory);
    }
  }, [debouncedSearch, selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
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

        {/* Filtros de categoría */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Filter className="w-5 h-5 text-slate-400 flex-shrink-0" />
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                ${
                  selectedCategory === category
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-slate-900/50 border border-slate-800 text-slate-400 hover:border-emerald-500/50 hover:text-emerald-400'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Contador de resultados */}
        {(searchTerm || selectedCategory !== 'Todas') && !loading && !error && (
          <div className="text-sm text-slate-400">
            {recipes.length === 0 ? (
              'No se encontraron recetas'
            ) : (
              <>
                Mostrando {recipes.length} de {totalCount} recetas
                {totalCount > recipes.length && (
                  <span className="text-slate-500 ml-1">
                    (limitado a 50 resultados)
                  </span>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Estado: Inicial (sin búsqueda) */}
      {!searchTerm && selectedCategory === 'Todas' && !loading && (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Busca recetas saludables
          </h3>
          <p className="text-slate-400 max-w-md">
            Usa la barra de búsqueda o selecciona una categoría para encontrar
            recetas que se ajusten a tu plan nutricional.
          </p>
        </div>
      )}

      {/* Estado: Cargando */}
      {loading && (
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Buscando recetas...</p>
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
              onClick={() => search(debouncedSearch, selectedCategory === 'Todas' ? '' : selectedCategory)}
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
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.slug}
              recipe={recipe}
              onClick={() => onSelectRecipe(recipe)}
            />
          ))}
        </div>
      )}

      {/* Estado: Sin resultados */}
      {!loading && !error && recipes.length === 0 && (searchTerm || selectedCategory !== 'Todas') && (
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No se encontraron recetas
            </h3>
            <p className="text-slate-400">
              Intenta con otros términos de búsqueda o selecciona una categoría diferente.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
