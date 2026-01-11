'use client';

import { useState, useEffect } from 'react';
import { Recipe } from '@/lib/recipeTypes';

interface UseRecipesOptions {
  query?: string;
  category?: string;
  autoFetch?: boolean;
}

interface UseRecipesReturn {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  search: (query: string, category?: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useRecipes(options: UseRecipesOptions = {}): UseRecipesReturn {
  const { query = '', category = '', autoFetch = false } = options;

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchRecipes = async (searchQuery: string = query, searchCategory: string = category) => {
    if (!searchQuery && !searchCategory) {
      setRecipes([]);
      setTotalCount(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (searchCategory) params.append('category', searchCategory);

      const response = await fetch(`/api/recipes/search?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Error al buscar recetas');
      }

      const data = await response.json();

      if (data.success) {
        setRecipes(data.recipes);
        setTotalCount(data.total);
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

  const search = async (searchQuery: string, searchCategory?: string) => {
    await fetchRecipes(searchQuery, searchCategory || category);
  };

  const refresh = async () => {
    await fetchRecipes(query, category);
  };

  // Auto-fetch si está habilitado y hay query o category
  useEffect(() => {
    if (autoFetch && (query || category)) {
      fetchRecipes(query, category);
    }
  }, [query, category, autoFetch]);

  return {
    recipes,
    loading,
    error,
    totalCount,
    search,
    refresh,
  };
}
