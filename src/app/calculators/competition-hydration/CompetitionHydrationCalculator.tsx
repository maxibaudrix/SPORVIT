"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Droplets, Thermometer, Timer, Share2, ShieldAlert, Zap, Waves, Beaker,
  Scale, Bike, Footprints, Sun, Snowflake, CloudSun, Target
} from 'lucide-react';

export default function CompetitionHydrationCalculator() {
  const [formData, setFormData] = useState({
    sport: 'running',
    duration: '', // horas
    weight: '', // kg
    climate: 'moderate', // cold, moderate, hot, extreme
    intensity: 'high', // moderate, high, elite
    goal: '' // Nombre de la competencia
  });

  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(typeof window !== 'undefined' ? window.location.href : ''); }, []);

  const calculatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const hours = parseFloat(formData.duration);
    const weight = parseFloat(formData.weight);
    
    if (!hours || !weight) return;

    // Lógica Base: Absorción máx ~800-900ml/h
    let baseRate = 500;
    if (formData.intensity === 'high') baseRate = 700;
    if (formData.intensity === 'elite') baseRate = 850;

    const climateMultipliers: Record<string, number> = {
      cold: 0.7,
      moderate: 1.0,
      hot: 1.3,
      extreme: 1.6
    };
    
    let hourlyFluid = baseRate * climateMultipliers[formData.climate];
    if (hourlyFluid > 950) hourlyFluid = 950;

    const totalFluid = hourlyFluid * hours;
    
    let sodiumPerHour = 600;
    if (formData.climate === 'hot' || formData.climate === 'extreme') sodiumPerHour = 850;
    if (formData.intensity === 'elite') sodiumPerHour += 150;

    setResult({
      hourly: Math.round(hourlyFluid),
      total: (totalFluid / 1000).toFixed(2),
      sodium: sodiumPerHour,
      totalSodium: Math.round(sodiumPerHour * hours),
      interval: Math.round(hourlyFluid / 4), // Toma cada 15 min
      goalName: formData.goal || 'mi competencia'
    });
  };

  const shareText = useMemo(() => {
    if (!result) return "";
    return `💧 Mi Plan de Hidratación Sporvit para ${result.goalName}:\n\n🥤 Beber: ${result.hourly}ml/h\n🧂 Sodio: ${result.sodium}mg/h\n🏁 Total: ${result.total}L\n\nPlanifica tu carrera aquí:`;
  }, [result]);

  const copyToClipboard = useCallback(async (text: string, type: 'embed' | 'share') => {
    await navigator.clipboard.writeText(text);
    if (type === 'embed') setCopyStatus('copied');
    else setShareStatus('copied');
    setTimeout(() => { setCopyStatus('idle'); setShareStatus('idle'); }, 2000);
  }, []);

  const embedSnippet = `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Plan Hidratacion Sporvit"></iframe>`;

  return (
    <div className="pt-8 pb-16 container mx-auto px-4 sm:px-6 max-w-6xl">
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <Droplets className="w-3 h-3" /> Estrategia de Nutrición Líquida
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter text-center">
          Hidratación para Competencia
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic text-center">
          "No bebas cuando tengas sed; bebe para que la sed nunca llegue."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculatePlan} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Nombre del Evento (Opcional)</label>
                <input type="text" value={formData.goal} onChange={(e) => setFormData({...formData, goal: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-cyan-500" placeholder="Ej: Maratón Valencia o Ironman 70.3" />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Deporte</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'running', label: 'Running', icon: Footprints },
                    { id: 'cycling', label: 'Ciclismo', icon: Bike },
                    { id: 'triathlon', label: 'Triatlón', icon: Waves }
                  ].map((s) => (
                    <button key={s.id} type="button" onClick={() => setFormData({...formData, sport: s.id})} className={`py-4 rounded-xl border text-[10px] font-black transition-all flex flex-col items-center gap-2 ${formData.sport === s.id ? 'bg-cyan-600 border-cyan-500 text-white shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-white'}`}>
                      <s.icon className="w-4 h-4" /> {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 flex items-center gap-2">
                    <Timer className="w-3 h-3 text-cyan-500" /> Duración Prevista (Horas)
                  </label>
                  <input type="number" step="0.1" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-cyan-500" placeholder="4.5" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 flex items-center gap-2">
                    <Scale className="w-3 h-3 text-cyan-500" /> Tu Peso (kg)
                  </label>
                  <input type="number" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-cyan-500" placeholder="72" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Clima el Día del Evento</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'cold', label: 'Frío', icon: Snowflake },
                    { id: 'moderate', label: 'Templado', icon: CloudSun },
                    { id: 'hot', label: 'Calor', icon: Sun },
                    { id: 'extreme', label: 'Extremo', icon: Zap }
                  ].map((c) => (
                    <button key={c.id} type="button" onClick={() => setFormData({...formData, climate: c.id})} className={`py-3 rounded-xl border text-[9px] font-black transition-all flex flex-col items-center gap-1 ${formData.climate === c.id ? 'bg-cyan-600 border-cyan-500 text-white shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                      <c.icon className="w-3 h-3" /> {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg">
                <Beaker className="w-6 h-6" /> Generar Mi Plan de Hidratación
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="text-center mb-8 border-b border-slate-800 pb-6">
                <p className="text-cyan-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Ingesta por Hora</p>
                <div className="text-6xl font-black text-white italic tracking-tighter">
                  {result ? result.hourly : '--'} <span className="text-xl text-slate-500">ml/h</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl flex justify-between items-center group transition-all">
                  <div>
                    <div className="text-[9px] font-black uppercase text-slate-400">Sodio Necesario</div>
                    <div className="text-[8px] text-slate-600 font-bold italic">Evita la hiponatremia</div>
                  </div>
                  <div className="text-2xl font-black text-white italic">{result?.sodium || '--'} <span className="text-xs">mg/h</span></div>
                </div>
                <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl flex justify-between items-center group transition-all">
                  <div>
                    <div className="text-[9px] font-black uppercase text-slate-400">Toma Frecuente</div>
                    <div className="text-[8px] text-slate-600 font-bold italic">Cada 15 minutos</div>
                  </div>
                  <div className="text-2xl font-black text-white italic">{result?.interval || '--'} <span className="text-xs">ml</span></div>
                </div>
              </div>
              
              <div className="p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-xl mb-8">
                <div className="text-[9px] font-black text-cyan-400 uppercase mb-2">Total Competencia</div>
                <div className="text-3xl font-black text-white italic">{result?.total || '--'} <span className="text-sm">Litros</span></div>
                <div className="text-[10px] text-slate-500 mt-1 font-bold italic">Sales totales: {result?.totalSodium || '--'} mg</div>
              </div>

              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button type="button" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center"><MessageCircle className="w-5 h-5" /></button>
                  <button type="button" onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center"><Send className="w-5 h-5" /></button>
                  <button type="button" onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-cyan-500 text-cyan-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button type="button" onClick={() => window.location.href=`mailto:?subject=Mi Estrategia de Hidratación Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl text-center">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-cyan-500" /> Widget de Planificación
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-cyan-400/50 focus:outline-none resize-none mb-3 cursor-pointer" />
            <button type="button" onClick={() => copyToClipboard(embedSnippet, 'embed')} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black transition-all border border-slate-700">
              {copyStatus === 'copied' ? <Check className="w-3 h-3 inline mr-1" /> : <Copy className="w-3 h-3 inline mr-1" />}
              {copyStatus === 'copied' ? 'CÓDIGO COPIADO' : 'COPIAR CÓDIGO EMBED'}
            </button>
          </div>
        </aside>
      </div>

      <article className="prose prose-invert prose-slate max-w-none space-y-16 mt-20">
        <section className="bg-slate-900/30 border border-slate-800 rounded-[40px] p-8 md:p-12">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-4">
            <Zap className="w-8 h-8 text-cyan-500" /> La Fisiología de la Hidratación en Carrera
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                En una competencia de larga distancia, la **hidratación** no es una opción, es un requerimiento biológico para el transporte de energía y la disipación del calor. Cuando realizas ejercicio intenso, solo el 20-25% de la energía se convierte en movimiento; el resto es calor. Para enfriarte, tu cuerpo recurre a la sudoración, lo que implica una pérdida masiva de agua y electrolitos.
              </p>
              <p>
                Si pierdes más del 2% de tu peso corporal en líquidos, tu plasma sanguíneo se vuelve más espeso y tu capacidad de absorber carbohidratos disminuye. Nuestra calculadora estima tus necesidades basándose en la intensidad y el clima, asegurando que tus niveles de hidratación se mantengan estables mediante la fórmula:
              </p>
              
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center space-y-4">
              <h3 className="text-xl font-bold text-cyan-400 italic mb-4 uppercase text-center">Reglas de Oro del Plan</h3>
              {[
                { t: "Poco y Frecuente", d: "Beber 150-200ml cada 15-20 min es mejor que beber medio litro de golpe." },
                { t: "El Peligro del Agua Sola", d: "Beber solo agua en exceso puede diluir el sodio en sangre (Hiponatremia)." },
                { t: "Límite de Absorción", d: "El estómago rara vez absorbe más de 800ml por hora en esfuerzo." },
                { t: "Prueba en Entreno", d: "Tu plan de hidratación debe entrenarse tanto como tus piernas." }
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