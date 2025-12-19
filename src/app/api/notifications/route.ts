// ============================================
// 1. app/api/notifications/route.ts
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { auth } from '@/auth';
import prisma  from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
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

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    const notificationsWithTime = notifications.map(notif => ({
      id: notif.id,
      message: notif.message,
      read: notif.read,
      type: notif.type,
      timeAgo: getTimeAgo(notif.createdAt),
      createdAt: notif.createdAt
    }));

    return NextResponse.json({ notifications: notificationsWithTime });

  } catch (error) {
    console.error('Notifications error:', error);
    return NextResponse.json(
      { error: 'Error al obtener notificaciones' },
      { status: 500 }
    );
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `${diffMins} min`;
  if (diffHours < 24) return `${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 7) return `${diffDays} día${diffDays > 1 ? 's' : ''}`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} semana${Math.floor(diffDays / 7) > 1 ? 's' : ''}`;
  return date.toLocaleDateString();
}
