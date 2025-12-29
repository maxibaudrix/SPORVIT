"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  ShieldCheck, AlertTriangle, TrendingUp, Activity, Gauge, Zap, BarChart3
} from 'lucide-react';

export default function ACWRCalculator() {
  const [acuteLoad, setAcuteLoad] = useState('');
  const [chronicLoad, setChronicLoad] = useState('');
  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { 
    setCurrentUrl(typeof window !== 'undefined' ? window.location.href : ''); 
  }, []);

  const calculateACWR = (e: React.FormEvent) => {
    e.preventDefault();
    const acute = parseFloat(acuteLoad);
    const chronic = parseFloat(chronicLoad);

    if (!acute || !chronic || chronic <= 0) return;

    const ratio = acute / chronic;

    let status = 'safe';
    let message = 'Sweet Spot: Carga óptima para mejorar sin riesgo excesivo.';
    let color = 'text-emerald-500';

    if (ratio < 0.8) {
      status = 'low';
      message = 'Carga baja: Riesgo de desentrenamiento o pérdida de forma.';
      color = 'text-blue-400';
    } else if (ratio > 1.3 && ratio <= 1.5) {
      status = 'warning';
      message = 'Zona de precaución: Tu carga está aumentando rápido.';
      color = 'text-yellow-400';
    } else if (ratio > 1.5) {
      status = 'danger';
      message = 'Zona de peligro: Riesgo inminente de lesión por pico de carga.';
      color = 'text-red-500';
    }

    setResult({ ratio: ratio.toFixed(2), status, message, color });
  };

  const shareText = useMemo(() => {
    if (!result) return "";
    return `🛡️ Mi Ratio de Carga ACWR en Sporvit: ${result.ratio}. Estado: ${result.message}\n\nGestiona tu entrenamiento aquí:`;
  }, [result]);

  // FUNCIÓN CORREGIDA
  const copyToClipboard = useCallback(async (text: string, type: 'embed' | 'share') => {
    await navigator.clipboard.writeText(text);
    if (type === 'embed') setCopyStatus('copied');
    else setShareStatus('copied');
    setTimeout(() => { setCopyStatus('idle'); setShareStatus('idle'); }, 2000);
  }, []);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Calculadora ACWR Sporvit"></iframe>`,
  [currentUrl]);

  return (
    <div className="pt-8 pb-16 container mx-auto px-4 sm:px-6 max-w-6xl">
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <ShieldCheck className="w-3 h-3" /> Monitorización de Carga Pro
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter text-center">
          Ratio Carga Aguda:Crónica
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic text-center">
          "No es el entrenamiento lo que te lesiona, sino el cambio brusco en la carga."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateACWR} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Zap className="w-3 h-3 text-emerald-500" /> Carga Aguda (7 días)
                  </label>
                  <input type="number" value={acuteLoad} onChange={(e) => setAcuteLoad(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-6 px-6 text-4xl text-white outline-none focus:border-emerald-500 font-black" placeholder="450" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <BarChart3 className="w-3 h-3 text-blue-500" /> Carga Crónica (Media 28 días)
                  </label>
                  <input type="number" value={chronicLoad} onChange={(e) => setChronicLoad(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-6 px-6 text-4xl text-white outline-none focus:border-blue-500 font-black" placeholder="400" />
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg">
                <Gauge className="w-6 h-6" /> Analizar Riesgo de Lesión
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center">
              <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Tu Ratio ACWR</p>
              <div className={`text-7xl font-black italic tracking-tighter mb-4 ${result?.color || 'text-white'}`}>
                {result ? result.ratio : '--'}
              </div>
              
              <div className={`p-4 rounded-2xl border mb-8 bg-slate-950/50 ${result?.status === 'danger' ? 'border-red-500/30' : 'border-slate-800'}`}>
                 <p className={`text-xs font-bold italic ${result?.color}`}>{result?.message}</p>
              </div>

              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button type="button" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center"><MessageCircle className="w-5 h-5" /></button>
                  <button type="button" onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center"><Send className="w-5 h-5" /></button>
                  <button type="button" onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-emerald-500 text-emerald-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button type="button" onClick={() => window.location.href=`mailto:?subject=Mi ACWR Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          {/* SECCIÓN DE EMBED AÑADIDA */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl text-center">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-emerald-500" /> Widget de Prevención
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-emerald-400/50 focus:outline-none resize-none mb-3 cursor-pointer" />
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
            <TrendingUp className="w-8 h-8 text-emerald-500" /> ACWR: La Ciencia de la Carga de Trabajo
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg">
              <p>
                El **Acute:Chronic Workload Ratio (ACWR)** es una herramienta predictiva que analiza la relación entre la carga de entrenamiento que has realizado en la última semana (**aguda**) frente a lo que tu cuerpo está acostumbrado a tolerar basándose en las últimas cuatro semanas (**crónica**). 
              </p>
              
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center space-y-4">
              <h3 className="text-xl font-bold text-emerald-500 italic mb-4 uppercase text-center">Interpretación del Ratio</h3>
              {[
                { t: "0.8 - 1.3: Sweet Spot", d: "El 'punto dulce'. Carga óptima para mejorar con bajo riesgo de lesión." },
                { t: "1.3 - 1.5: Zona de Transición", d: "Riesgo moderado. El cuerpo empieza a estar al límite." },
                { t: "> 1.5: Zona de Peligro", d: "Riesgo muy alto. Es imperativo reducir volumen." }
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