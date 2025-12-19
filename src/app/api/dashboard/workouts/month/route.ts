// ============================================
// 3. app/api/dashboard/workouts/month/route.ts
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || '');
    const month = parseInt(searchParams.get('month') || '');

    if (!year || !month) {
      return NextResponse.json(
        { error: 'Año y mes requeridos' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Obtener primer y último día del mes
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0, 23, 59, 59);

    // Obtener workouts del mes
    const workouts = await prisma.workout.findMany({
      where: {
        userId: user.id,
        date: {
          gte: firstDay,
          lte: lastDay
        }
      },
      select: {
        date: true
      }
    });

    const workoutDays = workouts.map(w => w.date.toISOString());

    return NextResponse.json({ workoutDays });

  } catch (error) {
    console.error('Get workout days error:', error);
    return NextResponse.json(
      { error: 'Error al obtener días de entrenamiento' },
      { status: 500 }
    );
  }
}
