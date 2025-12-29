"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { 
  Calculator, Calendar, Timer, Target, Footprints, Zap, 
  ChevronRight, Share2, ShieldAlert, Award, TrendingUp, 
  Dumbbell, MessageCircle, Send, Mail, Copy, Check, Code
} from 'lucide-react';

type Workout = { day: string; type: string; desc: string; intensity: string };
type Week = { weekNumber: number; workouts: Workout[] };

export default function RunningPlanGenerator() {
  const [formData, setFormData] = useState({
    level: 'intermediate', // beginner, intermediate, advanced
    goal: '10k', // 5k, 10k, 21k, 42k
    weeks: '8',
  });

  const [plan, setPlan] = useState<Week[] | null>(null);
  const [copyStatus, setCopyStatus] = useState(false);

  const generatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const numWeeks = parseInt(formData.weeks);
    const newPlan: Week[] = [];

    for (let w = 1; w <= numWeeks; w++) {
      const isDeload = w % 4 === 0; // Semana de descarga cada 4 semanas
      const workouts: Workout[] = [];

      // Lógica simplificada de generación por días
      const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
      
      days.forEach((day, idx) => {
        let session = { day, type: 'Descanso', desc: 'Recuperación total o estiramientos.', intensity: 'Nula' };

        if (idx === 1) { // Martes: Calidad (Series o Intervalos)
            session = { 
                day, 
                type: isDeload ? 'Rodaje Suave' : 'Series / Intervalos', 
                desc: isDeload ? '40 min suaves para recuperar.' : `Calentamiento + ${w+2}x800m ritmo fuerte + vuelta a la calma.`,
                intensity: isDeload ? 'Baja' : 'Alta'
            };
        } else if (idx === 3) { // Jueves: Tempo o Fartlek
            session = { 
                day, 
                type: 'Rodaje Base', 
                desc: `${40 + (w * 2)} min a ritmo cómodo (Zona 2).`,
                intensity: 'Media'
            };
        } else if (idx === 6) { // Domingo: Tirada Larga
            const baseDist = formData.goal === '42k' ? 15 : formData.goal === '21k' ? 10 : 5;
            const longDist = isDeload ? baseDist : baseDist + (w * 1.5);
            session = { 
                day, 
                type: 'Tirada Larga', 
                desc: `Carrera continua de ${longDist.toFixed(1)} km a ritmo aeróbico.`,
                intensity: 'Media/Alta'
            };
        }
        workouts.push(session);
      });

      newPlan.push({ weekNumber: w, workouts });
    }
    setPlan(newPlan);
  };

  const shareText = useMemo(() => {
    if (!plan) return "";
    return `🏃‍♂️ ¡He generado mi plan de ${formData.weeks} semanas para ${formData.goal} en Sporvit!\n\nListo para conquistar mi meta. Genera el tuyo gratis:`;
  }, [plan, formData]);

  return (
    <div className="pt-8 pb-16 container mx-auto px-4 sm:px-6 max-w-6xl">
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <Calendar className="w-3 h-3" /> Algoritmo de Periodización
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Plan de Entrenamiento Running
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
          "El éxito no ocurre por accidente; ocurre por diseño. Genera tu hoja de ruta hacia la meta."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-5">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl sticky top-24">
            <form onSubmit={generatePlan} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Nivel Actual</label>
                <div className="grid grid-cols-3 gap-2">
                  {['beginner', 'intermediate', 'advanced'].map(l => (
                    <button key={l} type="button" onClick={() => setFormData({...formData, level: l})} className={`py-3 rounded-xl border text-[10px] font-black transition-all ${formData.level === l ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Distancia Objetivo</label>
                <div className="grid grid-cols-2 gap-2">
                  {['5k', '10k', '21k', '42k'].map(g => (
                    <button key={g} type="button" onClick={() => setFormData({...formData, goal: g})} className={`py-3 rounded-xl border text-[10px] font-black transition-all ${formData.goal === g ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                      {g.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Semanas del Plan: {formData.weeks}</label>
                <input type="range" min="4" max="12" value={formData.weeks} onChange={(e) => setFormData({...formData, weeks: e.target.value})} className="w-full h-2 bg-slate-800 rounded-lg appearance-none accent-blue-500" />
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg">
                <Zap className="w-6 h-6" /> Crear Mi Plan de Carrera
              </button>
            </form>
          </div>
        </section>

        <section className="lg:col-span-7 space-y-8">
          {plan ? (
            plan.map((week) => (
              <div key={week.weekNumber} className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 animate-in fade-in slide-in-from-right-4">
                <h3 className="text-xl font-black text-white italic uppercase mb-6 flex items-center gap-2">
                  <ChevronRight className="w-5 h-5 text-blue-500" /> Semana {week.weekNumber}
                </h3>
                <div className="space-y-3">
                  {week.workouts.map((w, idx) => (
                    <div key={idx} className={`p-4 rounded-2xl border ${w.type === 'Descanso' ? 'bg-slate-950/20 border-slate-900' : 'bg-slate-950 border-slate-800'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black text-slate-600 uppercase">{w.day}</span>
                        <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase ${
                          w.intensity === 'Alta' ? 'bg-red-500/10 text-red-500' : 
                          w.intensity === 'Media' ? 'bg-blue-500/10 text-blue-500' : 'text-slate-700'
                        }`}>{w.type}</span>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed font-medium">{w.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="h-full min-h-[400px] border-2 border-dashed border-slate-800 rounded-[40px] flex flex-col items-center justify-center text-center p-12">
              <Footprints className="w-16 h-16 text-slate-800 mb-6" />
              <h3 className="text-2xl font-black text-slate-700 uppercase italic">Esperando parámetros...</h3>
              <p className="text-slate-500 max-w-xs mx-auto text-sm italic mt-2">Configura tu nivel y objetivo para que nuestra IA deportiva genere tu rutina ideal.</p>
            </div>
          )}
        </section>
      </div>

      <article className="prose prose-invert prose-slate max-w-none space-y-16 mt-20">
        <section className="bg-slate-900/30 border border-slate-800 rounded-[40px] p-8 md:p-12">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-4">
            <Award className="w-8 h-8 text-blue-500" /> La Ciencia Detrás de un Plan de Entrenamiento Running
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                Un plan de entrenamiento efectivo no es simplemente una lista de días para salir a correr. Es una estructura biológica diseñada para estresar tu sistema cardiovascular y musculoesquelético de manera que fuerce una **adaptación fisiológica positiva**. Nuestra herramienta de Sporvit utiliza principios de **periodización lineal**, donde el volumen y la intensidad se manipulan para alcanzar un pico de forma en la fecha de tu objetivo.
              </p>
              
              <p>
                Cada sesión tiene un propósito metabólico específico. Los **rodajes suaves** (Zona 2) construyen la base aeróbica y capilarización muscular. Las **series e intervalos** elevan tu consumo máximo de oxígeno (VO2 Max) y tu economía de carrera. Finalmente, las **tiradas largas** enseñan a tu cuerpo a utilizar las grasas como combustible y fortalecen tu resistencia mental para los kilómetros finales.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-xl font-bold text-blue-500 italic mb-4 uppercase text-center">Componentes del Plan</h3>
              {[
                { t: "Sobrecarga Progresiva", d: "Incremento gradual de la carga para evitar lesiones y asegurar progreso." },
                { t: "Semanas de Descarga", d: "Reducción estratégica del volumen cada 4 semanas para permitir la supercompensación." },
                { t: "Especificidad", d: "Ritmos y distancias calculados según tu distancia objetivo (5K a 42K)." },
                { t: "Variabilidad de Intensidad", d: "El famoso 80/20: el 80% suave y el 20% de alta intensidad." }
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
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Tipos de Sesiones Explicadas</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                title: "Series / Intervalos", 
                text: "Esfuerzos cortos a intensidades cercanas al 90-95% de tu FC Máxima. Son los que 'desbloquean' la velocidad y mejoran tu capacidad anaeróbica." 
              },
              { 
                title: "Tempo Run / Umbral", 
                text: "Carreras a un ritmo 'cómodamente duro'. Entrenan tu cuerpo para procesar el lactato de forma eficiente, permitiéndote correr más rápido por más tiempo." 
              },
              { 
                title: "Rodajes de Recuperación", 
                text: "Cruciales para limpiar el desecho metabólico y mantener el hábito sin fatigar el sistema nervioso central. No deben subestimarse." 
              }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl group hover:border-blue-500/40 transition-all">
                <h3 className="text-blue-500 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-t from-blue-500/10 to-transparent border border-blue-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Tu Meta es Nuestra Misión</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify">
            Un plan de entrenamiento es un compromiso contigo mismo. Sigue la estructura, respeta los días de descanso y escucha a tu cuerpo. La consistencia es el factor número uno que separa a los corredores que alcanzan su meta de los que se quedan en el camino. Con el Generador de Planes de Sporvit, tienes la tecnología de un entrenador de élite en tu bolsillo. Prepárate para cruzar la meta con la mejor versión de ti mismo.
          </p>
        </section>
      </article>
    </div>
  );
}