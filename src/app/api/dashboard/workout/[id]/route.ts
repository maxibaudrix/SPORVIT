import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/dashboard/workout/[id]
 * Obtiene el detalle completo de un workout
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const workoutId = params.id;
    
    const workout = await prisma.workout.findUnique({
      where: {
        id: workoutId,
      },
    });

    if (!workout) {
      return NextResponse.json(
        { error: 'Workout no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que el workout pertenece al usuario
    if (workout.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      workout: {
        id: workout.id,
        userId: workout.userId,
        date: workout.date,
        workoutType: workout.workoutType,
        title: workout.title,
        description: workout.description,
        durationMinutes: workout.durationMinutes,
        estimatedCalories: workout.estimatedCalories,
        completed: workout.completed,
        completedAt: workout.completedAt,
        actualDurationMin: workout.actualDurationMin,
        actualCalories: workout.actualCalories,
        createdAt: workout.createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching workout:', error);
    return NextResponse.json(
      { error: 'Error al obtener workout' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/dashboard/workout/[id]
 * Actualiza un workout existente
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const workoutId = params.id;
    const body = await request.json();

    // Verificar que el workout existe y pertenece al usuario
    const existingWorkout = await prisma.workout.findUnique({
      where: { id: workoutId },
    });

    if (!existingWorkout) {
      return NextResponse.json(
        { error: 'Workout no encontrado' },
        { status: 404 }
      );
    }

    if (existingWorkout.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }

    // Actualizar workout
    const updatedWorkout = await prisma.workout.update({
      where: { id: workoutId },
      data: {
        title: body.title ?? existingWorkout.title,
        description: body.description ?? existingWorkout.description,
        durationMinutes: body.durationMinutes ?? existingWorkout.durationMinutes,
        workoutType: body.workoutType ?? existingWorkout.workoutType,
        estimatedCalories: body.estimatedCalories ?? existingWorkout.estimatedCalories,
        completed: body.completed ?? existingWorkout.completed,
        completedAt: body.completed === true ? new Date() : body.completedAt,
        actualDurationMin: body.actualDurationMin,
        actualCalories: body.actualCalories,
      },
    });

    console.log('✅ Workout updated:', workoutId);

    return NextResponse.json({
      success: true,
      workout: updatedWorkout,
    });
  } catch (error) {
    console.error('Error updating workout:', error);
    return NextResponse.json(
      { error: 'Error al actualizar workout' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/dashboard/workout/[id]
 * Elimina un workout
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const workoutId = params.id;

    // Verificar que el workout existe y pertenece al usuario
    const existingWorkout = await prisma.workout.findUnique({
      where: { id: workoutId },
    });

    if (!existingWorkout) {
      return NextResponse.json(
        { error: 'Workout no encontrado' },
        { status: 404 }
      );
    }

    if (existingWorkout.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }

    // Eliminar workout
    await prisma.workout.delete({
      where: { id: workoutId },
    });

    console.log('🗑️ Workout deleted:', workoutId);

    return NextResponse.json({
      success: true,
      message: 'Workout eliminado',
    });
  } catch (error) {
    console.error('Error deleting workout:', error);
    return NextResponse.json(
      { error: 'Error al eliminar workout' },
      { status: 500 }
    );
  }
}