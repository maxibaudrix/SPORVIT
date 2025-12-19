// ============================================
// 2. app/api/dashboard/metrics/update/route.ts
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const updateSchema = z.object({
  field: z.enum(['weight', 'steps']),
  value: z.number().positive()
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = updateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error },
        { status: 400 }
      );
    }

    const { field, value } = validation.data;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (field === 'weight') {
      // Actualizar peso
      await prisma.weightEntry.upsert({
        where: {
          userId_date: {
            userId: user.id,
            date: today
          }
        },
        create: {
          userId: user.id,
          date: today,
          weight: value
        },
        update: {
          weight: value
        }
      });

      // Actualizar también en UserProfile
      await prisma.userProfile.update({
        where: { userId: user.id },
        data: { currentWeight: value }
      });
    }

    if (field === 'steps') {
      // Actualizar pasos
      await prisma.dailySteps.upsert({
        where: {
          userId_date: {
            userId: user.id,
            date: today
          }
        },
        create: {
          userId: user.id,
          date: today,
          steps: value
        },
        update: {
          steps: value
        }
      });
    }

    return NextResponse.json({ 
      success: true,
      field,
      value
    });

  } catch (error) {
    console.error('Update metric error:', error);
    return NextResponse.json(
      { error: 'Error al actualizar métrica' },
      { status: 500 }
    );
  }
}