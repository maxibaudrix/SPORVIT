"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  User, Ruler, Target, ShieldAlert, Share2, Activity, Scale, 
  ChevronRight, HeartPulse
} from 'lucide-react';

export default function BodyFatCalculator() {
  const [formData, setFormData] = useState({
    gender: 'male',
    age: '',
    weight: '',
    height: '',
    neck: '',
    waist: '',
    hips: '' // Solo para mujeres
  });

  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(typeof window !== 'undefined' ? window.location.href : ''); }, []);

  const calculatePGC = (e: React.FormEvent) => {
    e.preventDefault();
    const { gender, weight, height, neck, waist, hips, age } = formData;
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const n = parseFloat(neck);
    const wa = parseFloat(waist);
    const hi = parseFloat(hips);

    if (!w || !h || !n || !wa || (gender === 'female' && !hi)) return;

    let pgc = 0;

    // MÉTODO NAVY (Marina EE.UU.) - Basado en Logaritmos
    if (gender === 'male') {
      pgc = 495 / (1.0324 - 0.19077 * Math.log10(wa - n) + 0.15456 * Math.log10(h)) - 450;
    } else {
      pgc = 495 / (1.29579 - 0.35004 * Math.log10(wa + hi - n) + 0.22100 * Math.log10(h)) - 450;
    }

    const fatMass = (w * pgc) / 100;
    const leanMass = w - fatMass;

    // Clasificación ACE (American Council on Exercise)
    let category = "Promedio";
    if (gender === 'male') {
      if (pgc < 6) category = "Grasa Esencial";
      else if (pgc < 14) category = "Atleta";
      else if (pgc < 18) category = "Fitness";
      else if (pgc < 25) category = "Promedio";
      else category = "Obesidad";
    } else {
      if (pgc < 14) category = "Grasa Esencial";
      else if (pgc < 21) category = "Atleta";
      else if (pgc < 25) category = "Fitness";
      else if (pgc < 32) category = "Promedio";
      else category = "Obesidad";
    }

    setResult({
      pgc: pgc.toFixed(1),
      fatMass: fatMass.toFixed(1),
      leanMass: leanMass.toFixed(1),
      category
    });
  };

  const shareText = useMemo(() => {
    if (!result) return "";
    return `💪 Mi Composición Corporal en Sporvit:\n\n🔥 Grasa Corporal: ${result.pgc}%\n📊 Categoría: ${result.category}\n🥩 Masa Magra: ${result.leanMass}kg\n\nCalcula el tuyo aquí:`;
  }, [result]);

  const copyToClipboard = useCallback(async (text: string, type: 'embed' | 'share') => {
    await navigator.clipboard.writeText(text);
    if (type === 'embed') setCopyStatus('copied');
    else setShareStatus('copied');
    setTimeout(() => { setCopyStatus('idle'); setShareStatus('idle'); }, 2000);
  }, []);

  const embedSnippet = `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; border:1px solid #1e293b;" title="Calculadora PGC Sporvit"></iframe>`;

  return (
    <div className="pt-8 pb-16 container mx-auto px-4 sm:px-6 max-w-6xl">
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <HeartPulse className="w-3 h-3" /> Antropometría Avanzada
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter text-center">
          Porcentaje de Grasa Corporal
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic text-center">
          "No dejes que la báscula te engañe. Mide lo que realmente importa: tu composición."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculatePGC} className="space-y-6">
              <div className="flex gap-4 p-1 bg-slate-950 rounded-2xl border border-slate-800">
                {(['male', 'female'] as const).map((g) => (
                  <button
                    key={g} type="button" onClick={() => setFormData({...formData, gender: g})}
                    className={`flex-1 py-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
                      formData.gender === g ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    <User className="w-4 h-4" /> {g === 'male' ? 'HOMBRE' : 'MUJER'}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Altura (cm)</label>
                  <input type="number" value={formData.height} onChange={(e) => setFormData({...formData, height: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-emerald-500" placeholder="175" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Peso (kg)</label>
                  <input type="number" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-emerald-500" placeholder="75" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-800 pt-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Cuello (cm)</label>
                  <input type="number" value={formData.neck} onChange={(e) => setFormData({...formData, neck: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-emerald-500" placeholder="38" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Cintura (cm)</label>
                  <input type="number" value={formData.waist} onChange={(e) => setFormData({...formData, waist: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-emerald-500" placeholder="85" />
                </div>
                {formData.gender === 'female' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Cadera (cm)</label>
                    <input type="number" value={formData.hips} onChange={(e) => setFormData({...formData, hips: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-emerald-500" placeholder="95" />
                  </div>
                )}
              </div>

              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg">
                <Calculator className="w-6 h-6" /> Estimar Grasa Corporal
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center">
              <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Porcentaje de Grasa (PGC)</p>
              <div className="text-7xl font-black text-white italic tracking-tighter mb-4">
                {result ? result.pgc : '--'} <span className="text-2xl text-slate-500">%</span>
              </div>
              <div className="inline-block px-4 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-black uppercase mb-8">
                Categoría: {result?.category || 'Analizando...'}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
                    <div className="text-[8px] font-black text-slate-500 uppercase mb-1">Masa Grasa</div>
                    <div className="text-xl font-black text-white italic">{result?.fatMass || '--'} kg</div>
                </div>
                <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
                    <div className="text-[8px] font-black text-slate-500 uppercase mb-1">Masa Magra</div>
                    <div className="text-xl font-black text-white italic">{result?.leanMass || '--'} kg</div>
                </div>
              </div>

              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center shadow-lg"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center shadow-lg"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-emerald-500 text-emerald-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mi Composición Corporal Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center shadow-lg"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl text-center">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-emerald-500" /> Inserta este Widget
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-emerald-500/50 focus:outline-none resize-none mb-3 cursor-pointer" />
            <button onClick={() => copyToClipboard(embedSnippet, 'embed')} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black transition-all border border-slate-700">
              {copyStatus === 'copied' ? <Check className="w-3 h-3 inline mr-1" /> : <Copy className="w-3 h-3 inline mr-1" />}
              {copyStatus === 'copied' ? 'CÓDIGO COPIADO' : 'COPIAR CÓDIGO EMBED'}
            </button>
          </div>
        </aside>
      </div>

      <article className="prose prose-invert prose-slate max-w-none space-y-16 mt-20">
        <section className="bg-slate-900/30 border border-slate-800 rounded-[40px] p-8 md:p-12">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-4">
            <Activity className="w-8 h-8 text-emerald-500" /> PGC: La Métrica Definitiva de tu Progreso
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                El **Porcentaje de Grasa Corporal (PGC)** es la relación entre el peso de tu grasa total y tu peso corporal total. A diferencia del IMC, que solo considera la altura y el peso, el PGC es una medida mucho más precisa de la salud y la condición física porque distingue entre lo que es "lastre" (grasa excesiva) y lo que es "motor" (músculo, órganos, huesos).
              </p>
              <p>
                Nuestra calculadora de Sporvit utiliza el **Método de la Marina de EE. UU. (Navy Method)**. Este algoritmo ha sido validado científicamente como una de las formas más precisas de estimar la grasa corporal sin necesidad de equipos costosos como el DXA o el pesaje hidrostático. Se basa en perímetros clave que tienen una correlación directa con la acumulación de tejido adiposo visceral y subcutáneo.
              </p>
              
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center space-y-4">
              <h3 className="text-xl font-bold text-emerald-400 italic mb-4 uppercase text-center">Rangos de Salud (ACE)</h3>
              {[
                { t: "Atleta", d: "Hombres: 6-13% | Mujeres: 14-20%. Nivel de competición y alto rendimiento." },
                { t: "Fitness", d: "Hombres: 14-17% | Mujeres: 21-24%. Definición muscular visible y buena salud." },
                { t: "Promedio", d: "Hombres: 18-24% | Mujeres: 25-31%. Rango saludable para la población general." },
                { t: "Riesgo", d: "Hombres: +25% | Mujeres: +32%. Aumento de riesgo metabólico y cardiovascular." }
              ].map((item, i) => (
                <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-left">
                  <div className="font-black text-xs text-white uppercase">{item.t}</div>
                  <div className="text-[10px] text-slate-500 font-bold">{item.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">¿Por qué ignorar el IMC y usar el PGC?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                title: "Atletas y Masa Muscular", 
                text: "El IMC suele calificar a los atletas con mucha masa muscular como 'obesos'. El PGC reconoce que el peso extra es músculo, no grasa, proporcionando una evaluación justa de su estado físico." 
              },
              { 
                title: "Falsos Delgados (Skinny Fat)", 
                text: "Muchas personas tienen un IMC normal pero un PGC muy alto (poca masa muscular). El PGC detecta este riesgo metabólico que el peso simple ignora por completo." 
              },
              { 
                title: "Monitoreo de Pérdida de Grasa", 
                text: "Durante un déficit calórico, el peso puede estancarse si estás ganando músculo. Solo el PGC te confirmará si estás perdiendo grasa aunque el número en la báscula no se mueva." 
              }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl group hover:border-emerald-500/40 transition-all">
                <h3 className="text-emerald-500 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-t from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Toma el Control de tu Composición</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            La Calculadora de Porcentaje de Grasa Corporal de Sporvit es tu mejor aliada para una transformación física real. Mídete siempre en las mismas condiciones (preferiblemente en ayunas al despertar) para garantizar la consistencia de los datos. Recuerda que el objetivo no es llegar al 0% de grasa (la grasa esencial es vital para la salud hormonal), sino encontrar el rango donde te sientas con energía, fuerte y saludable. En Sporvit, medimos para mejorar.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Método Navy Pro", "Análisis Masa Magra", "Composición Corporal"].map((tag, i) => (
              <span key={i} className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                {tag}
              </span>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}