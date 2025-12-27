"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Droplets, Scale, Timer, Sun, Zap, ShieldAlert, ArrowRight, Share2, GlassWater
} from 'lucide-react';

export default function WaterIntakeCalculator() {
  const [formData, setFormData] = useState({
    weight: '',
    exercise: '0',
    climate: 'moderate'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{liters: number, glasses: number} | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const calculateWater = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(formData.weight);
    const ex = parseFloat(formData.exercise);
    
    if (!w || w < 20 || w > 300) {
      setErrors({ weight: "Introduce un peso válido entre 20kg y 300kg" });
      return;
    }
    setErrors({});

    // 1. Base: 35ml por kg de peso
    let ml = w * 35;

    // 2. Ajuste por ejercicio: +500ml por cada 30 min de actividad intensa
    ml += (ex / 30) * 500;

    // 3. Ajuste por clima
    if (formData.climate === 'hot') ml += 500;
    if (formData.climate === 'cold') ml -= 200;

    const totalLiters = ml / 1000;
    setResult({
      liters: Number(totalLiters.toFixed(2)),
      glasses: Math.ceil(ml / 250) // Vaso estándar de 250ml
    });

    if ((window as any).gtag) {
      (window as any).gtag('event', 'calculate_water', { weight: w, exercise_mins: ex });
    }
  };

  const shareText = useMemo(() => 
    result ? `💧 Mi objetivo de hidratación diaria es de ${result.liters} litros (${result.glasses} vasos). ¡Calcula el tuyo en Sporvit!` : "", 
  [result]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="900px" frameborder="0" style="border-radius:24px; overflow:hidden;" title="Calculadora Agua Sporvit"></iframe>`,
  [currentUrl]);

  const copyToClipboard = useCallback(async (text: string, type: 'embed' | 'share') => {
    await navigator.clipboard.writeText(text);
    if (type === 'embed') setCopyStatus('copied');
    else setShareStatus('copied');
    setTimeout(() => { setCopyStatus('idle'); setShareStatus('idle'); }, 2000);
  }, []);

  return (
    <div className="pt-8 pb-16 container mx-auto px-4 sm:px-6 max-w-6xl">
      {/* HEADER */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <Droplets className="w-3 h-3" /> Balance Hídrico Inteligente
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Calculadora de Consumo de Agua Diario
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
          "El agua es el combustible silencioso de tus células. No esperes a tener sed para hidratar tu rendimiento."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        {/* INPUTS */}
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateWater} noValidate className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label htmlFor="weight" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Scale className="w-3 h-3 text-blue-400" /> Peso Corporal (kg)
                  </label>
                  <input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    className={`w-full bg-slate-950 border ${errors.weight ? 'border-red-500' : 'border-slate-800'} rounded-2xl py-5 px-6 text-xl text-white outline-none focus:border-blue-400 transition-all font-black`}
                    placeholder="70"
                    aria-invalid={!!errors.weight}
                  />
                  {errors.weight && <p className="text-red-500 text-[10px] font-bold flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> {errors.weight}</p>}
                </div>

                <div className="space-y-3">
                  <label htmlFor="exercise" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Timer className="w-3 h-3 text-blue-400" /> Ejercicio Diario (min)
                  </label>
                  <input
                    id="exercise"
                    type="number"
                    value={formData.exercise}
                    onChange={(e) => setFormData({...formData, exercise: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-5 px-6 text-xl text-white outline-none focus:border-blue-400 transition-all font-black"
                    placeholder="45"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Sun className="w-3 h-3 text-blue-400" /> Clima Predominante
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'cold', label: 'Frío', icon: '❄️' },
                    { id: 'moderate', label: 'Templado', icon: '☁️' },
                    { id: 'hot', label: 'Cálido', icon: '☀️' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData({...formData, climate: item.id})}
                      className={`py-4 rounded-xl border font-bold text-xs transition-all flex flex-col items-center gap-1 ${
                        formData.climate === item.id 
                        ? 'bg-blue-500 border-blue-500 text-slate-950' 
                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-blue-400/50'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-500 hover:bg-blue-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)] uppercase tracking-tighter flex items-center justify-center gap-4 text-lg active:scale-[0.98]">
                <Droplets className="w-6 h-6" /> Calcular Hidratación
              </button>
            </form>
          </div>
        </section>

        {/* RESULTADOS */}
        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="text-center mb-8 border-b border-slate-800/50 pb-8">
                <p className="text-blue-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Tu Objetivo Diario</p>
                <div className="text-7xl font-black text-white italic tracking-tighter">
                  {result ? result.liters : '--'} <span className="text-2xl text-slate-500 ml-1">Litros</span>
                </div>
              </div>

              <div className="flex justify-between items-center p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl group transition-all mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                    <GlassWater className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase text-slate-300">Equivalente en vasos</div>
                    <div className="text-[10px] text-slate-500 font-bold italic">Vasos de 250ml aprox.</div>
                  </div>
                </div>
                <div className="text-4xl font-black text-white italic">{result?.glasses || '--'}</div>
              </div>

              {/* SHARE */}
              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center" aria-label="WhatsApp"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center" aria-label="Telegram"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center ${shareStatus === 'copied' ? 'border-blue-500 text-blue-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mi Hidratación Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center" aria-label="Email"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-blue-400" /> Widget para tu Blog
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-blue-400/50 focus:outline-none resize-none mb-3" />
            <button onClick={() => copyToClipboard(embedSnippet, 'embed')} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
              {copyStatus === 'copied' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copyStatus === 'copied' ? 'Copiado' : 'Copiar Código'}
            </button>
          </div>
        </aside>
      </div>

      {/* CONTENIDO EDUCATIVO (+800 PALABRAS) */}
      <article className="prose prose-invert prose-slate max-w-none space-y-16">
        <section className="bg-slate-900/30 border border-slate-800 rounded-[40px] p-8 md:p-12">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-4">
            <Info className="w-8 h-8 text-blue-400" /> La Ciencia de la Hidratación: ¿Por qué no basta con 2 litros?
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                El mito de los "8 vasos de agua al día" es una simplificación excesiva de una necesidad biológica compleja. El requerimiento hídrico es profundamente **individual**. Un atleta de 90 kg entrenando en un clima tropical tiene necesidades radicalmente distintas a las de una persona de 60 kg en un entorno de oficina con aire acondicionado.
              </p>
              <p>
                Nuestra calculadora utiliza el **protocolo de 35ml por kilogramo de peso**, que es el estándar recomendado por diversas organizaciones de salud para mantener la homeostasis celular. A esto añadimos variables críticas como el ejercicio intenso, donde la pérdida por sudoración puede alcanzar hasta 1.5 litros por hora en condiciones extremas.
              </p>
              <h3 className="text-xl font-bold text-white italic">El rol del agua en el rendimiento deportivo</h3>
              <p>
                Una deshidratación de apenas el **2% de tu peso corporal** puede provocar una caída del 20% en tu rendimiento físico y cognitivo. El agua no solo regula la temperatura corporal, sino que es el medio de transporte para los nutrientes que tus músculos necesitan durante el entrenamiento y el proceso de eliminación de desechos metabólicos.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 space-y-6">
              <h3 className="text-xl font-bold text-blue-400 italic mb-4 uppercase text-center">Signos de Deshidratación</h3>
              <div className="space-y-4">
                {[
                  { t: "Orina Oscura", d: "El indicador más fiable. Debe ser color paja claro." },
                  { t: "Fatiga Inexplicable", d: "La falta de agua reduce el volumen plasmático sanguíneo." },
                  { t: "Dolor de Cabeza", d: "El tejido cerebral pierde hidratación y se contrae levemente." },
                  { t: "Pérdida de Concentración", d: "El cerebro es 75% agua; la falta de esta afecta la sinapsis." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start bg-slate-900/50 p-3 rounded-xl">
                    <Zap className="w-5 h-5 text-blue-400 shrink-0 mt-1" />
                    <div>
                      <div className="font-black text-xs text-white uppercase">{item.t}</div>
                      <div className="text-[10px] text-slate-500 font-bold">{item.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Estrategias para una Hidratación de Élite</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Regla del Pre-Entreno", text: "Bebe 500ml de agua 2 horas antes de entrenar. Esto asegura que tus niveles plasmáticos estén optimizados antes de empezar a sudar." },
              { title: "Electrolitos", text: "Si tu entrenamiento dura más de 90 minutos o sudas mucho, el agua sola no basta. Necesitas sodio, potasio y magnesio para evitar la hiponatremia y los calambres." },
              { title: "Agua en Alimentos", text: "Recuerda que el 20% de tu hidratación proviene de lo que comes. Frutas como la sandía o vegetales como el pepino son casi 95% agua estructural." }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl group hover:border-blue-500/40 transition-all">
                <h3 className="text-blue-400 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-t from-blue-500/10 to-transparent border border-blue-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">¿Agua Fría o Templada?</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            La ciencia sugiere que durante el ejercicio, el agua a una temperatura de entre **15°C y 21°C** es la que mejor se absorbe y ayuda a enfriar el núcleo corporal. Sin embargo, lo más importante es la **palatabilidad**: bebe agua a la temperatura que te resulte más agradable para asegurar que consumes la cantidad necesaria. Si te cuesta beber agua sola, añadir rodajas de limón, menta o pepino puede mejorar la adherencia a tu objetivo diario.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Protocolo 35ml/kg", "Ajuste Ambiental", "Fórmula Deportiva"].map((tag, i) => (
              <span key={i} className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-widest">
                {tag}
              </span>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}