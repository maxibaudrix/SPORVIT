'use client';
import React, { useState } from 'react';
import { ArrowRight, Target, Dumbbell, Apple, TrendingUp, Sparkles, Wand2, Settings, CheckCircle2 } from 'lucide-react';

export default function OnboardingWelcomePage() {
  const [hoveredOption, setHoveredOption] = useState(null);

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
            ¿Cómo quieres empezar?
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Elige la experiencia que mejor se adapte a ti. Puedes cambiar de opción cuando quieras.
          </p>
        </div>

        {/* Cards de Elección */}
        <div className="grid md:grid-cols-2 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
          
          {/* Opción 1: Asistido con IA */}
          <div 
            onMouseEnter={() => setHoveredOption('assisted')}
            onMouseLeave={() => setHoveredOption(null)}
            className={`relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border rounded-3xl p-8 transition-all duration-300 cursor-pointer group ${
              hoveredOption === 'assisted' 
                ? 'border-emerald-500 shadow-2xl shadow-emerald-500/20 scale-[1.02]' 
                : 'border-slate-700/50 hover:border-slate-600'
            }`}
          >
            {/* Badge Recomendado */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <div className="px-4 py-1.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-full shadow-lg">
                ⭐ RECOMENDADO
              </div>
            </div>

            {/* Icono Principal */}
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Wand2 className="w-8 h-8 text-emerald-400" />
            </div>

            {/* Título */}
            <h2 className="text-2xl font-bold mb-3 text-white">
              Ayúdame a crear mi planificación
            </h2>

            {/* Descripción */}
            <p className="text-slate-400 mb-6 leading-relaxed">
              Responde un cuestionario de <strong className="text-emerald-400">5 minutos</strong> y nuestra IA creará un plan personalizado de entrenamiento y nutrición adaptado a tus objetivos.
            </p>

            {/* Features */}
            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">Plan de entrenamiento personalizado</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">Menú semanal con macros calculados</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">Ajustes automáticos según progreso</span>
              </div>
            </div>

            {/* CTA Button */}
            <button 
              onClick={() => window.location.href = '/onboarding/step-1-biometrics'}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Comenzar Onboarding</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-center text-xs text-slate-500 mt-3">
              ⏱️ ~5 minutos
            </p>
          </div>

          {/* Opción 2: Manual */}
          <div 
            onMouseEnter={() => setHoveredOption('manual')}
            onMouseLeave={() => setHoveredOption(null)}
            className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border rounded-3xl p-8 transition-all duration-300 cursor-pointer group ${
              hoveredOption === 'manual' 
                ? 'border-blue-500 shadow-2xl shadow-blue-500/20 scale-[1.02]' 
                : 'border-slate-700/50 hover:border-slate-600'
            }`}
          >
            {/* Icono Principal */}
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Settings className="w-8 h-8 text-blue-400" />
            </div>

            {/* Título */}
            <h2 className="text-2xl font-bold mb-3 text-white">
              Crearé la planificación manualmente
            </h2>

            {/* Descripción */}
            <p className="text-slate-400 mb-6 leading-relaxed">
              Accede directamente al dashboard y crea tu propio plan de entrenamiento y nutrición. <strong className="text-blue-400">Control total</strong> desde el inicio.
            </p>

            {/* Features */}
            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">Diseña tus propias rutinas</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">Configura tus comidas a medida</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">Flexibilidad total en tus planes</span>
              </div>
            </div>

            {/* CTA Button */}
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 group border border-slate-600"
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
                  Recomendamos empezar con el onboarding asistido. Siempre podrás ajustar manualmente tu plan más adelante.
                </p>
              </div>
            </div>
            <a href="/features" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium text-sm whitespace-nowrap">
              Ver comparación →
            </a>
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