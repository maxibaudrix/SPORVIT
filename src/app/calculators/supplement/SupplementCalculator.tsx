"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Beaker, Zap, Coffee, ShieldAlert, Share2, Microscope, Dumbbell,
  Timer, ChevronRight, Activity
} from 'lucide-react';

export default function SupplementCalculator() {
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(typeof window !== 'undefined' ? window.location.href : ''); }, []);

  const calculateSupplements = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    if (!w) return;

    setResult({
      creatine: (w * 0.1).toFixed(1),
      caffeineMin: Math.round(w * 3),
      caffeineMax: Math.round(w * 6),
      betaAlanine: (w * 0.065).toFixed(1),
      bicarbonate: (w * 0.3).toFixed(1),
      weight: w
    });
  };

  const shareText = useMemo(() => {
    if (!result) return "";
    return `💊 Mi protocolo de suplementación en Sporvit:\n\n🔹 Creatina: ${result.creatine}g/día\n☕ Cafeína: ${result.caffeineMin}-${result.caffeineMax}mg\n⚡ Beta-Alanina: ${result.betaAlanine}g/día\n\nCalcula tus dosis aquí:`;
  }, [result]);

  const copyToClipboard = useCallback(async (text: string, type: 'embed' | 'share') => {
    await navigator.clipboard.writeText(text);
    if (type === 'embed') setCopyStatus('copied');
    else setShareStatus('copied');
    setTimeout(() => { setCopyStatus('idle'); setShareStatus('idle'); }, 2000);
  }, []);

  const embedSnippet = `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Calculadora Suplementos Sporvit"></iframe>`;

  return (
    <div className="pt-8 pb-16 container mx-auto px-4 sm:px-6 max-w-6xl">
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <Microscope className="w-3 h-3" /> Ayudas Ergogénicas (Grado A)
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter text-center">
          Dosis de Suplementación
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic text-center">
          "La diferencia entre un suplemento y una ayuda efectiva es la dosis."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateSupplements} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Activity className="w-3 h-3 text-amber-500" /> Peso Corporal (kg)
                </label>
                <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-6 px-6 text-4xl text-white outline-none focus:border-amber-500 font-black transition-all" placeholder="75.0" />
                <p className="text-[9px] text-slate-600 font-bold italic ml-1">Utiliza tu peso actual para el cálculo de dosis agudas y crónicas.</p>
              </div>

              <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg">
                <Beaker className="w-6 h-6" /> Obtener Mi Protocolo
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <p className="text-amber-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-6 text-center">Protocolo de Ayudas</p>
              
              <div className="space-y-3 mb-8">
                {[
                  { icon: Zap, label: 'Creatina Monohidrato', val: `${result?.creatine || '--'}g`, freq: 'Diario (Cualquier momento)' },
                  { icon: Coffee, label: 'Cafeína Anhidra', val: `${result?.caffeineMin || '--'}-${result?.caffeineMax || '--'}mg`, freq: 'Pre-entreno (45-60 min antes)' },
                  { icon: Timer, label: 'Beta-Alanina', val: `${result?.betaAlanine || '--'}g`, freq: 'Diario (Dosis divididas)' },
                  { icon: Microscope, label: 'Bicarbonato Sódico', val: `${result?.bicarbonate || '--'}g`, freq: 'Eventos específicos (Dosis alta)' }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-amber-500" />
                      <div>
                        <div className="text-[10px] font-black text-white uppercase">{item.label}</div>
                        <div className="text-[8px] text-slate-500 font-bold italic uppercase">{item.freq}</div>
                      </div>
                    </div>
                    <div className="text-xl font-black text-white italic">{item.val}</div>
                  </div>
                ))}
              </div>

              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button type="button" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center shadow-lg"><MessageCircle className="w-5 h-5" /></button>
                  <button type="button" onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center shadow-lg"><Send className="w-5 h-5" /></button>
                  <button type="button" onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-amber-500 text-amber-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button type="button" onClick={() => window.location.href=`mailto:?subject=Mi Protocolo de Suplementos Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center shadow-lg"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl text-center">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-amber-500" /> Widget de Suplementación
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-amber-400/50 focus:outline-none resize-none mb-3 cursor-pointer" />
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
            <Dumbbell className="w-8 h-8 text-amber-500" /> El Pilar de la Suplementación con Evidencia
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg">
              <p>
                En el mundo del fitness, el 90% de los suplementos en el mercado carecen de base científica sólida. Sin embargo, un pequeño grupo de sustancias conocidas como **ayudas ergogénicas de Grado A** han demostrado repetidamente mejorar la fuerza, la potencia y la resistencia muscular.
              </p>
              <p>
                La clave para que estos compuestos funcionen no es solo la pureza, sino la **dosis relativa**. La creatina y la cafeína no deben tomarse de la misma forma por una persona de 60kg que por una de 100kg. Nuestra calculadora aplica los rangos sugeridos por el *International Society of Sports Nutrition* (ISSN).
              </p>
              
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center space-y-4">
              <h3 className="text-xl font-bold text-amber-500 italic mb-4 uppercase text-center">Protocolos de Uso</h3>
              {[
                { t: "Creatina Monohidrato", d: "0.1g/kg diario. No requiere carga. Actúa por saturación de fosfocreatina." },
                { t: "Cafeína Anhidra", d: "3-6mg/kg. Mejora el reclutamiento de unidades motoras y reduce la percepción de fatiga." },
                { t: "Beta-Alanina", d: "65mg/kg. Actúa como buffer intracelular de protones. Requiere toma crónica diaria." },
                { t: "Bicarbonato Sódico", d: "0.3g/kg. Buffer extracelular. Ideal para esfuerzos lácticos de 1 a 10 minutos." }
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