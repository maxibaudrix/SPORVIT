"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  TrendingUp, Zap, Target, ShieldAlert, Share2, Dumbbell, Calendar, BarChart3
} from 'lucide-react';

export default function ProgressionCalculator() {
  const [formData, setFormData] = useState({
    currentWeight: '',
    reps: '8',
    incrementType: 'weight', // weight (linear) or percentage
    incrementValue: '2.5',
    weeks: '8'
  });

  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const calculateProgression = (e: React.FormEvent) => {
    e.preventDefault();
    const startWeight = parseFloat(formData.currentWeight);
    const weeks = parseInt(formData.weeks);
    const incVal = parseFloat(formData.incrementValue);

    if (!startWeight || !weeks || !incVal) return;

    let weeklyData = [];
    let current = startWeight;

    for (let i = 1; i <= weeks; i++) {
      weeklyData.push({
        week: i,
        weight: current.toFixed(1),
        tonnage: (current * parseInt(formData.reps) * 3).toFixed(0) // Estimación sobre 3 series
      });
      
      if (formData.incrementType === 'weight') {
        current += incVal;
      } else {
        current *= (1 + incVal / 100);
      }
    }

    setResult({
      weeklyData,
      finalWeight: current.toFixed(1),
      totalGain: (current - startWeight).toFixed(1)
    });
  };

  const shareText = useMemo(() => {
    if (!result) return "";
    return `📈 Mi Plan de Progresión en Sporvit:\n\n🚀 Meta: ${result.finalWeight} kg en ${formData.weeks} semanas.\n🔥 Ganancia Total: +${result.totalGain} kg.\n\nPlanifica tu progreso aquí:`;
  }, [result, formData]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Calculadora Progresión Sporvit"></iframe>`,
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
          <TrendingUp className="w-3 h-3" /> Ingeniería de Cargas
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter text-center">
          Calculadora de Progresión
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic text-center">
          "No esperes a que el músculo crezca; dale una razón matemática para hacerlo."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateProgression} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 flex items-center gap-2">
                    <Dumbbell className="w-3 h-3 text-emerald-500" /> Peso Inicial (kg)
                  </label>
                  <input type="number" step="0.1" value={formData.currentWeight} onChange={(e) => setFormData({...formData, currentWeight: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-emerald-500" placeholder="80" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 flex items-center gap-2">
                    <Zap className="w-3 h-3 text-emerald-500" /> Repeticiones Objetivo
                  </label>
                  <input type="number" value={formData.reps} onChange={(e) => setFormData({...formData, reps: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-emerald-500" placeholder="8" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Tipo de Incremento</label>
                  <select value={formData.incrementType} onChange={(e) => setFormData({...formData, incrementType: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-4 text-white font-bold outline-none focus:border-emerald-500 appearance-none">
                    <option value="weight">Lineal (kg/semana)</option>
                    <option value="percentage">Porcentual (%/semana)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Valor Incremento</label>
                  <input type="number" step="0.1" value={formData.incrementValue} onChange={(e) => setFormData({...formData, incrementValue: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-emerald-500" placeholder="2.5" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Semanas de Proyección</label>
                <input type="range" min="4" max="12" value={formData.weeks} onChange={(e) => setFormData({...formData, weeks: e.target.value})} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                <div className="text-center text-emerald-500 font-black text-sm">{formData.weeks} Semanas</div>
              </div>

              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg active:scale-[0.98]">
                <BarChart3 className="w-6 h-6" /> Generar Plan de Progresión
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="text-center mb-8">
                <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Meta Final de Carga</p>
                <div className="text-6xl font-black text-white italic tracking-tighter">
                  {result ? result.finalWeight : '--'} <span className="text-xl text-slate-500">kg</span>
                </div>
                <div className="text-[10px] text-emerald-400/60 font-black uppercase mt-2">Mejora Total: +{result?.totalGain || '--'} kg</div>
              </div>

              <div className="max-h-[300px] overflow-y-auto space-y-2 mb-8 pr-2 custom-scrollbar">
                {result?.weeklyData.map((w: any) => (
                  <div key={w.week} className="flex justify-between items-center p-3 bg-slate-950/50 border border-slate-800 rounded-xl hover:border-emerald-500/30 transition-all">
                    <span className="text-[10px] font-black text-slate-500 uppercase italic">Semana {w.week}</span>
                    <span className="text-lg font-black text-white italic">{w.weight} kg</span>
                  </div>
                ))}
              </div>

              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-emerald-500 text-emerald-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mi Plan de Fuerza&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl text-center">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-emerald-500" /> Comparte esta Tecnología
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-emerald-500/50 focus:outline-none resize-none mb-3 cursor-pointer" />
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
            <Target className="w-8 h-8 text-emerald-500" /> Sobrecarga Progresiva: La Ley de Oro del Entrenamiento
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                El cuerpo humano es una máquina de adaptación. Si le pides que levante el mismo peso semana tras semana, no tendrá ninguna razón biológica para construir nuevo tejido muscular o mejorar su eficiencia neuromuscular. Este fenómeno es la base de la **Sobrecarga Progresiva**.
              </p>
              <p>
                Sin embargo, progresar no significa simplemente "poner más kilos" sin control. Significa aumentar de forma sistemática y planificada el estrés mecánico sobre las fibras musculares. Nuestra calculadora de Sporvit te permite modelar este estrés mediante dos de los métodos más eficaces: la **progresión lineal** (ideal para principiantes e intermedios) y la **progresión porcentual** (clave para atletas avanzados que buscan picos de forma en ejercicios multiarticulares).
              </p>
              <h3 className="text-xl font-bold text-white italic">El Principio SAID</h3>
              <p>
                Este principio (*Specific Adaptation to Imposed Demands*) establece que el cuerpo se adaptará de forma específica a la demanda que le impongas. Al planificar tu progresión, estás dictando la velocidad y naturaleza de esa adaptación, asegurando que el estímulo sea siempre superior a tu capacidad de recuperación actual pero inferior a tu límite de lesión.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center space-y-4 text-center">
              <h3 className="text-xl font-bold text-emerald-500 italic mb-4 uppercase">Tipos de Sobrecarga</h3>
              {[
                { t: "Carga (Peso)", d: "Aumentar los kilos en la barra. Es la forma más directa de medir la fuerza." },
                { t: "Volumen (Series/Reps)", d: "Hacer más trabajo total. Ideal para fases de hipertrofia." },
                { t: "Densidad", d: "Hacer el mismo trabajo en menos tiempo (reducir descansos)." },
                { t: "Esfuerzo Percibido (RPE)", d: "Entrenar más cerca del fallo con la misma carga." }
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
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Estrategias de Progresión para Cada Nivel</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                title: "Progresión Lineal", 
                text: "Es la más sencilla y potente para quienes llevan menos de 2 años entrenando. Consiste en añadir una carga fija (ej. 2.5kg) en cada sesión o semana. Es la base de programas legendarios como Starting Strength o 5x5." 
              },
              { 
                title: "Progresión por Porcentaje", 
                text: "A medida que te vuelves más fuerte, añadir 2.5kg se vuelve cada vez más difícil. Usar un 2% o 3% de incremento permite una progresión más ajustada a tu realidad fisiológica, evitando estancamientos prematuros." 
              },
              { 
                title: "La Importancia de la Descarga", 
                text: "En un plan de 8 o 12 semanas, la fatiga acumulada es inevitable. Planificar una semana donde el volumen baje un 50% permite que tu sistema nervioso se recupere y consolide las ganancias obtenidas." 
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
          <h2 className="text-2xl font-bold text-white mb-6">Convierte los Datos en Músculo</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            Utiliza la Calculadora de Progresión de Entrenamiento de Sporvit para diseñar tus próximos mesociclos. La clave no es levantar lo máximo hoy, sino ser capaz de levantar un poco más mañana. Al visualizar tu camino de las próximas semanas, eliminas la duda y el "entrenamiento por sensaciones" que a menudo conduce a la mediocridad. Toma el control de tus cargas, respeta el plan y deja que la matemática de la fuerza trabaje para ti.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Sobrecarga Programada", "Periodización Lineal", "Ciencia del Entrenamiento"].map((tag, i) => (
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