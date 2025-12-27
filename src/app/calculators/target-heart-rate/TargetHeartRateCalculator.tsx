"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Heart, Activity, Zap, ShieldAlert, ArrowRight, Share2, Timer, Gauge
} from 'lucide-react';

const INTENSITY_ZONES = [
  { id: 'zone1', name: 'Zona 1: Recuperación', range: '50-60%', color: 'text-emerald-400', desc: 'Calentamiento y recuperación activa.' },
  { id: 'zone2', name: 'Zona 2: Quema de Grasa', range: '60-70%', color: 'text-blue-400', desc: 'Resistencia base y máxima oxidación de grasas.' },
  { id: 'zone3', name: 'Zona 3: Aeróbica', range: '70-80%', color: 'text-yellow-400', desc: 'Mejora de la capacidad cardiovascular y fondo.' },
  { id: 'zone4', name: 'Zona 4: Anaeróbica', range: '80-90%', color: 'text-orange-400', desc: 'Mejora del umbral de lactato y potencia.' },
  { id: 'zone5', name: 'Zona 5: Máximo Esfuerzo', range: '90-100%', color: 'text-red-500', desc: 'Sprint y capacidad anaeróbica láctica.' }
];

export default function TargetHeartRateCalculator() {
  const [formData, setFormData] = useState({ age: '', restingHR: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const calculateTHR = (e: React.FormEvent) => {
    e.preventDefault();
    const age = parseInt(formData.age);
    const rhr = parseInt(formData.restingHR);
    if (!age || age < 10 || age > 100) { setErrors({ age: "Edad entre 10 y 100 años" }); return; }
    if (!rhr || rhr < 30 || rhr > 120) { setErrors({ restingHR: "FC reposo entre 30 y 120 bpm" }); return; }
    setErrors({});

    const mhr = 220 - age;
    const hrr = mhr - rhr;
    const zones = [0.5, 0.6, 0.7, 0.8, 0.9, 1.0].map(pct => Math.round((hrr * pct) + rhr));

    setResult({
      mhr, hrr, rhr,
      zones: INTENSITY_ZONES.map((z, i) => ({ ...z, low: zones[i], high: zones[i+1] }))
    });
  };

  const shareText = useMemo(() => result ? `💓 Mis zonas de entrenamiento Karvonen en Sporvit. Mi FC Máxima es ${result.mhr} bpm.` : "", [result]);
  const embedSnippet = useMemo(() => `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden;" title="Calculadora FC Objetivo Sporvit"></iframe>`, [currentUrl]);

  const copyToClipboard = useCallback(async (text: string, type: 'embed' | 'share') => {
    await navigator.clipboard.writeText(text);
    if (type === 'embed') setCopyStatus('copied');
    else setShareStatus('copied');
    setTimeout(() => { setCopyStatus('idle'); setShareStatus('idle'); }, 2000);
  }, []);

  return (
    <div className="pt-8 pb-16 container mx-auto px-4 sm:px-6 max-w-6xl">
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <Activity className="w-3 h-3" /> Monitor Cardiovascular Avanzado
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter text-balance">
          Calculadora de Frecuencia Cardíaca Objetivo
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
          "El corazón es un motor de precisión. Entrena por pulsaciones, no por sensaciones."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateTHR} noValidate className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label htmlFor="age" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Timer className="w-3 h-3 text-red-500" /> Edad Actual
                  </label>
                  <input id="age" type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className={`w-full bg-slate-950 border ${errors.age ? 'border-red-500' : 'border-slate-800'} rounded-2xl py-5 px-6 text-xl text-white outline-none focus:border-red-500 transition-all font-black`} placeholder="30" />
                  {errors.age && <p className="text-red-500 text-[10px] font-bold italic">{errors.age}</p>}
                </div>
                <div className="space-y-3">
                  <label htmlFor="restingHR" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Heart className="w-3 h-3 text-red-500" /> FC en Reposo (bpm)
                  </label>
                  <input id="restingHR" type="number" value={formData.restingHR} onChange={(e) => setFormData({...formData, restingHR: e.target.value})} className={`w-full bg-slate-950 border ${errors.restingHR ? 'border-red-500' : 'border-slate-800'} rounded-2xl py-5 px-6 text-xl text-white outline-none focus:border-red-500 transition-all font-black`} placeholder="60" />
                  {errors.restingHR && <p className="text-red-500 text-[10px] font-bold italic">{errors.restingHR}</p>}
                </div>
              </div>
              <button type="submit" className="w-full bg-red-500 hover:bg-red-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg active:scale-[0.98]">
                <Gauge className="w-6 h-6" /> Generar Zonas
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-6 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
              <div className="flex justify-around mb-8 border-b border-slate-800 pb-8">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">FC Máxima</p>
                  <div className="text-3xl font-black text-white italic">{result?.mhr || '--'}</div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">FC Reserva</p>
                  <div className="text-3xl font-black text-red-400 italic">{result?.hrr || '--'}</div>
                </div>
              </div>
              <div className="space-y-3">
                {result?.zones.map((zone: any) => (
                  <div key={zone.id} className="bg-slate-950/50 border border-slate-800 p-4 rounded-2xl flex justify-between items-center hover:border-red-500/30 transition-all">
                    <div>
                      <div className={`text-[10px] font-black uppercase tracking-widest ${zone.color}`}>{zone.name}</div>
                      <div className="text-[10px] text-slate-500 font-bold italic">{zone.desc}</div>
                    </div>
                    <div className="text-xl font-black text-white italic">{zone.low} - {zone.high} <span className="text-[10px] text-slate-600 uppercase">bpm</span></div>
                  </div>
                ))}
              </div>
              {result && (
                <div className="mt-8 pt-8 border-t border-slate-800 grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center shadow-lg"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center shadow-lg"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-red-500 text-red-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mis Zonas FC&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center shadow-lg"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          {/* BLOQUE EMBED (CORREGIDO) */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-red-500" /> Inserta este Widget
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-red-500/50 focus:outline-none resize-none mb-3 cursor-pointer" />
            <button onClick={() => copyToClipboard(embedSnippet, 'embed')} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest border border-slate-700">
              {copyStatus === 'copied' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copyStatus === 'copied' ? 'CÓDIGO COPIADO' : 'COPIAR CÓDIGO EMBED'}
            </button>
          </div>
        </aside>
      </div>

      {/* CONTENIDO EDUCATIVO (+800 PALABRAS) */}
      <article className="prose prose-invert prose-slate max-w-none space-y-16">
        <section className="bg-slate-900/30 border border-slate-800 rounded-[40px] p-8 md:p-12">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-4">
            <Heart className="w-8 h-8 text-red-500" /> Método Karvonen: La Ciencia de las Zonas de Intensidad
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                A diferencia del método simplista de "220 menos tu edad", la **Fórmula de Karvonen** es considerada el estándar de oro para la prescripción del ejercicio aeróbico. Su genialidad reside en que no solo considera tu edad, sino que integra tu **Frecuencia Cardíaca en Reposo (RHR)**, un indicador directo de tu nivel de condición física actual.
              </p>
              <p>
                Este método calcula la **Frecuencia Cardíaca de Reserva (HRR)**, que es el rango de latidos disponibles entre tu estado de reposo absoluto y tu capacidad máxima. Al entrenar sobre este rango, las intensidades porcentuales son mucho más precisas y seguras, evitando que entrenes por debajo de tu potencial o por encima de tus límites saludables.
              </p>
              <h3 className="text-xl font-bold text-white italic">¿Por qué es superior?</h3>
              <p>
                Si dos personas de 30 años entrenan al 70%, pero una tiene 45 pulsaciones en reposo y la otra 80, sus requerimientos metabólicos son totalmente distintos. Karvonen ajusta la zona objetivo para que el esfuerzo percibido y la respuesta fisiológica sean los correctos para cada individuo.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 space-y-6 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-red-400 italic mb-4 uppercase text-center">La Anatomía del Cálculo</h3>
              <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 font-mono text-[11px] leading-loose text-slate-300">
                1. FC Máxima = 220 - Edad<br/>
                2. FC Reserva = FC Máxima - FC Reposo<br/>
                3. FC Objetivo = (FC Reserva * %Intensidad) + FC Reposo
              </div>
              <p className="text-xs text-slate-500 italic text-center">
                Esta estructura permite que, a medida que mejoras tu condición física (bajando tu FC en reposo), tus zonas se ajusten dinámicamente.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Guía Detallada de Zonas Karvonen</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Zona 2: El Dulce Punto", text: "Es la zona de oxidación máxima de ácidos grasos. Entrenar aquí construye tu base aeróbica, mejora la capilarización y te permite durar más tiempo con menos fatiga." },
              { title: "Zona 4: Umbral de Lactato", text: "Aquí es donde el cuerpo empieza a producir lactato más rápido de lo que puede eliminarlo. Es esencial para mejorar la velocidad en carreras de 5k o 10k." },
              { title: "Zonas de Recuperación", text: "La Zona 1 es a menudo ignorada, pero es vital. Facilita la eliminación de desechos metabólicos sin estresar el sistema nervioso central tras entrenamientos intensos." }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl group hover:border-red-500/40 transition-all">
                <h3 className="text-red-500 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-t from-red-500/10 to-transparent border border-red-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Consejos para la Medición</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify">
            Para que esta calculadora sea 100% efectiva, mide tu **Frecuencia Cardíaca en Reposo** justo al despertar, antes de levantarte de la cama. Hazlo durante tres días consecutivos y utiliza el promedio. Evita medirla después de tomar cafeína o tras un día de entrenamiento muy intenso, ya que esto alterará al alza tu RHR y desvirtuará tus zonas objetivo. Recuerda que con el tiempo, un descenso en tu RHR es la mejor señal de que tu corazón se está volviendo más eficiente.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Protocolo Karvonen 1957", "Frecuencia de Reserva", "Optimizado para Endurance"].map((tag, i) => (
              <span key={i} className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-full text-[10px] font-black text-red-500 uppercase tracking-widest">
                {tag}
              </span>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}