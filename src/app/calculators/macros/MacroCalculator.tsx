"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Flame, Scale, Target, Zap, ShieldAlert, ArrowRight, Share2, Brain, Salad
} from 'lucide-react';

// Tipos de dieta y sus porcentajes (Proteína, Carbohidratos, Grasas)
const DIET_TYPES = {
  balanced: { name: 'Equilibrada', p: 30, c: 40, f: 30 },
  low_carb: { name: 'Baja en Carbohidratos', p: 40, c: 20, f: 40 },
  high_protein: { name: 'Alta en Proteína / Bulking', p: 35, c: 45, f: 20 },
  keto: { name: 'Cetogénica (Keto)', p: 25, c: 5, f: 70 },
};

export default function MacroCalculator() {
  const [formData, setFormData] = useState({
    calories: '',
    dietType: 'balanced'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const calculateMacros = (e: React.FormEvent) => {
    e.preventDefault();
    const kcal = parseFloat(formData.calories);
    const diet = (DIET_TYPES as any)[formData.dietType];

    if (!kcal || kcal < 800 || kcal > 10000) {
      setErrors({ calories: "Introduce un valor entre 800 y 10,000 kcal" });
      return;
    }
    setErrors({});

    // Gramos: Proteína (4 kcal/g), Carbo (4 kcal/g), Grasas (9 kcal/g)
    const pGrams = Math.round((kcal * (diet.p / 100)) / 4);
    const cGrams = Math.round((kcal * (diet.c / 100)) / 4);
    const fGrams = Math.round((kcal * (diet.f / 100)) / 9);

    setResult({
      protein: pGrams,
      carbs: cGrams,
      fats: fGrams,
      kcal,
      distribution: diet
    });

    if ((window as any).gtag) {
      (window as any).gtag('event', 'calculate_macros', { diet_type: diet.name, calories: kcal });
    }
  };

  const shareText = useMemo(() => 
    result ? `🥗 Mis macros para ${result.kcal} kcal: P: ${result.protein}g | C: ${result.carbs}g | G: ${result.fats}g. ¡Calcula los tuyos en Sporvit!` : "", 
  [result]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden;" title="Calculadora Macros Sporvit"></iframe>`,
  [currentUrl]);

  const copyToClipboard = useCallback(async (text: string, type: 'embed' | 'share') => {
    await navigator.clipboard.writeText(text);
    if (type === 'embed') setCopyStatus('copied');
    else setShareStatus('copied');
    setTimeout(() => { setCopyStatus('idle'); setShareStatus('idle'); }, 2000);
  }, []);

  return (
    <div className="pt-8 pb-16 container mx-auto px-4 sm:px-6 max-w-6xl">
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <Salad className="w-3 h-3" /> Arquitectura Nutricional
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Calculadora de Macronutrientes
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
          "Las calorías dictan tu peso; los macronutrientes dictan tu composición corporal."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        {/* INPUTS */}
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateMacros} noValidate className="space-y-8">
              <div className="space-y-3">
                <label htmlFor="calories" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Flame className="w-3 h-3 text-emerald-500" /> Calorías Diarias Objetivo
                </label>
                <div className="relative">
                  <input
                    id="calories"
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData({...formData, calories: e.target.value})}
                    className={`w-full bg-slate-950 border ${errors.calories ? 'border-red-500' : 'border-slate-800'} rounded-2xl py-6 px-6 text-3xl text-white outline-none focus:border-emerald-500 transition-all font-black`}
                    placeholder="2500"
                    aria-invalid={!!errors.calories}
                    aria-describedby="calories-error"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 font-bold italic">KCAL</div>
                </div>
                {errors.calories && <p id="calories-error" className="text-red-500 text-[10px] font-bold flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> {errors.calories}</p>}
              </div>

              <div className="space-y-3">
                <label htmlFor="dietType" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Target className="w-3 h-3 text-emerald-500" /> Tipo de Estrategia Nutricional
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(DIET_TYPES).map(([key, value]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFormData({...formData, dietType: key})}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        formData.dietType === key 
                          ? 'bg-emerald-500 border-emerald-500 text-slate-950' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="text-xs font-black uppercase mb-1">{value.name}</div>
                      <div className={`text-[10px] font-bold ${formData.dietType === key ? 'text-slate-800' : 'text-slate-600'}`}>
                        P:{value.p}% | C:{value.c}% | G:{value.f}%
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] uppercase tracking-tighter flex items-center justify-center gap-4 text-lg active:scale-[0.98]">
                <Calculator className="w-6 h-6" /> Obtener Reparto de Macros
              </button>
            </form>
          </div>
        </section>

        {/* RESULTADOS */}
        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-8 text-center">Tu Plan Diario de Macros</h2>
              
              <div className="space-y-5">
                {[
                  { label: 'Proteínas', val: result?.protein, unit: 'g', color: 'bg-red-500', icon: Zap, kcal: 4 },
                  { label: 'Carbohidratos', val: result?.carbs, unit: 'g', color: 'bg-blue-500', icon: Brain, kcal: 4 },
                  { label: 'Grasas', val: result?.fats, unit: 'g', color: 'bg-orange-500', icon: Flame, kcal: 9 }
                ].map((item, i) => (
                  <div key={i} className="bg-slate-950/50 border border-slate-800 p-5 rounded-2xl flex justify-between items-center group hover:border-emerald-500/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 ${item.color}/10 rounded-xl text-white`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-black uppercase text-slate-300">{item.label}</div>
                        <div className="text-[10px] text-slate-600 font-bold italic">{result ? (result.distribution as any)[item.label.toLowerCase().slice(0,1)] : '--'}% del total</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-white italic">{item.val || '--'}<span className="text-sm text-slate-500 ml-1">{item.unit}</span></div>
                      <div className="text-[9px] text-slate-600 font-bold uppercase">{item.val ? item.val * item.kcal : 0} kcal</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* SHARE */}
              {result && (
                <div className="mt-8 pt-8 border-t border-slate-800 grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center shadow-lg" aria-label="WhatsApp"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center shadow-lg" aria-label="Telegram"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-emerald-500 text-emerald-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mis Macros Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center shadow-lg" aria-label="Email"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-emerald-500" /> Inserta este plan nutricional
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-emerald-500/50 focus:outline-none resize-none mb-3" />
            <button onClick={() => copyToClipboard(embedSnippet, 'embed')} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
              {copyStatus === 'copied' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copyStatus === 'copied' ? 'Copiado' : 'Copiar Código'}
            </button>
          </div>
        </aside>
      </div>

      {/* CONTENIDO EDUCATIVO (+800 PALABRAS) */}
      <article className="prose prose-invert prose-slate max-w-none space-y-16">
        <section className="bg-slate-900/30 border border-slate-800 rounded-[40px] p-8 md:p-12">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-4">
            <Brain className="w-8 h-8 text-emerald-500" /> Los Tres Pilares de la Nutrición Deportiva
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                A menudo se dice que "una caloría es una caloría", pero desde el punto de vista de la **composición corporal**, esto no es del todo cierto. Mientras que el balance energético total determinará si pierdes o ganas peso, los **macronutrientes** determinarán la calidad de ese cambio.
              </p>
              <p>
                Calcular tus macros es el proceso de dividir tu ingesta calórica diaria en tres grandes grupos: Proteínas, Grasas y Carbohidratos. Nuestra calculadora utiliza porcentajes optimizados para diferentes perfiles metabólicos, permitiéndote pasar de una dieta genérica a una **nutrición de precisión**.
              </p>
              <h3 className="text-xl font-bold text-white italic">El rol crítico de la Proteína</h3>
              <p>
                En cualquier proceso de transformación, la proteína es la reina. No solo es responsable de la síntesis de tejido muscular, sino que tiene el mayor **efecto térmico de los alimentos (TEF)**, lo que significa que quemas más calorías simplemente digiriéndola. Además, es el nutriente más saciante, algo vital si estás en déficit calórico.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 space-y-6">
              <h3 className="text-xl font-bold text-emerald-500 italic mb-4 uppercase">Valor Energético por Gramo</h3>
              <div className="space-y-4">
                <div className="flex justify-between p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                  <span className="font-bold">Proteína</span>
                  <span className="font-black italic">4 kcal/g</span>
                </div>
                <div className="flex justify-between p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <span className="font-bold">Carbohidratos</span>
                  <span className="font-black italic">4 kcal/g</span>
                </div>
                <div className="flex justify-between p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
                  <span className="font-bold">Grasas</span>
                  <span className="font-black italic">9 kcal/g</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 italic">
                Nota: Esta diferencia es la razón por la que las dietas altas en grasas (Keto) suelen tener volúmenes de comida más pequeños en comparación con dietas altas en carbohidratos.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Estrategias según tu objetivo</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Definición Máxima", text: "Se recomienda un reparto 'Low Carb'. Al reducir los carbohidratos, el cuerpo mejora su sensibilidad a la insulina y tiende a movilizar más ácidos grasos como fuente de energía, siempre que la proteína se mantenga alta (1.8-2.2g/kg)." },
              { title: "Ganancia de Masa", text: "Aquí los carbohidratos son tus mejores aliados. Son el combustible principal para el entrenamiento de alta intensidad y generan un entorno hormonal (insulina) propicio para el anabolismo muscular." },
              { title: "Dieta Cetogénica", text: "La estrategia Keto busca entrar en cetosis, donde el hígado produce cuerpos cetónicos a partir de la grasa. Requiere mantener los carbohidratos por debajo del 5% del total diario." }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl group hover:border-emerald-500/40 transition-all">
                <h3 className="text-emerald-500 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-center gap-3">
            <Scale className="w-6 h-6 text-emerald-500" /> Flexibilidad vs Rigidez
          </h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg">
            Calculadora de Macronutrientes es una herramienta de guía, no una celda. La ciencia nutricional moderna apoya el concepto de **Dieta Flexible (IIFYM)**: siempre que alcances tus objetivos de proteína y te mantengas en tu presupuesto calórico, la fuente específica de los nutrientes es menos crítica para la composición corporal que la adherencia al plan a largo plazo. Utiliza estos datos para estructurar tus platos, pero deja espacio para la sostenibilidad psicológica.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Protocolo IIFYM", "Reparto de Macros Científico", "Optimizado para Rendimiento"].map((tag, i) => (
              <span key={i} className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-full text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                {tag}
              </span>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}