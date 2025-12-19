"use client";
import React, { useState } from 'react';
import { 
  Activity, 
  Calculator, 
  ChevronRight, 
  Info, 
  Flame, 
  Dumbbell, 
  ArrowDown, 
  ArrowUp, 
  Target 
} from 'lucide-react';

export default function GETCalculator() {
  const [formData, setFormData] = useState({
    gender: 'male',
    age: '',
    weight: '',
    height: '',
    activity: '1.2'
  });

  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateGET = (e) => {
    e.preventDefault();
    
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseFloat(formData.age);
    const activity = parseFloat(formData.activity);

    if (!weight || !height || !age) return;

    // Fórmula Mifflin-St Jeor
    let bmr = 0;
    if (formData.gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    const tdee = Math.round(bmr * activity);

    setResult({
      bmr: Math.round(bmr),
      tdee: tdee,
      lose_mild: Math.round(tdee * 0.90), // -10%
      lose_heavy: Math.round(tdee * 0.80), // -20%
      gain: Math.round(tdee * 1.10) // +10%
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
      <main className="pt-16 pb-16 container mx-auto px-4 sm:px-6 max-w-5xl">
        
        {/* Encabezado de la Herramienta */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
            <Activity className="w-3 h-3" />
            Calculadora Nutricional
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            Gasto Energético Total (GET)
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Descubre cuántas calorías necesitas realmente al día según tu actividad física para mantener, perder o ganar peso.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Formulario de Entrada */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-500" />
                Tus Datos
              </h2>

              <form onSubmit={calculateGET} className="space-y-6">
                
                {/* Género */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, gender: 'male'})}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
                      formData.gender === 'male'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold">Hombre</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, gender: 'female'})}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
                      formData.gender === 'female'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold">Mujer</span>
                  </button>
                </div>

                {/* Inputs Numéricos */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Edad</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        placeholder="25"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600"
                        required
                      />
                      <span className="absolute right-4 top-3.5 text-xs text-slate-500 font-bold">Años</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Peso</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        placeholder="70"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600"
                        required
                      />
                      <span className="absolute right-4 top-3.5 text-xs text-slate-500 font-bold">kg</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Altura</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        placeholder="175"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600"
                        required
                      />
                      <span className="absolute right-4 top-3.5 text-xs text-slate-500 font-bold">cm</span>
                    </div>
                  </div>
                </div>

                {/* Nivel de Actividad */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    Nivel de Actividad
                    <div className="group relative">
                      <Info className="w-3 h-3 cursor-help text-slate-500 hover:text-emerald-500" />
                      <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-slate-800 rounded-lg text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-slate-700 shadow-xl">
                        Sé honesto con tu nivel de actividad para obtener resultados precisos.
                      </div>
                    </div>
                  </label>
                  <select
                    name="activity"
                    value={formData.activity}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="1.2">Sedentario (Poco o nada de ejercicio)</option>
                    <option value="1.375">Ligero (Ejercicio 1-3 días/semana)</option>
                    <option value="1.55">Moderado (Ejercicio 3-5 días/semana)</option>
                    <option value="1.725">Activo (Ejercicio 6-7 días/semana)</option>
                    <option value="1.9">Muy Activo (Trabajo físico + Entreno duro)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <Calculator className="w-5 h-5" />
                  Calcular Requerimientos
                </button>

              </form>
            </div>

            {/* Información Educativa */}
            <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6">
              <h3 className="font-bold text-slate-200 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-500" />
                ¿Qué es el GET?
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                El Gasto Energético Total (GET) representa la cantidad de energía (calorías) que tu cuerpo consume en un día entero. Incluye tu metabolismo basal (energía para vivir) más la energía gastada en actividad física y el efecto térmico de los alimentos.
              </p>
            </div>
          </div>

          {/* Panel de Resultados */}
          <div className="lg:col-span-5 space-y-6">
            {result ? (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-6">
                
                {/* Resultado Principal */}
                <div className="bg-gradient-to-br from-emerald-500/10 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  
                  <p className="text-emerald-400 font-bold uppercase tracking-wider text-xs mb-2">Mantenimiento</p>
                  <div className="text-5xl font-black text-white mb-2 tracking-tight">
                    {result.tdee}
                    <span className="text-xl text-slate-400 font-medium ml-1">kcal</span>
                  </div>
                  <p className="text-sm text-slate-400">
                    Calorías diarias para mantener tu peso actual.
                  </p>

                  <div className="mt-6 pt-6 border-t border-emerald-500/20 flex justify-between items-center px-4">
                    <div className="text-left">
                      <p className="text-xs text-slate-500 font-bold uppercase">Basal (BMR)</p>
                      <p className="text-lg font-bold text-slate-300">{result.bmr} kcal</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 font-bold uppercase">Actividad</p>
                      <p className="text-lg font-bold text-slate-300">+{result.tdee - result.bmr} kcal</p>
                    </div>
                  </div>
                </div>

                {/* Objetivos */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1 mb-3">Tus Objetivos</h3>
                  
                  {/* Déficit */}
                  <div className="group bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 rounded-xl p-4 transition-all duration-300">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2 text-amber-400">
                        <ArrowDown className="w-4 h-4" />
                        <span className="font-bold">Perder Grasa</span>
                      </div>
                      <span className="text-2xl font-bold text-white">{result.lose_heavy}</span>
                    </div>
                    <p className="text-xs text-slate-500">Déficit agresivo (-20%)</p>
                  </div>

                  {/* Déficit Moderado */}
                  <div className="group bg-slate-900/50 border border-slate-800 hover:border-yellow-500/50 rounded-xl p-4 transition-all duration-300">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2 text-yellow-400">
                        <Target className="w-4 h-4" />
                        <span className="font-bold">Definición Lenta</span>
                      </div>
                      <span className="text-2xl font-bold text-white">{result.lose_mild}</span>
                    </div>
                    <p className="text-xs text-slate-500">Déficit sostenible (-10%)</p>
                  </div>

                  {/* Volumen */}
                  <div className="group bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 rounded-xl p-4 transition-all duration-300">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2 text-blue-400">
                        <ArrowUp className="w-4 h-4" />
                        <span className="font-bold">Ganar Músculo</span>
                      </div>
                      <span className="text-2xl font-bold text-white">{result.gain}</span>
                    </div>
                    <p className="text-xs text-slate-500">Superávit controlado (+10%)</p>
                  </div>
                </div>

              </div>
            ) : (
              // Estado Vacío (Placeholder)
              <div className="h-full bg-slate-900/20 border border-slate-800 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-600">
                  <Flame className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-300 mb-2">Esperando datos...</h3>
                <p className="text-slate-500 max-w-xs">
                  Completa el formulario a la izquierda para calcular tu perfil energético detallado.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}