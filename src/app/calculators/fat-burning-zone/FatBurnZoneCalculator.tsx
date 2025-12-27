"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Flame, Heart, Activity, Zap, ShieldAlert, ArrowRight, Share2, Target, Gauge
} from 'lucide-react';

export default function FatBurnZoneCalculator() {
  const [formData, setFormData] = useState({ age: '', restingHR: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const calculateZone = (e: React.FormEvent) => {
    e.preventDefault();
    const a = parseInt(formData.age);
    const rhr = parseInt(formData.restingHR);
    
    if (!a || a < 10) { setErrors({ age: "Edad no válida" }); return; }
    if (!rhr || rhr < 30) { setErrors({ restingHR: "FC Reposo no válida" }); return; }
    setErrors({});

    const mhr = 220 - a;
    const hrr = mhr - rhr;

    // Zona de Quema de Grasa (60% - 70% de HRR)
    const low = Math.round((hrr * 0.6) + rhr);
    const high = Math.round((hrr * 0.7) + rhr);

    setResult({ low, high, mhr });

    if ((window as any).gtag) {
      (window as any).gtag('event', 'calculate_fatburn_zone', { low, high });
    }
  };

  // SHARE TEXT CORREGIDO: Incluye resultados
  const shareText = useMemo(() => {
    if (!result) return "";
    return `🔥 ¡He calculado mi Zona de Quema de Grasas en Sporvit!\n\nMi rango ideal: ${result.low} - ${result.high} BPM\n\nOptimiza tu cardio aquí:`;
  }, [result]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="900px" frameborder="0" style="border-radius:24px; overflow:hidden;" title="Calculadora Zona Grasa Sporvit"></iframe>`,
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <Flame className="w-3 h-3 animate-pulse" /> Optimización de Oxidación Lipídica
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Calculadora de Zona de Quema de Grasas
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
          "No se trata de sudar más, sino de latir con inteligencia para movilizar tus reservas."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateZone} noValidate className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label htmlFor="age" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Activity className="w-3 h-3 text-orange-500" /> Edad
                  </label>
                  <input
                    id="age" type="number" value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className={`w-full bg-slate-950 border ${errors.age ? 'border-red-500' : 'border-slate-800'} rounded-2xl py-5 px-6 text-xl text-white outline-none focus:border-orange-500 transition-all font-black`}
                    placeholder="30"
                  />
                  {errors.age && <p className="text-red-500 text-[10px] font-bold italic">{errors.age}</p>}
                </div>
                <div className="space-y-3">
                  <label htmlFor="restingHR" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Heart className="w-3 h-3 text-orange-500" /> FC Reposo (bpm)
                  </label>
                  <input
                    id="restingHR" type="number" value={formData.restingHR}
                    onChange={(e) => setFormData({...formData, restingHR: e.target.value})}
                    className={`w-full bg-slate-950 border ${errors.restingHR ? 'border-red-500' : 'border-slate-800'} rounded-2xl py-5 px-6 text-xl text-white outline-none focus:border-orange-500 transition-all font-black`}
                    placeholder="65"
                  />
                  {errors.restingHR && <p className="text-red-500 text-[10px] font-bold italic">{errors.restingHR}</p>}
                </div>
              </div>

              <button type="submit" className="w-full bg-orange-500 hover:bg-orange-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg active:scale-[0.98]">
                <Target className="w-6 h-6" /> Definir Mi Zona 2
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center">
              <p className="text-orange-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Tu Rango Óptimo de Oxidación</p>
              <div className="text-6xl font-black text-white italic tracking-tighter mb-4">
                {result ? `${result.low}-${result.high}` : '--'}<span className="text-xl text-slate-500 ml-2">BPM</span>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-emerald-400 font-black uppercase text-[10px] tracking-widest bg-emerald-500/10 py-2 rounded-full mb-8">
                <Gauge className="w-3 h-3" /> Intensidad Moderada (Zona 2)
              </div>

              {/* SHARE */}
              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center shadow-lg"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center shadow-lg"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-orange-500 text-orange-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mi Zona de Cardio&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center shadow-lg"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-orange-500" /> Widget para tu Blog Fitness
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-orange-500/50 focus:outline-none resize-none mb-3 cursor-pointer" />
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
            <Info className="w-8 h-8 text-orange-500" /> El Mito de la Zona de Quema de Grasas
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                Existe una idea muy extendida de que solo se quema grasa si se entrena a baja intensidad. La realidad bioquímica es un poco más compleja. En la llamada **Zona 2 (60-70% de tu frecuencia cardíaca máxima)**, el porcentaje de energía que proviene de las grasas es mayor en comparación con los carbohidratos.
              </p>
              <p>
                Sin embargo, esto no significa que las intensidades altas no quemen grasa; simplemente utilizan más glucógeno durante la sesión. Entrenar en la zona de quema de grasas es ideal para construir una base aeróbica sólida, mejorar la eficiencia mitocondrial y permitir sesiones de entrenamiento más largas sin una fatiga excesiva del sistema nervioso central.
              </p>
              <h3 className="text-xl font-bold text-white italic text-left">Fórmula de Karvonen: Precisión Real</h3>
              <p>
                Nuestra calculadora utiliza el **Método de Karvonen**, que integra tu frecuencia cardíaca en reposo. Esto es fundamental: un atleta con 45 pulsaciones en reposo tiene una zona de quema de grasas muy distinta a una persona sedentaria con 80 pulsaciones, aunque ambos tengan la misma edad.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center space-y-4">
              <h3 className="text-xl font-bold text-orange-500 italic mb-4 uppercase text-center">Beneficios de la Zona 2</h3>
              {[
                { t: "Eficiencia Metabólica", d: "Enseña a tus células a usar ácidos grasos como combustible principal." },
                { t: "Recuperación Activa", text: "Promueve el flujo sanguíneo sin generar estrés sistémico." },
                { t: "Salud Mitocondrial", d: "Aumenta el número y la calidad de tus factorías energéticas celulares." },
                { t: "Resistencia Base", d: "El cimiento necesario para cualquier deporte de fondo o HIIT." }
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
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Cómo aplicar este rango a tu rutina</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "El Test del Habla", text: "En la zona de quema de grasas, deberías ser capaz de mantener una conversación en frases completas, aunque tu respiración sea algo más profunda de lo habitual. Si te falta el aire, has salido de la zona." },
              { title: "Duración es Clave", text: "Como la intensidad es moderada, el beneficio real de la oxidación de grasas ocurre en sesiones de más de 30-40 minutos. Es el 'cardio estable' por excelencia." },
              { title: "Consistencia vs Intensidad", text: "Para la salud general, es mejor acumular 150 minutos semanales en esta zona que hacer una única sesión de HIIT extremo que te deje agotado durante días." }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl group hover:border-orange-500/40 transition-all">
                <h3 className="text-orange-500 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-t from-orange-500/10 to-transparent border border-orange-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Optimiza tu composición corporal</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            Utiliza estos datos para tus caminatas rápidas, trotes suaves o sesiones de ciclismo. Entrenar en tu zona personalizada te asegura que estás trabajando en el rango de **máxima eficiencia lipolítica**. Recuerda que el control del pulso es la herramienta más barata y efectiva para garantizar que cada minuto que pasas en la cinta o en la carretera está alineado con tus objetivos de pérdida de grasa y salud cardiovascular.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Protocolo Karvonen", "Oxidación de Lípidos", "Zona 2 Training"].map((tag, i) => (
              <span key={i} className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-full text-[10px] font-black text-orange-400 uppercase tracking-widest">
                {tag}
              </span>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}