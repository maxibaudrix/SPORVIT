import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

/**
 * PATCH /api/workouts/[id]
 * Actualizar workout (ej: marcar como completado)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    // Verificar que el workout pertenece al usuario
    const workout = await prisma.workout.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!workout) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }

    if (workout.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Actualizar el workout
    const updated = await prisma.workout.update({
      where: { id },
      data: {
        ...body,
        completedAt: body.completedAt ? new Date(body.completedAt) : null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[PATCH /api/workouts/[id]]', error);
    return NextResponse.json(
      { error: 'Failed to update workout' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/workouts/[id]
 * Eliminar workout
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Verificar que el workout pertenece al usuario
    const workout = await prisma.workout.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!workout) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }

    if (workout.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Eliminar el workout
    await prisma.workout.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/workouts/[id]]', error);
    return NextResponse.json(
      { error: 'Failed to delete workout' },
      { status: 500 }
    );
  }
}
