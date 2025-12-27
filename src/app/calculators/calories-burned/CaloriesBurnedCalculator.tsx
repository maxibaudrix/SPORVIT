"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Flame, Timer, Scale, Activity, Zap, Share2, Search, Dumbbell, Bike, SunIcon
} from 'lucide-react';

// Base de datos de actividades y sus METs (Compendium of Physical Activities)
const ACTIVITIES = [
  { id: 'running_slow', name: 'Running (Pace suave - 8 km/h)', met: 8.3 },
  { id: 'running_mod', name: 'Running (Pace medio - 10 km/h)', met: 9.8 },
  { id: 'running_fast', name: 'Running (Pace alto - 12+ km/h)', met: 11.8 },
  { id: 'cycling_mod', name: 'Ciclismo (Moderado 20 km/h)', met: 8.0 },
  { id: 'cycling_high', name: 'Ciclismo (Esfuerzo alto)', met: 12.0 },
  { id: 'swimming', name: 'Natación (Crol moderado)', met: 8.0 },
  { id: 'weightlifting_heavy', name: 'Entrenamiento de Fuerza (Pesado)', met: 6.0 },
  { id: 'weightlifting_mod', name: 'Entrenamiento de Fuerza (Moderado)', met: 3.5 },
  { id: 'walking', name: 'Caminar rápido', met: 4.3 },
  { id: 'hiit', name: 'HIIT / Crossfit', met: 10.0 },
  { id: 'football', name: 'Fútbol / Baloncesto', met: 8.0 },
  { id: 'yoga', name: 'Yoga / Pilates', met: 3.0 },
  { id: 'boxing', name: 'Boxeo (Saco o Sparring)', met: 9.0 },
];

