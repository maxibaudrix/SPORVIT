// ============================================
// 2. app/api/notifications/[id]/read/route.ts
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { auth } from '@/auth';
import prisma  from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const notification = await prisma.notification.update({
      where: {
        id: params.id,
        userId: user.id
      },
      data: {
        read: true,
        readAt: new Date()
      }
    });

    return NextResponse.json({ success: true, notification });

  } catch (error) {
    console.error('Mark as read error:', error);
    return NextResponse.json(
      { error: 'Error al marcar como leída' },
      { status: 500 }
    );
  }
}