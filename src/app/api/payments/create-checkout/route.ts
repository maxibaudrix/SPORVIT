// ============================================
// app/api/payments/create-checkout/route.ts
// ============================================
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

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
    const { plan, cycle } = body; // 'premium', 'monthly' | 'annual'

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    // Definir precios (en centavos)
    const prices = {
      monthly: 1299, // €12.99
      annual: 11999  // €119.99
    };

    // Crear Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: user.email,
      client_reference_id: user.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Sporvit Premium',
              description: cycle === 'annual' 
                ? 'Plan anual - Ahorra 23%' 
                : 'Plan mensual'
            },
            unit_amount: prices[cycle],
            recurring: {
              interval: cycle === 'annual' ? 'year' : 'month'
            }
          },
          quantity: 1
        }
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/subscription?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/subscription?canceled=true`,
      metadata: {
        userId: user.id,
        plan: 'premium',
        cycle: cycle
      }
    });

    return NextResponse.json({ 
      checkoutUrl: checkoutSession.url 
    });

  } catch (error) {
    console.error('Create checkout error:', error);
    return NextResponse.json(
      { error: 'Error al crear checkout' },
      { status: 500 }
    );
  }
}