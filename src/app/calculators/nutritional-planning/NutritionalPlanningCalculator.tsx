"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Target, Flame, Zap, ShieldAlert, Share2, TrendingUp, TrendingDown, 
  Dumbbell, Apple, Utensils, Layout
} from 'lucide-react';

export default function NutritionalPlanningCalculator() {
  const [formData, setFormData] = useState({
    tdee: '',
    goal: 'cut', // cut, maintain, bulk
    aggressiveness: 'moderate', // conservative, moderate, aggressive
    proteinGoal: '2.0', // g/kg
    weight: ''
  });
  
  const [errors, setErrors] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const calculatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const tdee = parseFloat(formData.tdee);
    const weight = parseFloat(formData.weight);
    const proteinFactor = parseFloat(formData.proteinGoal);

    if (!tdee || tdee < 1000 || !weight || weight < 30) {
      setErrors("Por favor, introduce valores de TDEE y peso válidos.");
      return;
    }
    setErrors(null);

    // Ajuste de calorías según agresividad
    let adjustment = 0;
    const isBulk = formData.goal === 'bulk';
    const isCut = formData.goal === 'cut';

    if (formData.aggressiveness === 'conservative') adjustment = isBulk ? 200 : -250;
    else if (formData.aggressiveness === 'moderate') adjustment = isBulk ? 400 : -500;
    else if (formData.aggressiveness === 'aggressive') adjustment = isBulk ? 600 : -750;

    const targetKcal = formData.goal === 'maintain' ? tdee : tdee + adjustment;

    // Reparto de Macros
    const proteinG = weight * proteinFactor;
    const proteinKcal = proteinG * 4;
    
    // Grasa (25% de las calorías totales como estándar saludable)
    const fatKcal = targetKcal * 0.25;
    const fatG = fatKcal / 9;

    // Carbohidratos (El resto)
    const carbKcal = targetKcal - proteinKcal - fatKcal;
    const carbG = carbKcal / 4;

    setResult({
      kcal: Math.round(targetKcal),
      p: Math.round(proteinG),
      c: Math.round(carbG),
      f: Math.round(fatG),
      adjustment: adjustment > 0 ? `+${adjustment}` : adjustment,
      goalLabel: formData.goal === 'bulk' ? 'Volumen' : formData.goal === 'cut' ? 'Definición' : 'Mantenimiento'
    });
  };

  const shareText = useMemo(() => {
    if (!result) return "";
    return `🍎 Mi Plan Nutricional en Sporvit (${result.goalLabel}):\n\n- Calorías: ${result.kcal} kcal\n- Proteína: ${result.p}g\n- Carbohidratos: ${result.c}g\n- Grasas: ${result.f}g\n\nEstructura tu dieta aquí:`;
  }, [result]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Planificación Nutricional Sporvit"></iframe>`,
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <Layout className="w-3 h-3" /> Arquitectura Nutricional Avanzada
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Calculadora de Planificación Nutricional
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
          "No hagas dieta, diseña un protocolo. La planificación es la diferencia entre el azar y el resultado."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculatePlan} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Flame className="w-3 h-3 text-blue-400" /> Tu TDEE (Calorías Mantenimiento)
                  </label>
                  <input type="number" value={formData.tdee} onChange={(e) => setFormData({...formData, tdee: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-xl text-white outline-none focus:border-blue-500 transition-all font-black" placeholder="2500" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Dumbbell className="w-3 h-3 text-blue-400" /> Peso Actual (kg)
                  </label>
                  <input type="number" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-xl text-white outline-none focus:border-blue-500 transition-all font-black" placeholder="75" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Objetivo de la Fase</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'cut', label: 'Definición', icon: TrendingDown },
                    { id: 'maintain', label: 'Mantenimiento', icon: Target },
                    { id: 'bulk', label: 'Volumen', icon: TrendingUp }
                  ].map((obj) => (
                    <button key={obj.id} type="button" onClick={() => setFormData({...formData, goal: obj.id})} className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${formData.goal === obj.id ? 'bg-blue-500 border-blue-500 text-slate-950' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                      <obj.icon className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase">{obj.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Agresividad</label>
                  <select value={formData.aggressiveness} onChange={(e) => setFormData({...formData, aggressiveness: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-4 text-white font-bold outline-none focus:border-blue-500 appearance-none">
                    <option value="conservative">Conservador (Lento/Seguro)</option>
                    <option value="moderate">Moderado (Estándar)</option>
                    <option value="aggressive">Agresivo (Rápido/Exigente)</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Proteína (g/kg)</label>
                  <input type="number" step="0.1" value={formData.proteinGoal} onChange={(e) => setFormData({...formData, proteinGoal: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-4 text-white font-bold outline-none focus:border-blue-500" />
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-500 hover:bg-blue-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg">
                <Calculator className="w-6 h-6" /> Generar Planificación
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="text-center mb-8 border-b border-slate-800 pb-8">
                <p className="text-blue-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Presupuesto Calórico {result?.goalLabel}</p>
                <div className="text-6xl font-black text-white italic tracking-tighter mb-2">
                  {result ? result.kcal : '--'} <span className="text-xl text-slate-500">kcal</span>
                </div>
                <div className="text-[10px] text-slate-500 font-bold uppercase italic">Ajuste sobre TDEE: {result?.adjustment || '--'} kcal</div>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  { l: 'Proteínas', v: result?.p, c: 'text-red-400' },
                  { l: 'Carbohidratos', v: result?.c, c: 'text-emerald-400' },
                  { l: 'Grasas', v: result?.f, c: 'text-orange-400' }
                ].map((item, i) => (
                  <div key={i} className="bg-slate-950/50 border border-slate-800 p-4 rounded-2xl flex justify-between items-center">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${item.c}`}>{item.l}</span>
                    <span className="text-2xl font-black text-white italic">{item.v || '--'}<span className="text-xs text-slate-600 ml-1">g</span></span>
                  </div>
                ))}
              </div>

              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-blue-500 text-blue-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mi Planificación Nutricional&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-blue-500" /> Inserta este Planificador
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-blue-500/50 focus:outline-none resize-none mb-3 cursor-pointer" />
            <button onClick={() => copyToClipboard(embedSnippet, 'embed')} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black transition-all border border-slate-700">
              {copyStatus === 'copied' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copyStatus === 'copied' ? 'CÓDIGO COPIADO' : 'COPIAR CÓDIGO EMBED'}
            </button>
          </div>
        </aside>
      </div>

      <article className="prose prose-invert prose-slate max-w-none space-y-16">
        <section className="bg-slate-900/30 border border-slate-800 rounded-[40px] p-8 md:p-12">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-4">
            <Apple className="w-8 h-8 text-blue-400" /> Planificación Nutricional: Del Cálculo a la Realidad
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                Saber cuántas calorías quemas (TDEE) es el primer paso, pero saber cómo distribuirlas según tu objetivo es lo que define el éxito de una **planificación nutricional**. No se trata solo de comer menos o comer más; se trata de manipular los macronutrientes para preservar la masa muscular, optimizar el rendimiento y asegurar la sostenibilidad del plan a largo plazo.
              </p>
              <p>
                Nuestra calculadora de Sporvit permite estructurar fases de **Definición (Corte)**, **Mantenimiento (Recomposición)** y **Volumen (Bulk)**. Cada fase tiene requerimientos específicos: mientras que en volumen buscamos un superávit controlado para ganar tejido magro sin exceso de grasa, en definición el objetivo es un déficit que priorice la pérdida de tejido adiposo protegiendo la proteína muscular mediante una ingesta elevada de nitrógeno.
              </p>
              <h3 className="text-xl font-bold text-white italic">La Importancia de la Agresividad</h3>
              <p>
                Uno de los errores más comunes es ser demasiado agresivo al inicio de una fase. Un déficit extremo provoca fatiga metabólica y pérdida de músculo, mientras que un superávit exagerado deriva en una ganancia de grasa innecesaria. El ajuste de agresividad en nuestra herramienta te ayuda a elegir un ritmo fisiológico saludable.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center space-y-4">
              <h3 className="text-xl font-bold text-blue-400 italic mb-4 uppercase text-center">Fases del Plan Nutricional</h3>
              {[
                { t: "Fase de Definición", d: "Déficit de 250-750 kcal. Alta proteína para saciedad y músculo." },
                { t: "Fase de Mantenimiento", d: "Calorías estables. Ideal para mejorar el rendimiento sin cambiar peso." },
                { t: "Fase de Volumen", d: "Superávit de 200-600 kcal. Enfoque en carbohidratos para energía." },
                { t: "Fase de Transición (Diet Break)", d: "Periodos cortos de mantenimiento para resetear el metabolismo." }
              ].map((item, i) => (
                <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  <div className="font-black text-xs text-white uppercase">{item.t}</div>
                  <div className="text-[10px] text-slate-500 font-bold">{item.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Estructuración de Macros por Prioridad</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Proteína: El Ancla", text: "Es el nutriente innegociable. En definición, recomendamos subir hasta 2.2-2.5g por kilo para evitar el catabolismo. En volumen, 1.8-2.0g son suficientes para la síntesis de proteína muscular." },
              { title: "Grasas: El Regulador", text: "Esenciales para la salud hormonal y absorción de vitaminas. Nuestra calculadora asigna un 25% de las calorías totales a las grasas, asegurando un entorno endocrino óptimo tanto en hombres como en mujeres." },
              { title: "Carbohidratos: El Combustible", text: "Son los que fluctúan. En fases de volumen, los hidratos de carbono deben ser la fuente principal de energía para permitir entrenamientos de alta intensidad y maximizar la recuperación de glucógeno." }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl group hover:border-blue-500/40 transition-all">
                <h3 className="text-blue-400 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-t from-blue-500/10 to-transparent border border-blue-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Ajuste Continuo y Flexibilidad</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            Ningún plan es estático. A medida que tu peso cambia, tu TDEE también lo hace. Una planificación exitosa requiere reevaluar tus macros cada 4-8 semanas. Además, recuerda la importancia del **Efecto Térmico de los Alimentos (TEF)** y de la calidad nutricional; los números son la base, pero los micronutrientes (vitaminas y minerales) son los que garantizan que esos macros se utilicen de forma eficiente. En Sporvit, abogamos por una nutrición basada en datos que se adapte a tu vida, permitiéndote disfrutar del proceso mientras alcanzas tus objetivos de rendimiento.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Estructura de Macros", "Planificación por Objetivos", "Nutrición Basada en Evidencia"].map((tag, i) => (
              <span key={i} className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-widest">
                {tag}
              </span>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}