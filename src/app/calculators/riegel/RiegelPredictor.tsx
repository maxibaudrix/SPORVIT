"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Timer, Footprints, Target, Share2, ShieldAlert, Zap, TrendingUp, ArrowRight
} from 'lucide-react';

export default function RiegelPredictor() {
  const [formData, setFormData] = useState({
    dist1: '', // Distancia reciente (km)
    time1: '', // Formato HH:MM:SS o MM:SS
    dist2: '', // Distancia objetivo (km)
  });

  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(typeof window !== 'undefined' ? window.location.href : ''); }, []);

  // Convertir tiempo string (HH:MM:SS) a segundos
  const timeToSeconds = (timeStr: string) => {
    const parts = timeStr.split(':').reverse();
    let seconds = 0;
    if (parts[0]) seconds += parseInt(parts[0]); // seg
    if (parts[1]) seconds += parseInt(parts[1]) * 60; // min
    if (parts[2]) seconds += parseInt(parts[2]) * 3600; // horas
    return seconds;
  };

  // Convertir segundos a HH:MM:SS
  const secondsToTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.round(secs % 60);
    return [h, m, s].map(v => v < 10 ? "0" + v : v).filter((v, i) => v !== "00" || i > 0).join(":");
  };

  const calculateRiegel = (e: React.FormEvent) => {
    e.preventDefault();
    const d1 = parseFloat(formData.dist1);
    const d2 = parseFloat(formData.dist2);
    const t1 = timeToSeconds(formData.time1);

    if (!d1 || !d2 || !t1) return;

    // Fórmula de Riegel: T2 = T1 * (D2 / D1)^1.06
    const t2 = t1 * Math.pow((d2 / d1), 1.06);
    
    const pace1 = t1 / d1; // seg/km
    const pace2 = t2 / d2; // seg/km

    setResult({
      predictedTime: secondsToTime(t2),
      predictedPace: secondsToTime(pace2),
      originalPace: secondsToTime(pace1),
      distTarget: d2
    });
  };

  const shareText = useMemo(() => {
    if (!result) return "";
    return `🏃 Mi predicción para ${result.distTarget}km en Sporvit es ${result.predictedTime} (Ritmo: ${result.predictedPace} min/km).\n\nCalcula tu marca aquí:`;
  }, [result]);

  const copyToClipboard = useCallback(async (text: string, type: 'embed' | 'share') => {
    await navigator.clipboard.writeText(text);
    if (type === 'embed') setCopyStatus('copied');
    else setShareStatus('copied');
    setTimeout(() => { setCopyStatus('idle'); setShareStatus('idle'); }, 2000);
  }, []);

  const embedSnippet = `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Predictor Riegel Sporvit"></iframe>`;

  return (
    <div className="pt-8 pb-16 container mx-auto px-4 sm:px-6 max-w-6xl">
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <Footprints className="w-3 h-3" /> Rendimiento en Endurance
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter text-center">
          Predictor de Tiempos Riegel
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic text-center">
          "Dime qué has corrido y te diré de qué eres capaz."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateRiegel} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-blue-500" /> Distancia Reciente (km)
                  </label>
                  <input type="number" step="0.1" value={formData.dist1} onChange={(e) => setFormData({...formData, dist1: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-blue-500" placeholder="10" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 flex items-center gap-2">
                    <Timer className="w-3 h-3 text-blue-500" /> Tiempo Logrado (HH:MM:SS)
                  </label>
                  <input type="text" value={formData.time1} onChange={(e) => setFormData({...formData, time1: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-blue-500" placeholder="00:45:00" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 flex items-center gap-2">
                  <Target className="w-3 h-3 text-emerald-500" /> Distancia Objetivo (km)
                </label>
                <input type="number" step="0.1" value={formData.dist2} onChange={(e) => setFormData({...formData, dist2: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-emerald-500" placeholder="42.2" />
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg">
                <Zap className="w-6 h-6" /> Vaticinar Mi Marca
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="text-center mb-8 border-b border-slate-800 pb-6">
                <p className="text-blue-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Tiempo Estimado</p>
                <div className="text-6xl font-black text-white italic tracking-tighter">
                  {result ? result.predictedTime : '--:--:--'}
                </div>
              </div>

              <div className="space-y-4 mb-8 text-left">
                <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl flex justify-between items-center group transition-all">
                  <div>
                    <div className="text-[9px] font-black uppercase text-slate-400">Ritmo Objetivo</div>
                    <div className="text-[8px] text-slate-600 font-bold italic">Promedio sugerido</div>
                  </div>
                  <div className="text-2xl font-black text-white italic">{result?.predictedPace || '--:--'} <span className="text-xs">min/km</span></div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-start gap-3 mb-8">
                <ShieldAlert className="w-5 h-5 text-blue-500 shrink-0" />
                <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic text-justify">
                  Esta predicción asume que has realizado el entrenamiento de resistencia específico para la distancia objetivo. La fórmula es más precisa cuanto más cerca estén las dos distancias.
                </p>
              </div>

              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button type="button" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center"><MessageCircle className="w-5 h-5" /></button>
                  <button type="button" onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center"><Send className="w-5 h-5" /></button>
                  <button type="button" onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-blue-500 text-blue-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button type="button" onClick={() => window.location.href=`mailto:?subject=Mi Predicción Riegel Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl text-center">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-blue-500" /> Widget de Predicción
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-blue-400/50 focus:outline-none resize-none mb-3 cursor-pointer" />
            <button type="button" onClick={() => copyToClipboard(embedSnippet, 'embed')} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black transition-all border border-slate-700">
              {copyStatus === 'copied' ? <Check className="w-3 h-3 inline mr-1" /> : <Copy className="w-3 h-3 inline mr-1" />}
              {copyStatus === 'copied' ? 'CÓDIGO COPIADO' : 'COPIAR CÓDIGO EMBED'}
            </button>
          </div>
        </aside>
      </div>

      <article className="prose prose-invert prose-slate max-w-none space-y-16 mt-20 text-justify">
        <section className="bg-slate-900/30 border border-slate-800 rounded-[40px] p-8 md:p-12">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-4">
            <Timer className="w-8 h-8 text-blue-500" /> La Fórmula de Riegel: Ciencia aplicada al Asfalto
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg">
              <p>
                La **Fórmula de Riegel** fue propuesta por el ingeniero Peter Riegel en 1977 y se ha convertido en el estándar de oro para predecir marcas de resistencia. Su elegancia reside en su simplicidad: asume que la velocidad de un atleta disminuye de forma predecible a medida que aumenta la distancia.
              </p>
              <p>
                A diferencia de otros modelos, Riegel utiliza un exponente de decaimiento constante (**1.06**). Este número refleja la fatiga muscular y cardiovascular acumulada. Si eres capaz de correr 10 km en un tiempo determinado, la fórmula calculará cuánto tiempo tardarías en completar un Maratón asumiendo que tu nivel de entrenamiento aeróbico es el adecuado para esa distancia.
              </p>
              
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center space-y-4">
              <h3 className="text-xl font-bold text-blue-500 italic mb-4 uppercase text-center">Limitaciones del Modelo</h3>
              {[
                { t: "Entrenamiento Específico", d: "La fórmula no sabe si has hecho tiradas largas. Predecir un Maratón con un 5K es arriesgado." },
                { t: "La Barrera de los 90 min", d: "Para distancias muy largas, factores como el glucógeno y la hidratación pesan más." },
                { t: "Terreno y Clima", d: "Riegel asume condiciones ideales (terreno llano y temperatura fresca)." },
                { t: "Economía de Carrera", d: "Atletas con mejor técnica suelen batir la predicción en distancias largas." }
              ].map((item, i) => (
                <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-left">
                  <div className="font-black text-xs text-white uppercase">{item.t}</div>
                  <div className="text-[10px] text-slate-500 font-bold">{item.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}