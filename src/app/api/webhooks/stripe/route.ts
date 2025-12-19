// ============================================
// WEBHOOK DE STRIPE (para confirmar pagos)
// app/api/webhooks/stripe/route.ts
// ============================================
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook error' },
      { status: 400 }
    );
  }

  // Manejar eventos
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      // Activar suscripción
      await prisma.subscription.upsert({
        where: { userId: session.metadata.userId },
        create: {
          userId: session.metadata.userId,
          plan: 'premium',
          status: 'active',
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
          currentPeriodEnd: new Date(session.subscription.current_period_end * 1000)
        },
        update: {
          plan: 'premium',
          status: 'active',
          stripeSubscriptionId: session.subscription,
          currentPeriodEnd: new Date(session.subscription.current_period_end * 1000),
          cancelAtPeriodEnd: false
        }
      });

      // Registrar pago
      await prisma.payment.create({
        data: {
          userId: session.metadata.userId,
          amount: session.amount_total,
          currency: session.currency,
          status: 'paid',
          stripePaymentIntentId: session.payment_intent,
          description: `Suscripción Premium - ${session.metadata.cycle}`
        }
      });

      // Crear notificación
      await prisma.notification.create({
        data: {
          userId: session.metadata.userId,
          type: 'subscription_activated',
          message: '¡Bienvenido a Sporvit Premium! Ya tienes acceso a todas las funciones.'
        }
      });

      break;

    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      
      // Desactivar suscripción
      await prisma.subscription.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          status: 'canceled',
          plan: 'free'
        }
      });

      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}