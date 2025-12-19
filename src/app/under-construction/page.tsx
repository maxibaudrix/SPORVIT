"use client"; // Necesario para usar router.back()

import React from 'react';
import { Construction, ArrowLeft, Hammer } from 'lucide-react';
import useRouter from 'next/router'; 

export default function UnderConstructionPage() {
  let router;
  try {
    // Intenta usar el hook importado
    router = useRouter(); 
  } catch (e) {
    // Fallback: Crea un objeto simulado que tiene la función 'back' para evitar el error de runtime.
    router = {
      back: () => window.history.back(),
    };
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-md text-center">
        
        {/* Icon Container */}
        <div className="mx-auto w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center border border-slate-800 mb-8 shadow-2xl relative group">
          <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <Construction className="w-12 h-12 text-emerald-400 animate-pulse" />
          {/* Floating Hammer */}
          <div className="absolute -right-4 -top-4 bg-slate-800 p-2 rounded-xl border border-slate-700 transform rotate-12">
            <Hammer className="w-6 h-6 text-yellow-400" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-br from-white to-slate-500 bg-clip-text text-transparent">
          Estamos trabajando en ello
        </h1>
        
        <p className="text-slate-400 mb-8 leading-relaxed">
          Esta sección de Sporvit está actualmente en desarrollo. Estamos puliendo cada detalle para ofrecerte la mejor experiencia posible.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => router.back()}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Volver atrás
          </button>
          
          <a 
            href="/dashboard"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20"
          >
            Ir al Dashboard
          </a>
        </div>
        
      </div>
    </div>
  );
}