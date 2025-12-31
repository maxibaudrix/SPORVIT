// src/app/dashboard/subscription/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Crown, Check, X, CreditCard, Calendar, FileText,
  Loader2, Zap, Star, ShieldCheck
} from 'lucide-react';
import { AccountTabs } from '@/components/ui/layout/dashboard/AccountTabs';

export default function SubscriptionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'
  const [currentPlan, setCurrentPlan] = useState('free');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin');
    else if (status === 'authenticated') {
      // Simulación de carga de datos
      setTimeout(() => setLoading(false), 800);
    }
  }, [status]);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  const plans = [
    {
      name: 'Plan Free',
      price: 0,
      description: 'Lo esencial para empezar a entrenar.',
      features: [
        'Calendario de entrenamiento básico',
        'Seguimiento de peso y medidas',
        'Base de datos de ejercicios',
        'Acceso a la comunidad'
      ],
      notIncluded: [
        'IA Personal Coach',
        'Planes nutricionales personalizados',
        'Análisis avanzado de progreso',
        'Sincronización con Apple/Google Health'
      ],
      buttonText: currentPlan === 'free' ? 'Plan Actual' : 'Cambiar a Free',
      highlight: false
    },
    {
      name: 'Plan Premium',
      price: billingCycle === 'monthly' ? 14.99 : 9.99,
      description: 'Optimización total de tu físico con IA.',
      features: [
        'Todo lo del Plan Free',
        'IA Personal Coach 24/7',
        'Macros y dietas personalizadas',
        'Rutinas adaptativas dinámicas',
        'Sincronización con Wearables',
        'Soporte prioritario VIP'
      ],
      notIncluded: [],
      buttonText: currentPlan === 'premium' ? 'Plan Actual' : 'Pasar a Premium',
      highlight: true
    }
  ];

  return (
    <div className="p-4 lg:p-8 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        <AccountTabs />

        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-3">Tu Suscripción</h1>
          <p className="text-slate-400">Gestiona tu plan y accede a funciones avanzadas</p>
          
          {/* Selector de Ciclo de Facturación */}
          <div className="mt-8 inline-flex items-center p-1 bg-slate-900 border border-slate-800 rounded-2xl">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                billingCycle === 'monthly' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                billingCycle === 'annual' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Anual
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                -30%
              </span>
            </button>
          </div>
        </div>

        {/* Grid de Planes */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 ${
                plan.highlight 
                ? 'bg-slate-900 border-emerald-500 shadow-2xl shadow-emerald-500/10 scale-105 z-10' 
                : 'bg-slate-900/50 border-slate-800 opacity-90'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                  Recomendado
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm h-10">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white">€{plan.price}</span>
                  {plan.price > 0 && <span className="text-slate-500 font-medium">/mes</span>}
                </div>
                {billingCycle === 'annual' && plan.price > 0 && (
                  <p className="text-emerald-500 text-xs font-bold mt-1">Facturado anualmente (€119.88)</p>
                )}
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-sm">
                    <div className="mt-1 p-0.5 bg-emerald-500/20 rounded-full">
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <span className="text-slate-300">{feature}</span>
                  </div>
                ))}
                {plan.notIncluded.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-sm opacity-40">
                    <div className="mt-1 p-0.5 bg-slate-800 rounded-full">
                      <X className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <span className="text-slate-500">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-95 ${
                  plan.highlight
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-white'
                } ${currentPlan === plan.name.toLowerCase().replace('plan ', '') ? 'opacity-50 cursor-default' : ''}`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Sección de Seguridad/Garantía */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: ShieldCheck, title: 'Pago Seguro', desc: 'Encriptación SSL de 256 bits' },
            { icon: Zap, title: 'Acceso Instantáneo', desc: 'Funciones Premium al momento' },
            { icon: Star, title: 'Sin Compromiso', desc: 'Cancela online en cualquier momento' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center p-4">
              <item.icon className="w-6 h-6 text-emerald-500 mb-2" />
              <h4 className="text-white text-sm font-bold">{item.title}</h4>
              <p className="text-slate-500 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Historial de Facturación Corto */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-500" />
              Últimas Facturas
            </h3>
            <button className="text-xs text-emerald-500 hover:underline">Ver historial completo</button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800/50">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-900 rounded-lg">
                  <CreditCard className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Sporvit Premium - Mensual</p>
                  <p className="text-xs text-slate-500">12 de Octubre, 2025</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white">€14.99</p>
                <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full uppercase">Pagado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}