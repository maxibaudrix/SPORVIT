"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Dumbbell, Target, ShieldAlert, Zap, Layers, BarChart, ChevronRight
} from 'lucide-react';

const MUSCLE_GROUPS = [
  { id: 'chest', label: 'Pecho' },
  { id: 'back', label: 'Espalda' },
  { id: 'quads', label: 'Cuádriceps' },
  { id: 'hams', label: 'Isquios' },
  { id: 'shoulders', label: 'Hombros' },
  { id: 'biceps', label: 'Bíceps' },
  { id: 'triceps', label: 'Tríceps' },
  { id: 'calves', label: 'Gemelos' },
  { id: 'core', label: 'Core' }
];

export default function MuscleVolumeCalculator() {
  const [volumes, setVolumes] = useState<Record<string, string>>(
    MUSCLE_GROUPS.reduce((acc, curr) => ({ ...acc, [curr.id]: '' }), {})
  );

  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(typeof window !== 'undefined' ? window.location.href : ''); }, []);

  const handleInputChange = (id: string, value: string) => {
    setVolumes(prev => ({ ...prev, [id]: value }));
  };

  const calculateVolume = (e: React.FormEvent) => {
    e.preventDefault();
    
    const analysis = MUSCLE_GROUPS.map(group => {
      const sets = parseInt(volumes[group.id]) || 0;
      let status = 'Bajo';
      let color = 'text-blue-400';

      if (sets >= 6 && sets <= 9) {
        status = 'Mantenimiento';
        color = 'text-cyan-400';
      } else if (sets >= 10 && sets <= 20) {
        status = 'Crecimiento Óptimo';
        color = 'text-emerald-500';
      } else if (sets > 20) {
        status = 'Riesgo / Muy Alto';
        color = 'text-red-500';
      }

      return { ...group, sets, status, color };
    });

    setResult(analysis);
  };

  const shareText = useMemo(() => {
    if (!result) return "";
    return `💪 Mi auditoría de volumen semanal en Sporvit:\n\n${result.map((r: any) => `• ${r.label}: ${r.sets} series (${r.status})`).join('\n')}\n\nAnaliza tu rutina aquí:`;
  }, [result]);

  const copyToClipboard = useCallback(async (text: string, type: 'embed' | 'share') => {
    await navigator.clipboard.writeText(text);
    if (type === 'embed') setCopyStatus('copied');
    else setShareStatus('copied');
    setTimeout(() => { setCopyStatus('idle'); setShareStatus('idle'); }, 2000);
  }, []);

  const embedSnippet = `<iframe src="${currentUrl}" width="100%" height="1100px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Calculadora Volumen Sporvit"></iframe>`;

  return (
    <div className="pt-8 pb-16 container mx-auto px-4 sm:px-6 max-w-6xl">
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <Dumbbell className="w-3 h-3" /> Hipertrofia y Estética
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter text-center">
          Volumen por Grupo Muscular
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic text-center">
          "Cuenta lo que importa. El volumen es el lenguaje que tus músculos entienden."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 ml-1 flex items-center gap-2">
              <Layers className="w-3 h-3 text-orange-500" /> Series Efectivas por Semana
            </p>
            <form onSubmit={calculateVolume} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {MUSCLE_GROUPS.map(group => (
                  <div key={group.id} className="flex items-center justify-between gap-4 p-2 bg-slate-950/40 rounded-xl border border-slate-800/50">
                    <label className="text-xs font-bold text-slate-300">{group.label}</label>
                    <input 
                      type="number" 
                      value={volumes[group.id]} 
                      onChange={(e) => handleInputChange(group.id, e.target.value)}
                      className="w-20 bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-white text-center font-black focus:border-orange-500 outline-none transition-all"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>

              <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg mt-8">
                <BarChart className="w-6 h-6" /> Auditar Mi Volumen
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center">
              <p className="text-orange-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-6">Análisis Semanal</p>
              
              <div className="space-y-3 mb-8">
                {result?.map((r: any) => (
                  <div key={r.id} className="flex justify-between items-center bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                    <div className="text-left">
                      <div className="text-[10px] font-black text-white uppercase">{r.label}</div>
                      <div className={`text-[8px] font-bold uppercase ${r.color}`}>{r.status}</div>
                    </div>
                    <div className="text-2xl font-black text-white italic">{r.sets} <span className="text-[10px] text-slate-600">SERIES</span></div>
                  </div>
                ))}
              </div>

              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button type="button" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center"><MessageCircle className="w-5 h-5" /></button>
                  <button type="button" onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center"><Send className="w-5 h-5" /></button>
                  <button type="button" onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-orange-500 text-orange-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button type="button" onClick={() => window.location.href=`mailto:?subject=Mi Auditoría de Volumen Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl text-justify">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-orange-500" /> Widget para Coaches
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-orange-400/50 focus:outline-none resize-none mb-3 cursor-pointer" />
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
            <Zap className="w-8 h-8 text-orange-500" /> La Ciencia del Volumen Semanal
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg">
              <p>
                En el mundo de la hipertrofia, el **volumen** se define comúnmente como el número de series efectivas por grupo muscular a la semana. Una "serie efectiva" es aquella que se realiza con una intensidad suficiente (generalmente un RPE de 7 o superior) para reclutar las unidades motoras de alto umbral.
              </p>
              <p>
                La evidencia científica actual sugiere que existe una relación de "U invertida" entre el volumen y las ganancias musculares. Hacer muy poco no genera adaptación, pero hacer demasiado puede llevar a un estado de fatiga crónica donde el cuerpo gasta toda su energía en reparar el daño en lugar de construir nuevo tejido.
              </p>
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center font-mono text-orange-400 text-lg my-4 italic">
                {"Series Semanales = (Ejs. × Series) / Grupo Muscular"}
              </div>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center space-y-4">
              <h3 className="text-xl font-bold text-orange-500 italic mb-4 uppercase text-center">Guía de Series Semanales</h3>
              {[
                { t: "< 6 Series: Mantenimiento", d: "Ideal para conservar masa muscular en periodos de poco tiempo o mucho estrés." },
                { t: "10 - 20 Series: Volumen Efectivo", d: "El rango óptimo para la mayoría de atletas naturales para maximizar la hipertrofia." },
                { t: "20 - 25 Series: Volumen Límite", d: "Solo recomendable para grupos musculares rezagados o atletas muy avanzados por periodos cortos." },
                { t: "> 25 Series: Junk Volume", d: "Riesgo de sobreentrenamiento y daño acumulado sin beneficios adicionales." }
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