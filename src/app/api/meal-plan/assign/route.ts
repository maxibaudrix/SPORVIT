// src/app/api/meal-plan/assign/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromSession, handleUnauthorized } from '@/lib/auth-helper';

/**
 * PATCH /api/meal-plan/assign
 * Asigna una receta a una comida y día específicos.
 */
export async function PATCH(request: NextRequest) {
  try {
    // Authenticate user
    const userId = await getUserIdFromSession(request);
    if (!userId) return handleUnauthorized();
    const body = await request.json();
    const { date, mealType, recipeId } = body;
    
    if (!date || !mealType || !recipeId) {
        return NextResponse.json({ message: "Datos incompletos para la asignación." }, { status: 400 });
    }

    // 1. Lógica de Base de Datos: Buscar el plan y actualizar la entrada específica
    console.log(`[DB Mock] Asignando receta ${recipeId} a ${mealType} del día ${date} para el usuario ${userId}`);
    // await prisma.mealPlan.update({ ... lógica de actualización ... });

    return NextResponse.json({ message: "Receta asignada correctamente.", date, mealType, recipeId }, { status: 200 });

  } catch (error: any) {
    if (error?.message === "Unauthorized") {
      return handleUnauthorized();
    }
    console.error('Error assigning recipe:', error);
    return NextResponse.json({ message: "Error interno al asignar la receta." }, { status: 500 });
  }
}

// DELETE /api/meal-plan/remove (Quitamos la receta)
// Por conveniencia, creamos un endpoint DELETE específico para quitar la receta.

/**
 * DELETE /api/meal-plan/remove
 * Quita la receta asignada a una comida y día específicos.
 */
export async function DELETE(request: NextRequest) {
    try {
      // Authenticate user
      const userId = await getUserIdFromSession(request);
      if (!userId) return handleUnauthorized();
      const body = await request.json();
      const { date, mealType } = body;
      
      if (!date || !mealType) {
          return NextResponse.json({ message: "Datos incompletos para remover la receta." }, { status: 400 });
      }
  
      // 1. Lógica de Base de Datos: Buscar el plan y poner null en la entrada específica
      console.log(`[DB Mock] Removiendo receta de ${mealType} del día ${date} para el usuario ${userId}`);
      // await prisma.mealPlan.update({ ... lógica de actualización a NULL ... });
  
      return NextResponse.json({ message: "Receta removida correctamente.", date, mealType }, { status: 200 });
  
    } catch (error: any) {
      if (error?.message === "Unauthorized") {
        return handleUnauthorized();
      }
      console.error('Error removing recipe:', error);
      return NextResponse.json({ message: "Error interno al remover la receta." }, { status: 500 });
    }
  }