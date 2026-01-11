import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { searchRecipes, getRecipesByCategory, getAllRecipes } from '@/lib/recipeUtils';
import { filterAndScoreRecipes, calculateCalorieRange, detectMealSlot } from '@/lib/recipeScoring';
import type { UserContext, RecipeSearchRequest, RecipeSearchResponse, ActiveFilters, MealSlot } from '@/types/recipeFilters';

/**
 * POST /api/recipes/search-smart
 * Búsqueda inteligente de recetas con filtrado contextual y scoring
 *
 * Body:
 * - query?: string - Término de búsqueda
 * - filters: ActiveFilters - Filtros activos
 * - mealSlot?: MealSlot - Slot de comida (si no se prov ee, se detecta automáticamente)
 * - limit?: number - Límite de resultados (default: 50)
 * - offset?: number - Offset para paginación (default: 0)
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Obtener body del request
    const body: RecipeSearchRequest = await request.json();
    const { query, filters, userContext: providedContext, limit = 50, offset = 0 } = body;

    // Obtener usuario de la DB
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        goals: true,
      },
    });

    if (!user || !user.goals) {
      return NextResponse.json(
        { error: 'Usuario sin perfil configurado' },
        { status: 400 }
      );
    }

    // Construir contexto del usuario
    const userContext: UserContext = {
      // Safety Profile (Nivel 1) - Desde la DB
      safetyProfile: {
        allergies: user.goals.allergies ? JSON.parse(user.goals.allergies) : [],
        intolerances: user.goals.intolerances ? JSON.parse(user.goals.intolerances) : [],
        medicalConditions: user.goals.medicalConditions ? JSON.parse(user.goals.medicalConditions) : [],
        dietaryRestrictions: user.goals.dietaryRestrictions ? JSON.parse(user.goals.dietaryRestrictions) : [],
      },

      // Goal & Targets (Nivel 2) - Desde la DB o filtros
      goal: filters.nutritionalGoal?.goal || (user.goals.goalType as 'cut' | 'bulk' | 'maintenance'),
      tdee: user.goals.tdee,
      targetCalories: 0, // Se calculará después
      targetProtein: filters.macroTargets?.protein_min || user.goals.targetProteinG,
      targetCarbs: user.goals.targetCarbsG,
      targetFat: user.goals.targetFatG,

      // Meal Context (Nivel 2)
      mealSlot: filters.mealTiming?.slot || detectMealSlot(),
      mealPercentage: 0, // Se calculará después

      // Preferences (Nivel 3)
      preferredTime: filters.timeFilter?.category || 'any',
      preferredIngredients: user.goals.preferredIngredients ? JSON.parse(user.goals.preferredIngredients) : [],

      // User Level
      userLevel: user.goals.userLevel as 'basic' | 'intermediate' | 'advanced',
    };

    // Calcular porcentaje del TDEE para este slot
    const mealSlotPercentages: Record<MealSlot, number> = {
      breakfast: 25,
      lunch: 35,
      dinner: 30,
      snack: 10,
      snack_1: 5,
      snack_2: 5,
      pre_workout: 10,
      post_workout: 15,
    };
    userContext.mealPercentage = mealSlotPercentages[userContext.mealSlot];

    // Calcular calorías objetivo para este slot
    if (filters.calorieRange) {
      // Si se proporciona un rango personalizado, usar el punto medio
      userContext.targetCalories = Math.round((filters.calorieRange.min + filters.calorieRange.max) / 2);
    } else {
      // Calcular automáticamente según el slot
      const autoRange = calculateCalorieRange(userContext.tdee, userContext.mealPercentage);
      userContext.targetCalories = Math.round((autoRange.min + autoRange.max) / 2);
    }

    // Obtener recetas base
    let baseRecipes;
    if (query && query.trim()) {
      // Búsqueda por texto
      baseRecipes = await searchRecipes(query);
    } else if (filters.mealTiming?.slot) {
      // Filtrar por categoría de comida
      const categoryMap: Record<MealSlot, string> = {
        breakfast: 'Desayunos',
        lunch: 'Comidas',
        dinner: 'Cenas',
        snack: 'Snacks',
        snack_1: 'Snacks',
        snack_2: 'Snacks',
        pre_workout: 'Snacks',
        post_workout: 'Snacks',
      };
      const category = categoryMap[filters.mealTiming.slot];
      baseRecipes = await getRecipesByCategory(category);
    } else {
      // Sin filtros específicos, obtener todas
      baseRecipes = await getAllRecipes();
    }

    // Aplicar filtros de ingredientes (Nivel 3)
    if (filters.ingredientFilter) {
      const { include, exclude } = filters.ingredientFilter;

      if (include && include.length > 0) {
        baseRecipes = baseRecipes.filter(recipe => {
          const ingredientsText = recipe.recipeIngredient.join(' ').toLowerCase();
          return include.some(ing => ingredientsText.includes(ing.toLowerCase()));
        });
      }

      if (exclude && exclude.length > 0) {
        baseRecipes = baseRecipes.filter(recipe => {
          const ingredientsText = recipe.recipeIngredient.join(' ').toLowerCase();
          return !exclude.some(ing => ingredientsText.includes(ing.toLowerCase()));
        });
      }
    }

    // Aplicar filtro de tiempo (Nivel 3)
    if (filters.timeFilter && filters.timeFilter.category !== 'any') {
      const maxMinutes = filters.timeFilter.category === 'quick' ? 15
        : filters.timeFilter.category === 'moderate' ? 30
        : 60;

      baseRecipes = baseRecipes.filter(recipe => {
        const timeMatch = recipe.totalTime?.match(/PT(\d+)M/) || recipe.totalTime?.match(/PT(\d+)H/);
        if (!timeMatch) return true; // Si no tiene tiempo, no filtrar

        const totalMinutes = recipe.totalTime.includes('H')
          ? parseInt(timeMatch[1]) * 60
          : parseInt(timeMatch[1]);

        return totalMinutes <= maxMinutes;
      });
    }

    // Aplicar filtro de calorías (Nivel 2)
    if (filters.calorieRange) {
      baseRecipes = baseRecipes.filter(recipe => {
        const calories = recipe.nutrition?.calories || 0;
        return calories >= filters.calorieRange!.min && calories <= filters.calorieRange!.max;
      });
    }

    // Aplicar filtro de macros avanzados (Nivel 2)
    if (filters.macroTargets && userContext.userLevel === 'advanced') {
      const { protein_min, carbs_max, fat_max, flexible } = filters.macroTargets;
      const margin = flexible ? 1.1 : 1.0; // ±10% si flexible

      baseRecipes = baseRecipes.filter(recipe => {
        const protein = recipe.nutrition?.protein_g || 0;
        const carbs = recipe.nutrition?.carbs_g || 0;
        const fat = recipe.nutrition?.fat_g || 0;

        let passes = true;

        if (protein_min !== undefined) {
          passes = passes && protein >= protein_min / margin;
        }
        if (carbs_max !== undefined) {
          passes = passes && carbs <= carbs_max * margin;
        }
        if (fat_max !== undefined) {
          passes = passes && fat <= fat_max * margin;
        }

        return passes;
      });
    }

    // Scoring y filtrado inteligente
    const scoredRecipes = filterAndScoreRecipes(baseRecipes, userContext);

    // Aplicar filtro de calidad mínima (Nivel 3)
    let filteredScored = scoredRecipes;
    if (filters.qualityFilter) {
      filteredScored = scoredRecipes.filter(result =>
        result.totalScore >= filters.qualityFilter!.minScore
      );
    }

    // Paginación
    const paginatedResults = filteredScored.slice(offset, offset + limit);

    // Construir respuesta
    const appliedFilters = {
      safety: [] as string[],
      contextual: [] as string[],
      preferences: [] as string[],
    };

    // Documentar filtros aplicados
    if (userContext.safetyProfile.allergies.length > 0) {
      appliedFilters.safety.push(`Sin alérgenos: ${userContext.safetyProfile.allergies.join(', ')}`);
    }
    if (userContext.safetyProfile.dietaryRestrictions.length > 0) {
      appliedFilters.safety.push(`Restricciones: ${userContext.safetyProfile.dietaryRestrictions.join(', ')}`);
    }
    if (filters.mealTiming) {
      appliedFilters.contextual.push(`Momento: ${filters.mealTiming.slot}`);
    }
    if (filters.nutritionalGoal) {
      appliedFilters.contextual.push(`Objetivo: ${filters.nutritionalGoal.goal}`);
    }
    if (filters.calorieRange) {
      appliedFilters.contextual.push(`Calorías: ${filters.calorieRange.min}-${filters.calorieRange.max} kcal`);
    }
    if (filters.timeFilter) {
      appliedFilters.preferences.push(`Tiempo: ${filters.timeFilter.category}`);
    }
    if (filters.ingredientFilter?.include && filters.ingredientFilter.include.length > 0) {
      appliedFilters.preferences.push(`Con: ${filters.ingredientFilter.include.join(', ')}`);
    }
    if (filters.ingredientFilter?.exclude && filters.ingredientFilter.exclude.length > 0) {
      appliedFilters.preferences.push(`Sin: ${filters.ingredientFilter.exclude.join(', ')}`);
    }

    // Generar sugerencias si no hay resultados
    const suggestions: string[] = [];
    if (filteredScored.length === 0) {
      suggestions.push('Amplía el rango calórico');
      if (filters.timeFilter) suggestions.push('Elimina el filtro de tiempo');
      if (filters.ingredientFilter) suggestions.push('Quita algunos ingredientes excluidos');
      if (filters.qualityFilter) suggestions.push('Reduce la puntuación mínima');
    }

    const response: RecipeSearchResponse = {
      success: true,
      recipes: paginatedResults,
      total: filteredScored.length,
      appliedFilters,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error en búsqueda inteligente de recetas:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al buscar recetas',
        recipes: [],
        total: 0,
        appliedFilters: { safety: [], contextual: [], preferences: [] },
      },
      { status: 500 }
    );
  }
}
