// app/dashboard/subscription/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Crown, Check, X, CreditCard, Calendar, FileText,
  Loader2, Sparkles, Zap, TrendingUp
} from 'lucide-react';


export default function SubscriptionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [billingHistory, setBillingHistory] = useState([]);
  const [currentPlan, setCurrentPlan] = useState('free');
  const [billingCycle, setBillingCycle] = useState('monthly');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      loadSubscriptionData();
    }
  }, [status]);

  const loadSubscriptionData = async () => {
    try {
      const res = await fetch('/api/user/subscription');
      const data = await res.json();
      setCurrentPlan(data.plan);
      setBillingHistory(data.billingHistory || []);
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      const res = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'premium', cycle: billingCycle })
      });

      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert('❌ Error al procesar el pago');
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('¿Estás seguro de que quieres cancelar tu suscripción Premium?')) {
      return;
    }

    try {
      const res = await fetch('/api/user/subscription/cancel', {
        method: 'POST'
      });

      if (res.ok) {
        alert('✅ Suscripción cancelada. Tu plan Premium estará activo hasta el final del período actual.');
        loadSubscriptionData();
      } else {
        alert('❌ Error al cancelar suscripción');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      alert('❌ Error al cancelar suscripción');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  const pricingPlans = [
    {
      name: 'Free',
      price: 0,
      cycle: 'Gratis para siempre',
      description: 'Ideal para comenzar tu viaje fitness',
      features: [
        'Plan de entrenamiento básico semanal',
        'Plan nutricional simple',
        'Tracking de progreso',
        'Dashboard básico',
        'Calculadoras fitness'
      ],
      limitations: [
        'Generación AI de planes',
        'Recetas avanzadas',
        'Adaptación automática',
        'Soporte prioritario',
        'Exportar datos'
      ],
      cta: currentPlan === 'free' ? 'Plan Actual' : 'Cambiar a Free',
      current: currentPlan === 'free'
    },
    {
      name: 'Premium',
      price: billingCycle === 'monthly' ? 12.99 : 119.99,
      cycle: billingCycle === 'monthly' ? '/mes' : '/año',
      description: 'Desbloquea todo el potencial de Sporvit',
      badge: 'Más Popular',
      features: [
        'Planes de entrenamiento completos con IA',
        'Planes nutricionales avanzados',
        'Adaptación automática semanal',
        'Meal planner con recetas ilimitadas',
        'IA Coach personal',
        'Escáner de productos (próximamente)',
        'Sincronización con wearables',
        'Soporte prioritario',
        'Exportar todos tus datos',
        'Sin anuncios'
      ],
      limitations: [],
      cta: currentPlan === 'premium' ? 'Plan Actual' : 'Upgrade a Premium',
      current: currentPlan === 'premium',
      highlight: true
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">
            Elige tu Plan
          </h1>
          <p className="text-slate-400 text-lg">
            Comienza gratis o desbloquea todas las funciones con Premium
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-lg font-medium transition-all relative ${
                billingCycle === 'annual'
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Anual
              <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-bold rounded-full">
                -23%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-slate-900 rounded-3xl p-8 border transition-all ${
                plan.highlight
                  ? 'border-emerald-500 shadow-2xl shadow-emerald-500/20 scale-105'
                  : 'border-slate-800'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold rounded-full">
                  {plan.badge}
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-white">{plan.price === 0 ? 'Gratis' : `€${plan.price}`}</span>
                  {plan.price > 0 && (
                    <span className="text-slate-400">{plan.cycle}</span>
                  )}
                </div>
                {billingCycle === 'annual' && plan.price > 0 && (
                  <p className="text-xs text-emerald-400 mt-2">
                    Ahorra €36 al año
                  </p>
                )}
              </div>

              <button
                onClick={() => !plan.current && (plan.name === 'Premium' ? handleUpgrade() : null)}
                disabled={plan.current}
                className={`w-full py-3 rounded-xl font-bold mb-6 transition-all ${
                  plan.current
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : plan.highlight
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/25'
                    : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
              >
                {plan.cta}
              </button>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>

              {plan.limitations.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-slate-800">
                  {plan.limitations.map((limit, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <X className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-500">{limit}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Current Subscription Details */}
        {currentPlan === 'premium' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-emerald-400" />
              Tu Suscripción Premium
            </h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-slate-950 rounded-xl">
                <p className="text-sm text-slate-400 mb-1">Estado</p>
                <p className="text-lg font-bold text-emerald-400">Activa</p>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl">
                <p className="text-sm text-slate-400 mb-1">Próximo cobro</p>
                <p className="text-lg font-bold text-white">15 Ene 2025</p>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl">
                <p className="text-sm text-slate-400 mb-1">Monto</p>
                <p className="text-lg font-bold text-white">€{billingCycle === 'monthly' ? '12.99' : '119.99'}</p>
              </div>
            </div>
            <button
              onClick={handleCancelSubscription}
              className="text-sm text-red-400 hover:text-red-300 font-medium"
            >
              Cancelar suscripción
            </button>
          </div>
        )}

        {/* Billing History */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-400" />
            Historial de Pagos
          </h2>
          
          {billingHistory.length > 0 ? (
            <div className="space-y-3">
              {billingHistory.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between p-4 bg-slate-950 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{bill.description}</p>
                      <p className="text-xs text-slate-500">{bill.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">€{bill.amount}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      bill.status === 'paid'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {bill.status === 'paid' ? 'Pagado' : 'Pendiente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500">No tienes historial de pagos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
