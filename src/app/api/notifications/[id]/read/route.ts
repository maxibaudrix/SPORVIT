/**
 * PATCH /api/notifications/[id]/read
 *
 * Marca una notificación como leída.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Autenticación
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userId = session.user.id;
    const notificationId = params.id;

    // Verificar que la notificación pertenece al usuario
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      return NextResponse.json(
        { error: 'Notificación no encontrada' },
        { status: 404 }
      );
    }

    if (notification.userId !== userId) {
      return NextResponse.json(
        { error: 'No tienes permiso para modificar esta notificación' },
        { status: 403 }
      );
    }

    // Marcar como leída
    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    console.log(`[Notifications] Marked notification ${notificationId} as read`);

    return NextResponse.json({
      success: true,
      notification: updatedNotification,
    });
  } catch (error: any) {
    console.error('[Notifications] Error marking notification as read:', error);
    return NextResponse.json(
      { error: 'Error al marcar notificación como leída', details: error.message },
      { status: 500 }
    );
  }
}
