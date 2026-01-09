'use client';
import React, { useState } from 'react';
import { ArrowRight, Target, Dumbbell, Apple, TrendingUp, Sparkles, Wand2, Settings, CheckCircle2, Zap, Edit3 } from 'lucide-react';
import { useOnboardingStore } from '@/store/onboarding';
import { useRouter } from 'next/navigation';

export default function OnboardingWelcomePage() {
  const [hoveredOption, setHoveredOption] = useState(null);
  const router = useRouter();
  const { setOnboardingType } = useOnboardingStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Container */}
      <div className="relative max-w-5xl mx-auto w-full px-4">
        
        {/* Logo y Badge Superior */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Bienvenido a Sporvit
          </div>

          {/* Título */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent leading-tight">
            Configura tu perfil
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Elige cuánto detalle quieres dar ahora. Siempre podrás completar tu perfil después.
          </p>
        </div>

        {/* Cards de Elección */}
        <div className="grid md:grid-cols-3 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">

          {/* Opción 1: Básico - 3 Pasos */}
          <div
            onMouseEnter={() => setHoveredOption('basic')}
            onMouseLeave={() => setHoveredOption(null)}
            className={`relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border rounded-3xl p-8 transition-all duration-300 cursor-pointer group flex flex-col ${
              hoveredOption === 'basic'
                ? 'border-emerald-500 shadow-2xl shadow-emerald-500/20 scale-[1.02]'
                : 'border-slate-700/50 hover:border-slate-600'
            }`}
          >
            {/* Badge Recomendado */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <div className="px-4 py-1.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-full shadow-lg">
                ⚡ INICIO RÁPIDO
              </div>
            </div>

            {/* Icono Principal */}
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-8 h-8 text-emerald-400" />
            </div>

            {/* Título */}
            <h2 className="text-2xl font-bold mb-3 text-white">
              Inicio Rápido
            </h2>

            {/* Descripción */}
            <p className="text-slate-400 mb-6 leading-relaxed">
              Solo <strong className="text-emerald-400">3 pasos básicos</strong> (2 minutos) para generar tu primer plan. Podrás completar tu perfil después para mayor personalización.
            </p>

            {/* Features */}
            <div className="space-y-3 mb-8 flex-grow">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">Datos biométricos básicos</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">Objetivo y timeline</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">Nivel de actividad</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => {
                setOnboardingType('basic');
                router.push('/onboarding/step-1-biometrics');
              }}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 group h-14"
            >
              <span>Empezar Ahora</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-center text-xs text-slate-500 mt-3">
              ⏱️ ~2 minutos · 3 pasos
            </p>
          </div>

          {/* Opción 2: Completo - 6 Pasos */}
          <div
            onMouseEnter={() => setHoveredOption('complete')}
            onMouseLeave={() => setHoveredOption(null)}
            className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border rounded-3xl p-8 transition-all duration-300 cursor-pointer group flex flex-col ${
              hoveredOption === 'complete'
                ? 'border-blue-500 shadow-2xl shadow-blue-500/20 scale-[1.02]'
                : 'border-slate-700/50 hover:border-slate-600'
            }`}
          >
            {/* Icono Principal */}
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Wand2 className="w-8 h-8 text-blue-400" />
            </div>

            {/* Título */}
            <h2 className="text-2xl font-bold mb-3 text-white">
              Configuración Completa
            </h2>

            {/* Descripción */}
            <p className="text-slate-400 mb-6 leading-relaxed">
              Cuestionario completo de <strong className="text-blue-400">6 pasos</strong> (5 minutos) para un plan ultra-personalizado con todos los detalles de entrenamiento y nutrición.
            </p>

            {/* Features */}
            <div className="space-y-3 mb-8 flex-grow">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">Experiencia y preferencias de entrenamiento</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">Dieta, intolerancias y suplementos</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">Máxima personalización</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => {
                setOnboardingType('complete');
                router.push('/onboarding/step-1-biometrics');
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group border border-blue-500/50 h-14"
            >
              <span>Configuración Detallada</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-center text-xs text-slate-500 mt-3">
              ⏱️ ~5 minutos · 6 pasos
            </p>
          </div>

          {/* Opción 3: Manual */}
          <div
            onMouseEnter={() => setHoveredOption('manual')}
            onMouseLeave={() => setHoveredOption(null)}
            className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border rounded-3xl p-8 transition-all duration-300 cursor-pointer group flex flex-col ${
              hoveredOption === 'manual'
                ? 'border-purple-500 shadow-2xl shadow-purple-500/20 scale-[1.02]'
                : 'border-slate-700/50 hover:border-slate-600'
            }`}
          >
            {/* Icono Principal */}
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Edit3 className="w-8 h-8 text-purple-400" />
            </div>

            {/* Título */}
            <h2 className="text-2xl font-bold mb-3 text-white">
              Manual
            </h2>

            {/* Descripción */}
            <p className="text-slate-400 mb-6 leading-relaxed">
              Salta el onboarding y accede directamente al dashboard. Crea tus planes de entrenamiento y nutrición manualmente con <strong className="text-purple-400">control total</strong>.
            </p>

            {/* Features */}
            <div className="space-y-3 mb-8 flex-grow">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">Diseña tus propias rutinas</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">Configura comidas personalizadas</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">Flexibilidad total</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => {
                router.push('/dashboard');
              }}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 group border border-slate-600 h-14"
            >
              <span>Ir al Dashboard</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-center text-xs text-slate-500 mt-3">
              Para usuarios avanzados
            </p>
          </div>

        </div>

        {/* Info adicional */}
        <div className="bg-slate-900/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0">
                💡
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-1">¿No estás seguro?</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Empieza con el <strong className="text-emerald-400">inicio rápido</strong>. Podrás completar tu perfil más adelante para mayor personalización.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Help Link */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            ¿Necesitas ayuda?{' '}
            <a href="/contact" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
              Contáctanos
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}