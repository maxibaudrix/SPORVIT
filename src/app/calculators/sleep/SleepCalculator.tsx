"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Moon, Sun, Clock, Zap, Coffee, Bed, Brain, RefreshCcw, 
  Share2, ShieldAlert, Code, Copy, Check, MessageCircle, Send, Mail, Calculator
} from 'lucide-react';

export default function SleepCalculator() {
  const [mode, setMode] = useState<'wake' | 'sleep'>('wake');
  const [targetTime, setTargetTime] = useState('07:00');
  const [results, setResults] = useState<any[]>([]);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  const FALL_ASLEEP_TIME = 14; // Promedio de minutos para quedarse dormido

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const calculateSleep = useCallback(() => {
    const times = [];
    const now = new Date();
    
    if (mode === 'sleep') {
      // Duermo ahora, ¿cuándo despierto?
      for (let i = 1; i <= 6; i++) {
        const time = new Date(now.getTime() + (i * 90 + FALL_ASLEEP_TIME) * 60000);
        times.push({
          label: `${i} Ciclos (${(i * 1.5).toFixed(1)}h)`,
          time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quality: i >= 5 ? 'optimal' : i >= 3 ? 'fair' : 'poor'
        });
      }
    } else {
      // Quiero despertar a las X, ¿cuándo duermo?
      const [h, m] = targetTime.split(':');
      const target = new Date();
      target.setHours(parseInt(h), parseInt(m), 0);
      
      for (let i = 6; i >= 1; i--) {
        const time = new Date(target.getTime() - (i * 90 + FALL_ASLEEP_TIME) * 60000);
        times.push({
          label: `${i} Ciclos (${(i * 1.5).toFixed(1)}h)`,
          time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quality: i >= 5 ? 'optimal' : i >= 3 ? 'fair' : 'poor'
        });
      }
    }
    setResults(times);
  }, [mode, targetTime]);

  useEffect(() => {
    if (mode === 'sleep') calculateSleep();
  }, [mode, calculateSleep]);

  const shareText = useMemo(() => {
    if (results.length === 0) return "";
    const optimal = results.find(r => r.quality === 'optimal');
    const msg = mode === 'sleep' 
      ? `🌙 Según Sporvit, si me duermo ahora debería despertar a las ${optimal?.time} para completar 6 ciclos.`
      : `⏰ Para despertar a las ${targetTime}, Sporvit me recomienda dormir a las ${optimal?.time}.`;
    return `${msg}\n\nOptimiza tu descanso aquí:`;
  }, [results, mode, targetTime]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="900px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Calculadora Sueño Sporvit"></iframe>`,
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
          <Moon className="w-3 h-3" /> Neurociencia del Descanso
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Calculadora de Sueño Óptimo
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
          "El sueño no es tiempo perdido; es el taller donde se repara tu cuerpo y se consolida tu mente."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <div className="flex gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-8">
              {[
                { id: 'wake', label: 'Quiero despertar a las...', icon: Sun },
                { id: 'sleep', label: 'Me voy a dormir ahora', icon: Bed }
              ].map((t) => (
                <button
                  key={t.id} onClick={() => setMode(t.id as any)}
                  className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase transition-all flex flex-col items-center gap-2 ${mode === t.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </button>
              ))}
            </div>

            {mode === 'wake' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2 ml-1">
                    <Clock className="w-3 h-3 text-indigo-400" /> Hora de Despertar
                  </label>
                  <input 
                    type="time" value={targetTime} 
                    onChange={(e) => setTargetTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-6 px-6 text-4xl text-white outline-none focus:border-indigo-500 font-black"
                  />
                </div>
                <button onClick={calculateSleep} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg">
                  <Calculator className="w-6 h-6" /> Calcular Horas de Sueño
                </button>
              </div>
            )}

            {mode === 'sleep' && (
              <div className="text-center py-12 animate-in slide-in-from-bottom-4 duration-500">
                <RefreshCcw className="w-16 h-16 text-indigo-500 mx-auto mb-6 animate-spin-slow" />
                <h3 className="text-xl font-black text-white italic uppercase mb-2">Calculando Ciclos Actuales</h3>
                <p className="text-slate-500 text-sm font-bold italic">Basado en la hora actual y 14 min para conciliar el sueño.</p>
              </div>
            )}
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className={`${results.length > 0 ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl">
              <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-6 text-center">Horarios Recomendados</h2>
              <div className="space-y-3 mb-8">
                {results.map((res, i) => (
                  <div key={i} className={`p-4 rounded-2xl border transition-all flex justify-between items-center ${res.quality === 'optimal' ? 'bg-indigo-600/10 border-indigo-500 shadow-[0_0_20px_-5px_rgba(79,70,229,0.3)]' : 'bg-slate-950/50 border-slate-800'}`}>
                    <div>
                      <div className="text-[9px] font-black uppercase text-slate-400">{res.label}</div>
                      <div className="text-2xl font-black text-white italic">{res.time}</div>
                    </div>
                    {res.quality === 'optimal' ? (
                      <div className="px-3 py-1 bg-indigo-600 rounded-full text-[8px] font-black text-white uppercase">Recomendado</div>
                    ) : (
                      <div className="text-[8px] font-black text-slate-600 uppercase">Aceptable</div>
                    )}
                  </div>
                ))}
              </div>

              {results.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-indigo-500 text-indigo-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mi Descanso Óptimo Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl text-center">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-indigo-400" /> Inserta este Widget
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-indigo-500/50 focus:outline-none resize-none mb-3 cursor-pointer" />
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
            <Brain className="w-8 h-8 text-indigo-500" /> La Ciencia del Ciclo de 90 Minutos
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                Dormir no es un estado uniforme. Nuestra mente atraviesa diferentes fases que se repiten aproximadamente cada **90 minutos**. Estas fases incluyen el sueño ligero, el sueño profundo (donde ocurre la reparación física) y el sueño REM (donde ocurre la consolidación de la memoria y el equilibrio emocional).
              </p>
              <p>
                El secreto de despertar con energía no está en cuántas horas duermes, sino en **cuándo te despiertas**. Si el despertador suena a mitad de un ciclo de sueño profundo, experimentarás lo que la ciencia llama **inercia del sueño**: esa sensación de pesadez, aturdimiento y mal humor que puede durar horas. Al utilizar nuestra calculadora, programas tu despertar justo al finalizar un ciclo, cuando tu cerebro ya está en un estado de sueño ligero, facilitando una transición natural a la vigilia.
              </p>
              <h3 className="text-xl font-bold text-white italic">El Papel de la Hormona del Crecimiento</h3>
              <p>
                Para los deportistas, el sueño profundo es el "gimnasio de la noche". Es durante las fases de sueño de ondas lentas cuando el cuerpo libera el mayor pico de **Hormona del Crecimiento (GH)**, fundamental para la síntesis de proteína muscular y la reparación de tejidos dañados por el entrenamiento.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center space-y-4">
              <h3 className="text-xl font-bold text-indigo-400 italic mb-4 uppercase text-center">Fases de un Ciclo Completo</h3>
              {[
                { t: "Fase 1: Sueño Ligero", d: "Transición entre vigilia y sueño. Fácil de despertar." },
                { t: "Fase 2: Consolidación", d: "La temperatura baja y el ritmo cardíaco se ralentiza." },
                { t: "Fase 3: Sueño Profundo", d: "Reparación física, liberación hormonal y limpieza cerebral." },
                { t: "Fase 4: Sueño REM", d: "Actividad cerebral alta, sueños vívidos y salud mental." }
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
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Higiene del Sueño para Atletas</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                title: "Bloqueo de Luz Azul", 
                text: "La luz de las pantallas inhibe la producción de melatonina, la hormona del sueño. Apaga tus dispositivos 60 minutos antes de la hora calculada por nuestra herramienta para asegurar una conciliación rápida." 
              },
              { 
                title: "Temperatura Óptima", 
                text: "Tu cuerpo necesita enfriarse para entrar en sueño profundo. Una habitación a unos 18-20°C es ideal para optimizar la calidad de tus ciclos de 90 minutos." 
              },
              { 
                title: "Consistencia Circadiana", 
                text: "Intentar despertar a la misma hora todos los días (incluso fines de semana) entrena a tu reloj biológico. Esto hace que tu cuerpo empiece a prepararse para despertar minutos antes de que suene la alarma." 
              }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl group hover:border-indigo-500/40 transition-all">
                <h3 className="text-indigo-500 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-t from-indigo-500/10 to-transparent border border-indigo-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Recuperación Total con Sporvit</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            Dormir 5 o 6 ciclos completos transformará tu rendimiento físico y tu capacidad de enfoque. No te conformes con "estar despierto"; busca estar optimizado. La Calculadora de Sueño de Sporvit es tu guía para sincronizar tus necesidades de vida con tus ritmos biológicos. Recuerda que la calidad del descanso es el multiplicador de todo tu esfuerzo en el entrenamiento. Duerme con inteligencia, despierta con poder.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Ciclos REM/NREM", "Optimización Circadiana", "Higiene del Sueño Pro"].map((tag, i) => (
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