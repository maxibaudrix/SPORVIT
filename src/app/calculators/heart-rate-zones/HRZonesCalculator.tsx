"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Heart, Calculator, Share2, Code, Copy, 
  MessageCircle, Send, Mail, Check, Activity, Zap, HeartPulse, Timer, ShieldAlert
} from 'lucide-react';

export default function HRZonesCalculator() {
  const [formData, setFormData] = useState({ age: '', restingHR: '60' });
  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(typeof window !== 'undefined' ? window.location.href : ''); }, []);

  const calculateZones = (e: React.FormEvent) => {
    e.preventDefault();
    const age = Number(formData.age);
    const rhr = Number(formData.restingHR);

    if (!age || !rhr || age <= 0) return;

    // FÓRMULAS CORREGIDAS (Asegurando tipos numéricos)
    const mhr = 220 - age;
    const hrr = mhr - rhr; // Heart Rate Reserve (Karvonen)

    if (hrr <= 0) return; // Validación de seguridad

    const zones = [
      { name: "Zona 1", label: "Recuperación", pct: "50-60%", min: 0.5, max: 0.6, color: "text-blue-400", desc: "Calentamiento y salud metabólica." },
      { name: "Zona 2", label: "Fondo / Quema Grasa", pct: "60-70%", min: 0.6, max: 0.7, color: "text-emerald-400", desc: "Base aeróbica y oxidación de lípidos." },
      { name: "Zona 3", label: "Tempo / Aeróbica", pct: "70-80%", min: 0.7, max: 0.8, color: "text-yellow-400", desc: "Mejora del gasto cardíaco y eficiencia." },
      { name: "Zona 4", label: "Umbral Anaeróbico", pct: "80-90%", min: 0.8, max: 0.9, color: "text-orange-400", desc: "Resistencia al lactato y potencia." },
      { name: "Zona 5", label: "Esfuerzo Máximo", pct: "90-100%", min: 0.9, max: 1.0, color: "text-red-500", desc: "VO2 Máximo y capacidad anaeróbica." }
    ].map(z => ({
      ...z,
      range: `${Math.round((hrr * z.min) + rhr)} - ${Math.round((hrr * z.max) + rhr)}`
    }));

    setResult({ mhr, zones, rhr });
  };

  const shareText = useMemo(() => {
    if (!result) return "";
    return `💓 Mis Zonas de FC en Sporvit:\n🔥 Z2 (Quema Grasa): ${result.zones[1].range} BPM\n🚀 Z5 (Máximo): ${result.zones[4].range} BPM\n\nCalcula las tuyas aquí:`;
  }, [result]);

  const copyToClipboard = useCallback(async (text: string, type: 'embed' | 'share') => {
    await navigator.clipboard.writeText(text);
    if (type === 'embed') setCopyStatus('copied');
    else setShareStatus('copied');
    setTimeout(() => { setCopyStatus('idle'); setShareStatus('idle'); }, 2000);
  }, []);

  const embedSnippet = `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; border:1px solid #1e293b;" title="Calculadora Zonas FC Sporvit"></iframe>`;

  return (
    <div className="pt-8 pb-16 container mx-auto px-4 sm:px-6 max-w-6xl">
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <HeartPulse className="w-3 h-3" /> Fisiología Cardiovascular
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter text-center">
          Zonas de Frecuencia Cardíaca
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic text-center">
          "El corazón no miente. Entrena en los rangos exactos para cada objetivo fisiológico."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateZones} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Activity className="w-3 h-3 text-red-500" /> Edad Actual (años)
                  </label>
                  <input type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-6 px-6 text-4xl text-white outline-none focus:border-red-500 font-black transition-all" placeholder="30" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Timer className="w-3 h-3 text-red-500" /> FC en Reposo (BPM)
                  </label>
                  <input type="number" value={formData.restingHR} onChange={(e) => setFormData({...formData, restingHR: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-6 px-6 text-4xl text-white outline-none focus:border-red-500 font-black transition-all" placeholder="60" />
                </div>
              </div>
              <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg">
                <Calculator className="w-6 h-6" /> Obtener Mis Zonas Karvonen
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center">
              <div className="text-center mb-8 border-b border-slate-800 pb-6">
                <p className="text-red-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">FC Máxima Estimada</p>
                <div className="text-6xl font-black text-white italic tracking-tighter">
                  {result ? result.mhr : '--'} <span className="text-xl text-slate-500">BPM</span>
                </div>
              </div>

              <div className="space-y-2 mb-8 text-left">
                {result?.zones.map((z: any) => (
                  <div key={z.name} className="flex justify-between items-center bg-slate-950/50 p-3 rounded-xl border border-slate-800 hover:border-red-500/30 transition-all group">
                    <div className="flex flex-col">
                        <span className={`text-[10px] font-black uppercase ${z.color}`}>{z.name}: {z.label}</span>
                        <span className="text-[8px] font-bold text-slate-600 uppercase italic">{z.desc}</span>
                    </div>
                    <div className="text-right">
                        <span className="text-sm font-black text-white italic group-hover:text-red-400 transition-colors">{z.range}</span>
                        <div className="text-[8px] font-bold text-slate-600 uppercase">{z.pct}</div>
                    </div>
                  </div>
                ))}
              </div>

              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button type="button" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center shadow-lg"><MessageCircle className="w-5 h-5" /></button>
                  <button type="button" onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center shadow-lg"><Send className="w-5 h-5" /></button>
                  <button type="button" onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-red-500 text-red-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button type="button" onClick={() => window.location.href=`mailto:?subject=Mis Zonas FC Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center shadow-lg"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl text-center">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-red-500" /> Widget Profesional
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-red-400/50 focus:outline-none resize-none mb-3 cursor-pointer" />
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
            <Zap className="w-8 h-8 text-red-500" /> Karvonen vs. Fox: La Ciencia de la Intensidad
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                Entrenar basándose únicamente en la edad (la famosa fórmula de Fox: **220 - edad**) es un error común que ignora la individualidad biológica. Esa ecuación fue diseñada en los años 70 basándose en promedios estadísticos de personas sedentarias y no atletas. Aquí es donde el **Método Karvonen** marca la diferencia al introducir el concepto de la **Frecuencia Cardíaca de Reserva (FCR)**.
              </p>
              <p>
                La FCR representa el rango real de trabajo de tu corazón: el espacio entre tu pulso en descanso total y tu pulso al máximo esfuerzo. Al incluir tu frecuencia cardíaca en reposo (RHR), Karvonen ajusta las zonas según tu nivel de forma actual. Si eres un atleta con un corazón eficiente (RHR bajo), tu ventana de trabajo es más amplia, permitiéndote entrenar a intensidades aeróbicas que una persona sedentaria de tu misma edad no podría alcanzar.
              </p>
              
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center space-y-4">
              <h3 className="text-xl font-bold text-red-500 italic mb-4 uppercase text-center">Por qué Karvonen es Superior</h3>
              {[
                { t: "Individualidad Biológica", d: "Considera que tu corazón se vuelve más eficiente al entrenar (baja el pulso en reposo)." },
                { t: "Rango de Trabajo Real", d: "Calcula el esfuerzo sobre el margen real disponible, no sobre un absoluto teórico." },
                { t: "Precisión en Zona 2", d: "Evita que entrenes demasiado suave o demasiado fuerte, optimizando la quema de grasa." },
                { t: "Adaptabilidad", d: "A medida que tu forma mejora, tus zonas se desplazan para seguir ofreciendo el estímulo adecuado." }
              ].map((item, i) => (
                <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-left">
                  <div className="font-black text-xs text-white uppercase">{item.t}</div>
                  <div className="text-[10px] text-slate-500 font-bold">{item.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-t from-red-500/10 to-transparent border border-red-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Mide tu Corazón con Sporvit</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            La frecuencia cardíaca es el "tacómetro" de tu motor interno. Entrenar sin zonas claras es como conducir sin saber a qué revoluciones va el motor: puedes quedarte corto de potencia o terminar rompiendo el sistema por sobrecalentamiento. Al utilizar el Método Karvonen en nuestra calculadora, estás aplicando ciencia deportiva de élite a tu rutina diaria. Recuerda medir tu pulso en reposo al despertar para obtener la máxima precisión posible. En Sporvit, transformamos tus latidos en progreso tangible.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Método Karvonen", "Zonas de Entrenamiento", "Fisiología Deportiva"].map((tag, i) => (
              <span key={tag} className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-full text-[10px] font-black text-red-400 uppercase tracking-widest">
                {tag}
              </span>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}