// src/app/progress/page.tsx
'use client';
import React, { useState } from 'react';
import { 
  ChevronLeft, TrendingUp, TrendingDown, Scale, Ruler, 
  Camera, Share2, History, Plus, Flame, Target, Zap, 
  Loader2, CheckCircle, XCircle
} from 'lucide-react';

// Se asume que estos componentes existen en tu proyecto
// RUTAS CORREGIDAS PARA EVITAR ERRORES DE RESOLUCIÓN DE ALIASES (@/)
import { WeightChart } from '../../components/progress/WeightChart'; 
import { useProgressStore } from '../../store/progress';

// Mock de Periodos (para el selector)
const periods = [
  { label: 'Semana', value: '7days' },
  { label: 'Mes', value: '30days' },
  { label: '3 Meses', value: '90days' },
  { label: 'Todo', value: 'all' },
];

// Tipos de datos para las medidas (necesario si no se importa desde el store)
interface MeasurementEntry {
  date: string;
  waist: number; // cm
  chest: number; // cm
  hips: number; // cm
  bicep: number; // cm
}

export default function ProgressPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  // Usar el store de estado
  const { 
    currentWeight, initialWeight, currentIMC, dailyStreak, adherencePercentage, 
    predictionWeeks, averageLossRate, measurementsHistory, photos, fetchProgress 
  } = useProgressStore();

  const weightDifference = (currentWeight - initialWeight).toFixed(1);
  // Se añade el casting para manejar el tipo de datos del array
  const lastMeasurements = measurementsHistory[measurementsHistory.length - 1] as MeasurementEntry | undefined;
  const initialMeasurements = measurementsHistory[0] as MeasurementEntry | undefined;

  // Manejador del selector de período
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    fetchProgress(period); // Llama a la acción del store
  };
  
  // Función para obtener la diferencia de medida
  const getMeasurementDiff = (key: 'waist' | 'chest' | 'hips' | 'bicep') => {
    if (!lastMeasurements || !initialMeasurements) return 0;
    return (lastMeasurements[key] - initialMeasurements[key]).toFixed(1);
  };
  
  // Mock de Adherencia para el Heatmap Calendar (solo para visualización)
  const adherenceMock = Array(30).fill(0).map((_, i) => ({
    date: new Date(new Date().setDate(new Date().getDate() - (29 - i))).toISOString().split('T')[0],
    fulfilled: Math.random() > 0.15, // 85% de cumplimiento
  }));


  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans pb-24">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/dashboard" className="p-2 hover:bg-slate-800 rounded-full transition-colors">
              <ChevronLeft className="w-5 h-5 text-slate-400" />
            </a>
            <h1 className="text-lg font-bold">Mi Progreso</h1>
          </div>
          <button className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <Share2 className="w-5 h-5 text-emerald-400" />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-5xl space-y-8">

        {/* --- STATS CARDS --- */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="col-span-2 bg-gradient-to-br from-indigo-900/30 to-slate-900 p-5 rounded-2xl border border-indigo-500/20 relative overflow-hidden">
            <p className="text-sm text-indigo-300/70 font-medium mb-1">Peso vs Inicial</p>
            <h2 className="text-2xl font-bold text-white mb-2">
              {currentWeight} kg <span className="text-base text-slate-500 font-normal">→ {initialWeight} kg</span>
            </h2>
            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg w-fit ${
                parseFloat(weightDifference) < 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
            }`}>
              {parseFloat(weightDifference) < 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
              {weightDifference} kg
            </div>
          </div>

          <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
                <p className="text-xs text-slate-400 mb-1">IMC</p>
                <h3 className="text-2xl font-bold text-white">{currentIMC}</h3>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Normal</span>
          </div>

          <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
                <p className="text-xs text-slate-400 mb-1">Racha</p>
                <h3 className="text-2xl font-bold text-white">{dailyStreak} <span className="text-sm font-normal text-slate-500">días</span></h3>
            </div>
            <span className="text-[10px] text-orange-400 font-bold flex items-center gap-1">
              <Flame className="w-3 h-3 fill-current" /> Activa
            </span>
          </div>
        </section>

        {/* --- WEIGHT CHART & PERIOD SELECTOR --- */}
        <section className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Evolución de Peso
            </h3>
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              {periods.map((period) => (
                <button
                  key={period.value}
                  onClick={() => handlePeriodChange(period.value)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    selectedPeriod === period.value 
                      ? 'bg-slate-800 text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
          
          <WeightChart /> {/* Componente de gráfico */}
          
          <button className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg flex items-center justify-center gap-2">
            <Scale className="w-4 h-4" />
            Registrar Peso Hoy
          </button>
        </section>
        
        {/* --- ADHERENCE & PREDICTIONS --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Adherencia */}
            <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    
                    Adherencia y Consistencia
                </h3>
                <div className="text-4xl font-extrabold text-pink-400">{adherencePercentage}%</div>
                <p className="text-sm text-slate-400">Días con objetivo calórico y/o de entrenamiento cumplido.</p>
                
                {/* Heatmap Calendar Mock */}
                <div className="grid grid-cols-7 gap-1 mt-4 p-2 bg-slate-950 rounded-lg">
                    {adherenceMock.map((day, index) => (
                        <div 
                            key={index} 
                            className={`w-full h-5 rounded-sm transition-colors cursor-pointer ${
                                day.fulfilled ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-800/80 hover:bg-red-700'
                            }`}
                            title={`${day.date}: ${day.fulfilled ? 'Cumplido' : 'No Cumplido'}`}
                        ></div>
                    ))}
                    <div className="col-span-7 text-[10px] text-slate-500 text-right pt-2">Últimos 30 días</div>
                </div>
            </div>

            {/* Predicciones */}
            <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Proyecciones
                </h3>
                <div className="space-y-3">
                    <div className="bg-slate-800 p-3 rounded-lg border-l-4 border-yellow-400">
                        <p className="text-sm font-medium text-slate-300">
                            A este ritmo alcanzarás tu objetivo en:
                        </p>
                        <p className="text-xl font-bold text-white mt-1">
                            {predictionWeeks} semanas
                        </p>
                    </div>
                    <div className="bg-slate-800 p-3 rounded-lg border-l-4 border-indigo-400">
                        <p className="text-sm font-medium text-slate-300">
                            Velocidad promedio de pérdida:
                        </p>
                        <p className="text-xl font-bold text-white mt-1">
                            -{averageLossRate} kg/semana
                        </p>
                    </div>
                </div>
                <button className="text-xs text-slate-400 hover:text-white mt-3 flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Ajustar objetivo de pérdida
                </button>
            </div>
        </section>


        {/* --- BODY MEASUREMENTS --- */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Ruler className="w-5 h-5 text-purple-400" />
              Medidas Corporales
            </h3>
            <button className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
              Ver Historial <History className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['waist', 'chest', 'hips', 'bicep'].map((key) => {
              // Se usa un casting temporal para asegurar que TS sepa qué propiedades buscar en las mediciones mock
              const current = lastMeasurements ? lastMeasurements[key as keyof MeasurementEntry] : 0;
              const initial = initialMeasurements ? initialMeasurements[key as keyof MeasurementEntry] : 0;
              const diff = parseFloat(String(getMeasurementDiff(key as 'waist' | 'chest' | 'hips' | 'bicep')));
              const isPositive = diff >= 0; 
              
              return (
                <div key={key} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-1 capitalize">{key} (cm)</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-white">{current}</span>
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] mt-2 ${
                      diff === 0 ? 'text-slate-500' : isPositive ? 'text-green-400' : 'text-red-400' // Verde para ganancia (pecho/bicep), rojo para pérdida (cintura/cadera) -> Simplificado
                    }`}>
                    {Math.abs(diff)} cm vs inicio
                  </div>
                </div>
              );
            })}
          </div>
          
          <button className="w-full mt-4 py-3 border border-dashed border-slate-700 text-slate-400 rounded-xl hover:bg-slate-800 hover:text-white transition-colors flex items-center justify-center gap-2 text-sm font-medium">
            <Plus className="w-4 h-4" />
            Registrar Medidas Hoy
          </button>
        </section>

        {/* --- PROGRESS PHOTOS --- */}
        <section className="bg-slate-900/30 p-6 rounded-3xl border border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-orange-400" />
              Fotos de Transformación
            </h3>
            <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 relative">
            {/* Fotos Antes y Ahora */}
            {photos.slice(-2).map((photo, i) => (
              <div key={photo.id} className="relative group">
                <div className="aspect-[3/4] bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-lg">
                  {/* Se asume que 'url' contiene la imagen */}
                  <img src={photo.url} alt={`Progreso ${photo.date}`} className="w-full h-full object-cover opacity-80" onError={(e: any) => e.target.src = 'https://placehold.co/300x400/334155/64748b?text=Foto_No_Disponible'}/>
                </div>
                <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800">
                  <p className="text-xs font-bold text-white">{photo.date}</p>
                </div>
                <div className="absolute top-3 left-3 bg-emerald-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  {i === 0 ? 'Antes' : 'Ahora'}
                </div>
              </div>
            ))}
            
            {/* VS Badge centered */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-slate-950 rounded-full flex items-center justify-center border-2 border-slate-800 z-10 shadow-xl">
              <span className="text-xs font-black text-slate-500 italic">VS</span>
            </div>
          </div>
          
          <button className="w-full mt-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg">
            Ver Galería y Comparar Fechas
          </button>
        </section>

      </main>
    </div>
  );
}