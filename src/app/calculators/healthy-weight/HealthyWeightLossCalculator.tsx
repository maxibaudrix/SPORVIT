"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Scale, Target, ShieldCheck, Zap, TrendingDown, Flame, Activity, 
  ChevronRight, HeartPulse
} from 'lucide-react';

export default function HealthyWeightLossCalculator() {
  const [weight, setWeight] = useState('');
  const [rate, setRate] = useState('0.7'); // % semanal predeterminado (saludable)
  
  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(typeof window !== 'undefined' ? window.location.href : ''); }, []);

  const calculateLoss = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const r = parseFloat(rate) / 100;

    if (!w || !r) return;

    // 1. Kg a perder por semana
    const kgPerWeek = w * r;
    
    // 2. Déficit calórico total semanal (aprox 7700 kcal por 1kg de grasa)
    const totalWeeklyDeficit = kgPerWeek * 7700;
    
    // 3. Déficit diario
    const dailyDeficit = totalWeeklyDeficit / 7;

    let muscleSafety = 'Máxima';
    let safetyColor = 'text-emerald-500';
    if (parseFloat(rate) > 1.0) {
      muscleSafety = 'Moderada (Riesgo)';
      safetyColor = 'text-yellow-400';
    }
    if (parseFloat(rate) > 1.3) {
      muscleSafety = 'Baja (Peligro de pérdida muscular)';
      safetyColor = 'text-red-500';
    }

    setResult({
      kgPerWeek: kgPerWeek.toFixed(2),
      dailyDeficit: Math.round(dailyDeficit),
      totalWeeklyDeficit: Math.round(totalWeeklyDeficit),
      muscleSafety,
      safetyColor,
      rate: rate
    });
  };

  const shareText = useMemo(() => {
    if (!result) return "";
    return `📉 Mi objetivo de pérdida saludable en Sporvit:\n\n⚖️ Perder: ${result.kgPerWeek} kg/semana\n🔥 Déficit: -${result.dailyDeficit} kcal/día\n💪 Seguridad Muscular: ${result.muscleSafety}\n\nCalcula tu plan aquí:`;
  }, [result]);

  const copyToClipboard = useCallback(async (text: string, type: 'embed' | 'share') => {
    await navigator.clipboard.writeText(text);
    if (type === 'embed') setCopyStatus('copied');
    else setShareStatus('copied');
    setTimeout(() => { setCopyStatus('idle'); setShareStatus('idle'); }, 2000);
  }, []);

  const embedSnippet = `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Calculadora Perdida Peso Sporvit"></iframe>`;

  return (
    <div className="pt-8 pb-16 container mx-auto px-4 sm:px-6 max-w-6xl">
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <HeartPulse className="w-3 h-3" /> Nutrición Basada en Evidencia
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter text-center">
          Pérdida de Peso Saludable
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic text-center">
          "Pierde grasa, no salud. El ritmo es el secreto de la permanencia."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateLoss} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Scale className="w-3 h-3 text-emerald-500" /> Peso Actual (kg)
                </label>
                <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-6 px-6 text-4xl text-white outline-none focus:border-emerald-500 font-black transition-all" placeholder="85.0" />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Ritmo de Pérdida Deseado (% de peso/semana)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: '0.5', label: 'Conservador', desc: '0.5% (Ideal Músculo)' },
                    { val: '0.8', label: 'Moderado', desc: '0.8% (Estándar)' },
                    { val: '1.2', label: 'Agresivo', desc: '1.2% (Rápido)' }
                  ].map((btn) => (
                    <button key={btn.val} type="button" onClick={() => setRate(btn.val)} className={`py-4 rounded-xl border text-[10px] font-black transition-all flex flex-col items-center gap-1 ${rate === btn.val ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-white'}`}>
                      {btn.label} <span className="text-[8px] opacity-60">{btn.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg">
                <Activity className="w-6 h-6" /> Generar Plan de Pérdida
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6 text-justify">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center">
              <div className="text-center mb-8 border-b border-slate-800 pb-6">
                <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Meta Semanal</p>
                <div className="text-6xl font-black text-white italic tracking-tighter">
                  -{result ? result.kgPerWeek : '--'} <span className="text-xl text-slate-500">kg</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl flex justify-between items-center group transition-all">
                  <div>
                    <div className="text-[9px] font-black uppercase text-slate-400">Déficit Diario</div>
                    <div className="text-[8px] text-slate-600 font-bold italic">Kcal a restar de tu TDEE</div>
                  </div>
                  <div className="text-2xl font-black text-white italic">-{result?.dailyDeficit || '--'} <span className="text-xs">kcal</span></div>
                </div>
                <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl flex justify-between items-center group transition-all">
                  <div>
                    <div className="text-[9px] font-black uppercase text-slate-400">Retención Muscular</div>
                    <div className="text-[8px] text-slate-600 font-bold italic">Probabilidad de éxito</div>
                  </div>
                  <div className={`text-sm font-black italic uppercase ${result?.safetyColor}`}>
                    {result?.muscleSafety || '--'}
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-start gap-3 mb-8">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic">
                  Perder más del 1% de tu peso semanal aumenta el riesgo de pérdida de fuerza y tejido magro. Prioriza ritmos moderados.
                </p>
              </div>

              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button type="button" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center shadow-lg"><MessageCircle className="w-5 h-5" /></button>
                  <button type="button" onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center shadow-lg"><Send className="w-5 h-5" /></button>
                  <button type="button" onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-emerald-500 text-emerald-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button type="button" onClick={() => window.location.href=`mailto:?subject=Mi Plan de Pérdida Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center shadow-lg"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl text-center">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-emerald-500" /> Widget de Nutrición
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
            <TrendingDown className="w-8 h-8 text-emerald-500" /> La Ciencia del Ritmo en la Pérdida de Grasa
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg">
              <p>
                El mayor error en los procesos de pérdida de peso es la prisa. Cuando perdemos peso de forma excesivamente rápida (más del 1.5% del peso corporal semanal), el cuerpo entra en un estado de **emergencia metabólica**. En este escenario, el organismo prefiere degradar tejido muscular —que es metabólicamente "caro" de mantener— para obtener energía, conservando las reservas de grasa como mecanismo de supervivencia.
              </p>
              <p>
                Un ritmo saludable y sostenible se sitúa entre el **0.5% y el 1% de tu peso corporal por semana**. Este rango permite que el déficit calórico sea cubierto principalmente por la oxidación de lípidos, manteniendo la integridad del tejido muscular (especialmente si se acompaña de entrenamiento de fuerza).
              </p>
              
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center space-y-4">
              <h3 className="text-xl font-bold text-emerald-500 italic mb-4 uppercase text-center">Protocolo de Éxito</h3>
              {[
                { t: "Proteína Alta", d: "Consumir entre 1.8g y 2.2g de proteína por kg para proteger el músculo durante el déficit." },
                { t: "Déficit Progresivo", d: "No empieces restando 1000 kcal. Comienza con 300-500 y ajusta según sensaciones." },
                { t: "Entrenamiento de Fuerza", d: "Es la señal que le dice a tu cuerpo: 'No te deshagas del músculo, lo necesito'." },
                { t: "Sostenibilidad", d: "Un ritmo de 0.5% es mucho más fácil de mantener a largo plazo que uno del 1.5%." }
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