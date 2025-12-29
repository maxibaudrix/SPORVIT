// src/app/calculators/page.tsx
"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Calculator, Activity, Scale, Dumbbell, 
  ChefHat, Heart, ChevronRight, Bike, Timer, Droplet,
  Search, X, Filter, TrendingUp
} from 'lucide-react';

// Metadata se exporta desde un Server Component separado si es necesario
// O se maneja en el layout superior

type Category = 'Todos' | 'Nutrición' | 'Cuerpo' | 'Rendimiento' | 'Ciclismo' | 'Salud';

interface Calculator {
  title: string;
  icon: React.ReactElement;
  href: string;
  category: Category;
  highlight?: boolean;
  badge?: string;
  description?: string;
}

export default function CalculatorsHubPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('Todos');

  // Lista completa de calculadoras con descripciones
  const calculators: Calculator[] = [
    // Nutrición y Metabolismo
    { 
      title: "Gasto Energético Total (GET)", 
      icon: <Calculator />, 
      href: "/calculators/get", 
      category: "Nutrición",
      description: "Calcula tu gasto calórico diario total"
    },
    { 
      title: "Calorías (Harris-Benedict)", 
      icon: <Calculator />, 
      href: "/calculators/harris-benedict", 
      category: "Nutrición",
      description: "Fórmula clásica de metabolismo basal"
    },
    { 
      title: "Calorías y Macronutrientes", 
      icon: <ChefHat />, 
      href: "/calculators/macros", 
      category: "Nutrición",
      description: "Calcula tus macros según tu objetivo"
    },
    { 
      title: "Gasto Energético Basal (GEB)", 
      icon: <Calculator />, 
      href: "/calculators/geb", 
      category: "Nutrición",
      description: "Calorías en reposo absoluto"
    },
    { 
      title: "Consumo de Agua Diario", 
      icon: <Droplet />, 
      href: "/calculators/water", 
      category: "Nutrición",
      description: "Hidratación personalizada"
    },
    { 
      title: "Ingesta Diaria Recomendada (IDR)", 
      icon: <ChefHat />, 
      href: "/calculators/idr", 
      category: "Nutrición",
      description: "Micronutrientes esenciales"
    },
    { 
      title: "Calculadora Keto", 
      icon: <ChefHat />, 
      href: "/calculators/keto", 
      category: "Nutrición",
      description: "Macros para dieta cetogénica"
    },
    { 
      title: "Nutricional para Triatlones", 
      icon: <Activity />, 
      href: "/calculators/triathlon-nutrition", 
      category: "Nutrición",
      description: "Estrategia nutricional para triatlón"
    },
    { 
      title: "Ingesta de Proteínas", 
      icon: <Dumbbell />, 
      href: "/calculators/protein", 
      category: "Nutrición",
      description: "Proteína según tu peso y actividad"
    },
    { 
      title: "Déficit Calórico", 
      icon: <Scale />, 
      href: "/calculators/deficit", 
      category: "Nutrición",
      description: "Pérdida de peso sostenible"
    },
    { 
      title: "Planificación Nutricional Competencias", 
      icon: <Activity />, 
      href: "/calculators/nutritional-planning", 
      category: "Nutrición",
      description: "Timing de nutrientes en competición"
    },
    { 
      title: "Hidratación para Competencias", 
      icon: <Droplet />, 
      href: "/calculators/competition-hydration", 
      category: "Nutrición",
      description: "Estrategia de hidratación en carrera"
    },
    { 
      title: "Tasa de Sudoración", 
      icon: <Droplet />, 
      href: "/calculators/sweating", 
      category: "Nutrición",
      description: "Pérdida de líquidos por hora"
    },
    { 
      title: "Suplementación Específica", 
      icon: <Calculator />, 
      href: "/calculators/supplement", 
      category: "Nutrición",
      description: "Dosis óptimas por peso corporal"
    },
    { 
      title: "Macronutrientes por Dieta", 
      icon: <ChefHat />, 
      href: "/calculators/diet-macros", 
      category: "Nutrición",
      description: "Macros según tipo de dieta"
    },
    { 
      title: "Carga de Carbohidratos", 
      icon: <ChefHat />, 
      href: "/calculators/carb-loading", 
      category: "Nutrición",
      description: "Protocolo pre-competición"
    },
    { 
      title: "Composición Nutricional", 
      icon: <Calculator />, 
      href: "/calculators/nutrition", 
      category: "Nutrición", 
      badge: "App",
      description: "Escanea productos en tiempo real"
    },

    // Composición Corporal
    { 
      title: "Índice de Masa Libre de Grasa (FFMI)", 
      icon: <Dumbbell />, 
      href: "/calculators/ffmi", 
      category: "Cuerpo", 
      highlight: true,
      description: "Evalúa tu masa muscular natural"
    },
    { 
      title: "Índice de Masa Corporal (IMC)", 
      icon: <Scale />, 
      href: "/calculators/imc", 
      category: "Cuerpo",
      description: "Relación peso-altura estándar"
    },
    { 
      title: "Porcentaje de Grasa Corporal", 
      icon: <Scale />, 
      href: "/calculators/body-fat", 
      category: "Cuerpo",
      description: "Método de pliegues cutáneos"
    },
    { 
      title: "Grasa Corporal (Método Marina USA)", 
      icon: <Scale />, 
      href: "/calculators/navy-body-fat", 
      category: "Cuerpo",
      description: "Método con circunferencias"
    },
    { 
      title: "Masa Corporal Magra (LBM)", 
      icon: <Scale />, 
      href: "/calculators/lbm", 
      category: "Cuerpo",
      description: "Peso sin grasa corporal"
    },
    { 
      title: "Metabolismo por Masa Magra", 
      icon: <Scale />, 
      href: "/calculators/katch-mcardle", 
      category: "Cuerpo",
      description: "Fórmula Katch-McArdle"
    },
    { 
      title: "Peso Ideal", 
      icon: <Scale />, 
      href: "/calculators/ideal-weight", 
      category: "Cuerpo",
      description: "Rango saludable según altura"
    },
    { 
      title: "Relación Cintura-Cadera (WHR)", 
      icon: <Scale />, 
      href: "/calculators/whr",
      category: "Cuerpo",
      description: "Indicador de salud metabólica"
    },
    { 
      title: "Pérdida de Peso Saludable", 
      icon: <Scale />, 
      href: "/calculators/healthy-weight", 
      category: "Cuerpo",
      description: "Ritmo sostenible semanal"
    },

    // Entrenamiento y Rendimiento
    { 
      title: "VO2 Máx", 
      icon: <Heart />, 
      href: "/calculators/vo2max", 
      category: "Rendimiento",
      description: "Capacidad aeróbica máxima"
    },
    { 
      title: "Zona de Quema de Grasas", 
      icon: <Heart />, 
      href: "/calculators/fat-burning-zone", 
      category: "Rendimiento",
      description: "Rango óptimo de FC"
    },
    { 
      title: "Calorías por Frecuencia Cardíaca", 
      icon: <Heart />, 
      href: "/calculators/calories-heart-rate", 
      category: "Rendimiento",
      description: "Gasto según tu pulso"
    },
    { 
      title: "Calorías Quemadas", 
      icon: <Activity />, 
      href: "/calculators/calories-burned", 
      category: "Rendimiento",
      description: "Por tipo de actividad"
    },
    { 
      title: "Frecuencia Cardíaca Objetivo", 
      icon: <Heart />, 
      href: "/calculators/target-heart-rate", 
      category: "Rendimiento",
      description: "FC ideal para tus objetivos"
    },
    { 
      title: "Zonas de Frecuencia Cardíaca", 
      icon: <Heart />, 
      href: "/calculators/heart-rate-zones", 
      category: "Rendimiento", 
      highlight: true,
      description: "5 zonas con método Karvonen"
    },
    { 
      title: "Ritmo de Entrenamiento Running", 
      icon: <Timer />, 
      href: "/calculators/running-pace", 
      category: "Rendimiento",
      description: "Pace por kilómetro"
    },
    { 
      title: "Ritmo de Carrera", 
      icon: <Timer />, 
      href: "/calculators/race-pace", 
      category: "Rendimiento",
      description: "Predicción de tiempos"
    },
    { 
      title: "Volumen de Entrenamiento", 
      icon: <Dumbbell />, 
      href: "/calculators/training-volume", 
      category: "Rendimiento",
      description: "Sets × Reps × Peso"
    },
    { 
      title: "1RM (Repetición Máxima)", 
      icon: <Dumbbell />, 
      href: "/calculators/1rm", 
      category: "Rendimiento",
      description: "Fuerza máxima estimada"
    },
    { 
      title: "Fuerza Relativa", 
      icon: <Dumbbell />, 
      href: "/calculators/relative-strength", 
      category: "Rendimiento",
      description: "Fuerza por kg de peso"
    },
    { 
      title: "Tapering Training", 
      icon: <Activity />, 
      href: "/calculators/tapering", 
      category: "Rendimiento",
      description: "Reducción pre-competición"
    },
    { 
      title: "Progresión de Entrenamiento", 
      icon: <Activity />, 
      href: "/calculators/progression", 
      category: "Rendimiento",
      description: "Carga progresiva semanal"
    },
    { 
      title: "Volumen Mensual", 
      icon: <Dumbbell />, 
      href: "/calculators/monthly-volume", 
      category: "Rendimiento",
      description: "Planificación mensual"
    },
    { 
      title: "Volumen por Grupo Muscular", 
      icon: <Dumbbell />, 
      href: "/calculators/muscle-volume", 
      category: "Rendimiento",
      description: "Series por músculo"
    },
    { 
      title: "Velocidad Crítica de Nado (CSS)", 
      icon: <Activity />, 
      href: "/calculators/css", 
      category: "Rendimiento",
      description: "Umbral aeróbico en natación"
    },
    { 
      title: "Plan Running Personalizado", 
      icon: <Timer />, 
      href: "/calculators/plan-running", 
      category: "Rendimiento",
      description: "Estructura de entrenamiento"
    },
    { 
      title: "Estimador de FTP", 
      icon: <Bike />, 
      href: "/calculators/ftp", 
      category: "Rendimiento",
      description: "Umbral funcional de potencia"
    },
    { 
      title: "Metabolismo Cunningham", 
      icon: <Calculator />, 
      href: "/calculators/basal-cunningham", 
      category: "Rendimiento",
      description: "BMR por masa magra"
    },
    { 
      title: "Wilks 2.0 / Puntos GL", 
      icon: <Dumbbell />, 
      href: "/calculators/wilkins", 
      category: "Rendimiento",
      description: "Comparativa de fuerza"
    },
    { 
      title: "ACWR (Ratio Carga)", 
      icon: <TrendingUp />, 
      href: "/calculators/acwr", 
      category: "Rendimiento",
      description: "Prevención de lesiones"
    },
    { 
      title: "Predicción de Tiempos (Riegel)", 
      icon: <Timer />, 
      href: "/calculators/riegel", 
      category: "Rendimiento",
      description: "Extrapola tu rendimiento"
    },

    // Ciclismo / Otros
    { 
      title: "Presión de Neumáticos", 
      icon: <Bike />, 
      href: "/calculators/tire-pressure", 
      category: "Ciclismo",
      description: "PSI óptimo según peso"
    },
    { 
      title: "Tamaño de Cuadro", 
      icon: <Bike />, 
      href: "/calculators/bike-fit", 
      category: "Ciclismo",
      description: "Bike fit personalizado"
    },
    { 
      title: "Ratio Potencia/Peso", 
      icon: <Bike />, 
      href: "/calculators/power-weight", 
      category: "Ciclismo",
      description: "Watts por kilogramo"
    },
    { 
      title: "Sueño Óptimo", 
      icon: <Activity />, 
      href: "/calculators/sleep", 
      category: "Salud",
      description: "Ciclos de sueño ideales"
    },
  ];

  // Categorías únicas
  const categories: Category[] = ['Todos', 'Nutrición', 'Cuerpo', 'Rendimiento', 'Ciclismo', 'Salud'];

  // Filtrado
  const filteredCalculators = useMemo(() => {
    return calculators.filter(calc => {
      const matchesCategory = selectedCategory === 'Todos' || calc.category === selectedCategory;
      const matchesSearch = calc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (calc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory, calculators]);

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
      
      {/* Header */}
      <div className="text-center mb-12 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
          <Calculator className="w-3 h-3" />
          +50 Herramientas Gratuitas
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
          Centro de Calculadoras
        </h1>
        <p className="text-xl text-slate-400 leading-relaxed">
          Optimiza tu nutrición y entrenamiento con datos precisos respaldados por ciencia.
        </p>
      </div>

      {/* Búsqueda y Filtros */}
      <div className="mb-12 space-y-6">
        {/* Búsqueda */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar calculadora... (ej: zonas cardíacas, macros, IMC)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filtros de Categoría */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <Filter className="w-4 h-4" />
            Filtrar:
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900/50 text-slate-400 border border-slate-800 hover:border-emerald-500/30 hover:text-emerald-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Contador de resultados */}
        <div className="text-center text-sm text-slate-500">
          {filteredCalculators.length} {filteredCalculators.length === 1 ? 'calculadora' : 'calculadoras'} 
          {searchQuery && ` para "${searchQuery}"`}
        </div>
      </div>

      {/* Grid de Calculadoras */}
      {filteredCalculators.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-16">
          {filteredCalculators.map((calc, idx) => (
            <Link 
              key={idx}
              href={calc.href}
              className={`group relative flex flex-col p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                calc.highlight 
                  ? 'bg-gradient-to-br from-emerald-900/20 to-slate-900/50 border-emerald-500/50 shadow-lg shadow-emerald-900/20' 
                  : 'bg-slate-900/30 border-slate-800 hover:border-emerald-500/30 hover:bg-slate-900/50 hover:shadow-xl hover:shadow-emerald-500/5'
              }`}
            >
              {/* Badge */}
              {calc.badge && (
                <div className="absolute -top-2 -right-2">
                  <span className="px-3 py-1 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase rounded-full shadow-lg">
                    {calc.badge}
                  </span>
                </div>
              )}

              {/* Icono */}
              <div className={`p-3 rounded-xl mb-4 w-fit ${
                calc.highlight 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'bg-slate-950 text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10'
              } transition-all`}>
                {React.cloneElement(calc.icon, { className: 'w-6 h-6' })}
              </div>

              {/* Título */}
              <h3 className="text-base font-bold text-white mb-2 leading-snug line-clamp-2 min-h-[2.5rem]">
                {calc.title}
              </h3>

              {/* Descripción */}
              {calc.description && (
                <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2 min-h-[2.5rem]">
                  {calc.description}
                </p>
              )}

              {/* Categoría */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800 group-hover:border-emerald-500/30 transition-colors">
                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                  {calc.category}
                </span>
                <div className="flex items-center text-xs font-bold text-emerald-500 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                  Calcular <ChevronRight className="w-3 h-3 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        // Sin resultados
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-slate-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-700" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            No encontramos resultados
          </h3>
          <p className="text-slate-500 mb-6">
            Intenta con otros términos de búsqueda o explora todas las categorías
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Todos');
            }}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all"
          >
            Ver todas las calculadoras
          </button>
        </div>
      )}

      {/* CTA Final */}
      <section className="mt-20 bg-gradient-to-br from-emerald-900/20 to-slate-900 border border-emerald-500/20 rounded-3xl p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          ¿No encuentras lo que buscas?
        </h2>
        <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
          Todas nuestras calculadoras están basadas en fórmulas científicas validadas. 
          Si necesitas una herramienta específica, contáctanos.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/contact"
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl transition-all shadow-xl inline-flex items-center gap-2"
          >
            Solicitar Calculadora
          </Link>
          <Link 
            href="/onboarding"
            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all border border-slate-700"
          >
            Crear Plan Personalizado
          </Link>
        </div>
      </section>

    </div>
  );
}