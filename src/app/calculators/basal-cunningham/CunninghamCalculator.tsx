"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Flame, Activity, ShieldAlert, Zap, Dumbbell, Ruler, Target
} from 'lucide-react';

export default function CunninghamCalculator() {
  const [lbm, setLbm] = useState('');
  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const calculateCunningham = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(lbm);
    if (!val) return;

    // RMR = 500 + 22 * LBM (kg)
    const bmr = 500 + (22 * val);

    setResult({
      bmr: Math.round(bmr),
      lbm: val
    });
  };

  const shareText = useMemo(() => {
    if (!result) return "";
    return `🔥 Mi Metabolismo Basal (Cunningham) en Sporvit:\n\n💪 Gasto en Reposo: ${result.bmr} kcal/día\n⚡ Basado en ${result.lbm}kg de masa magra.\n\nCalcula el tuyo aquí:`;
  }, [result]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Calculadora Cunningham Sporvit"></iframe>`,
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <Dumbbell className="w-3 h-3" /> Nutrición y Rendimiento Pro
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter text-center">
          Calculadora de Metabolismo Cunningham
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic text-center">
          "Tu músculo es el motor de tu metabolismo. Calcula tus necesidades con precisión de atleta."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateCunningham} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Activity className="w-3 h-3 text-indigo-500" /> Masa Libre de Grasa (LBM en kg)
                </label>
                <input 
                  type="number" step="0.1" value={lbm} 
                  onChange={(e) => setLbm(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-6 px-6 text-4xl text-white outline-none focus:border-indigo-500 font-black transition-all" 
                  placeholder="65.0" 
                />
                <p className="text-[9px] text-slate-600 font-bold italic">Resta tu grasa corporal de tu peso total para obtener tu LBM.</p>
              </div>

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg">
                <Calculator className="w-6 h-6" /> Obtener Mi Gasto Basal
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center">
              <p className="text-indigo-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Tasa Metabólica Basal (RMR)</p>
              <div className="text-7xl font-black text-white italic tracking-tighter mb-4">
                {result ? result.bmr : '--'} <span className="text-2xl text-slate-500">kcal</span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase mb-8 italic">Energía diaria basada en tu tejido magro</p>

              <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl flex items-start gap-3 mb-8 text-left">
                <ShieldAlert className="w-5 h-5 text-indigo-500 shrink-0" />
                <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic">
                  La fórmula de Cunningham es la más recomendada para culturistas y personas con baja grasa corporal y alta masa muscular.
                </p>
              </div>

              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center shadow-lg"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center shadow-lg"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-indigo-500 text-indigo-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mi BMR Cunningham Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center shadow-lg"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl text-center">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-indigo-500" /> Inserta este Widget
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-indigo-400/50 focus:outline-none resize-none mb-3 cursor-pointer" />
            <button onClick={() => copyToClipboard(embedSnippet, 'embed')} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black transition-all border border-slate-700">
              {copyStatus === 'copied' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copyStatus === 'copied' ? 'CÓDIGO COPIADO' : 'COPIAR CÓDIGO EMBED'}
            </button>
          </div>
        </aside>
      </div>

      <article className="prose prose-invert prose-slate max-w-none space-y-16 mt-20">
        <section className="bg-slate-900/30 border border-slate-800 rounded-[40px] p-8 md:p-12">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-4">
            <Zap className="w-8 h-8 text-indigo-500" /> Cunningham: La Fórmula que Entiende el Músculo
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                Mientras que ecuaciones como Harris-Benedict o Mifflin-St Jeor son excelentes para la población general, suelen fallar cuando se aplican a atletas con una composición corporal fuera de la norma. El problema radica en que esas fórmulas utilizan el **peso total**, asumiendo una proporción de grasa estándar.
              </p>
              <p>
                La **Fórmula de Cunningham** elimina el ruido de la grasa corporal y se centra exclusivamente en el tejido metabólicamente activo: la **Masa Libre de Grasa (LBM)**. El músculo es un tejido costoso de mantener para el cuerpo humano, y Cunningham cuantifica ese gasto con una precisión quirúrgica mediante la ecuación:
              </p>
              
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center space-y-4">
              <h3 className="text-xl font-bold text-indigo-400 italic mb-4 uppercase text-center">Ventajas para el Atleta</h3>
              {[
                { t: "Foco en Masa Magra", d: "Ignora el tejido graso, que es metabólicamente casi inerte." },
                { t: "Sin sesgo de edad", d: "El metabolismo no baja por la edad, sino por la pérdida de músculo." },
                { t: "Sin sesgo de género", d: "A igual masa magra, el gasto basal es idéntico entre sexos." },
                { t: "Ideal para Volumen", d: "Evita subestimar calorías en fases de ganancia muscular." }
              ].map((item, i) => (
                <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-left">
                  <div className="font-black text-xs text-white uppercase">{item.t}</div>
                  <div className="text-[10px] text-slate-500 font-bold">{item.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-t from-indigo-500/10 to-transparent border border-indigo-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Optimiza tu Nutrición Deportiva</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            Si eres un culturista en fase de volumen o un atleta de CrossFit con un porcentaje de grasa bajo, tu metabolismo es una "hoguera" comparado con una persona sedentaria del mismo peso. Cunningham evita que subestimes tus necesidades calóricas, lo que previene el estancamiento y la pérdida de tejido magro durante fases críticas de entrenamiento.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Masa Libre de Grasa", "Nutrición Basada en Ciencia", "Eficiencia Metabólica"].map((tag, i) => (
              <span key={i} className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                {tag}
              </span>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}