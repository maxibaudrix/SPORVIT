// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, CheckCircle2, Sparkles, Calendar, Edit3, 
  BarChart3, Brain, Camera, ChefHat, Zap, Target, 
  TrendingUp, Dumbbell, Menu, X, Star, Award, Users,
  ListChecks, Activity, ShieldCheck
} from 'lucide-react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Features principales del ecosistema
  const coreFeatures = [
    {
      icon: <Calendar className="w-7 h-7" />,
      title: "Planner Semanal Inteligente",
      description: "Tu semana completa organizada: entrenamientos y nutrición sincronizados en un único calendario adaptativo.",
      color: "from-emerald-500 to-teal-600",
      badge: "CORE"
    },
    {
      icon: <Edit3 className="w-7 h-7" />,
      title: "Editor Visual Total",
      description: "Modifica comidas y entrenos con precisión. Ajusta macros, cambia ejercicios, adapta tu plan en tiempo real.",
      color: "from-blue-500 to-cyan-600",
      badge: "NEW"
    },
    {
      icon: <ListChecks className="w-7 h-7" />,
      title: "Sistema de Estados",
      description: "Marca cada comida y entreno. La IA aprende de tu adherencia y ajusta automáticamente tu plan futuro.",
      color: "from-purple-500 to-pink-600",
      badge: "SMART"
    },
    {
      icon: <BarChart3 className="w-7 h-7" />,
      title: "Analíticas Avanzadas",
      description: "Visualiza tu progreso real: carga de entrenamiento, adherencia, tendencias de peso y macros cumplidos.",
      color: "from-orange-500 to-amber-600",
      badge: "PRO"
    },
    {
      icon: <Brain className="w-7 h-7" />,
      title: "IA Adaptativa",
      description: "Tu plan evoluciona contigo. Ajustes automáticos según tu progreso, fatiga y cumplimiento diario.",
      color: "from-cyan-500 to-blue-600",
      badge: "AI"
    },
    {
      icon: <Camera className="w-7 h-7" />,
      title: "Escáner Nutricional",
      description: "Escanea productos y descubre al instante si son compatibles con TU objetivo y TUS macros del día.",
      color: "from-green-500 to-emerald-600",
      badge: "SOON"
    }
  ];

  const stats = [
    { value: "12", label: "Semanas de Plan", icon: <Calendar className="w-5 h-5" /> },
    { value: "100%", label: "Personalizado", icon: <Target className="w-5 h-5" /> },
    { value: "IA", label: "Adaptativa", icon: <Brain className="w-5 h-5" /> },
    { value: "24/7", label: "Seguimiento", icon: <Activity className="w-5 h-5" /> }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Onboarding de 5 minutos",
      description: "Objetivos, biometría, actividad, entreno y nutrición. Todo lo necesario para generar tu plan perfecto.",
      icon: <Target className="w-6 h-6" />
    },
    {
      step: "2",
      title: "IA genera tu plan completo",
      description: "12 semanas de entrenamientos periodizados + plan nutricional completo con recetas y macros exactos.",
      icon: <Sparkles className="w-6 h-6" />
    },
    {
      step: "3",
      title: "Ejecuta y edita libremente",
      description: "Usa el planner semanal, edita según tus necesidades, marca completados y deja que la IA se adapte.",
      icon: <Edit3 className="w-6 h-6" />
    },
    {
      step: "4",
      title: "Progreso visible diario",
      description: "Dashboard con métricas reales: adherencia, carga, tendencias. Sabe exactamente dónde estás.",
      icon: <TrendingUp className="w-6 h-6" />
    }
  ];

  const testimonials = [
    {
      name: "Carlos M.",
      role: "Perdió 8kg en 10 semanas",
      image: "CM",
      text: "El planner semanal lo cambió todo. Saber exactamente qué entreno y qué comer cada día eliminó toda la fricción.",
      rating: 5
    },
    {
      name: "Ana L.",
      role: "Preparación medio maratón",
      image: "AL",
      text: "La IA adaptativa es increíble. Si un día como más, ajusta mi entreno automáticamente. Es como tener un entrenador 24/7.",
      rating: 5
    },
    {
      name: "Miguel R.",
      role: "Ganancia muscular limpia",
      image: "MR",
      text: "Las analíticas me permiten ver mi carga de entrenamiento y evitar sobreentrenamiento. Datos claros, decisiones simples.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      
      <main>
        {/* HERO SECTION */}
        <section className="relative pt-16 pb-16 md:pt-16 md:pb-16 overflow-hidden bg-slate-950/95 md:bg-transparent">
          {/* Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/20 blur-[120px] rounded-full opacity-50 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full opacity-30 pointer-events-none" />

          <div className="container mx-auto px-6 relative z-10 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Ecosistema Completo de Fitness + Nutrición
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-6 duration-1000">
              Planifica. Ejecuta. <br />
              Evoluciona.
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              El único sistema que integra <span className="text-emerald-400 font-semibold">planificación semanal</span>, 
              <span className="text-blue-400 font-semibold"> edición visual</span> y 
              <span className="text-purple-400 font-semibold"> IA adaptativa</span> para que alcances tus objetivos fitness de forma fluida y sostenible.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 mb-12">
              <Link 
                href="/register" 
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-emerald-500/25 hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                Crear Mi Plan Ahora
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/features" 
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 rounded-2xl font-bold text-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
              >
                Ver Todas las Features
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-slate-500 text-sm font-medium animate-in fade-in delay-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Plan gratis permanente</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Sin tarjeta requerida</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>IA incluida</span>
              </div>
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <section className="py-12 bg-slate-900/50 border-y border-slate-800">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="text-emerald-400">{stat.icon}</div>
                    <div className="text-3xl md:text-4xl font-bold text-white">
                      {stat.value}
                    </div>
                  </div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CORE FEATURES GRID */}
        <section id="features" className="py-24 bg-slate-950 relative">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                El Ecosistema Completo
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Seis herramientas integradas que trabajan juntas para que tú no tengas que pensar. Solo ejecutar.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/30 transition-all group relative overflow-hidden"
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  {/* Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      {feature.badge}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {feature.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    {feature.description}
                  </p>

                  {/* Hover indicator */}
                  <div className="mt-6 flex items-center text-emerald-400 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Ver más</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>

                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity rounded-3xl`}></div>
                </div>
              ))}
            </div>

            {/* Ver todas las features link */}
            <div className="text-center mt-12">
              <Link 
                href="/features" 
                className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
              >
                Ver documentación técnica completa
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-24 bg-slate-900/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                De Cero a Plan Completo en
                <span className="text-emerald-400"> 5 Minutos</span>
              </h2>
              <p className="text-slate-400 text-lg">
                Un onboarding diseñado para extraer lo esencial y generar un plan de 12 semanas personalizado
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {howItWorks.map((item, index) => (
                <div 
                  key={index} 
                  className="flex flex-col md:flex-row items-start gap-6 bg-slate-900/50 rounded-2xl p-6 border border-slate-800 hover:border-emerald-500/30 transition-all"
                >
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg">
                      {item.step}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-emerald-400">{item.icon}</div>
                      <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    </div>
                    <p className="text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link 
                href="/register" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-emerald-500/25 hover:scale-105 transition-all"
              >
                Comenzar Mi Onboarding
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 bg-slate-950">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Resultados Reales de Usuarios Reales
              </h2>
              <p className="text-slate-400">
                Miles de personas ya están transformando su fitness con Sporvit
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800 hover:border-emerald-500/30 transition-all"
                >
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-slate-300 mb-6 leading-relaxed italic">
                    "{testimonial.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-sm font-bold">
                      {testimonial.image}
                    </div>
                    <div>
                      <div className="font-bold text-white">{testimonial.name}</div>
                      <div className="text-emerald-400 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 blur-3xl"></div>
          
          <div className="container mx-auto px-6 relative z-10 text-center">
            <div className="max-w-3xl mx-auto bg-gradient-to-br from-emerald-900/50 to-slate-900/80 border border-emerald-500/30 p-12 rounded-3xl backdrop-blur-sm">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                Tu Plan Perfecto Te Espera
              </h2>
              <p className="text-slate-300 text-lg mb-8">
                5 minutos de onboarding. 12 semanas de plan completo. Resultados medibles desde el día 1.
              </p>
              <Link
                href="/register"
                className="inline-flex px-6 py-3 sm:px-10 sm:py-5 bg-white text-emerald-950 rounded-full font-bold text-base sm:text-xl hover:bg-emerald-50 transition-all shadow-xl hover:shadow-white/20 hover:scale-105 items-center gap-2"
              >
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                Crear Mi Plan Gratis
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
              <p className="mt-4 text-xs text-slate-400">
                Sin tarjeta • Sin compromiso • Plan free permanente
              </p>
            </div>
          </div>
        </section>
      </main>

      
    </div>
  );
}