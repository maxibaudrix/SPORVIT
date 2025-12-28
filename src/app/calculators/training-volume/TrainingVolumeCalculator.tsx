"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Code, Copy, Check, MessageCircle, Send, Mail, 
  Dumbbell, Scale, Zap, Trash2, Plus, TrendingUp, LayoutList, Info, Target, Award
} from 'lucide-react';

// Lista predefinida de ejercicios por categorías
const PREDEFINED_EXERCISES = {
  "Pecho": ["Press de Banca", "Press Inclinado", "Aperturas con Mancuernas", "Dips (Fondos)", "Push-ups"],
  "Espalda": ["Dominadas", "Remo con Barra", "Jalón al Pecho", "Remo en Polea Baja", "Peso Muerto"],
  "Piernas": ["Sentadilla", "Prensa de Piernas", "Estocadas", "Extensiones de Cuádriceps", "Curl Femoral"],
  "Hombros": ["Press Militar", "Elevaciones Laterales", "Face Pulls", "Press Arnold"],
  "Brazos": ["Curl de Bíceps con Barra", "Extensiones de Tríceps", "Curl Martillo", "Press Francés"]
};

interface ExerciseRow {
  id: string;
  name: string;
  sets: string;
  reps: string;
  weight: string;
}

export default function TrainingVolumeCalculator() {
  const [exercises, setExercises] = useState<ExerciseRow[]>([
    { id: '1', name: 'Press de Banca', sets: '', reps: '', weight: '' }
  ]);
  const [errors, setErrors] = useState<string | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const addRow = () => {
    setExercises([...exercises, { id: Date.now().toString(), name: 'Press de Banca', sets: '', reps: '', weight: '' }]);
  };

  const removeRow = (id: string) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter(ex => ex.id !== id));
    }
  };

  const handleUpdate = (id: string, field: keyof ExerciseRow, value: string) => {
    setExercises(exercises.map(ex => ex.id === id ? { ...ex, [field]: value } : ex));
  };

  const calculateVolume = (e: React.FormEvent) => {
    e.preventDefault();
    let total = 0;
    let valid = true;

    exercises.forEach(ex => {
      const s = parseFloat(ex.sets);
      const r = parseFloat(ex.reps);
      const w = parseFloat(ex.weight);
      if (isNaN(s) || isNaN(r) || isNaN(w)) valid = false;
      else total += (s * r * w);
    });

    if (!valid) {
      setErrors("Por favor, rellena todos los campos numéricos.");
      return;
    }

    setErrors(null);
    setResult(total);
  };

  // SHARE TEXT CORREGIDO: Incluye el resultado en el mensaje
  const shareText = useMemo(() => {
    if (result === null) return "";
    return `🏋️‍♂️ ¡He calculado mi Volumen de Entrenamiento en Sporvit!\n\nTonelaje Total: ${result.toLocaleString()} kg levantados.\n\nOptimiza tu entrenamiento aquí:`;
  }, [result]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Calculadora Volumen Sporvit"></iframe>`,
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
          <TrendingUp className="w-3 h-3" /> Monitor de Carga Progresiva
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Calculadora de Volumen de Entrenamiento
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
          "El tonelaje total es el mapa de tu crecimiento muscular. Mídelo con precisión."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-8">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateVolume} className="space-y-6">
              <div className="space-y-4">
                {exercises.map((ex) => (
                  <div key={ex.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 bg-slate-950/50 rounded-2xl border border-slate-800 relative group transition-all hover:border-emerald-500/30">
                    
                    {/* SELECT PREDEFINIDO */}
                    <div className="sm:col-span-4 space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Ejercicio</label>
                      <select 
                        value={ex.name} 
                        onChange={(e) => handleUpdate(ex.id, 'name', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-3 text-white text-xs outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                      >
                        {Object.entries(PREDEFINED_EXERCISES).map(([category, items]) => (
                          <optgroup key={category} label={category} className="bg-slate-950 text-emerald-500 font-bold italic">
                            {items.map(item => (
                              <option key={item} value={item} className="text-white bg-slate-900">{item}</option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Series</label>
                      <input type="number" placeholder="4" value={ex.sets} onChange={(e) => handleUpdate(ex.id, 'sets', e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-emerald-500 font-bold" />
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Reps</label>
                      <input type="number" placeholder="10" value={ex.reps} onChange={(e) => handleUpdate(ex.id, 'reps', e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-emerald-500 font-bold" />
                    </div>

                    <div className="sm:col-span-3 space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Carga (kg)</label>
                      <input type="number" placeholder="80" value={ex.weight} onChange={(e) => handleUpdate(ex.id, 'weight', e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-emerald-500 font-bold" />
                    </div>

                    <div className="sm:col-span-1 flex items-end justify-center pb-1">
                      <button type="button" onClick={() => removeRow(ex.id)} className="p-3 text-slate-600 hover:text-red-500 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button type="button" onClick={addRow} className="flex-1 p-4 border border-dashed border-slate-700 rounded-2xl text-slate-400 font-bold text-xs hover:border-emerald-500/50 hover:text-emerald-400 transition-all flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Añadir Otro Ejercicio
                </button>
                <button type="submit" className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black p-4 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-3 text-sm">
                  <Calculator className="w-5 h-5" /> Calcular Tonelaje Total
                </button>
              </div>
              {errors && <p className="text-red-500 text-[10px] font-bold text-center italic">{errors}</p>}
            </form>
          </div>
        </section>

        {/* ASIDE RESULTADOS */}
        <aside className="lg:col-span-4 space-y-6">
          <div className={`${result !== null ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center">
              <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Tonelaje Total Sesión</p>
              <div className="text-6xl font-black text-white italic tracking-tighter mb-4">
                {result !== null ? result.toLocaleString() : '--'} <span className="text-xl text-slate-500">kg</span>
              </div>
              
              {result !== null && (
                <div className="grid grid-cols-4 gap-2 mt-8">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center shadow-lg"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center shadow-lg"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-emerald-500 text-emerald-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mi Tonelaje Semanal&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center shadow-lg"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          {/* EMBED BLOCK */}
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

      <article className="prose prose-invert prose-slate max-w-none space-y-16">
        <section className="bg-slate-900/30 border border-slate-800 rounded-[40px] p-8 md:p-12">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-4">
            <LayoutList className="w-8 h-8 text-emerald-500" /> Domina la Ciencia del Volumen y el Tonelaje
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                El **tonelaje total** es una de las métricas más poderosas para cuantificar el volumen de entrenamiento. Se calcula multiplicando las series por las repeticiones por la carga (S x R x C). A diferencia de solo contar series, el tonelaje permite ver la progresión real de la carga de trabajo a lo largo de los meses.
              </p>
              <p>
                Utilizar una lista predefinida de ejercicios, como hemos integrado en Sporvit, es vital para mantener la consistencia. Si un mes sumas el volumen de "Press de Banca" y al siguiente lo llamas "Pecho con barra", pierdes la trazabilidad de tu **sobrecarga progresiva**. Nuestra herramienta estandariza los movimientos principales para que tu análisis sea científico y riguroso.
              </p>
              <h3 className="text-xl font-bold text-white italic text-left">¿Cuánto volumen es suficiente?</h3>
              <p>
                La evidencia sugiere que para la hipertrofia muscular, la mayoría de los atletas necesitan entre 10 y 20 series efectivas por grupo muscular a la semana. Al calcular el tonelaje, puedes asegurar que no solo estás haciendo las series, sino que la carga total de trabajo está aumentando, lo cual es el motor principal del crecimiento muscular.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-emerald-500 italic mb-4 uppercase text-center">Ventajas del Tonelaje</h3>
              {[
                { t: "Objetividad Total", d: "Los números no mienten. Sabes exactamente cuánto has trabajado." },
                { t: "Detección de Estancamiento", d: "Si el tonelaje se estanca, es hora de ajustar la intensidad o el volumen." },
                { t: "Gestión de Fatiga", d: "Picos excesivos de tonelaje pueden predecir la necesidad de una descarga." },
                { t: "Motivación Basada en Datos", d: "Ver cómo pasas de levantar 2.000kg a 5.000kg por sesión es el mejor motor." }
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
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Cómo interpretar tu Tonelaje Semanal</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Calidad vs Cantidad", text: "Un tonelaje alto es inútil si la técnica es deficiente. Asegúrate de que cada repetición sumada en esta calculadora sea una repetición de calidad (RPE 7-9). El 'volumen basura' solo genera fatiga, no adaptación." },
              { title: "Diferencia entre Ejercicios", text: "No compares el tonelaje de un ejercicio de aislamiento (como Curl de Bíceps) con uno multiarticular (como Sentadilla). Los grandes movimientos siempre dominarán tu tonelaje total semanal." },
              { title: "El Rol de la Descarga", text: "Cada 4-8 semanas, es recomendable reducir el tonelaje total en un 30-50% (semana de descarga). Esto permite que el sistema nervioso y las articulaciones se recuperen para un nuevo bloque de progreso." }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl group hover:border-emerald-500/40 transition-all">
                <h3 className="text-emerald-500 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-t from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Tu camino hacia la Sobrecarga Progresiva</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            La Calculadora de Volumen de Entrenamiento Semanal de Sporvit es la herramienta definitiva para el atleta serio. Al registrar tus series, repeticiones y cargas basándote en nuestra lista estandarizada, estás construyendo una base de datos de tu propio rendimiento. No dejes tu progreso al azar; utiliza los datos para ajustar tu programación y asegurar que cada gota de sudor en el gimnasio se convierta en un resultado tangible en tu físico y tu fuerza.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Tonelaje Científico", "Sobrecarga Progresiva", "Volumen Entrenamiento"].map((tag, i) => (
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