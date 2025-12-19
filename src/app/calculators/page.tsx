//src/app/calculators/page.tsx
import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Calculator, Activity, Scale, Dumbbell, 
  ChefHat, Heart, ChevronRight, Bike, Timer, Droplet 
} from 'lucide-react';
import { Header } from '@/components/ui/layout/public/Header';
import { Footer } from '@/components/ui/layout/public/Footer';

export const metadata: Metadata = {
  title: 'Calculadoras Fitness y Nutrición | Sporvit',
  description: 'Herramientas gratuitas de precisión para optimizar tu rendimiento: FFMI, Macros, VO2 Máx, y más.',
};

export default function CalculatorsHubPage() {
  // Lista completa de calculadoras solicitadas
  const calculators = [
    // Nutrición y Metabolismo
    { title: "Gasto Energético Total (GET)", icon: <Calculator />, href: "/calculators/get", category: "Nutrición" },
    { title: "Calorías (Harris-Benedict)", icon: <Calculator />, href: "/calculators/harris-benedict", category: "Nutrición" },
    { title: "Calorías y Macronutrientes", icon: <ChefHat />, href: "/calculators/macros", category: "Nutrición" },
    { title: "Gasto Energético Basal (GEB)", icon: <Calculator />, href: "/calculators/geb", category: "Nutrición" },
    { title: "Consumo de Agua Diario", icon: <Droplet />, href: "/calculators/water", category: "Nutrición" },
    { title: "Ingesta Diaria Recomendada (IDR)", icon: <ChefHat />, href: "/calculators/idr", category: "Nutrición" },
    { title: "Calculadora Keto", icon: <ChefHat />, href: "/calculators/keto", category: "Nutrición" },
    { title: "Nutricional para Triatlones", icon: <Activity />, href: "/calculators/triathlon-nutrition", category: "Nutrición" },
    { title: "Ingesta de Proteínas", icon: <Dumbbell />, href: "/calculators/protein", category: "Nutrición" },
    { title: "Déficit Calórico", icon: <Scale />, href: "/calculators/deficit", category: "Nutrición" },
    { title: "Planificación Nutricional Competencias", icon: <Activity />, href: "/calculators/competition-nutrition", category: "Nutrición" },
    { title: "Hidratación para Competencias", icon: <Droplet />, href: "/calculators/competition-hydration", category: "Nutrición" },
    { title: "Macronutrientes por Dieta", icon: <ChefHat />, href: "/calculators/diet-macros", category: "Nutrición" },
    { title: "Carga de carbohidratos", icon: <ChefHat />, href: "/calculators/carb-loading", category: "Nutrición" },
    { title: "Composición Nutricional", icon: <Calculator />, href: "/scanner", category: "Herramienta", badge: "App" },

    // Composición Corporal
    { title: "Índice de Masa Libre de Grasa (FFMI)", icon: <Dumbbell />, href: "/calculators/ffmi", category: "Cuerpo", highlight: true },
    { title: "Índice de Masa Corporal (IMC)", icon: <Scale />, href: "/calculators/imc", category: "Cuerpo" },
    { title: "Porcentaje de Grasa Corporal (PGC)", icon: <Scale />, href: "/calculators/body-fat", category: "Cuerpo" },
    { title: "Masa Corporal Magra (LBM)", icon: <Scale />, href: "/calculators/lbm", category: "Cuerpo" },

    // Entrenamiento y Rendimiento
    { title: "VO2 Máx", icon: <Heart />, href: "/calculators/vo2max", category: "Rendimiento" },
    { title: "Zona de Quema de Grasas", icon: <Heart />, href: "/calculators/fat-burning-zone", category: "Rendimiento" },
    { title: "Calorías por Frecuencia Cardíaca", icon: <Heart />, href: "/calculators/calories-heart-rate", category: "Rendimiento" },
    { title: "Calorías Quemadas (Actividad)", icon: <Activity />, href: "/calculators/calories-burned", category: "Rendimiento" },
    { title: "Frecuencia Cardíaca Objetivo", icon: <Heart />, href: "/calculators/target-heart-rate", category: "Rendimiento" },
    { title: "Zonas de Frecuencia Cardíaca", icon: <Heart />, href: "/calculators/heart-rate-zones", category: "Rendimiento" },
    { title: "Ritmo de Entrenamiento Running", icon: <Timer />, href: "/calculators/running-pace", category: "Rendimiento" },
    { title: "Ritmo de Carrera", icon: <Timer />, href: "/calculators/race-pace", category: "Rendimiento" },
    { title: "Volumen de Entrenamiento", icon: <Dumbbell />, href: "/calculators/training-volume", category: "Rendimiento" },
    { title: "1RM (Repetición Máxima)", icon: <Dumbbell />, href: "/calculators/1rm", category: "Rendimiento" },
    { title: "Fuerza Relativa", icon: <Dumbbell />, href: "/calculators/relative-strength", category: "Rendimiento" },
    { title: "Tapering Training", icon: <Activity />, href: "/calculators/tapering", category: "Rendimiento" },
    { title: "Progresión de Entrenamiento", icon: <Activity />, href: "/calculators/progression", category: "Rendimiento" },

    // Ciclismo / Otros
    { title: "Presión de Neumáticos", icon: <Bike />, href: "/calculators/tire-pressure", category: "Ciclismo" },
    { title: "Tamaño Cuadro y Configuración", icon: <Bike />, href: "/calculators/bike-fit", category: "Ciclismo" },
    { title: "Ratio Potencia/Peso", icon: <Bike />, href: "/calculators/power-weight", category: "Ciclismo" },
    { title: "Sueño Óptimo", icon: <Activity />, href: "/calculators/sleep", category: "Salud" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30">
      
      <main className="pt-16 pb-16 container mx-auto px-4 sm:px-6 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
            <Calculator className="w-3 h-3" />
            Herramientas Gratuitas
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            Centro de Calculadoras
          </h1>
          <p className="text-xl text-slate-400">
            Optimiza tu nutrición y entrenamiento con datos precisos.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {calculators.map((calc, idx) => (
            <Link 
              key={idx}
              href={calc.href}
              className={`group flex flex-col p-5 rounded-2xl border transition-all duration-300 ${
                calc.highlight 
                  ? 'bg-slate-900/80 border-emerald-500/50 shadow-lg shadow-emerald-900/20' 
                  : 'bg-slate-900/30 border-slate-800 hover:border-emerald-500/30 hover:bg-slate-900/50'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl ${calc.highlight ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-950 text-slate-400 group-hover:text-emerald-400'} transition-colors`}>
                  {React.cloneElement(calc.icon as React.ReactElement, { className: 'w-6 h-6' })}
                </div>
                {calc.badge && (
                  <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 text-[10px] font-bold uppercase rounded-full">
                    {calc.badge}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-slate-200 mb-1 group-hover:text-white transition-colors line-clamp-2">
                {calc.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-4">
                {calc.category}
              </p>

              <div className="mt-auto flex items-center text-xs font-bold text-emerald-500 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                Calcular <ChevronRight className="w-3 h-3 ml-1" />
              </div>
            </Link>
          ))}
        </div>

      </main>

    </div>
  );
}