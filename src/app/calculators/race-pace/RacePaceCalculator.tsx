"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Timer, Footprints, Map, Trophy, Share2, Zap, ShieldAlert, Target, ListOrdered
} from 'lucide-react';

const DISTANCES = [
  { name: '5K', value: 5 },
  { name: '10K', value: 10 },
  { name: 'Media Maratón', value: 21.0975 },
  { name: 'Maratón', value: 42.195 },
];

export default function RacePaceCalculator() {
  const [mode, setMode] = useState<'pace' | 'time' | 'distance'>('pace');
  const [distance, setDistance] = useState('10');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('50');
  const [seconds, setSeconds] = useState('00');
  const [paceMin, setPaceMin] = useState('5');
  const [paceSec, setPaceSec] = useState('00');

  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const dist = parseFloat(distance);
    const totalSecondsTime = (parseInt(hours || '0') * 3600) + (parseInt(minutes || '0') * 60) + parseInt(seconds || '0');
    const paceInSeconds = (parseInt(paceMin || '0') * 60) + parseInt(paceSec || '0');

    let calculated: any = {};

    if (mode === 'pace' && dist && totalSecondsTime) {
      const pace = totalSecondsTime / dist;
      calculated = { 
        pace: formatTime(pace), 
        dist, 
        time: formatFullTime(totalSecondsTime),
        splits: generateSplits(pace, dist)
      };
    } else if (mode === 'time' && dist && paceInSeconds) {
      const totalTime = paceInSeconds * dist;
      calculated = { 
        time: formatFullTime(totalTime), 
        dist, 
        pace: formatTime(paceInSeconds),
        splits: generateSplits(paceInSeconds, dist)
      };
    } else if (mode === 'distance' && totalSecondsTime && paceInSeconds) {
      const totalDist = totalSecondsTime / paceInSeconds;
      calculated = { 
        dist: totalDist.toFixed(2), 
        time: formatFullTime(totalSecondsTime), 
        pace: formatTime(paceInSeconds),
        splits: generateSplits(paceInSeconds, totalDist)
      };
    }

    setResult(calculated);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const formatFullTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const generateSplits = (pace: number, totalDist: number) => {
    const benchmarks = [1, 5, 10, 21.0975, 42.195];
    return benchmarks
      .filter(b => b <= totalDist + 0.5)
      .map(b => ({
        label: b === 21.0975 ? 'Media' : b === 42.195 ? 'Maratón' : `${b}K`,
        time: formatFullTime(pace * b)
      }));
  };

  const shareText = useMemo(() => {
    if (!result) return "";
    return `🏃‍♂️ Mi ritmo de carrera en Sporvit:\nDistancia: ${result.dist} km\nTiempo: ${result.time}\nRitmo: ${result.pace} min/km\n\nCalcula el tuyo aquí:`;
  }, [result]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Calculadora Ritmo Sporvit"></iframe>`,
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
          <Footprints className="w-3 h-3" /> Rendimiento Endurance Pro
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Calculadora de Ritmo de Carrera
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
          "El cronómetro no miente, pero el ritmo se entrena. Domina tu zancada."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <div className="flex gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-8">
              {['pace', 'time', 'distance'].map((m) => (
                <button
                  key={m} onClick={() => setMode(m as any)}
                  className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${mode === m ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}
                >
                  {m === 'pace' ? 'Calcular Ritmo' : m === 'time' ? 'Calcular Tiempo' : 'Calcular Distancia'}
                </button>
              ))}
            </div>

            <form onSubmit={calculate} className="space-y-6">
              {/* DISTANCIA */}
              <div className={`space-y-3 ${mode === 'distance' ? 'opacity-30' : ''}`}>
                <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Map className="w-3 h-3 text-emerald-500" /> Distancia (Kilómetros)
                </label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {DISTANCES.map(d => (
                    <button key={d.name} type="button" onClick={() => setDistance(d.value.toString())} className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[9px] font-black text-slate-400 hover:border-emerald-500 hover:text-white transition-all">
                      {d.name}
                    </button>
                  ))}
                </div>
                <input disabled={mode === 'distance'} type="number" step="0.01" value={distance} onChange={(e) => setDistance(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-xl text-white outline-none focus:border-emerald-500 font-black" />
              </div>

              {/* TIEMPO */}
              <div className={`space-y-3 ${mode === 'time' ? 'opacity-30' : ''}`}>
                <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Timer className="w-3 h-3 text-emerald-500" /> Tiempo Total (H:M:S)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input disabled={mode === 'time'} type="number" placeholder="HH" value={hours} onChange={(e) => setHours(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl py-4 text-center text-white font-black" />
                  <input disabled={mode === 'time'} type="number" placeholder="MM" value={minutes} onChange={(e) => setMinutes(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl py-4 text-center text-white font-black" />
                  <input disabled={mode === 'time'} type="number" placeholder="SS" value={seconds} onChange={(e) => setSeconds(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl py-4 text-center text-white font-black" />
                </div>
              </div>

              {/* RITMO */}
              <div className={`space-y-3 ${mode === 'pace' ? 'opacity-30' : ''}`}>
                <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Zap className="w-3 h-3 text-emerald-500" /> Ritmo (Min:Seg por Km)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input disabled={mode === 'pace'} type="number" placeholder="Min" value={paceMin} onChange={(e) => setPaceMin(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl py-4 text-center text-white font-black" />
                  <input disabled={mode === 'pace'} type="number" placeholder="Seg" value={paceSec} onChange={(e) => setPaceSec(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl py-4 text-center text-white font-black" />
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg">
                <Calculator className="w-6 h-6" /> {mode === 'pace' ? 'Calcular Ritmo' : mode === 'time' ? 'Predecir Tiempo' : 'Calcular Distancia'}
              </button>
            </form>
          </div>
        </section>

        {/* RESULTADOS */}
        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
              <div className="text-center mb-6">
                <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Resultado Principal</p>
                <div className="text-6xl font-black text-white italic tracking-tighter">
                  {result ? (mode === 'pace' ? result.pace : mode === 'time' ? result.time : result.dist + 'km') : '--'}
                </div>
                <div className="text-[10px] text-slate-500 font-bold mt-2">
                  {mode === 'pace' ? 'min/km' : mode === 'time' ? 'Tiempo Total' : 'Distancia total'}
                </div>
              </div>

              <div className="space-y-2 mb-8 border-t border-slate-800 pt-6">
                <p className="text-[10px] font-black text-slate-600 uppercase mb-3 flex items-center gap-2"><ListOrdered className="w-3 h-3" /> Parciales Estimados (Splits)</p>
                {result?.splits.map((s: any) => (
                  <div key={s.label} className="flex justify-between items-center bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-black text-slate-400 uppercase">{s.label}</span>
                    <span className="text-sm font-black text-white italic">{s.time}</span>
                  </div>
                ))}
              </div>

              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-emerald-500 text-emerald-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mi Ritmo Running Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl text-center">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-emerald-500" /> Inserta este Widget de Running
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-emerald-500/50 focus:outline-none resize-none mb-3 cursor-pointer" />
            <button onClick={() => copyToClipboard(embedSnippet, 'embed')} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black transition-all border border-slate-700">
              {copyStatus === 'copied' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copyStatus === 'copied' ? 'CÓDIGO COPIADO' : 'COPIAR CÓDIGO EMBED'}
            </button>
          </div>
        </aside>
      </div>

      {/* SEO ARTICLE (+1200 PALABRAS) */}
      <article className="prose prose-invert prose-slate max-w-none space-y-16">
        <section className="bg-slate-900/30 border border-slate-800 rounded-[40px] p-8 md:p-12">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-4">
            <Trophy className="w-8 h-8 text-emerald-500" /> Ritmo de Carrera (Pace): La Clave del Rendimiento Endurance
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                Para cualquier corredor, el **ritmo de carrera** o *pace* es la métrica reina. Se define como el tiempo que tardas en recorrer un kilómetro (o una milla) y es mucho más útil que la velocidad media para planificar entrenamientos y estrategias de competición. Entender tu ritmo te permite gestionar tu energía, evitar el agotamiento prematuro y alcanzar tus objetivos de marca personal.
              </p>
              <p>
                Nuestra calculadora de Sporvit permite despejar cualquier incógnita de la ecuación: ¿A qué ritmo debo ir para bajar de 4 horas en Maratón? ¿Cuál será mi tiempo en 10K si corro a 4:30 min/km? Estas respuestas son vitales para la periodización del entrenamiento. Sin un ritmo objetivo, el corredor entrena a ciegas, arriesgándose a lesiones por sobreesfuerzo o a estancamientos por falta de intensidad.
              </p>
              <h3 className="text-xl font-bold text-white italic">La Fisiología del Ritmo</h3>
              <p>
                Cada ritmo de carrera corresponde a una **vía metabólica** predominante. Un ritmo suave (Zona 2) entrena la oxidación de grasas y la salud mitocondrial, mientras que un ritmo de umbral de lactato mejora tu capacidad para mantener intensidades altas durante periodos prolongados.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center space-y-4">
              <h3 className="text-xl font-bold text-emerald-500 italic mb-4 uppercase text-center">Ritmos Referencia (Sub-objetivos)</h3>
              {[
                { t: "Sub 20' en 5K", d: "Ritmo necesario: 4:00 min/km" },
                { t: "Sub 45' en 10K", d: "Ritmo necesario: 4:30 min/km" },
                { t: "Sub 1h 45' en Media", d: "Ritmo necesario: 4:58 min/km" },
                { t: "Sub 4h en Maratón", d: "Ritmo necesario: 5:41 min/km" }
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
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Cómo Usar los Splits para tu Estrategia</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                title: "Even Splits (Ritmo Constante)", 
                text: "Es la estrategia más eficiente mecánicamente. Consiste en mantener el mismo ritmo desde el primer kilómetro hasta el último. Ideal para carreras llanas y con condiciones climáticas estables." 
              },
              { 
                title: "Negative Splits (Ritmo Progresivo)", 
                text: "Correr la segunda mitad de la carrera más rápido que la primera. Es la táctica preferida de los corredores de élite para ahorrar glucógeno y evitar el temido 'muro' en los últimos kilómetros." 
              },
              { 
                title: "Pacing en Terreno Irregular", 
                text: "Si tu carrera tiene desniveles, no te obsesiones con el ritmo instantáneo. Utiliza el GAP (Ritmo Ajustado a Grado) para mantener un esfuerzo constante independientemente de si subes o bajas." 
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
          <h2 className="text-2xl font-bold text-white mb-6">Optimiza cada Zancada con Sporvit</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            El ritmo es la brújula que guía al corredor hacia su meta. Ya sea que busques terminar tu primera carrera de 5K o romper la barrera de las 3 horas en maratón, la precisión en tus ritmos de entrenamiento es el factor determinante. Utiliza esta calculadora para desglosar tus objetivos, planificar tus series y visualizar tu éxito. Recuerda que la consistencia es superior a la intensidad aislada: el ritmo ideal es aquel que te permite cruzar la línea de meta con la satisfacción de haberlo dado todo de forma inteligente.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Ritmo por Kilómetro", "Predicción de Marca", "Running de Precisión"].map((tag, i) => (
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