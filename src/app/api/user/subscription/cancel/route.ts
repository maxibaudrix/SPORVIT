// ============================================
// app/api/user/subscription/cancel/route.ts
// ============================================
import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
export async function POST(request: NextRequest) {
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
      include: { subscription: true }
    });

    if (!user || !user.subscription) {
      return NextResponse.json(
        { error: 'No hay suscripción activa' },
        { status: 404 }
      );
    }

    // Cancelar en Stripe (o tu proveedor de pagos)
    if (user.subscription.stripeSubscriptionId) {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      
      await stripe.subscriptions.update(
        user.subscription.stripeSubscriptionId,
        { cancel_at_period_end: true }
      );
    }

    // Actualizar en base de datos
    await prisma.subscription.update({
      where: { userId: user.id },
      data: {
        cancelAtPeriodEnd: true,
        status: 'canceling'
      }
    });

    // Crear notificación
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'subscription_canceled',
        message: 'Tu suscripción Premium se cancelará al final del período actual.'
      }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Suscripción cancelada. Tendrás acceso hasta el final del período actual.'
    });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { error: 'Error al cancelar suscripción' },
      { status: 500 }
    );
  }
}
