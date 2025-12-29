"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  TrendingDown, Zap, Target, ShieldAlert, Share2, Timer, Trophy, Activity, ArrowRight
} from 'lucide-react';

export default function TaperingCalculator() {
  const [formData, setFormData] = useState({
    peakVolume: '', // km o horas
    taperDuration: '2', // semanas
    discipline: 'running' // running, cycling, swimming
  });

  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const calculateTaper = (e: React.FormEvent) => {
    e.preventDefault();
    const volume = parseFloat(formData.peakVolume);
    const weeks = parseInt(formData.taperDuration);
    
    if (!volume || volume <= 0) return;

    let plan = [];
    
    if (weeks === 2) {
      // Taper de 2 semanas (Reducción moderada)
      plan.push({ week: 'Semana 2 (Pre-Race)', vol: (volume * 0.70).toFixed(1), pct: '30% reducción' });
      plan.push({ week: 'Semana 1 (Race Week)', vol: (volume * 0.45).toFixed(1), pct: '55% reducción' });
    } else {
      // Taper de 3 semanas (Ideal para Maratón/Ironman)
      plan.push({ week: 'Semana 3', vol: (volume * 0.80).toFixed(1), pct: '20% reducción' });
      plan.push({ week: 'Semana 2', vol: (volume * 0.60).toFixed(1), pct: '40% reducción' });
      plan.push({ week: 'Semana 1 (Race Week)', vol: (volume * 0.40).toFixed(1), pct: '60% reducción' });
    }

    setResult({
      plan,
      intensity: "Mantener 90-100% de intensidad competitiva",
      finalVol: plan[plan.length - 1].vol,
      totalReduction: plan[plan.length - 1].pct
    });
  };

  const shareText = useMemo(() => {
    if (!result) return "";
    return `🏁 Mi Plan de Tapering Sporvit:\n\nVolumen Semana de Carrera: ${result.finalVol} (Reducción del ${result.totalReduction}).\n\nOptimiza tu pico de forma aquí:`;
  }, [result]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Calculadora Tapering Sporvit"></iframe>`,
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <Zap className="w-3 h-3 animate-pulse" /> Supercompensación de Élite
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter text-center">
          Calculadora de Tapering
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic text-center">
          "Entrenar es fácil; saber descansar para ser el más rápido es el verdadero arte."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateTaper} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Activity className="w-3 h-3 text-orange-500" /> Volumen Pico Actual (km o Horas)
                </label>
                <input 
                  type="number" step="0.1" value={formData.peakVolume} 
                  onChange={(e) => setFormData({...formData, peakVolume: e.target.value})} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-6 px-6 text-3xl text-white outline-none focus:border-orange-500 transition-all font-black" 
                  placeholder="80" 
                />
                <p className="text-[9px] text-slate-600 font-bold italic">Indica el volumen semanal máximo de tu bloque actual.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Duración del Taper</label>
                  <select 
                    value={formData.taperDuration} 
                    onChange={(e) => setFormData({...formData, taperDuration: e.target.value})} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-4 text-white font-bold outline-none focus:border-orange-500 appearance-none"
                  >
                    <option value="2">2 Semanas (Estándar)</option>
                    <option value="3">3 Semanas (Larga Distancia)</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Disciplina</label>
                  <select 
                    value={formData.discipline} 
                    onChange={(e) => setFormData({...formData, discipline: e.target.value})} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-4 text-white font-bold outline-none focus:border-orange-500 appearance-none"
                  >
                    <option value="running">Running</option>
                    <option value="cycling">Ciclismo</option>
                    <option value="swimming">Natación</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full bg-orange-500 hover:bg-orange-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg">
                <Target className="w-6 h-6" /> Generar Plan de Tapering
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="text-center mb-8">
                <p className="text-orange-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Plan de Reducción</p>
                <div className="text-2xl font-black text-white italic uppercase tracking-tighter">Objetivo: Supercompensación</div>
              </div>

              <div className="space-y-3 mb-8">
                {result?.plan.map((step: any, i: number) => (
                  <div key={i} className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl flex justify-between items-center group hover:border-orange-500/30 transition-all">
                    <div>
                      <div className="text-[9px] font-black text-slate-500 uppercase">{step.week}</div>
                      <div className="text-2xl font-black text-white italic">{step.vol} <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{formData.peakVolume && isNaN(Number(formData.peakVolume)) ? '' : (formData.discipline === 'cycling' ? 'km' : 'km/h')}</span></div>
                    </div>
                    <div className="text-[10px] font-black text-orange-400 uppercase tracking-widest">{step.pct}</div>
                  </div>
                ))}
              </div>

              <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl mb-8 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-orange-500 shrink-0" />
                <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
                  <span className="text-orange-400 uppercase">Regla de Oro:</span> {result?.intensity}. Reduce el volumen, pero no la velocidad de tus series específicas.
                </p>
              </div>

              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-orange-500 text-orange-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mi Plan Tapering Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl text-center">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-orange-500" /> Inserta este Planificador
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-orange-500/50 focus:outline-none resize-none mb-3 cursor-pointer" />
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
            <Trophy className="w-8 h-8 text-orange-500" /> Tapering: La Ciencia de Alcanzar el Pico de Forma
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                En el deporte de resistencia, entrenar duro es solo la mitad de la ecuación. La otra mitad, a menudo descuidada por los deportistas populares, es el **Tapering**. Se define como una reducción progresiva y no lineal de la carga de entrenamiento durante un periodo de tiempo variable, con el objetivo de reducir el estrés fisiológico y psicológico del entrenamiento diario y optimizar el rendimiento deportivo.
              </p>
              <p>
                Durante un bloque de entrenamiento de 12 o 16 semanas para un maratón o un triatlón, el cuerpo acumula una fatiga sistémica masiva. Si llegas al día de la carrera con esa fatiga, tus depósitos de glucógeno estarán comprometidos, tu sistema nervioso estará agotado y tus fibras musculares tendrán micro-roturas. El tapering permite que todos estos sistemas se restauren, elevando tus niveles de fuerza y potencia justo para el día de la competición. Este fenómeno se conoce científicamente como **Supercompensación**.
              </p>
              <h3 className="text-xl font-bold text-white italic">Los Tres Pilares del Tapering</h3>
              <p>
                Nuestra calculadora Sporvit implementa los modelos validados por el Dr. Iñigo Mujika, que se basan en tres pilares fundamentales: **Reducción del Volumen** (entre un 40-60%), **Mantenimiento de la Intensidad** (clave para no perder adaptaciones neuromusculares) y una ligera reducción o mantenimiento de la **Frecuencia** de entrenamiento.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center space-y-4">
              <h3 className="text-xl font-bold text-orange-500 italic mb-4 uppercase text-center">Efectos del Tapering Correcto</h3>
              {[
                { t: "Aumento del VO2 Max", d: "Mejora en la capacidad de transporte de oxígeno." },
                { t: "Carga de Glucógeno", d: "Máxima saturación de energía en músculos e hígado." },
                { t: "Potencia Muscular", d: "Recuperación total de la capacidad contráctil." },
                { t: "Claridad Mental", d: "Reducción del estrés percibido y aumento de la motivación." }
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
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Fisiología de la Recuperación Invisible</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                title: "No pierdas la Chispa", 
                text: "El error más común es dejar de correr rápido durante el tapering. Si solo haces rodajes suaves, tu cuerpo entrará en un estado de 'letargo' neuromuscular. Debes mantener series cortas al ritmo de carrera para mantener el sistema nervioso activado." 
              },
              { 
                title: "Volumen vs Intensidad", 
                text: "La fatiga es sensible al volumen, mientras que la adaptación es sensible a la intensidad. Por eso, bajamos los kilómetros totales (volumen) pero mantenemos la velocidad (intensidad). Es la fórmula mágica del récord personal." 
              },
              { 
                title: "Nutrición y Tapering", 
                text: "Al reducir el volumen, tus necesidades calóricas bajan, pero tus necesidades de carbohidratos suben para asegurar la carga de glucógeno. Es una fase de balance delicado para llegar ligero pero cargado de energía." 
              }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl group hover:border-orange-500/40 transition-all">
                <h3 className="text-orange-500 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-t from-orange-500/10 to-transparent border border-orange-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Tu Victoria Comienza en el Descanso</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            La Calculadora de Tapering de Sporvit es la herramienta final de tu preparación. Confía en la ciencia: reducir el volumen no te hará perder la forma, te hará ganar la carrera. Sigue los porcentajes sugeridos, mantén la intensidad de tus series específicas y llega a la línea de salida sintiéndote como un muelle comprimido listo para liberarse. El éxito en la competición es el resultado de un entrenamiento inteligente y un tapering impecable.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Modelo Iñigo Mujika", "Supercompensación Atlética", "Pico de Forma Pro"].map((tag, i) => (
              <span key={i} className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-full text-[10px] font-black text-orange-400 uppercase tracking-widest">
                {tag}
              </span>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}