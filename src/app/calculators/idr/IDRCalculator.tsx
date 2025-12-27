"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Scale, Zap, ShieldAlert, ArrowRight, Share2, Target, Award, Brain, 
  ClipboardCheck, Activity, Milk, Apple, Droplets
} from 'lucide-react';

export default function IDRCalculator() {
  const [formData, setFormData] = useState({ gender: 'male', age: '', weight: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const calculateIDR = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(formData.weight);
    const a = parseInt(formData.age);
    const g = formData.gender;
    
    if (!w || w < 20) { setErrors({ weight: "Peso no válido" }); return; }
    if (!a || a < 1) { setErrors({ age: "Edad no válida" }); return; }
    setErrors({});

    // Lógica basada en estándares RDA (Simplificada para web)
    const protein = w * 0.8;
    const fiber = g === 'male' ? 38 : 25;
    const water = w * 0.035;
    const calcium = a > 50 ? 1200 : 1000;
    const iron = g === 'female' && a < 50 ? 18 : 8;

    setResult({
      macros: [
        { label: 'Proteína Base', val: protein.toFixed(0), unit: 'g', desc: 'Mantenimiento mínimo' },
        { label: 'Fibra Diaria', val: fiber, unit: 'g', desc: 'Salud digestiva' },
        { label: 'Agua Estimada', val: water.toFixed(1), unit: 'L', desc: 'Hidratación base' }
      ],
      micros: [
        { label: 'Calcio', val: calcium, unit: 'mg', icon: Milk },
        { label: 'Hierro', val: iron, unit: 'mg', icon: Activity },
        { label: 'Vitamina C', val: g === 'male' ? 90 : 75, unit: 'mg', icon: Apple }
      ]
    });

    if ((window as any).gtag) {
      (window as any).gtag('event', 'calculate_idr', { age: a, gender: g });
    }
  };

  const shareText = useMemo(() => {
    if (!result) return "";
    const macroResumen = result.macros
        .map((m: any) => `${m.label}: ${m.val}${m.unit}`)
        .join('\n');
    
    return `📋 Mis necesidades diarias según Sporvit:\n\n${macroResumen}\n\n¡Calcula tu perfil nutricional completo aquí:`;
    }, [result]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Calculadora IDR Sporvit"></iframe>`,
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
          <ClipboardCheck className="w-3 h-3" /> Guía de Salud Universal
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Calculadora de IDR (Ingesta Diaria Recomendada)
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
          "La salud no es un destino, es un balance diario de nutrientes esenciales."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateIDR} noValidate className="space-y-8">
              <div className="flex gap-4 p-1 bg-slate-950 rounded-2xl border border-slate-800">
                {(['male', 'female'] as const).map((g) => (
                  <button
                    key={g} type="button" onClick={() => setFormData({...formData, gender: g})}
                    className={`flex-1 py-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
                      formData.gender === g ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    {g === 'male' ? 'HOMBRE' : 'MUJER'}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label htmlFor="age" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Brain className="w-3 h-3 text-emerald-500" /> Edad
                  </label>
                  <input
                    id="age" type="number" value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className={`w-full bg-slate-950 border ${errors.age ? 'border-red-500' : 'border-slate-800'} rounded-2xl py-5 px-6 text-xl text-white outline-none focus:border-emerald-500 transition-all font-black`}
                    placeholder="30"
                  />
                </div>
                <div className="space-y-3">
                  <label htmlFor="weight" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Scale className="w-3 h-3 text-emerald-500" /> Peso (kg)
                  </label>
                  <input
                    id="weight" type="number" value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    className={`w-full bg-slate-950 border ${errors.weight ? 'border-red-500' : 'border-slate-800'} rounded-2xl py-5 px-6 text-xl text-white outline-none focus:border-emerald-500 transition-all font-black`}
                    placeholder="70"
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg active:scale-[0.98]">
                <Calculator className="w-6 h-6" /> Obtener Mi Perfil IDR
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
              <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-8 text-center">Tus Necesidades Básicas</h2>
              
              <div className="space-y-4 mb-8">
                {result?.macros.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-slate-950/50 border border-slate-800 rounded-2xl group hover:border-emerald-500/30 transition-all">
                    <div>
                      <div className="text-[10px] font-black uppercase text-slate-300">{item.label}</div>
                      <div className="text-[9px] text-slate-600 font-bold italic">{item.desc}</div>
                    </div>
                    <div className="text-2xl font-black text-white italic">{item.val}<span className="text-xs text-slate-500 ml-1">{item.unit}</span></div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 mb-8">
                {result?.micros.map((item: any, i: number) => (
                  <div key={i} className="bg-slate-950/50 border border-slate-800 p-3 rounded-xl text-center">
                    <item.icon className="w-4 h-4 text-emerald-500 mx-auto mb-2" />
                    <div className="text-[8px] font-black uppercase text-slate-500 mb-1">{item.label}</div>
                    <div className="text-sm font-black text-white">{item.val}<span className="text-[8px] ml-0.5">{item.unit}</span></div>
                  </div>
                ))}
              </div>

              {/* SHARE */}
              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center shadow-lg"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center shadow-lg"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-emerald-500 text-emerald-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mi IDR en Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center shadow-lg"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-emerald-500" /> Inserta esta herramienta
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-emerald-500/50 focus:outline-none resize-none mb-3 cursor-pointer" />
            <button onClick={() => copyToClipboard(embedSnippet, 'embed')} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest border border-slate-700">
              {copyStatus === 'copied' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copyStatus === 'copied' ? 'CÓDIGO COPIADO' : 'COPIAR CÓDIGO EMBED'}
            </button>
          </div>
        </aside>
      </div>

      <article className="prose prose-invert prose-slate max-w-none space-y-16">
        <section className="bg-slate-900/30 border border-slate-800 rounded-[40px] p-8 md:p-12">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-4">
            <Info className="w-8 h-8 text-emerald-500" /> ¿Qué es la IDR y por qué es tu mapa de salud?
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                La **Ingesta Diaria Recomendada (IDR)** es un estándar nutricional diseñado para cubrir las necesidades de casi todas las personas sanas (97-98%) en una etapa de la vida y sexo específicos. No se trata solo de calorías para energía, sino de los bloques químicos que permiten que tus hormonas, huesos y sistema inmune funcionen.
              </p>
              <p>
                A menudo nos obsesionamos con los macronutrientes (proteínas, grasas, carbohidratos), pero descuidamos la **fibra** y los **micronutrientes**. Una deficiencia de hierro puede arruinar tu rendimiento deportivo más rápido que un déficit calórico ligero. Nuestra calculadora traduce las complejas tablas de la RDA a un formato directo para tu perfil.
              </p>
              <h3 className="text-xl font-bold text-white italic text-left">Más allá del mínimo</h3>
              <p>
                Es importante entender que la IDR es el nivel que previene enfermedades por deficiencia (como el escorbuto o la anemia). Para un atleta o alguien que busca optimizar su salud, estos números son el **punto de partida**, no el techo.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-emerald-500 italic mb-4 uppercase text-center">Pilares del IDR</h3>
              {[
                { t: "Vitaminas", d: "Reguladores de reacciones bioquímicas." },
                { t: "Minerales", d: "Estructurales (huesos) y conductores eléctricos." },
                { t: "Fibra", d: "Fundamental para el microbioma y salud cardíaca." },
                { t: "Agua", d: "El solvente universal de la vida celular." }
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
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Nutrición de Precisión según tu Perfil</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Salud Ósea", text: "El Calcio y la Vitamina D trabajan en sinergia. La IDR de calcio aumenta significativamente después de los 50 años para prevenir la osteoporosis, especialmente en mujeres debido a cambios hormonales." },
              { title: "Transporte de Oxígeno", text: "El Hierro es vital para la hemoglobina. Las mujeres en edad fértil tienen un requerimiento de hierro casi el doble que los hombres debido a las pérdidas mensuales, algo crítico para evitar la fatiga crónica." },
              { title: "Inmunidad y Colágeno", text: "La Vitamina C no solo ayuda al sistema inmune; es un cofactor esencial para la síntesis de colágeno, vital para la salud de las articulaciones de los deportistas." }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl group hover:border-emerald-500/40 transition-all">
                <h3 className="text-emerald-500 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-t from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">¿Suplementos o comida real?</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            La IDR debe alcanzarse, idealmente, mediante una dieta variada de alimentos densos nutricionalmente. Los suplementos son útiles para cubrir brechas (como la Vitamina D en invierno o Hierro en casos de anemia diagnosticada), pero nunca sustituyen la matriz alimentaria compleja de frutas, verduras y fuentes proteicas. Utiliza esta calculadora para auditar tu dieta actual y asegúrate de que no estás dejando ningún flanco descubierto en tu camino hacia una salud inquebrantable.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Protocolo RDA/OMS", "Nutrición Integral", "A11Y & SEO Optimized"].map((tag, i) => (
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