export default function CaloriesBurnedCalculator() {
  const [weight, setWeight] = useState('');
  const [duration, setDuration] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(ACTIVITIES[0].id);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{total: number, perHour: number} | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const calculateCalories = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const d = parseFloat(duration);
    const activity = ACTIVITIES.find(a => a.id === selectedActivity);
    
    let newErrors: Record<string, string> = {};
    if (!w || w <= 0) newErrors.weight = "Peso requerido";
    if (!d || d <= 0) newErrors.duration = "Duración requerida";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (activity) {
      // Fórmula: Calorías = (MET * Peso(kg) * Tiempo(min)) / 60
      const total = (activity.met * w * d) / 60;
      const perHour = activity.met * w;
      setResult({ total: Math.round(total), perHour: Math.round(perHour) });
      
      if ((window as any).gtag) {
        (window as any).gtag('event', 'calculate_burned_calories', { 
          activity: activity.name,
          total_burned: total 
        });
      }
    }
  };

  const shareText = useMemo(() => 
    result ? `🔥 He quemado ${result.total} kcal haciendo ${ACTIVITIES.find(a => a.id === selectedActivity)?.name}. ¡Calcula las tuyas en Sporvit!` : "", 
  [result, selectedActivity]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="900px" frameborder="0" style="border-radius:20px; overflow:hidden;" title="Calculadora Calorías Quemadas Sporvit"></iframe>`,
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <Activity className="w-3 h-3" /> Monitor de Gasto Energético
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Calculadora de Calorías Quemadas
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
          "Transforma tu esfuerzo en datos precisos. Mide la intensidad de tu entrenamiento con rigor científico."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        {/* CONFIGURACIÓN */}
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
            <form onSubmit={calculateCalories} noValidate className="space-y-6">
              
              <div className="space-y-2">
                <label htmlFor="activity" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Search className="w-3 h-3 text-emerald-500" /> Selecciona la Actividad
                </label>
                <select 
                  id="activity"
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-5 px-6 text-white outline-none focus:border-emerald-500 font-bold appearance-none cursor-pointer text-lg"
                >
                  {ACTIVITIES.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="weight" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Scale className="w-3 h-3 text-emerald-500" /> Tu Peso (kg)
                  </label>
                  <input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => { setWeight(e.target.value); setErrors({...errors, weight: ''}); }}
                    className={`w-full bg-slate-950 border ${errors.weight ? 'border-red-500' : 'border-slate-800'} rounded-2xl py-5 px-6 text-xl text-white outline-none focus:border-emerald-500 transition-all font-black`}
                    placeholder="75"
                    aria-invalid={!!errors.weight}
                  />
                  {errors.weight && <p className="text-red-500 text-[10px] font-bold">{errors.weight}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="duration" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Timer className="w-3 h-3 text-emerald-500" /> Duración (Minutos)
                  </label>
                  <input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => { setDuration(e.target.value); setErrors({...errors, duration: ''}); }}
                    className={`w-full bg-slate-950 border ${errors.duration ? 'border-red-500' : 'border-slate-800'} rounded-2xl py-5 px-6 text-xl text-white outline-none focus:border-emerald-500 transition-all font-black`}
                    placeholder="60"
                    aria-invalid={!!errors.duration}
                  />
                  {errors.duration && <p className="text-red-500 text-[10px] font-bold">{errors.duration}</p>}
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] uppercase tracking-tighter flex items-center justify-center gap-4 text-lg active:scale-[0.98]">
                <Flame className="w-6 h-6" /> Calcular Calorías Quemadas
              </button>
            </form>
          </div>
        </section>

        {/* RESULTADOS */}
        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl overflow-hidden relative">
              <div className="text-center mb-8 border-b border-slate-800/50 pb-8">
                <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Total Quemado en Sesión</p>
                <div className="text-6xl font-black text-white italic tracking-tighter">
                  {result ? result.total : '--'} <span className="text-2xl text-slate-500">kcal</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-5 bg-slate-950/50 border border-slate-800 rounded-2xl group hover:border-emerald-500/30 transition-all">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ritmo Horario</div>
                    <div className="text-[10px] text-slate-600 font-bold italic">Intensidad mantenida</div>
                  </div>
                  <div className="text-2xl font-black text-white italic">{result?.perHour || '--'} <span className="text-xs text-slate-600">kcal/h</span></div>
                </div>
                
                <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10">
                  <p className="text-[10px] text-emerald-500/80 leading-relaxed font-bold italic">
                    *Este cálculo incluye tu metabolismo basal durante el tiempo de actividad.
                  </p>
                </div>
              </div>

              {/* SHARE */}
              {result && (
                <div className="mt-6 pt-6 border-t border-slate-800">
                  <div className="grid grid-cols-4 gap-2">
                    <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center shadow-lg"><MessageCircle className="w-5 h-5" /></button>
                    <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center shadow-lg"><Send className="w-5 h-5" /></button>
                    <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-emerald-500 text-emerald-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                    <button onClick={() => window.location.href=`mailto:?subject=Mi Gasto Calórico&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center shadow-lg"><Mail className="w-5 h-5" /></button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* EMBED CODE */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-emerald-500" /> Widget para tu Blog
            </div>
            <textarea 
              readOnly 
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              value={embedSnippet} 
              className="w-full h-32 sm:h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-emerald-500/50 focus:outline-none resize-none cursor-pointer mb-3" 
            />
            <button onClick={() => copyToClipboard(embedSnippet, 'embed')} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
              {copyStatus === 'copied' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copyStatus === 'copied' ? 'COPIADO AL PORTAPAPELES' : 'COPIAR CÓDIGO'}
            </button>
          </div>
        </aside>
      </div>

      {/* CONTENIDO EDUCATIVO (+800 PALABRAS ESTRATÉGICAS) */}
      <article className="prose prose-invert prose-slate max-w-none space-y-16">
        <section className="bg-slate-900/30 border border-slate-800 rounded-[40px] p-8 md:p-12">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-4">
            <Zap className="w-8 h-8 text-emerald-500" /> La Ciencia del Gasto Calórico: ¿Qué son los METs?
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                Para entender cómo quemamos calorías, debemos hablar de los **METs (Metabolic Equivalent of Task)**. Un MET se define como la cantidad de oxígeno consumido mientras se está sentado en reposo. Para un adulto promedio, esto equivale aproximadamente a 3.5 ml de oxígeno por kilogramo de peso corporal por minuto.
              </p>
              <p>
                Cuando realizas una actividad con un valor de **8 METs**, como correr a 8 km/h, estás utilizando 8 veces más energía de la que gastarías en reposo absoluto. Nuestra calculadora utiliza los valores actualizados del <em>Compendio de Actividades Físicas</em>, una base de datos utilizada por investigadores y profesionales de la salud en todo el mundo para estandarizar la medición de la intensidad del ejercicio.
              </p>
              <h3 className="text-xl font-bold text-white italic">Factores que influyen en tu quema de grasa</h3>
              <p>
                No todo el mundo quema calorías al mismo ritmo. El factor más determinante es el **peso corporal total**. Una persona de 90 kg requiere más energía para mover su masa a través del espacio que una persona de 60 kg realizando la misma actividad. Otros factores incluyen la composición corporal (el músculo quema más que la grasa), la eficiencia técnica y las condiciones ambientales.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-emerald-500 italic mb-6">Comparativa de Intensidad (METs)</h3>
              <div className="space-y-4">
                {[
                  { label: "Caminar (Paseo)", met: "2.5 METs", color: "bg-blue-500/20" },
                  { label: "Entrenamiento de Pesas", met: "3.5 - 6.0 METs", color: "bg-emerald-500/20" },
                  { label: "Ciclismo Intenso", met: "10.0 - 12.0 METs", color: "bg-orange-500/20" },
                  { label: "Running Rápido", met: "11.5 - 14.0 METs", color: "bg-red-500/20" },
                ].map((item, i) => (
                  <div key={i} className={`flex justify-between items-center p-3 rounded-xl border border-white/5 ${item.color}`}>
                    <span className="text-xs font-bold text-white uppercase">{item.label}</span>
                    <span className="text-xs font-black text-white">{item.met}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Optimiza tu Pérdida de Peso con Datos Reales</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "El Efecto EPOC", text: "Tras ejercicios de alta intensidad (HIIT), el cuerpo sigue quemando calorías extra durante horas. Esto se conoce como Consumo de Oxígeno Post-ejercicio. Aunque la calculadora mide la sesión, el beneficio real es mayor." },
              { title: "Frecuencia vs Intensidad", text: "Quemar 500 kcal en una sesión intensa de 30 min es excelente, pero caminar 10.000 pasos (aprox 400 kcal) de forma diaria suele ser más sostenible para la pérdida de grasa a largo plazo." },
              { title: "Nutrición y Gasto", text: "Es imposible 'entrenar más que una mala dieta'. Usa estos datos para ajustar tu ingesta. Si has quemado 600 kcal, no significa que debas compensarlas inmediatamente con comida procesada." }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl group hover:border-emerald-500/40 transition-all">
                <h3 className="text-emerald-500 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Precisión y Limitaciones</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg">
            Aunque los METs son la herramienta más precisa sin entrar en un laboratorio de calorimetría indirecta, recuerda que son estimaciones. Variables como la <strong>temperatura externa</strong>, la <strong>altitud</strong> o tu nivel de <strong>deshidratación</strong> pueden alterar el gasto real hasta en un 15%. Sin embargo, utilizar esta calculadora de forma consistente te permitirá llevar un control riguroso de tu progresión y volumen de entrenamiento semanal.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Compendium of Physical Activities 2024", "Basado en METs", "Validado Científicamente"].map((tag, i) => (
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