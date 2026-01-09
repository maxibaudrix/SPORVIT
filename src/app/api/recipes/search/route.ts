import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { searchRecipes, getRecipesByCategory } from '@/lib/recipeUtils';

/**
 * GET /api/recipes/search
 * Busca recetas por término de búsqueda y/o categoría
 * Query params:
 * - q: término de búsqueda (opcional)
 * - category: categoría de receta (opcional)
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Obtener parámetros de búsqueda
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';

    let recipes;

    // Si hay término de búsqueda, buscar
    if (query.trim()) {
      recipes = await searchRecipes(query);

      // Si también hay categoría, filtrar resultados
      if (category && category !== 'Todas') {
        recipes = recipes.filter(recipe => {
          const recipeCategory = recipe.recipeCategory.toLowerCase();
          const searchCategory = category.toLowerCase();

          const categoryMap: { [key: string]: string[] } = {
            'desayunos': ['desayuno', 'breakfast'],
            'comidas': ['almuerzo', 'comida', 'lunch'],
            'cenas': ['cena', 'dinner'],
            'snacks': ['snack', 'aperitivo', 'tentempié'],
            'postres': ['postre', 'dessert'],
            'batidos': ['batido', 'smoothie', 'licuado']
          };

          if (categoryMap[searchCategory]) {
            return categoryMap[searchCategory].some(term => recipeCategory.includes(term));
          }

          return recipeCategory.includes(searchCategory);
        });
      }
    }
    // Si solo hay categoría, filtrar por categoría
    else if (category) {
      recipes = await getRecipesByCategory(category);
    }
    // Si no hay parámetros, devolver error
    else {
      return NextResponse.json(
        { error: 'Debe proporcionar parámetro de búsqueda (q) o categoría (category)' },
        { status: 400 }
      );
    }

    // Limitar resultados a 50 para no sobrecargar
    const limitedRecipes = recipes.slice(0, 50);

    return NextResponse.json({
      success: true,
      count: limitedRecipes.length,
      total: recipes.length,
      recipes: limitedRecipes
    });

  } catch (error) {
    console.error('Error en búsqueda de recetas:', error);
    return NextResponse.json(
      { error: 'Error al buscar recetas' },
      { status: 500 }
    );
  }
}
