import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/user/meals/add-manual
 * Agrega una receta manual/personalizada al plan de comidas del usuario
 * Body:
 * - name: nombre de la receta (requerido)
 * - date: fecha para la comida (ISO string) (requerido)
 * - mealType: tipo de comida (breakfast, lunch, dinner, snack, etc.) (requerido)
 * - servings: número de porciones (default: 1)
 * - calories: calorías totales (opcional)
 * - protein: proteína en gramos (opcional)
 * - carbs: carbohidratos en gramos (opcional)
 * - fat: grasas en gramos (opcional)
 * - notes: notas adicionales (opcional)
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

    // Obtener usuario de la DB
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Obtener datos del body
    const body = await request.json();
    const {
      name,
      date,
      mealType,
      servings = 1,
      calories,
      protein,
      carbs,
      fat,
      notes,
    } = body;

    // Validaciones
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'El nombre de la receta es obligatorio' },
        { status: 400 }
      );
    }

    if (!date) {
      return NextResponse.json(
        { error: 'La fecha es obligatoria' },
        { status: 400 }
      );
    }

    if (!mealType) {
      return NextResponse.json(
        { error: 'El tipo de comida es obligatorio' },
        { status: 400 }
      );
    }

    if (servings < 1) {
      return NextResponse.json(
        { error: 'El número de porciones debe ser al menos 1' },
        { status: 400 }
      );
    }

    // Parsear fecha
    const mealDate = new Date(date);
    if (isNaN(mealDate.getTime())) {
      return NextResponse.json(
        { error: 'Fecha inválida' },
        { status: 400 }
      );
    }

    // Calcular totales (multiplicar por número de porciones)
    const totalCalories = calories ? Math.round(calories * servings) : 0;
    const totalProtein = protein ? protein * servings : 0;
    const totalCarbs = carbs ? carbs * servings : 0;
    const totalFat = fat ? fat * servings : 0;

    // Construir notas con información de la receta
    let mealNotes = `${name}\n`;
    if (servings > 1) {
      mealNotes += `Porciones: ${servings}\n`;
    }
    if (notes && notes.trim()) {
      mealNotes += `\n${notes.trim()}`;
    }

    // Crear el registro de comida
    const meal = await prisma.meal.create({
      data: {
        userId: user.id,
        date: mealDate,
        mealType: mealType,
        name: name.trim(),
        totalCalories: totalCalories,
        totalProteinG: totalProtein,
        totalCarbsG: totalCarbs,
        totalFatG: totalFat,
        totalFiberG: 0, // No disponible para recetas manuales
        recipeName: name.trim(),
        notes: mealNotes,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Receta agregada exitosamente',
      meal: {
        id: meal.id,
        date: meal.date,
        mealType: meal.mealType,
        name: meal.name,
        totalCalories: meal.totalCalories,
        totalProteinG: meal.totalProteinG,
        totalCarbsG: meal.totalCarbsG,
        totalFatG: meal.totalFatG,
      },
    });

  } catch (error) {
    console.error('Error al agregar receta manual:', error);
    return NextResponse.json(
      { error: 'Error al agregar la receta' },
      { status: 500 }
    );
  }
}
