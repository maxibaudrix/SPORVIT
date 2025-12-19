// app/api/user/subscription/route.ts

import { NextRequest, NextResponse } from 'next/server';
import  NextAuth  from 'next-auth';
import { auth } from '@/auth';
import  prisma  from '@/lib/prisma';

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
      where: { email: session.user.email },
      include: {
        subscription: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Obtener historial de pagos
    const payments = await prisma.payment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    const billingHistory = payments.map(payment => ({
      id: payment.id,
      description: payment.description,
      amount: (payment.amount / 100).toFixed(2), // Convertir de centavos
      date: payment.createdAt.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      status: payment.status
    }));

    return NextResponse.json({
      plan: user.subscription?.plan || 'free',
      status: user.subscription?.status || 'inactive',
      currentPeriodEnd: user.subscription?.currentPeriodEnd,
      cancelAtPeriodEnd: user.subscription?.cancelAtPeriodEnd || false,
      billingHistory
    });

  } catch (error) {
    console.error('Get subscription error:', error);
    return NextResponse.json(
      { error: 'Error al obtener suscripción' },
      { status: 500 }
    );
  }
}