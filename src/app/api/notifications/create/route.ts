/**
 * POST /api/notifications/create
 *
 * Crea una nueva notificación para un usuario.
 * Esta API se usa internamente para crear notificaciones automáticas.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Autenticación
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, type, title, message, actionUrl, actionLabel } = body;

    // Validación básica
    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: userId, type, title, message' },
        { status: 400 }
      );
    }

    // Validar tipos permitidos
    const validTypes = ['COMPLETE_PROFILE', 'PLAN_READY', 'REMINDER', 'UPDATE'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Tipo inválido. Debe ser uno de: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Crear notificación
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        actionUrl: actionUrl || null,
        actionLabel: actionLabel || null,
        read: false,
      },
    });

    console.log(`[Notifications] Created notification ${notification.id} for user ${userId}`);

    return NextResponse.json({
      success: true,
      notification,
    });
  } catch (error: any) {
    console.error('[Notifications] Error creating notification:', error);
    return NextResponse.json(
      { error: 'Error al crear notificación', details: error.message },
      { status: 500 }
    );
  }
}
