import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Check, Star, Zap, ShieldCheck, ArrowRight, Crown } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Precios | Sporvit',
  description:
    'Planes diseñados para cualquier objetivo: desde usuarios que comienzan hasta atletas que quieren un sistema avanzado de planificación y nutrición con IA.',
};

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "0",
      period: "siempre",
      badge: null,
      highlighted: false,
      color: "border-slate-800 bg-slate-900/50",
      features: [
        "Planner semanal básico",
        "5 escaneos diarios",
        "Editor limitado de comidas",
        "Entrenamientos estándar",
        "Trackeo de progreso básico",
        "Recetas limitadas",
        "Comunidad Sporvit"
      ]
    },
    {
      name: "Pro",
      price: "9.99",
      period: "mes",
      badge: "Más Popular",
      highlighted: true,
      color: "border-emerald-500 bg-gradient-to-br from-emerald-600/20 to-teal-600/20",
      features: [
        "Planner Inteligente completo",
        "Escaneos ilimitados",
        "IA Adaptativa diaria",
        "Editor avanzado (comidas + entrenos)",
        "Estados visuales (check system)",
        "Recetas Zero Desperdicio",
        "Progreso con gráficas detalladas",
        "Predicciones de IA",
        "Sin anuncios"
      ]
    },
    {
      name: "Pro Anual",
      price: "99",
      period: "año",
      badge: "Ahorra 20€",
      highlighted: false,
      color: "border-yellow-500/50 bg-slate-900/50",
      features: [
        "Todo lo incluido en Pro",
        "2 meses gratis",
        "Acceso early a features",
        "Sincronización prioritaria de IA",
        "Exportar datos",
        "Recetas premium exclusivas"
      ]
    },
    {
      name: "Elite",
      price: "19.99",
      period: "mes",
      badge: "Atletas & Power Users",
      highlighted: false,
      color: "border-purple-500/50 bg-slate-900/50",
      features: [
        "Todo en Pro",
        "Recomendaciones de IA según fatiga",
        "Ajustes automáticos avanzados de cargas",
        "Progreso extendido (EPOC, volumen, adherencia profunda)",
        "Entrenamientos personalizados por objetivo",
        "Dashboard avanzado de rendimiento",
        "Recetas gourmet por macros exactas",
        "Soporte prioritario"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      
      <main className="pt-16 pb-24">

        {/* HERO */}
        <section className="container mx-auto px-6 text-center mb-20 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
            <Zap className="w-3 h-3" /> Elige tu camino
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Planes claros.  
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Resultados reales.</span>
          </h1>
          <p className="text-xl text-slate-400">
            Empieza gratis y escala cuando tu progreso lo pida.  
            Diseñado para principiantes, intermedios y atletas avanzados.
          </p>
        </section>

        {/* PRICING CARDS */}
        <section className="container mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl">

          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-3xl p-8 border ${plan.color} backdrop-blur-sm
              ${plan.highlighted ? 'shadow-emerald-500/20 shadow-xl scale-[1.05]' : ''}
              transition-all`}
            >

              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                  {plan.badge}
                </div>
              )}

              <h3 className="text-2xl font-bold text-center mb-4">{plan.name}</h3>

              <div className="text-center mb-6">
                <span className="text-5xl font-bold">{plan.price}</span>
                <span className="text-slate-400 text-lg">€/{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                    <span className="text-slate-300 text-sm">{feat}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 rounded-full font-semibold transition-all
                ${plan.highlighted
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/40'
                  : 'bg-slate-800 hover:bg-slate-700'}
              `}>
                Empezar
              </button>
            </div>
          ))}

        </section>

        {/* CTA FINAL */}
        <section className="container mx-auto px-6 mt-24 text-center">
          <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900 p-12 rounded-3xl border border-emerald-500/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿Listo para tu transformación?
            </h2>
            <p className="text-slate-300 mb-8 max-w-xl mx-auto">
              Empieza con el plan gratuito. Mejora cuando quieras. Sin compromiso.
            </p>

            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-slate-950 rounded-full font-bold text-lg hover:bg-emerald-50 transition-all shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1"
            >
              Crear mi cuenta <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
