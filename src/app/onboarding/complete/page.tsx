'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Sparkles, Calendar, Utensils, Dumbbell, TrendingUp, ArrowRight, Download, Share2 } from 'lucide-react';

export default function OnboardingCompletePage() {
  const [showConfetti, setShowConfetti] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true);
    
    // Hide confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Mock data del plan generado
  const planData = {
    userName: 'Usuario',
    startDate: '15 de Diciembre, 2024',
    targetDate: '15 de Marzo, 2025',
    duration: 12,
    weeklyWorkouts: 5,
    dailyCalories: 2890,
    macros: {
      protein: 149,
      carbs: 372,
      fat: 74
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                backgroundColor: ['#10B981', '#14B8A6', '#3B82F6', '#8B5CF6', '#F59E0B'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                opacity: Math.random() * 0.7 + 0.3
              }}
            />
          ))}
        </div>
      )}

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className={`relative w-full max-w-4xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Logo */}
        <div className="absolute -top-16 left-0 flex items-center gap-2 opacity-80">
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
            <path d="M 8 8 L 8 14 M 8 8 L 14 8" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M 40 8 L 40 14 M 40 8 L 34 8" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M 18 16 L 18 32" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round"/>
            <path d="M 18 24 L 30 16" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round"/>
            <path d="M 18 24 L 30 32" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round"/>
            <path d="M 8 40 L 8 34 M 8 40 L 14 40" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M 40 40 L 40 34 M 40 40 L 34 40" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <span className="text-sm font-bold text-slate-400">Sporvit</span>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-3xl overflow-hidden">
          
          {/* Hero Section */}
          <div className="text-center p-12 pb-8 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none"></div>
            
            <div className="relative z-10">
              {/* Success Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mb-6 shadow-lg shadow-emerald-500/50 animate-bounce-slow">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                ¡Tu Plan Está Listo!
              </h1>

              <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
                Hemos creado un programa personalizado de <span className="text-emerald-400 font-bold">{planData.duration} semanas</span> diseñado específicamente para ti.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                  <div className="text-2xl mb-1">🗓️</div>
                  <div className="text-xs text-slate-500 mb-1">Duración</div>
                  <div className="text-lg font-bold text-white">{planData.duration} sem</div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                  <div className="text-2xl mb-1">💪</div>
                  <div className="text-xs text-slate-500 mb-1">Entrenos/sem</div>
                  <div className="text-lg font-bold text-white">{planData.weeklyWorkouts}x</div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                  <div className="text-2xl mb-1">🔥</div>
                  <div className="text-xs text-slate-500 mb-1">Calorías</div>
                  <div className="text-lg font-bold text-white">{planData.dailyCalories}</div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                  <div className="text-2xl mb-1">🍽️</div>
                  <div className="text-xs text-slate-500 mb-1">Recetas</div>
                  <div className="text-lg font-bold text-white">24+</div>
                </div>
              </div>
            </div>
          </div>

          {/* What's Included */}
          <div className="p-8 pt-4 border-t border-slate-800">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-medium mb-4">
                <Sparkles className="w-3 h-3" />
                Tu plan incluye
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              
              {/* Training Plan */}
              <div className="bg-gradient-to-br from-blue-900/20 to-slate-900/50 border border-blue-500/30 rounded-xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <Dumbbell className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">Plan de Entrenamiento</h3>
                      <p className="text-xs text-slate-400">{planData.duration} semanas programadas</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>Sesiones adaptadas a tu nivel</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>Periodización con fases progresivas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>Calendario sincronizado con tus días</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Nutrition Plan */}
              <div className="bg-gradient-to-br from-green-900/20 to-slate-900/50 border border-green-500/30 rounded-xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <Utensils className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">Plan Nutricional</h3>
                      <p className="text-xs text-slate-400">Recetas personalizadas</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Macros calculados: {planData.macros.protein}g P / {planData.macros.carbs}g C / {planData.macros.fat}g G</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Ingredientes locales de tu región</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Recetas ajustadas a tus restricciones</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Progress Tracking */}
              <div className="bg-gradient-to-br from-purple-900/20 to-slate-900/50 border border-purple-500/30 rounded-xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">Seguimiento</h3>
                      <p className="text-xs text-slate-400">Dashboard interactivo</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span>Registro de peso y medidas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span>Gráficos de progreso en tiempo real</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span>Análisis de adherencia semanal</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* AI Coach */}
              <div className="bg-gradient-to-br from-orange-900/20 to-slate-900/50 border border-orange-500/30 rounded-xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">Coach IA</h3>
                      <p className="text-xs text-slate-400">Asistente personal 24/7</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                      <span>Respuestas instantáneas a tus dudas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                      <span>Ajustes automáticos según progreso</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                      <span>Sugerencias personalizadas diarias</span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>

            {/* Timeline Preview */}
            <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white">Tu Journey</h3>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <div className="text-slate-500 mb-1">Inicio</div>
                  <div className="text-white font-bold">{planData.startDate}</div>
                </div>
                <div className="flex-grow mx-4 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 rounded-full relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"></div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50 animate-pulse"></div>
                </div>
                <div className="text-right">
                  <div className="text-slate-500 mb-1">Meta</div>
                  <div className="text-white font-bold">{planData.targetDate}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-grow bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 px-8 rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group">
                <span>Ir al Dashboard</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="px-6 py-4 bg-slate-900 border-2 border-slate-700 text-slate-300 font-bold rounded-xl hover:bg-slate-800 hover:border-slate-600 transition-all flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Descargar Plan
              </button>

              <button className="px-6 py-4 bg-slate-900 border-2 border-slate-700 text-slate-300 font-bold rounded-xl hover:bg-slate-800 hover:border-slate-600 transition-all flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5" />
                Compartir
              </button>
            </div>

          </div>

          {/* Footer Message */}
          <div className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border-t border-emerald-500/20 p-6 text-center">
            <p className="text-slate-300 text-sm mb-2">
              🎉 <span className="font-bold text-white">¡Felicidades, {planData.userName}!</span> Estás a punto de comenzar tu transformación.
            </p>
            <p className="text-slate-500 text-xs">
              Recuerda: la consistencia es la clave del éxito. ¡Vamos a por ello!
            </p>
          </div>

        </div>

      </div>

      {/* Confetti Animation Styles */}
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}