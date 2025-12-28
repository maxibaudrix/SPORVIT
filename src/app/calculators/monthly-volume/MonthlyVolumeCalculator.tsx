"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Code, Copy, Check, MessageCircle, Send, Mail, 
  Dumbbell, Calendar, Zap, Trash2, Plus, TrendingUp, LayoutList, Info, Target, Award
} from 'lucide-react';

const PREDEFINED_EXERCISES = {
  "Pecho": ["Press de Banca", "Press Inclinado", "Aperturas con Mancuernas", "Dips (Fondos)", "Push-ups"],
  "Espalda": ["Dominadas", "Remo con Barra", "Jalón al Pecho", "Remo en Polea Baja", "Peso Muerto"],
  "Piernas": ["Sentadilla", "Prensa de Piernas", "Estocadas", "Extensiones de Cuádriceps", "Curl Femoral"],
  "Hombros": ["Press Militar", "Elevaciones Laterales", "Face Pulls", "Press Arnold"],
  "Brazos": ["Curl de Bíceps con Barra", "Extensiones de Tríceps", "Curl Martillo", "Press Francés"]
};

interface MonthlyExercise {
  id: string;
  name: string;
  sets: string;
  reps: string;
  weight: string;
  frequency: string; // Veces por semana
}

export default function MonthlyVolumeCalculator() {
  const [exercises, setExercises] = useState<MonthlyExercise[]>([
    { id: '1', name: 'Press de Banca', sets: '', reps: '', weight: '', frequency: '2' }
  ]);
  const [errors, setErrors] = useState<string | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const addRow = () => {
    setExercises([...exercises, { id: Date.now().toString(), name: 'Press de Banca', sets: '', reps: '', weight: '', frequency: '1' }]);
  };

  const removeRow = (id: string) => {
    if (exercises.length > 1) setExercises(exercises.filter(ex => ex.id !== id));
  };

  const handleUpdate = (id: string, field: keyof MonthlyExercise, value: string) => {
    setExercises(exercises.map(ex => ex.id === id ? { ...ex, [field]: value } : ex));
  };

  const calculateMonthlyVolume = (e: React.FormEvent) => {
    e.preventDefault();
    let total = 0;
    let valid = true;

    exercises.forEach(ex => {
      const s = parseFloat(ex.sets);
      const r = parseFloat(ex.reps);
      const w = parseFloat(ex.weight);
      const f = parseFloat(ex.frequency);
      if (isNaN(s) || isNaN(r) || isNaN(w) || isNaN(f)) valid = false;
      else total += (s * r * w * f * 4); // Estimación de 4 semanas al mes
    });

    if (!valid) {
      setErrors("Por favor, rellena todos los campos numéricos.");
      return;
    }

    setErrors(null);
    setResult(total);
  };

  const shareText = useMemo(() => {
    if (result === null) return "";
    const detail = exercises
      .filter(ex => ex.name && ex.weight)
      .map(ex => `- ${ex.name}: ${(parseFloat(ex.sets) * parseFloat(ex.reps) * parseFloat(ex.weight) * parseFloat(ex.frequency) * 4).toLocaleString()}kg`)
      .slice(0, 3) // Mostramos los 3 principales para no saturar el mensaje
      .join('\n');

    return `📈 Mi Volumen Mensual en Sporvit:\n${detail}\n...y más.\n\nTOTAL: ${result.toLocaleString()} kg este mes.\n\nPlanifica tu mesociclo aquí:`;
  }, [result, exercises]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Calculadora Volumen Mensual Sporvit"></iframe>`,
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
          <Calendar className="w-3 h-3" /> Planificación de Mesociclo
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Calculadora de Volumen Mensual
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
          "El éxito no se construye en un día, sino en la suma de tus esfuerzos mensuales."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-8">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateMonthlyVolume} className="space-y-6">
              <div className="space-y-4">
                {exercises.map((ex) => (
                  <div key={ex.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 bg-slate-950/50 rounded-2xl border border-slate-800 relative group transition-all hover:border-emerald-500/30">
                    <div className="sm:col-span-3 space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Ejercicio</label>
                      <select 
                        value={ex.name} 
                        onChange={(e) => handleUpdate(ex.id, 'name', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-2 text-white text-[11px] outline-none focus:border-emerald-500 appearance-none"
                      >
                        {Object.entries(PREDEFINED_EXERCISES).map(([category, items]) => (
                          <optgroup key={category} label={category}>
                            {items.map(item => <option key={item} value={item}>{item}</option>)}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Series</label>
                      <input type="number" placeholder="4" value={ex.sets} onChange={(e) => handleUpdate(ex.id, 'sets', e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-white text-sm outline-none focus:border-emerald-500 font-bold" />
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Reps</label>
                      <input type="number" placeholder="10" value={ex.reps} onChange={(e) => handleUpdate(ex.id, 'reps', e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-white text-sm outline-none focus:border-emerald-500 font-bold" />
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Peso (kg)</label>
                      <input type="number" placeholder="80" value={ex.weight} onChange={(e) => handleUpdate(ex.id, 'weight', e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-white text-sm outline-none focus:border-emerald-500 font-bold" />
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Freq/Sem</label>
                      <input type="number" placeholder="2" value={ex.frequency} onChange={(e) => handleUpdate(ex.id, 'frequency', e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-white text-sm outline-none focus:border-emerald-500 font-bold" />
                    </div>
                    <div className="sm:col-span-1 flex items-end justify-center pb-1">
                      <button type="button" onClick={() => removeRow(ex.id)} className="p-2 text-slate-600 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button type="button" onClick={addRow} className="flex-1 p-4 border border-dashed border-slate-700 rounded-2xl text-slate-400 font-bold text-xs hover:border-emerald-500/50 hover:text-emerald-400 transition-all flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Añadir Ejercicio
                </button>
                <button type="submit" className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black p-4 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-3 text-sm">
                  <Calculator className="w-5 h-5" /> Calcular Tonelaje Mensual
                </button>
              </div>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-4 space-y-6">
          <div className={`${result !== null ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center">
              <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Tonelaje Mensual Acumulado</p>
              <div className="text-5xl font-black text-white italic tracking-tighter mb-4">
                {result !== null ? result.toLocaleString() : '--'} <span className="text-xl text-slate-500">kg</span>
              </div>
              
              {result !== null && (
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center shadow-lg"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center shadow-lg"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-emerald-500 text-emerald-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mi Volumen Mensual&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center shadow-lg"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl text-center">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-emerald-500" /> Inserta este Widget
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-emerald-500/50 focus:outline-none resize-none mb-3 cursor-pointer" />
            <button onClick={() => copyToClipboard(embedSnippet, 'embed')} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest border border-slate-700">
              {copyStatus === 'copied' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copyStatus === 'copied' ? 'CÓDIGO COPIADO' : 'COPIAR CÓDIGO EMBED'}
            </button>
          </div>
        </aside>
      </div>

      <article className="prose prose-invert prose-slate max-w-none space-y-16 mt-20">
        <section className="bg-slate-900/30 border border-slate-800 rounded-[40px] p-8 md:p-12">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-4">
            <TrendingUp className="w-8 h-8 text-emerald-500" /> La Ciencia del Mesociclo: Por qué el Volumen Mensual dicta tu Crecimiento
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                En la periodización del entrenamiento, un **mesociclo** (generalmente de 4 a 6 semanas) es la unidad de tiempo más crítica para evaluar la adaptación biológica. Mientras que el volumen semanal nos da una foto instantánea del esfuerzo, el **volumen de entrenamiento mensual** nos revela la tendencia real de tu progresión.
              </p>
              <p>
                El cuerpo humano no responde al estrés de forma lineal inmediata; requiere una acumulación de estímulos (tonelaje) para señalizar procesos de hipertrofia significativos. Al monitorizar el tonelaje mensual, puedes identificar si estás aplicando una **Sobrecarga Progresiva** real o si simplemente estás manteniendo un volumen de mantenimiento que no generará nuevas ganancias de fuerza o tamaño.
              </p>
              <h3 className="text-xl font-bold text-white italic text-left">El Concepto de Tonelaje Acumulado</h3>
              <p>
                El tonelaje mensual se define como la suma total de kilos movidos en todas tus sesiones del mes. Esta métrica es especialmente valiosa en ejercicios multiarticulares. Por ejemplo, si en la semana 1 tu tonelaje en Sentadilla fue de 5,000kg y en la semana 4 es de 5,500kg, has logrado un incremento del 10% en tu capacidad de trabajo, un indicador directo de mejora en la eficiencia neuromuscular y muscular.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center space-y-4">
              <h3 className="text-xl font-bold text-emerald-500 italic mb-4 uppercase text-center">Métricas Clave del Mesociclo</h3>
              {[
                { t: "Volumen de Mantenimiento (MV)", d: "Cantidad de tonelaje para no perder masa muscular." },
                { t: "Volumen Adaptativo (MAV)", d: "El rango donde ocurre la mayor ganancia de hipertrofia." },
                { t: "Volumen Máximo Recuperable (MRV)", d: "El límite de tonelaje antes de entrar en sobreentrenamiento." },
                { t: "Frecuencia de Estímulo", d: "Número de veces que un grupo muscular es sometido a carga por mes." }
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
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Periodización y Gestión de la Fatiga Acumulada</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                title: "La Regla de la Progresión del 10%", 
                text: "Un aumento sostenible del volumen mensual suele rondar el 10% respecto al mes anterior. Saltar de un tonelaje mensual de 50 toneladas a 80 toneladas es una receta para la lesión y el agotamiento del sistema nervioso." 
              },
              { 
                title: "Importancia de la Semana de Descarga (Deload)", 
                text: "En un mesociclo de 4 semanas, la cuarta semana suele ser de descarga. Reducir el tonelaje mensual un 30-50% en esta semana permite que la fatiga residual se disipe, facilitando la supercompensación y nuevas ganancias en el siguiente mes." 
              },
              { 
                title: "Ratio de Carga Aguda vs Crónica", 
                text: "Comparar el volumen de la última semana (aguda) con el promedio mensual (crónica) ayuda a prevenir lesiones. Un ratio superior a 1.5 indica que estás aumentando el volumen demasiado rápido para tu capacidad de recuperación." 
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
          <h2 className="text-2xl font-bold text-white mb-6">¿Cómo interpretar tu estancamiento mensual?</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify">
            Si tras 3 meses de seguimiento tu tonelaje mensual en los ejercicios principales se ha estancado, es una señal inequívoca de que necesitas cambiar una variable: o bien aumentas la intensidad (más peso), el volumen (más series/reps) o mejoras la recuperación (sueño y nutrición). Sin el dato mensual, estarías entrenando "a ciegas". La calculadora de Sporvit te ofrece la brújula necesaria para que cada mes sea un escalón hacia tu mejor versión física.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Hipertrofia Basada en Evidencia", "Cálculo de Tonelaje Real", "Periodización de Entrenamiento"].map((tag, i) => (
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