import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * GET /api/planning/check
 * Verifica si el usuario tiene un plan de entrenamiento existente
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Buscar si existe algún plan para este usuario
    const existingPlan = await prisma.planningContext.findFirst({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        createdAt: true,
        status: true,
      },
    });

    return NextResponse.json({
      hasPlan: !!existingPlan,
      plan: existingPlan ? {
        id: existingPlan.id,
        createdAt: existingPlan.createdAt,
        status: existingPlan.status,
      } : null,
    });
  } catch (error) {
    console.error('[API Planning Check] Error:', error);
    return NextResponse.json(
      { error: 'Error al verificar plan existente' },
      { status: 500 }
    );
  }
}
