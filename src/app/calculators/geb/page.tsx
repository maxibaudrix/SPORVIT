"use client";
import React, { useState } from 'react';
import { 
  Calculator, 
  Info, 
  Battery, 
  Zap, 
  Activity,
  User
} from 'lucide-react';

export default function GEBCalculator() {
  const [formData, setFormData] = useState({
    gender: 'male',
    age: '',
    weight: '',
    height: ''
  });

  const [result, setResult] = useState<null | {
    mifflin: number;
    harris: number;
    average: number;
  }>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateGEB = (e: React.FormEvent) => {
    e.preventDefault();
    
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseFloat(formData.age);

    if (!weight || !height || !age) return;

    // 1. Mifflin-St Jeor (Estándar moderno)
    let mifflin = 0;
    if (formData.gender === 'male') {
      mifflin = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      mifflin = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // 2. Harris-Benedict (Clásica revisada)
    let harris = 0;
    if (formData.gender === 'male') {
      harris = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      harris = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    setResult({
      mifflin: Math.round(mifflin),
      harris: Math.round(harris),
      average: Math.round((mifflin + harris) / 2)
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
      <main className="pt-16 pb-16 container mx-auto px-4 sm:px-6 max-w-5xl">
        
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
            <Battery className="w-3 h-3" />
            Metabolismo Basal
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            Gasto Energético Basal (GEB)
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Calcula la energía mínima que necesita tu cuerpo para sobrevivir en reposo absoluto (respirar, bombear sangre, función cerebral).
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Formulario */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
              <form onSubmit={calculateGEB} className="space-y-6">
                
                {/* Género */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, gender: 'male'})}
                    className={`p-3 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                      formData.gender === 'male' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-950/50 border-slate-800 text-slate-400'
                    }`}
                  >
                    <User className="w-4 h-4" /> Hombre
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, gender: 'female'})}
                    className={`p-3 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                      formData.gender === 'female' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-950/50 border-slate-800 text-slate-400'
                    }`}
                  >
                    <User className="w-4 h-4" /> Mujer
                  </button>
                </div>

                {/* Datos */}
                <div className="space-y-4">
                   <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Edad (años)</label>
                    <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-4 text-white focus:border-emerald-500 outline-none" placeholder="30" required />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Peso (kg)</label>
                        <input type="number" name="weight" value={formData.weight} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-4 text-white focus:border-emerald-500 outline-none" placeholder="70" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Altura (cm)</label>
                        <input type="number" name="height" value={formData.height} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-4 text-white focus:border-emerald-500 outline-none" placeholder="175" required />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <Calculator className="w-5 h-5" />
                  Calcular Metabolismo Basal
                </button>

              </form>
            </div>

            {/* Info Box */}
            <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6">
                <h3 className="font-bold text-slate-200 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4 text-emerald-500" />
                    ¿Por qué es importante el GEB?
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                    Conocer tu GEB es vital porque <strong>nunca deberías comer menos de esta cantidad</strong> de calorías de forma prolongada. Hacerlo puede ralentizar tu metabolismo, causar pérdida de masa muscular y afectar tu salud hormonal.
                </p>
            </div>
          </div>

          {/* Resultados */}
          <div className="lg:col-span-6 space-y-6">
            {result ? (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-6">
                
                {/* Main Result Card */}
                <div className="bg-gradient-to-br from-emerald-500/10 to-slate-900 border border-emerald-500/30 rounded-2xl p-8 text-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-all"></div>
                  
                  <div className="inline-flex items-center justify-center p-3 bg-emerald-500/20 rounded-full text-emerald-400 mb-4">
                    <Zap className="w-6 h-6" />
                  </div>
                  
                  <h2 className="text-5xl font-black text-white mb-2 tracking-tight">
                    {result.mifflin}
                    <span className="text-xl text-slate-400 font-medium ml-1">kcal/día</span>
                  </h2>
                  <p className="text-sm text-slate-400 uppercase tracking-widest font-bold">
                    Tu "Línea Roja" Metabólica
                  </p>
                </div>

                {/* Comparison Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Fórmula Mifflin-St Jeor</p>
                        <p className="text-xl font-bold text-white">{result.mifflin} kcal</p>
                        <p className="text-[10px] text-emerald-500 mt-1">Recomendada (Más precisa)</p>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Fórmula Harris-Benedict</p>
                        <p className="text-xl font-bold text-white">{result.harris} kcal</p>
                        <p className="text-[10px] text-slate-500 mt-1">Comparativa clásica</p>
                    </div>
                </div>

                {/* Hourly Breakdown */}
                <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Gasto por Hora (Durmiendo)</p>
                        <p className="text-2xl font-bold text-white">~{Math.round(result.mifflin / 24)} kcal</p>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-full">
                        <Activity className="w-6 h-6 text-slate-400" />
                    </div>
                </div>

              </div>
            ) : (
              <div className="h-full bg-slate-900/20 border border-slate-800 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-600">
                  <Battery className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-300 mb-2">Calcula tu Energía Base</h3>
                <p className="text-slate-500 max-w-xs">
                  Introduce tus datos para ver cuántas calorías quema tu cuerpo por el simple hecho de existir.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}