/**
 * GET /api/notifications/list
 *
 * Obtiene todas las notificaciones del usuario autenticado.
 * Opcionalmente puede filtrar solo las no leídas.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Autenticación
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userId = session.user.id;

    // Query params opcionales
    const searchParams = request.nextUrl.searchParams;
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');

    // Construir query
    const whereClause: any = { userId };
    if (unreadOnly) {
      whereClause.read = false;
    }

    // Obtener notificaciones
    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId, read: false },
    });

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
      total: notifications.length,
    });
  } catch (error: any) {
    console.error('[Notifications] Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Error al obtener notificaciones', details: error.message },
      { status: 500 }
    );
  }
}
