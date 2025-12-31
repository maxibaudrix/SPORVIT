import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/dashboard/workout
 * Crea un nuevo workout
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validaciones
    if (!body.date) {
      return NextResponse.json(
        { error: 'Fecha requerida' },
        { status: 400 }
      );
    }

    if (!body.title) {
      return NextResponse.json(
        { error: 'Título requerido' },
        { status: 400 }
      );
    }

    if (!body.workoutType) {
      return NextResponse.json(
        { error: 'Tipo de workout requerido' },
        { status: 400 }
      );
    }

    // Crear workout
    const workout = await prisma.workout.create({
      data: {
        userId: session.user.id,
        date: new Date(body.date),
        workoutType: body.workoutType,
        title: body.title,
        description: body.description || '',
        durationMinutes: body.durationMinutes || 30,
        estimatedCalories: body.estimatedCalories || 200,
        completed: false,
      },
    });

    console.log('✅ Workout created:', workout.id);

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
        createdAt: workout.createdAt,
      },
    });
  } catch (error) {
    console.error('Error creating workout:', error);
    return NextResponse.json(
      { error: 'Error al crear workout' },
      { status: 500 }
    );
  }
}