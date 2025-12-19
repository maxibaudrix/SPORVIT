// src/app/api/diary/exercise/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { updateExerciseSchema } from '@/lib/validations/diary'; // Importar esquema Zod
import prisma from '@/lib/prisma'; // Importa tu instancia de Prisma

interface Context {
  params: {
    id: string; // exerciseId
  };
}

/**
 * PATCH /api/diary/exercise/:id
 * Marca un ejercicio como completado y añade notas de rendimiento.
 */
export async function PATCH(request: NextRequest, context: Context) {
  const exerciseId = context.params.id;

  if (!exerciseId) {
    return NextResponse.json({ message: "ID de ejercicio es requerido." }, { status: 400 });
  }

  try {
    const body = await request.json();

    // 1. Validar el cuerpo de la petición con Zod
    const validation = updateExerciseSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: "Datos de actualización inválidos.", errors: validation.error.format() }, { status: 400 });
    }

    const { completed, notes } = validation.data;
    
    // Obtener userId (MOCKEO, reemplazar por lógica de autenticación y verificación de propiedad)
    const userId = 'mock-user-uuid-123';

    // 2. Actualizar el registro del ejercicio (MOCKEO DE PRISMA)
    /*
    // Nota: El modelo de Prisma para ejercicios (TrainingExercise o similar) debe estar enlazado.
    const updatedExercise = await prisma.trainingExercise.update({
      where: { 
        id: exerciseId,
        // Añadir userId para garantizar que solo el usuario pueda modificar su ejercicio
        userId: userId 
      },
      data: {
        completed: completed,
        notes: notes,
      },
    });
    */

    const mockResponse = { id: exerciseId, completed: completed ?? true, notes: notes ?? "Peso: 80kg x 8 reps" };

    return NextResponse.json({ 
      message: "Ejercicio actualizado exitosamente.", 
      data: mockResponse 
    }, { status: 200 });

  } catch (error) {
    // Manejar error si el ejercicio no existe (P2025 en Prisma)
    console.error(`Error al actualizar ejercicio ${exerciseId}:`, error);
    return NextResponse.json({ message: `Error al actualizar el ejercicio. Es posible que el ID ${exerciseId} no exista.` }, { status: 404 });
  }
}