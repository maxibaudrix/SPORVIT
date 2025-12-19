"use client";
import React, { useState } from 'react';
import { 
  ChefHat, 
  Calculator, 
  Info, 
  Dumbbell, 
  Beef, 
  Wheat, 
  Droplet,
  ArrowRight,
  Target
} from 'lucide-react';

export default function MacrosCalculator() {
  const [formData, setFormData] = useState({
    gender: 'male',
    age: '',
    weight: '',
    height: '',
    activity: '1.2',
    goal: 'maintain', // lose, maintain, gain
    diet: 'balanced'  // balanced, high-protein, low-carb, keto
  });

  const [result, setResult] = useState<null | {
    calories: number;
    protein: { grams: number; cals: number; pct: number };
    fats: { grams: number; cals: number; pct: number };
    carbs: { grams: number; cals: number; pct: number };
  }>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateMacros = (e: React.FormEvent) => {
    e.preventDefault();
    
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseFloat(formData.age);
    const activity = parseFloat(formData.activity);

    if (!weight || !height || !age) return;

    // 1. Calcular TDEE (Mifflin-St Jeor)
    let bmr = 0;
    if (formData.gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
    let tdee = bmr * activity;

    // 2. Ajustar por Objetivo
    let targetCalories = tdee;
    if (formData.goal === 'lose') targetCalories = tdee * 0.80; // -20%
    if (formData.goal === 'gain') targetCalories = tdee * 1.10; // +10%

    // 3. Definir Ratios según Dieta (Prot/Grasa/Carbo)
    let ratios = { p: 0.30, f: 0.30, c: 0.40 }; // Balanced default

    switch (formData.diet) {
      case 'balanced':
        ratios = { p: 0.30, f: 0.35, c: 0.35 };
        break;
      case 'high-protein':
        ratios = { p: 0.40, f: 0.30, c: 0.30 };
        break;
      case 'low-carb':
        ratios = { p: 0.40, f: 0.40, c: 0.20 };
        break;
      case 'keto':
        ratios = { p: 0.25, f: 0.70, c: 0.05 };
        break;
    }

    const finalCals = Math.round(targetCalories);

    setResult({
      calories: finalCals,
      protein: {
        grams: Math.round((finalCals * ratios.p) / 4),
        cals: Math.round(finalCals * ratios.p),
        pct: ratios.p * 100
      },
      fats: {
        grams: Math.round((finalCals * ratios.f) / 9),
        cals: Math.round(finalCals * ratios.f),
        pct: ratios.f * 100
      },
      carbs: {
        grams: Math.round((finalCals * ratios.c) / 4),
        cals: Math.round(finalCals * ratios.c),
        pct: ratios.c * 100
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
      <main className="pt-16 pb-16 container mx-auto px-4 sm:px-6 max-w-5xl">
        
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
            <ChefHat className="w-3 h-3" />
            Planificación Nutricional
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            Calorías y Macronutrientes
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Calcula tus calorías diarias y el reparto exacto de proteínas, grasas y carbohidratos según tu objetivo y estilo de alimentación.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Formulario */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
              <form onSubmit={calculateMacros} className="space-y-6">
                
                {/* Género */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, gender: 'male'})}
                    className={`p-3 rounded-xl border text-sm font-bold transition-all ${
                      formData.gender === 'male' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-950/50 border-slate-800 text-slate-400'
                    }`}
                  >
                    Hombre
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, gender: 'female'})}
                    className={`p-3 rounded-xl border text-sm font-bold transition-all ${
                      formData.gender === 'female' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-950/50 border-slate-800 text-slate-400'
                    }`}
                  >
                    Mujer
                  </button>
                </div>

                {/* Datos Biométricos */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Edad</label>
                    <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-white focus:border-emerald-500 outline-none" placeholder="25" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Peso (kg)</label>
                    <input type="number" name="weight" value={formData.weight} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-white focus:border-emerald-500 outline-none" placeholder="75" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Altura (cm)</label>
                    <input type="number" name="height" value={formData.height} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-white focus:border-emerald-500 outline-none" placeholder="180" />
                  </div>
                </div>

                {/* Actividad */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Nivel de Actividad</label>
                  <select name="activity" value={formData.activity} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-4 text-white focus:border-emerald-500 outline-none cursor-pointer">
                    <option value="1.2">Sedentario (Oficina, sin ejercicio)</option>
                    <option value="1.375">Ligero (1-3 días/sem)</option>
                    <option value="1.55">Moderado (3-5 días/sem)</option>
                    <option value="1.725">Activo (6-7 días/sem)</option>
                    <option value="1.9">Muy Activo (Doble sesión)</option>
                  </select>
                </div>

                {/* Objetivo y Dieta */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                      <Target className="w-3 h-3" /> Objetivo
                    </label>
                    <select name="goal" value={formData.goal} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-4 text-white focus:border-emerald-500 outline-none cursor-pointer">
                      <option value="lose">Perder Grasa (-20%)</option>
                      <option value="maintain">Mantenimiento</option>
                      <option value="gain">Ganar Músculo (+10%)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                      <ChefHat className="w-3 h-3" /> Dieta
                    </label>
                    <select name="diet" value={formData.diet} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-4 text-white focus:border-emerald-500 outline-none cursor-pointer">
                      <option value="balanced">Equilibrada</option>
                      <option value="high-protein">Alta en Proteína</option>
                      <option value="low-carb">Baja en Carbos</option>
                      <option value="keto">Keto (Cetogénica)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <Calculator className="w-5 h-5" />
                  Calcular Macros
                </button>

              </form>
            </div>
          </div>

          {/* Resultados */}
          <div className="lg:col-span-6 space-y-6">
            {result ? (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-6">
                
                {/* Calorías Totales */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                   <div className="absolute left-0 top-0 w-1 h-full bg-emerald-500"></div>
                   <div>
                     <p className="text-emerald-400 font-bold uppercase tracking-wider text-xs mb-1">Tu objetivo diario</p>
                     <h2 className="text-4xl font-black text-white">{result.calories} <span className="text-lg text-slate-500 font-medium">kcal</span></h2>
                   </div>
                   <div className="text-right hidden md:block">
                     <p className="text-xs text-slate-500 font-bold uppercase mb-1">Distribución</p>
                     <p className="text-slate-300 text-sm">
                       {result.protein.pct}% P • {result.fats.pct}% G • {result.carbs.pct}% C
                     </p>
                   </div>
                </div>

                {/* Tarjetas de Macros */}
                <div className="grid gap-4">
                  
                  {/* Proteína */}
                  <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 flex items-center justify-between group hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <Beef className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Proteínas</p>
                        <p className="text-2xl font-bold text-white">{result.protein.grams}g</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-slate-500 text-xs font-mono">{result.protein.cals} kcal</p>
                       <div className="w-16 h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                         <div className="h-full bg-emerald-500" style={{ width: '100%' }}></div>
                       </div>
                    </div>
                  </div>

                  {/* Carbohidratos */}
                  <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 flex items-center justify-between group hover:border-blue-500/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                        <Wheat className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Carbohidratos</p>
                        <p className="text-2xl font-bold text-white">{result.carbs.grams}g</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-slate-500 text-xs font-mono">{result.carbs.cals} kcal</p>
                       <div className="w-16 h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                         <div className="h-full bg-blue-500" style={{ width: '100%' }}></div>
                       </div>
                    </div>
                  </div>

                  {/* Grasas */}
                  <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 flex items-center justify-between group hover:border-amber-500/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
                        <Droplet className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Grasas</p>
                        <p className="text-2xl font-bold text-white">{result.fats.grams}g</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-slate-500 text-xs font-mono">{result.fats.cals} kcal</p>
                       <div className="w-16 h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                         <div className="h-full bg-amber-500" style={{ width: '100%' }}></div>
                       </div>
                    </div>
                  </div>

                </div>

                <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/50">
                  <p className="text-xs text-slate-500 leading-relaxed text-center">
                    <Info className="w-3 h-3 inline mr-1" />
                    Estos valores son estimaciones. Ajusta según tu progreso semanal. 
                    1g Proteína = 4 kcal, 1g Carbohidrato = 4 kcal, 1g Grasa = 9 kcal.
                  </p>
                </div>

              </div>
            ) : (
              <div className="h-full bg-slate-900/20 border border-slate-800 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-600">
                  <ChefHat className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-300 mb-2">Diseña tu dieta</h3>
                <p className="text-slate-500 max-w-xs">
                  Completa tus datos, elige tu objetivo y el tipo de dieta para obtener tu plan de macros personalizado.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}