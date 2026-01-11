import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getRecipeBySlug } from '@/lib/recipeUtils';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/user/meals/add-recipe
 * Agrega una receta del catálogo al plan de comidas del usuario
 * Body:
 * - recipeSlug: slug de la receta
 * - date: fecha para la comida (ISO string)
 * - mealType: tipo de comida (breakfast, lunch, dinner, snack, etc.)
 * - portions: número de porciones (opcional, default 1)
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

    // Obtener datos del body
    const body = await request.json();
    const { recipeSlug, date, mealType, portions = 1 } = body;

    // Validar campos requeridos
    if (!recipeSlug || !date || !mealType) {
      return NextResponse.json(
        { error: 'Campos requeridos: recipeSlug, date, mealType' },
        { status: 400 }
      );
    }

    // Validar mealType
    const validMealTypes = ['breakfast', 'lunch', 'dinner', 'snack', 'snack_1', 'snack_2', 'pre_workout', 'post_workout'];
    if (!validMealTypes.includes(mealType)) {
      return NextResponse.json(
        { error: `mealType inválido. Debe ser uno de: ${validMealTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Buscar receta
    const recipe = await getRecipeBySlug(recipeSlug);
    if (!recipe) {
      return NextResponse.json(
        { error: 'Receta no encontrada' },
        { status: 404 }
      );
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Calcular macros ajustados por porciones
    const adjustedCalories = recipe.nutrition ? Math.round(recipe.nutrition.calories * portions) : 0;
    const adjustedProtein = recipe.nutrition ? Math.round(recipe.nutrition.protein_g * portions) : 0;
    const adjustedCarbs = recipe.nutrition ? Math.round(recipe.nutrition.carbs_g * portions) : 0;
    const adjustedFat = recipe.nutrition ? Math.round(recipe.nutrition.fat_g * portions) : 0;
    const adjustedFiber = recipe.nutrition ? Math.round(recipe.nutrition.fiber_g * portions) : 0;

    // Construir notas con información completa de la receta
    const notes = buildRecipeNotes(recipe, portions);

    // Crear comida en la base de datos
    const meal = await prisma.meal.create({
      data: {
        userId: user.id,
        date: new Date(date),
        mealType,
        timing: getDefaultTiming(mealType),
        notes,
        totalCalories: adjustedCalories,
        totalProteinG: adjustedProtein,
        totalCarbsG: adjustedCarbs,
        totalFatG: adjustedFat,
        totalFiberG: adjustedFiber,
        // Guardar referencia a la receta original
        recipeSlug: recipe.slug,
        recipeName: recipe.name,
      }
    });

    return NextResponse.json({
      success: true,
      meal,
      message: `Receta "${recipe.name}" agregada al ${formatMealType(mealType)} del ${new Date(date).toLocaleDateString('es-ES')}`
    });

  } catch (error) {
    console.error('Error al agregar receta:', error);
    return NextResponse.json(
      { error: 'Error al agregar receta al plan' },
      { status: 500 }
    );
  }
}

/**
 * Construir notas formateadas con información de la receta
 */
function buildRecipeNotes(recipe: any, portions: number): string {
  let notes = `${recipe.name}\n\n`;

  if (recipe.description) {
    notes += `${recipe.description}\n\n`;
  }

  // Ingredientes
  if (recipe.recipeIngredient && recipe.recipeIngredient.length > 0) {
    notes += `Ingredientes (${portions} ${portions === 1 ? 'porción' : 'porciones'}):\n`;
    recipe.recipeIngredient.forEach((ingredient: string) => {
      notes += `- ${ingredient}\n`;
    });
    notes += '\n';
  }

  // Instrucciones
  if (recipe.recipeInstructions && recipe.recipeInstructions.length > 0) {
    notes += `Instrucciones:\n`;
    recipe.recipeInstructions.forEach((instruction: string, index: number) => {
      notes += `${index + 1}. ${instruction}\n`;
    });
    notes += '\n';
  }

  // Tiempo de preparación
  if (recipe.totalTime) {
    notes += `Tiempo total: ${recipe.totalTime}\n`;
  }

  // Información nutricional
  if (recipe.nutrition) {
    notes += `\nInformación nutricional (por porción):\n`;
    notes += `- Calorías: ${recipe.nutrition.calories} kcal\n`;
    notes += `- Proteína: ${recipe.nutrition.protein_g}g\n`;
    notes += `- Carbohidratos: ${recipe.nutrition.carbs_g}g\n`;
    notes += `- Grasas: ${recipe.nutrition.fat_g}g\n`;
    if (recipe.nutrition.fiber_g > 0) {
      notes += `- Fibra: ${recipe.nutrition.fiber_g}g\n`;
    }
  }

  return notes;
}

/**
 * Obtener timing por defecto según tipo de comida
 */
function getDefaultTiming(mealType: string): string {
  const timings: { [key: string]: string } = {
    breakfast: '08:00',
    snack_1: '11:00',
    lunch: '13:30',
    snack_2: '17:00',
    pre_workout: '18:30',
    dinner: '20:30',
    post_workout: '21:30',
    snack: '11:00',
  };
  return timings[mealType] || '12:00';
}

/**
 * Formatear tipo de comida para mensaje
 */
function formatMealType(mealType: string): string {
  const formats: { [key: string]: string } = {
    breakfast: 'desayuno',
    lunch: 'almuerzo',
    dinner: 'cena',
    snack: 'snack',
    snack_1: 'snack 1',
    snack_2: 'snack 2',
    pre_workout: 'pre-entreno',
    post_workout: 'post-entreno',
  };
  return formats[mealType] || mealType;
}
