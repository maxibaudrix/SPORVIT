import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Calendar, Edit3, Brain, ChefHat, Camera, BarChart3,
  Zap, ArrowRight, ShieldCheck, CheckCircle2, ListChecks
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Funcionalidades | Sporvit',
  description: 'Descubre el nuevo ecosistema Sporvit: Planner inteligente, IA adaptativa, editor de comidas y entrenos, progreso avanzado y escáner nutricional.',
};

export default function FeaturesPage() {

  const featuresList = [
    {
      id: 'planner',
      icon: <Calendar className="w-12 h-12 text-emerald-400" />,
      title: "Planner Inteligente Semanal",
      subtitle: "Tu semana planificada con precisión.",
      description:
        "Organiza entrenamientos y comidas en un único planner que se adapta automáticamente a tus objetivos, preferencias y disponibilidad. Tu semana se vuelve predecible, ordenada y eficiente.",
      details: [
        "Plan semanal editable",
        "Recomendaciones automáticas de entrenos",
        "Comidas sugeridas según tus calorías del día",
        "Sincronización en tiempo real con tu progreso"
      ],
      image: "https://placehold.co/600x400/064e3b/10b981?text=Planner+UI"
    },
    {
      id: 'editor',
      icon: <Edit3 className="w-12 h-12 text-blue-400" />,
      title: "Editor de Comidas y Entrenamientos",
      subtitle: "Control total, cero fricción.",
      description:
        "Modifica cualquier comida o entreno con el editor nativo de Sporvit. Arrastra, ajusta por macros, cambia ejercicios, sustituye alimentos o adapta según tus sensaciones del día.",
      details: [
        "Editor de comidas con macros en tiempo real",
        "Editor de entrenos (sets, reps, carga, cardio)",
        "Sugerencias inteligentes según tu historial",
        "Adaptación dinámica según tu energía diaria"
      ],
      image: "https://placehold.co/600x400/1e1b4b/60a5fa?text=Meal+%26+Workout+Editor"
    },
    {
      id: 'states',
      icon: <ListChecks className="w-12 h-12 text-yellow-300" />,
      title: "Estados Visuales (Check System)",
      subtitle: "Tu adherencia, visible al instante.",
      description:
        "Marca cada comida o entreno como completado, parcial u omitido. La IA usa estos datos para ajustar tus calorías, volumen y sesiones futuras.",
      details: [
        "Completado / Parcial / Omitido",
        "Impacto automático en tu plan diario",
        "Historial visual de adherencia",
        "Recomendaciones basadas en comportamiento"
      ],
      image: "https://placehold.co/600x400/3f3f46/eab308?text=Adherence+States+UI"
    },
    {
      id: 'progress',
      icon: <BarChart3 className="w-12 h-12 text-purple-400" />,
      title: "Progreso y Analíticas Avanzadas",
      subtitle: "Datos claros. Decisiones simples.",
      description:
        "Visualiza tu rendimiento, adherencia, calorías, cargas de entrenamiento, peso y macros. Gráficos que te muestran exactamente qué está funcionando.",
      details: [
        "Gráficos de carga (EPOC, volumen, intensidad)",
        "Tendencias de peso, macros y energía",
        "Detección de estancamientos",
        "Predicciones basadas en adherencia"
      ],
      image: "https://placehold.co/600x400/312e81/a78bfa?text=Progress+Analytics"
    },
    {
      id: 'ai',
      icon: <Brain className="w-12 h-12 text-cyan-400" />,
      title: "IA Adaptativa en Tiempo Real",
      subtitle: "Tu plan evoluciona contigo.",
      description:
        "Sporvit ajusta tu plan automáticamente según lo que comes, entrenas, completas, o fallas. Nunca más tendrás un plan desactualizado.",
      details: [
        "Reajuste diario de macros",
        "Modificación automática del volumen de entrenamiento",
        "Notificaciones inteligentes",
        "Gestión de fatiga y recuperación"
      ],
      image: "https://placehold.co/600x400/0c4a6e/67e8f9?text=Adaptive+AI+Engine"
    },
    {
      id: 'scanner',
      icon: <Camera className="w-12 h-12 text-emerald-300" />,
      title: "Escáner Inteligente Nutricional",
      subtitle: "De la etiqueta a tu plan, en segundos.",
      description:
        "Escanea cualquier producto y recibe un análisis completo que te dice si ese alimento es compatible con tu objetivo, tu día y tus macros restantes.",
      details: [
        "Compatibilidad con tu día y tu objetivo",
        "Semáforo nutricional personalizado",
        "Análisis NOVA + eco-score",
        "Recomendaciones automáticas de sustitutos"
      ],
      image: "https://placehold.co/600x400/064e3b/10b981?text=Scanner+IA"
    },
    {
      id: 'chef',
      icon: <ChefHat className="w-12 h-12 text-orange-400" />,
      title: "Chef Zero Desperdicio",
      subtitle: "Comer bien nunca fue tan fácil.",
      description:
        "Dile a Sporvit qué tienes en la nevera y genera recetas que cumplen tus macros del día. Zero desperdicio, máximo sabor.",
      details: [
        "Recetas por ingredientes disponibles",
        "Macros exactas al día",
        "Instrucciones paso a paso",
        "Lista de compra optimizada"
      ],
      image: "https://placehold.co/600x400/451a03/fbbf24?text=Smart+Recipes"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30">
      <main className="pt-16 pb-16">

        {/* HERO */}
        <section className="container mx-auto px-6 text-center mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
            <Zap className="w-3 h-3" /> Ecosistema Integrado
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            Todo lo que necesitas.<br /> En un solo lugar.
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Entrena, come, registra, analiza y mejora. Sporvit conecta todos los elementos
            de tu vida fitness en una experiencia fluida impulsada por IA.
          </p>
        </section>

        {/* FEATURES LIST */}
        <section className="container mx-auto px-6 space-y-32">
          {featuresList.map((f, i) => (
            <div key={f.id} className={`flex flex-col lg:flex-row items-center gap-16 ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="flex-1 space-y-6">
                <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-800 shadow-xl">
                  {f.icon}
                </div>

                <h2 className="text-3xl md:text-4xl font-bold">{f.title}</h2>
                <p className="text-xl text-emerald-400 font-medium">{f.subtitle}</p>
                <p className="text-slate-400 text-lg leading-relaxed">{f.description}</p>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {f.details.map((d, index) => (
                    <li key={index} className="flex items-center gap-3 text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {d}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex-1 w-full">
                <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 aspect-video group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img src={f.image} alt={f.title} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute bottom-6 left-6 right-6 bg-slate-950/90 backdrop-blur p-4 rounded-xl border border-slate-800 shadow-lg">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <span className="text-sm font-mono text-emerald-200">Funcionalidad validada</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6 mt-32 text-center">
          <div className="bg-gradient-to-br from-emerald-900/50 to-slate-900 p-12 rounded-3xl border border-emerald-500/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Quieres probar el ecosistema completo?</h2>
            <p className="text-slate-300 mb-8 max-w-xl mx-auto">
              Activa tu planner y empieza a ver resultados desde la primera semana.
            </p>
            <Link 
              href="/onboarding" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-950 rounded-xl font-bold hover:bg-emerald-50 transition-colors"
            >
              Crear mi cuenta gratis <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
