"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Waves, Timer, Zap, Share2, ShieldAlert, Target, Trophy, Activity, Droplets
} from 'lucide-react';

export default function CSSCalculator() {
  const [t400Min, setT400Min] = useState('6');
  const [t400Sec, setT400Sec] = useState('30');
  const [t200Min, setT200Min] = useState('3');
  const [t200Sec, setT200Sec] = useState('00');

  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const calculateCSS = (e: React.FormEvent) => {
    e.preventDefault();
    const time400 = (parseInt(t400Min || '0') * 60) + parseInt(t400Sec || '0');
    const time200 = (parseInt(t200Min || '0') * 60) + parseInt(t200Sec || '0');

    if (time400 <= time200 || time200 === 0) return;

    // Fórmula CSS: (D2 - D1) / (T2 - T1) -> (400 - 200) / (T400 - T200)
    const cssMps = 200 / (time400 - time200);
    const pace100 = 100 / cssMps;

    const zones = [
      { label: 'CSS (Umbral)', pace: pace100, desc: 'Ritmo para series de 200-400m.' },
      { label: 'Aeróbico (CSS + 5s)', pace: pace100 + 5, desc: 'Rodajes de larga distancia.' },
      { label: 'Sprint (CSS - 3s)', pace: pace100 - 3, desc: 'Series de 50-100m técnica.' }
    ];

    setResult({
      cssPace: formatTime(pace100),
      zones: zones.map(z => ({ ...z, formatted: formatTime(z.pace) })),
      mps: cssMps.toFixed(2)
    });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const shareText = useMemo(() => {
    if (!result) return "";
    return `🏊‍♂️ Mi Velocidad Crítica de Nado (CSS) en Sporvit:\nRitmo: ${result.cssPace}/100m\n\nOptimiza tu natación aquí:`;
  }, [result]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Calculadora CSS Sporvit"></iframe>`,
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <Waves className="w-3 h-3" /> Fisiología Acuática de Élite
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter text-center">
          Calculadora de Velocidad Crítica (CSS)
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic text-center">
          "El agua es 800 veces más densa que el aire. No nades contra ella, domina tu umbral."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateCSS} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Timer className="w-3 h-3 text-cyan-500" /> Tiempo Test 400m (M:S)
                  </label>
                  <div className="flex gap-2">
                    <input type="number" value={t400Min} onChange={(e) => setT400Min(e.target.value)} className="w-1/2 bg-slate-950 border border-slate-800 rounded-2xl py-4 text-center text-white font-black outline-none focus:border-cyan-500" placeholder="Min" />
                    <input type="number" value={t400Sec} onChange={(e) => setT400Sec(e.target.value)} className="w-1/2 bg-slate-950 border border-slate-800 rounded-2xl py-4 text-center text-white font-black outline-none focus:border-cyan-500" placeholder="Seg" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Timer className="w-3 h-3 text-cyan-500" /> Tiempo Test 200m (M:S)
                  </label>
                  <div className="flex gap-2">
                    <input type="number" value={t200Min} onChange={(e) => setT200Min(e.target.value)} className="w-1/2 bg-slate-950 border border-slate-800 rounded-2xl py-4 text-center text-white font-black outline-none focus:border-cyan-500" placeholder="Min" />
                    <input type="number" value={t200Sec} onChange={(e) => setT200Sec(e.target.value)} className="w-1/2 bg-slate-950 border border-slate-800 rounded-2xl py-4 text-center text-white font-black outline-none focus:border-cyan-500" placeholder="Seg" />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg">
                <Calculator className="w-6 h-6" /> Calcular Mi Ritmo CSS
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="text-center mb-8">
                <p className="text-cyan-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Tu Ritmo CSS</p>
                <div className="text-7xl font-black text-white italic tracking-tighter">
                  {result ? result.cssPace : '--'} <span className="text-2xl text-slate-500">/100m</span>
                </div>
                <div className="text-[10px] text-slate-500 font-bold uppercase mt-2">Velocidad: {result?.mps || '--'} m/s</div>
              </div>

              <div className="space-y-3 mb-8">
                {result?.zones.map((zone: any, i: number) => (
                  <div key={i} className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl flex justify-between items-center group hover:border-cyan-500/30 transition-all">
                    <div>
                      <div className="text-[9px] font-black text-slate-500 uppercase">{zone.label}</div>
                      <div className="text-lg font-black text-white italic">{zone.formatted} <span className="text-[10px] text-slate-600">/100m</span></div>
                    </div>
                    <div className="text-[9px] text-slate-600 font-bold italic text-right max-w-[120px]">{zone.desc}</div>
                  </div>
                ))}
              </div>

              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-cyan-500 text-cyan-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mi CSS Natación Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl text-center">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-cyan-500" /> Inserta este Widget
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-cyan-400/50 focus:outline-none resize-none mb-3 cursor-pointer" />
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
            <Activity className="w-8 h-8 text-cyan-500" /> ¿Qué es la Velocidad Crítica de Nado (CSS)?
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                La **Velocidad Crítica de Nado** (Critical Swim Speed o CSS) es, de forma simplificada, el equivalente en natación al Umbral de Lactato en carrera o al FTP en ciclismo. Representa el ritmo de nado más alto que puedes mantener de forma continua sin entrar en un estado de fatiga exponencial. Matemáticamente, es la pendiente de la relación entre la distancia recorrida y el tiempo empleado.
              </p>
              <p>
                Para los triatletas de media y larga distancia (Ironman y 70.3), la CSS es el dato más importante. Entrenar por encima de este ritmo te ayuda a mejorar tu potencia aeróbica, mientras que entrenar justo en este ritmo mejora tu capacidad para mantener una velocidad competitiva durante los 1.900 o 3.800 metros de la etapa de natación. Nuestra calculadora utiliza el **Test de 400 y 200 metros**, un estándar de la industria por su facilidad de ejecución y alta correlación con pruebas de laboratorio.
              </p>
              <h3 className="text-xl font-bold text-white italic">La Fórmula Detrás del Test</h3>
              <p>
                La lógica se basa en restar la contribución del sistema anaeróbico inicial. Al comparar un esfuerzo de 400m con uno de 200m, podemos aislar el componente aeróbico puro. La fórmula es:
              </p>
              
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center space-y-4">
              <h3 className="text-xl font-bold text-cyan-500 italic mb-4 uppercase text-center">Por qué necesitas tu CSS</h3>
              {[
                { t: "Adiós a la 'Zona Gris'", d: "Evita nadar siempre al mismo ritmo monótono que no genera mejora." },
                { t: "Estructura de Series", d: "Sabrás exactamente a qué ritmo nadar tus bloques de 100m, 200m o 400m." },
                { t: "Monitor de Progreso", d: "Si tu CSS baja de 1:45 a 1:42, tu estado de forma aeróbico ha mejorado." },
                { t: "Estrategia de Triatlón", d: "Te ayuda a no 'quemarte' en los primeros 500m de la competición." }
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
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Cómo Ejecutar el Test de Campo</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                title: "Calentamiento", 
                text: "Realiza 400-600m de nado variado incluyendo técnica y algunas aceleraciones. Debes estar completamente activado pero no fatigado antes de empezar el primer test." 
              },
              { 
                title: "El Bloque Principal", 
                text: "Nada 400m a tu máxima intensidad constante. Descansa 10-15 minutos (nado muy suave) y luego nada 200m a máxima intensidad. Registra ambos tiempos con precisión de segundos." 
              },
              { 
                title: "Análisis de Datos", 
                text: "Introduce los tiempos en la calculadora de Sporvit. El resultado te dará tu ritmo base para series. Repite este test cada 4-6 semanas para ajustar tus zonas de intensidad." 
              }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl group hover:border-cyan-500/40 transition-all">
                <h3 className="text-cyan-500 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-t from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Eficiencia Total en el Agua</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            La natación es un deporte donde la técnica y la fisiología van de la mano. Conocer tu Velocidad Crítica de Nado te permite entrenar el motor aeróbico mientras mantienes una técnica sólida bajo fatiga controlada. La Calculadora CSS de Sporvit es tu herramienta para dejar de adivinar tus ritmos en la piscina. Ya sea que prepares un cruce a nado o el sector acuático de un triatlón, el dato de tu CSS es la brújula que te llevará a ser un nadador más rápido, eficiente y resistente.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Test 400/200", "Umbral de Nado", "Entrenamiento de Triatlón"].map((tag, i) => (
              <span key={i} className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-full text-[10px] font-black text-cyan-500 uppercase tracking-widest">
                {tag}
              </span>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}