"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Droplets, Thermometer, Timer, Share2, ShieldAlert, Zap, Waves, Beaker
} from 'lucide-react';

export default function HydrationCalculator() {
  const [formData, setFormData] = useState({
    preWeight: '',
    postWeight: '',
    fluidIntake: '', // ml
    duration: '', // minutos
    intensity: 'moderate' // moderate, high
  });

  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const calculateHydration = (e: React.FormEvent) => {
    e.preventDefault();
    const pre = parseFloat(formData.preWeight);
    const post = parseFloat(formData.postWeight);
    const intake = parseFloat(formData.fluidIntake) / 1000; // a litros
    const timeHr = parseFloat(formData.duration) / 60;

    if (!pre || !post || !timeHr) return;

    // 1. TASA DE SUDORACIÓN (L/h)
    // Fórmula: ((Peso Pre - Peso Post) + Líquido) / Horas
    const sweatRate = ((pre - post) + intake) / timeHr;

    // 2. PORCENTAJE DE DESHIDRATACIÓN
    const dehydrationPct = ((pre - post) / pre) * 100;

    // 3. RECOMENDACIÓN DE SODIO (Basado en intensidad media: 700mg/L)
    const sodiumTarget = sweatRate * 700;

    setResult({
      rate: sweatRate.toFixed(2),
      dehydration: dehydrationPct.toFixed(1),
      sodium: Math.round(sodiumTarget),
      replacement: (sweatRate * 0.8).toFixed(2), // Recomendar reponer el 80%
      status: dehydrationPct > 2 ? 'Crítico' : 'Controlado'
    });
  };

  const shareText = useMemo(() => {
    if (!result) return "";
    return `💧 Mi Tasa de Sudoración en Sporvit:\n\n📉 Pierdo: ${result.rate} L/h\n🧂 Necesito: ${result.sodium} mg de Sodio/h\n⚠️ Deshidratación: ${result.dehydration}%\n\nCalcula tu plan de hidratación aquí:`;
  }, [result]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Calculadora Hidratación Sporvit"></iframe>`,
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
          <Beaker className="w-3 h-3" /> Fisiología de la Hidratación
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter text-center">
          Calculadora de Tasa de Sudoración e Hidratación
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic text-center">
          "El agua es el transporte de tus nutrientes; el sodio es la llave que los mantiene en tus células."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateHydration} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 flex items-center gap-2">
                    <Waves className="w-3 h-3 text-cyan-500" /> Peso Pre-Entreno (kg)
                  </label>
                  <input type="number" step="0.1" value={formData.preWeight} onChange={(e) => setFormData({...formData, preWeight: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-cyan-500" placeholder="70.5" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 flex items-center gap-2">
                    <Waves className="w-3 h-3 text-cyan-500" /> Peso Post-Entreno (kg)
                  </label>
                  <input type="number" step="0.1" value={formData.postWeight} onChange={(e) => setFormData({...formData, postWeight: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-cyan-500" placeholder="69.2" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 flex items-center gap-2">
                    <Droplets className="w-3 h-3 text-cyan-500" /> Líquido Ingerido (ml)
                  </label>
                  <input type="number" value={formData.fluidIntake} onChange={(e) => setFormData({...formData, fluidIntake: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-cyan-500" placeholder="500" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 flex items-center gap-2">
                    <Timer className="w-3 h-3 text-cyan-500" /> Duración Sesión (min)
                  </label>
                  <input type="number" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-cyan-500" placeholder="60" />
                </div>
              </div>

              <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg">
                <Calculator className="w-6 h-6" /> Calcular Plan de Hidratación
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="text-center mb-8 border-b border-slate-800 pb-6">
                <p className="text-cyan-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Tasa de Sudoración Estimada</p>
                <div className="text-6xl font-black text-white italic tracking-tighter">
                  {result ? result.rate : '--'} <span className="text-xl text-slate-500">L/h</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl flex justify-between items-center group transition-all">
                  <div>
                    <div className="text-[9px] font-black uppercase text-slate-400">Pérdida de Sodio</div>
                    <div className="text-[8px] text-slate-600 font-bold italic">Sugerencia por hora</div>
                  </div>
                  <div className="text-2xl font-black text-white italic">{result?.sodium || '--'} <span className="text-xs">mg</span></div>
                </div>
                <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl flex justify-between items-center group transition-all">
                  <div>
                    <div className="text-[9px] font-black uppercase text-slate-400">Deshidratación</div>
                    <div className="text-[8px] text-slate-600 font-bold italic">% de peso perdido</div>
                  </div>
                  <div className={`text-2xl font-black italic ${result?.status === 'Crítico' ? 'text-red-500' : 'text-emerald-500'}`}>
                    {result ? result.dehydration : '--'}%
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-xl flex items-start gap-3 mb-8">
                <ShieldAlert className="w-5 h-5 text-cyan-500 shrink-0" />
                <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic text-justify">
                  El objetivo es no perder más del 2% del peso corporal. Se recomienda reponer al menos el 80% del líquido perdido ({result?.replacement || '--'} L/h).
                </p>
              </div>

              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-cyan-500 text-cyan-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mi Plan de Hidratación Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center"><Mail className="w-5 h-5" /></button>
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
            <Zap className="w-8 h-8 text-cyan-500" /> La Tasa de Sudoración: Tu Pasaporte al Rendimiento
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                La **hidratación** no consiste simplemente en beber agua cuando tienes sed. En deportes de larga duración, la sed es un indicador tardío que aparece cuando ya estás deshidratado. La **Tasa de Sudoración** es el volumen de líquido que tu cuerpo expulsa por hora para regular su temperatura interna ante el calor metabólico generado por el ejercicio.
              </p>
              <p>
                Nuestra calculadora implementa el protocolo de campo avalado por la literatura científica: comparar el peso corporal antes y después de una sesión representativa de 60 minutos, sumando el líquido ingerido. Conocer tu "número" te permite diseñar una estrategia de carrera personalizada, evitando la hiponatremia (exceso de agua pura sin sales) o la deshidratación severa.
              </p>
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center font-mono text-cyan-400 text-xl my-4">
                {"$$Tasa (L/h) = \\frac{(Peso_{Pre} - Peso_{Post}) + Líquido}{Tiempo}$$"}
              </div>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center space-y-4">
              <h3 className="text-xl font-bold text-cyan-400 italic mb-4 uppercase text-center">Protocolo de Reposición</h3>
              {[
                { t: "Límite del 2%", d: "Perder más del 2% del peso total compromete el VO2 Max y la potencia." },
                { t: "La Regla del 80%", d: "No intentes reponer el 100% mientras corres; el estómago no lo tolera. Busca el 80%." },
                { t: "Importancia del Sodio", d: "El sodio retiene el agua. Sin él, el líquido se elimina rápidamente por la orina." },
                { t: "Temperatura Ambiental", d: "Repite el test en diferentes climas para ajustar tu plan estacional." }
              ].map((item, i) => (
                <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-left">
                  <div className="font-black text-xs text-white uppercase">{item.t}</div>
                  <div className="text-[10px] text-slate-500 font-bold">{item.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-t from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Hidratación Inteligente con Sporvit</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            Un plan de hidratación bien ejecutado es la diferencia entre un gran final y un colapso en los últimos kilómetros. Utiliza esta herramienta para conocer tu fisiología única, entrena tu estómago para absorber los líquidos necesarios y llega a la meta con la frescura necesaria para un sprint final. En Sporvit, transformamos el sudor en datos para que tú lo transformes en victorias.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Tasa de Sudoración L/h", "Plan de Electrolitos", "Rendimiento Endurance"].map((tag, i) => (
              <span key={i} className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-full text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                {tag}
              </span>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}