"use client";
import React, { useState } from 'react';
import { 
  Activity, 
  Calculator, 
  Info, 
  Flame, 
  ArrowDown, 
  ArrowUp, 
  Target 
} from 'lucide-react';

export default function HarrisBenedictCalculator() {
  const [formData, setFormData] = useState({
    gender: 'male',
    age: '',
    weight: '',
    height: '',
    activity: '1.2'
  });

  const [result, setResult] = useState<null | {
    bmr: number;
    tdee: number;
    lose_mild: number;
    lose_heavy: number;
    gain: number;
  }>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateHarris = (e: React.FormEvent) => {
    e.preventDefault();
    
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseFloat(formData.age);
    const activity = parseFloat(formData.activity);

    if (!weight || !height || !age) return;

    // Fórmula Harris-Benedict Original (Revisada 1984 por Roza y Shizgal)
    let bmr = 0;
    if (formData.gender === 'male') {
      // Hombres: BMR = 88.362 + (13.397 x kg) + (4.799 x cm) - (5.677 x años)
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      // Mujeres: BMR = 447.593 + (9.247 x kg) + (3.098 x cm) - (4.330 x años)
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    const tdee = Math.round(bmr * activity);

    setResult({
      bmr: Math.round(bmr),
      tdee: tdee,
      lose_mild: Math.round(tdee * 0.90),
      lose_heavy: Math.round(tdee * 0.80),
      gain: Math.round(tdee * 1.10)
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
      <main className="pt-16 pb-16 container mx-auto px-4 sm:px-6 max-w-5xl">
        
        {/* Encabezado */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
            <Activity className="w-3 h-3" />
            Clásica y Robusta
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            Calculadora Harris-Benedict
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            La fórmula clásica para estimar tu tasa metabólica basal y requerimientos calóricos totales. Ideal para comparar con otros métodos.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Formulario */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-500" />
                Parámetros Corporales
              </h2>

              <form onSubmit={calculateHarris} className="space-y-6">
                
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

                {/* Inputs */}
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
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Peso (kg)</label>
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
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Altura (cm)</label>
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
                    </div>
                  </div>
                </div>

                {/* Nivel de Actividad */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Factor de Actividad
                  </label>
                  <select
                    name="activity"
                    value={formData.activity}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer"
                  >
                    <option value="1.2">Sedentario (Oficina, poco movimiento)</option>
                    <option value="1.375">Ligero (Ejercicio 1-3 días/sem)</option>
                    <option value="1.55">Moderado (Ejercicio 3-5 días/sem)</option>
                    <option value="1.725">Activo (Deporte 6-7 días/sem)</option>
                    <option value="1.9">Muy Activo (Doble sesión/Trabajo físico)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <Calculator className="w-5 h-5" />
                  Calcular Harris-Benedict
                </button>

              </form>
            </div>

            <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6">
              <h3 className="font-bold text-slate-200 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-500" />
                Diferencias con Mifflin-St Jeor
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Harris-Benedict fue creada en 1919 y revisada en 1984. Tiende a sobreestimar el gasto calórico entre un 5% y un 15% en personas con obesidad o muy sedentarias, pero puede ser más precisa para atletas con mucha masa muscular.
              </p>
            </div>
          </div>

          {/* Panel de Resultados (Reutilizamos el diseño exitoso del anterior) */}
          <div className="lg:col-span-5 space-y-6">
            {result ? (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-6">
                
                <div className="bg-gradient-to-br from-emerald-500/10 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  
                  <p className="text-emerald-400 font-bold uppercase tracking-wider text-xs mb-2">Mantenimiento (Harris-Benedict)</p>
                  <div className="text-5xl font-black text-white mb-2 tracking-tight">
                    {result.tdee}
                    <span className="text-xl text-slate-400 font-medium ml-1">kcal</span>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-emerald-500/20 flex justify-between items-center px-2">
                    <span className="text-xs text-slate-500 font-bold uppercase">Metabolismo Basal (BMR)</span>
                    <span className="text-sm font-bold text-slate-300">{result.bmr} kcal</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1 mb-3">Escenarios</h3>
                  
                  <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex justify-between items-center">
                     <div className="flex items-center gap-2 text-amber-400">
                        <ArrowDown className="w-4 h-4" />
                        <span className="font-bold text-sm">Pérdida Grasa</span>
                      </div>
                      <span className="font-bold text-white">{result.lose_heavy} kcal</span>
                  </div>

                  <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex justify-between items-center">
                     <div className="flex items-center gap-2 text-yellow-400">
                        <Target className="w-4 h-4" />
                        <span className="font-bold text-sm">Definición</span>
                      </div>
                      <span className="font-bold text-white">{result.lose_mild} kcal</span>
                  </div>

                  <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex justify-between items-center">
                     <div className="flex items-center gap-2 text-blue-400">
                        <ArrowUp className="w-4 h-4" />
                        <span className="font-bold text-sm">Volumen</span>
                      </div>
                      <span className="font-bold text-white">{result.gain} kcal</span>
                  </div>
                </div>

              </div>
            ) : (
              <div className="h-full bg-slate-900/20 border border-slate-800 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
                <Calculator className="w-12 h-12 text-slate-700 mb-4" />
                <p className="text-slate-500 text-sm">
                  Introduce tus datos para ver el desglose calórico según Harris-Benedict.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}