"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Timer, Footprints, Zap, Share2, Target, Gauge, Activity, ListChecks
} from 'lucide-react';

const RACE_DISTANCES = [
  { name: '5K', value: 5000 },
  { name: '10K', value: 10000 },
  { name: 'Media Maratón', value: 21097 },
  { name: 'Maratón', value: 42195 },
];

export default function TrainingPaceCalculator() {
  const [distance, setDistance] = useState('10000');
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('45');
  const [seconds, setSeconds] = useState('00');

  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const calculateZones = (e: React.FormEvent) => {
    e.preventDefault();
    const totalSec = (parseInt(hours || '0') * 3600) + (parseInt(minutes || '0') * 60) + parseInt(seconds || '0');
    const dist = parseFloat(distance);

    if (!totalSec || !dist) return;

    // Estimación simplificada de VDOT (Jack Daniels)
    const velocity = dist / (totalSec / 60); // m/min
    const vdot = -4.6 + 0.182258 * velocity + 0.000104 * Math.pow(velocity, 2);

    // Factores de intensidad sobre el ritmo de carrera
    // Easy: ~70% VDOT, Threshold: ~88% VDOT, Interval: ~97% VDOT
    const racePaceSec = totalSec / (dist / 1000);
    
    const zones = [
      { id: 'easy', label: 'Easy / Rodaje Suave', pace: racePaceSec * 1.32, desc: 'Recuperación y base aeróbica.' },
      { id: 'marathon', label: 'Ritmo Maratón', pace: racePaceSec * 1.08, desc: 'Entrenamiento de resistencia específica.' },
      { id: 'threshold', label: 'Umbral (Tempo)', pace: racePaceSec * 0.94, desc: 'Mejora de la tolerancia al lactato.' },
      { id: 'interval', label: 'Intervalos (VO2 Max)', pace: racePaceSec * 0.88, desc: 'Series de 800m a 1600m.' },
      { id: 'repetition', label: 'Repeticiones (Velocidad)', pace: racePaceSec * 0.82, desc: 'Series cortas de 200m a 400m.' }
    ];

    setResult({
      vdot: vdot.toFixed(1),
      zones: zones.map(z => ({ ...z, formatted: formatPace(z.pace) }))
    });
  };

  const formatPace = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.round(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const shareText = useMemo(() => {
    if (!result) return "";
    const keyZones = result.zones
      .filter((z: any) => ['easy', 'threshold', 'interval'].includes(z.id))
      .map((z: any) => `${z.label}: ${z.formatted} min/km`)
      .join('\n');
    return `🏃‍♂️ Mis Ritmos de Entrenamiento en Sporvit (VDOT: ${result.vdot}):\n\n${keyZones}\n\nPlanifica tu entrenamiento aquí:`;
  }, [result]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Calculadora Ritmos Sporvit"></iframe>`,
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
          <Activity className="w-3 h-3" /> Metodología VDOT Científica
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter text-center">
          Calculadora de Ritmos de Entrenamiento
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic text-center">
          "No entrenes duro, entrena con precisión. Tus ritmos exactos para cada sesión."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateZones} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Distancia de Referencia (Mejor Marca)</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {RACE_DISTANCES.map((d) => (
                    <button key={d.value} type="button" onClick={() => setDistance(d.value.toString())} className={`py-3 rounded-xl border text-[10px] font-black transition-all ${distance === d.value.toString() ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-white'}`}>
                      {d.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Timer className="w-3 h-3 text-emerald-500" /> Tiempo de tu Marca (H:M:S)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <input type="number" placeholder="HH" value={hours} onChange={(e) => setHours(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-2xl py-4 text-center text-white font-black outline-none focus:border-emerald-500" />
                  <input type="number" placeholder="MM" value={minutes} onChange={(e) => setMinutes(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-2xl py-4 text-center text-white font-black outline-none focus:border-emerald-500" />
                  <input type="number" placeholder="SS" value={seconds} onChange={(e) => setSeconds(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-2xl py-4 text-center text-white font-black outline-none focus:border-emerald-500" />
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg">
                <Target className="w-6 h-6" /> Obtener Mis Ritmos de Entrenamiento
              </button>
            </form>
          </div>
        </section>

        {/* RESULTADOS */}
        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="text-center mb-8 border-b border-slate-800 pb-6">
                <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-1">Índice de Rendimiento VDOT</p>
                <div className="text-5xl font-black text-white italic">{result?.vdot || '--'}</div>
              </div>

              <div className="space-y-3 mb-8">
                {result?.zones.map((zone: any) => (
                  <div key={zone.id} className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl hover:border-emerald-500/30 transition-all group">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase">{zone.label}</span>
                      <span className="text-xl font-black text-white italic">{zone.formatted} <span className="text-[10px] text-slate-500">/km</span></span>
                    </div>
                    <p className="text-[9px] text-slate-600 font-bold italic">{zone.desc}</p>
                  </div>
                ))}
              </div>

              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center shadow-lg"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center shadow-lg"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-emerald-500 text-emerald-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mis Ritmos VDOT Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center shadow-lg"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl text-center">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-emerald-500" /> Inserta este Planificador de Ritmos
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-emerald-500/50 focus:outline-none resize-none mb-3 cursor-pointer" />
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
            <ListChecks className="w-8 h-8 text-emerald-500" /> Domina tus Zonas de Entrenamiento Running
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                El mayor error de los corredores populares es correr sus rodajes suaves "demasiado rápido" y sus series "demasiado lento". Esto se conoce como la trampa de la **zona gris**, un nivel de intensidad que genera mucha fatiga pero pocas adaptaciones fisiológicas específicas. Nuestra calculadora de Sporvit soluciona este problema utilizando el concepto de **VDOT**.
              </p>
              <p>
                El VDOT es un índice de rendimiento popularizado por el legendario entrenador Jack Daniels. Relaciona tu mejor marca reciente con tu capacidad de transporte y utilización de oxígeno ($VO_2 Max$). Al conocer tu VDOT, podemos desglosar matemáticamente a qué ritmo debes realizar cada tipo de sesión para obtener el estímulo deseado: desde la capilarización muscular en rodajes suaves hasta la potencia aeróbica en intervalos de alta intensidad.
              </p>
              <h3 className="text-xl font-bold text-white italic">¿Por qué basarse en una marca real?</h3>
              <p>
                A diferencia de las zonas de frecuencia cardíaca, que pueden verse alteradas por el estrés, la cafeína o el calor, los ritmos basados en marcas recientes reflejan tu **capacidad mecánica y fisiológica real**. Son el "estándar de oro" para la programación profesional de maratón y triatlón.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center space-y-4">
              <h3 className="text-xl font-bold text-emerald-500 italic mb-4 uppercase text-center">Desglose de Sesiones</h3>
              {[
                { t: "Easy Run", d: "El 80% de tu volumen. Construye mitocondrias y resistencia de base." },
                { t: "Threshold (Umbral)", d: "El ritmo que podrías mantener durante 1 hora. Crucial para 10k/21k." },
                { t: "Interval (VO2 Max)", d: "Series duras de 3-5 minutos. Aumentan tu techo aeróbico." },
                { t: "Repetitions", d: "Trabajo de velocidad y economía de carrera. Muy cortos con descanso total." }
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
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">La Ciencia Detrás de Cada Ritmo</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                title: "Rodajes Suaves (Easy)", 
                text: "Se corren a un ritmo conversacional. Su objetivo es fortalecer el corazón, aumentar la densidad capilar y preparar a los tendones para cargas mayores. Si no puedes hablar mientras corres, vas demasiado rápido para ser un rodaje Easy." 
              },
              { 
                title: "El Umbral de Lactato", 
                text: "Entrenar en el umbral enseña a tu cuerpo a reciclar el lactato de forma eficiente. Es el entrenamiento que más impacto tiene en tus marcas de larga distancia. Se siente como un esfuerzo 'cómodamente duro'." 
              },
              { 
                title: "Intervalos VO2 Max", 
                text: "Estas series estresan tu sistema de transporte de oxígeno al máximo. Son físicamente exigentes y deben realizarse con precaución, pero son la llave para desbloquear nuevas marcas personales en distancias cortas y medias." 
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
          <h2 className="text-2xl font-bold text-white mb-6">Optimiza tu Plan con Sporvit</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            Utiliza estos ritmos para estructurar tu semana de entrenamiento. Un plan equilibrado suele consistir en un 80% de ritmos Easy y un 20% repartido entre Umbral e Intervalos. Re-evalúa tus ritmos cada vez que logres una nueva marca personal o tras completar un bloque de entrenamiento de 8-12 semanas. En Sporvit, creemos que el entrenamiento de calidad no se basa en el sufrimiento innecesario, sino en el estímulo preciso. Entrena con datos, corre con inteligencia.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Metodología VDOT", "Zonas de Entrenamiento", "Optimización de Marcas"].map((tag, i) => (
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