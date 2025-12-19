"use client";
import React, { useState } from 'react';
import { 
  Droplet, 
  Calculator, 
  Info, 
  Sun, 
  Cloud, 
  Activity,
  GlassWater
} from 'lucide-react';

export default function WaterCalculator() {
  const [formData, setFormData] = useState({
    weight: '',
    exercise: '0',
    weather: 'normal' // normal, hot
  });

  const [result, setResult] = useState<null | {
    liters: number;
    glasses: number;
    base: number;
    activity_add: number;
  }>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateWater = (e: React.FormEvent) => {
    e.preventDefault();
    
    const weight = parseFloat(formData.weight);
    const exerciseMins = parseFloat(formData.exercise);

    if (!weight) return;

    // 1. Base: Regla general de 35ml por kg de peso
    const baseNeeds = weight * 35; 

    // 2. Ajuste por Ejercicio: ~12ml por minuto de actividad media/intensa (~700ml/hora)
    const exerciseNeeds = exerciseMins * 12;

    // 3. Ajuste por Clima: +500ml si hace calor
    const weatherNeeds = formData.weather === 'hot' ? 500 : 0;

    const totalMl = baseNeeds + exerciseNeeds + weatherNeeds;
    const totalLiters = (totalMl / 1000).toFixed(2);
    
    // Vasos estándar de 250ml
    const glasses = Math.ceil(totalMl / 250);

    setResult({
      liters: parseFloat(totalLiters),
      glasses: glasses,
      base: Math.round(baseNeeds),
      activity_add: Math.round(exerciseNeeds + weatherNeeds)
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
      <main className="pt-16 pb-16 container mx-auto px-4 sm:px-6 max-w-5xl">
        
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-6">
            <Droplet className="w-3 h-3" />
            Hidratación Deportiva
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            Calculadora de Hidratación
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Determina tu ingesta diaria de agua óptima basándote en tu peso corporal, nivel de entrenamiento y clima.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Formulario */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
              <form onSubmit={calculateWater} className="space-y-6">
                
                {/* Peso */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tu Peso (kg)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        name="weight" 
                        value={formData.weight} 
                        onChange={handleInputChange} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-4 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" 
                        placeholder="75" 
                        required 
                      />
                    </div>
                </div>

                {/* Ejercicio */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Activity className="w-3 h-3" /> Minutos de Ejercicio
                    </label>
                    <div className="relative">
                      <input 
                        type="number" 
                        name="exercise" 
                        value={formData.exercise} 
                        onChange={handleInputChange} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-4 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" 
                        placeholder="0" 
                      />
                      <span className="absolute right-4 top-3.5 text-xs text-slate-500 font-bold">min/día</span>
                    </div>
                </div>

                {/* Clima */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Clima Actual</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, weather: 'normal'})}
                      className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                        formData.weather === 'normal'
                          ? 'bg-slate-800 border-slate-600 text-white'
                          : 'bg-slate-950/50 border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}
                    >
                      <Cloud className="w-5 h-5" />
                      <span className="text-sm font-bold">Templado</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, weather: 'hot'})}
                      className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                        formData.weather === 'hot'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                          : 'bg-slate-950/50 border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}
                    >
                      <Sun className="w-5 h-5" />
                      <span className="text-sm font-bold">Caluroso</span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                >
                  <Calculator className="w-5 h-5" />
                  Calcular Litros
                </button>

              </form>
            </div>
            
            <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6 flex gap-4 items-start">
               <Info className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
               <p className="text-sm text-slate-400 leading-relaxed">
                 La deshidratación de tan solo un 2% puede reducir tu rendimiento deportivo notablemente. Bebe antes de tener sed.
               </p>
            </div>
          </div>

          {/* Resultados */}
          <div className="lg:col-span-6 space-y-6">
            {result ? (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-6">
                
                {/* Tarjeta Principal */}
                <div className="bg-gradient-to-br from-cyan-500/20 to-slate-900 border border-cyan-500/30 rounded-2xl p-8 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  
                  <p className="text-cyan-400 font-bold uppercase tracking-wider text-xs mb-2">Objetivo Diario</p>
                  <div className="text-6xl font-black text-white mb-2 tracking-tight flex items-end justify-center gap-2">
                    {result.liters}
                    <span className="text-2xl text-slate-400 font-medium mb-1.5">Litros</span>
                  </div>
                  
                  <div className="items-center justify-center gap-2 text-slate-400 mt-4 bg-slate-950/30 inline-flex py-1 px-3 rounded-full border border-white/5">
                     <GlassWater className="w-4 h-4" />
                     <span className="text-sm font-medium">~{result.glasses} vasos de agua</span>
                  </div>
                </div>

                {/* Desglose */}
                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1 mb-2">Desglose</h3>
                    
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex justify-between items-center">
                        <div>
                            <p className="text-white font-bold">Necesidad Basal</p>
                            <p className="text-xs text-slate-500">Basado en tu peso ({formData.weight}kg)</p>
                        </div>
                        <span className="font-mono text-cyan-400">{result.base} ml</span>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex justify-between items-center">
                        <div>
                            <p className="text-white font-bold">Extra por Actividad/Clima</p>
                            <p className="text-xs text-slate-500">Reposición de sudor estimada</p>
                        </div>
                        <span className="font-mono text-amber-400">+{result.activity_add} ml</span>
                    </div>
                </div>

              </div>
            ) : (
              <div className="h-full bg-slate-900/20 border border-slate-800 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-600">
                  <Droplet className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-300 mb-2">Calcula tu Hidratación</h3>
                <p className="text-slate-500 max-w-xs">
                  Introduce tu peso y actividad para saber cuánta agua necesita tu cuerpo hoy.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}