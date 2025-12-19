import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  ChevronLeft, Calendar, Edit3, Brain, ListChecks, BarChart3,
  Camera, ArrowRight, CheckCircle2
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cómo Funciona | Sporvit',
  description:
    'Descubre cómo Sporvit integra IA, nutrición, entrenamiento y planificación en un sistema único que se adapta a ti día a día.',
};

export default function HowItWorksPage() {

  const steps = [
    {
      num: "01",
      title: "Onboarding Inteligente",
      desc:
        "En solo 3 minutos configuramos tu metabolismo, objetivos, disponibilidad semanal, preferencias alimentarias y nivel deportivo. Esto genera el primer borrador del plan.",
      icon: Calendar,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10"
    },
    {
      num: "02",
      title: "Planner Semanal Autogenerado",
      desc:
        "Tu semana se crea automáticamente: comidas, entrenos y recomendaciones adaptadas a tu objetivo. Todo editable y conectado entre sí.",
      icon: Calendar,
      color: "text-blue-400",
      bg: "bg-blue-500/10"
    },
    {
      num: "03",
      title: "Editor de Comidas y Entrenos",
      desc:
        "Modifica cualquier parte del plan sin perder la coherencia del día. Los macros se recalculan al instante y los entrenos ajustan su volumen según tus cambios.",
      icon: Edit3,
      color: "text-yellow-300",
      bg: "bg-yellow-500/10"
    },
    {
      num: "04",
      title: "Estados Visuales",
      desc:
        "Marca qué comidas y entrenos completaste. Esto permite medir adherencia real y sirve como insumo directo para la IA.",
      icon: ListChecks,
      color: "text-orange-400",
      bg: "bg-orange-500/10"
    },
    {
      num: "05",
      title: "IA Adaptativa",
      desc:
        "Sporvit ajusta automáticamente tus macros, entrenos y volumen según adherencia, energía, escaneos y ritmo real de progreso.",
      icon: Brain,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10"
    },
    {
      num: "06",
      title: "Progreso y Métricas",
      desc:
        "Visualiza tu evolución diaria y semanal con gráficos claros: calorías, cargas, volumen, peso, adherencia y predicciones.",
      icon: BarChart3,
      color: "text-purple-400",
      bg: "bg-purple-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <main className="pt-16 pb-16">

        {/* HERO */}
        <section className="container mx-auto px-6 text-center mb-24 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-8">
            La ciencia detrás de un plan<br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              que se adapta a ti
            </span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            Sporvit conecta tu nutrición, tu entrenamiento y tus hábitos en un único sistema fluido.
            Un plan vivo que cambia contigo, no al revés.
          </p>
        </section>

        {/* STEPS */}
        <section className="container mx-auto px-6 relative">

          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 transform -translate-x-1/2" />

          <div className="space-y-24">
            {steps.map((s, i) => (
              <div key={i} className={`flex flex-col md:flex-row items-center gap-12 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                
                <div className="flex-1 w-full">
                  <div className="relative aspect-square md:aspect-[4/3] bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl group">
                    <div className="absolute top-6 left-6 text-8xl font-black text-slate-800/50">
                      {s.num}
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-24 h-24 rounded-full ${s.bg} flex items-center justify-center shadow-lg`}>
                        <s.icon className={`w-10 h-10 ${s.color}`} />
                      </div>
                    </div>

                    <div className="absolute bottom-8 left-8 right-8 bg-slate-950/80 backdrop-blur p-4 rounded-xl border border-slate-800">
                      <div className="h-2 w-2/3 bg-slate-700 rounded mb-2"></div>
                      <div className="h-2 w-1/2 bg-slate-700 rounded"></div>
                    </div>
                  </div>
                </div>

                <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'} text-center md:text-left`}>
                  <h3 className={`text-sm font-bold uppercase tracking-widest mb-2 ${s.color}`}>Paso {s.num}</h3>
                  <h2 className="text-3xl font-bold mb-4">{s.title}</h2>
                  <p className="text-slate-400 text-lg leading-relaxed">{s.desc}</p>
                </div>

              </div>
            ))}
          </div>

        </section>

        {/* FAQ */}
        <section className="container mx-auto px-6 mt-32 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Preguntas Frecuentes</h2>

          <div className="space-y-4">
            <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
              <h4 className="font-bold text-white mb-2">¿Tengo que seguir el plan al 100%?</h4>
              <p className="text-slate-400 text-sm">
                No. El sistema está diseñado para ajustarse a ti, incluso cuando te sales del plan.
                La clave es la consistencia, no la perfección.
              </p>
            </div>

            <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
              <h4 className="font-bold text-white mb-2">¿Necesito gimnasio o equipamiento?</h4>
              <p className="text-slate-400 text-sm">
                No. Puedes seleccionar entrenamientos de casa, al aire libre o gimnasio completo.
              </p>
            </div>

            <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
              <h4 className="font-bold text-white mb-2">¿Qué pasa si me lesiono o tengo fatiga?</h4>
              <p className="text-slate-400 text-sm">
                La IA se ajusta automáticamente y reduce volumen, intensidad o calorías según tus sensaciones.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-24 py-20 bg-slate-900 border-t border-slate-800">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Tu nuevo sistema empieza con un clic
            </h2>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-slate-400 mb-8">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500"/> Plan gratuito disponible
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500"/> Sin compromiso
              </span>
            </div>

            <Link 
              href="/onboarding" 
              className="inline-flex items-center gap-2 px-10 py-4 bg-emerald-500 text-slate-950 rounded-full font-bold text-lg hover:bg-emerald-400 transition-all shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1"
            >
              Crear mi Plan Gratis
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
