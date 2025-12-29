"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Zap, Utensils, Trophy, Scale, ShieldAlert, Share2, Timer, Apple,
  ArrowRight, Activity
} from 'lucide-react';

export default function CHOLoadingCalculator() {
  const [formData, setFormData] = useState({
    weight: '',
    duration: '2-3h', // 1.5-3h, 3-5h, 5h+
    days: '2', // 1, 2, 3 días de carga
    intensity: 'standard' // standard, aggressive
  });

  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(typeof window !== 'undefined' ? window.location.href : ''); }, []);

  const calculateLoading = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(formData.weight);
    if (!w) return;

    // Lógica de gramos de CHO por kg de peso
    let choPerKg = 7; // Base para eventos de 1.5-3h
    if (formData.duration === '3-5h') choPerKg = 9;
    if (formData.duration === '5h+') choPerKg = 10.5;

    // Ajuste por agresividad del protocolo
    if (formData.intensity === 'aggressive') choPerKg += 1.5;

    const totalChoDay = w * choPerKg;
    const totalKcal = totalChoDay * 4;

    setResult({
      choPerKg: choPerKg.toFixed(1),
      totalCho: Math.round(totalChoDay),
      totalKcal: Math.round(totalKcal),
      days: formData.days,
      perMeal: Math.round(totalChoDay / 5) // Estimación para 5 comidas
    });
  };

  const shareText = useMemo(() => {
    if (!result) return "";
    return `🥖 Mi Carga de Carbohidratos en Sporvit:\n\n⚡ ${result.totalCho}g CHO/día\n🔥 ${result.totalKcal} kcal de pura energía\n🏁 Objetivo: Satura glucógeno.\n\nCalcula tu carga aquí:`;
  }, [result]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Calculadora Carga CHO Sporvit"></iframe>`,
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
          <Zap className="w-3 h-3" /> Glucógeno y Supercompensación
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter text-center">
          Carga de Carbohidratos
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic text-center">
          "El combustible que decides cargar hoy determina el muro con el que no chocarás mañana."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateLoading} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Scale className="w-3 h-3 text-orange-500" /> Peso Corporal Actual (kg)
                </label>
                <input type="number" step="0.1" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-6 px-6 text-4xl text-white outline-none focus:border-orange-500 font-black transition-all" placeholder="70" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Duración del Evento</label>
                  <select value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-4 text-white font-bold outline-none focus:border-orange-500 appearance-none">
                    <option value="2-3h">Medio Fondo / 2-3h (5-7g/kg)</option>
                    <option value="3-5h">Maratón / 3-5h (7-10g/kg)</option>
                    <option value="5h+">Ultra / Ironman / 5h+ (10-12g/kg)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Protocolo</label>
                  <select value={formData.intensity} onChange={(e) => setFormData({...formData, intensity: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-4 text-white font-bold outline-none focus:border-orange-500 appearance-none">
                    <option value="standard">Estándar (Seguro)</option>
                    <option value="aggressive">Agresivo (Elite)</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg">
                <Utensils className="w-6 h-6" /> Calcular Mi Carga de Energía
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="text-center mb-8 border-b border-slate-800 pb-6">
                <p className="text-orange-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Objetivo de Carbohidratos Diario</p>
                <div className="text-6xl font-black text-white italic tracking-tighter">
                  {result ? result.totalCho : '--'} <span className="text-xl text-slate-500">g/día</span>
                </div>
                <div className="text-[10px] text-slate-500 font-bold uppercase mt-2">({result?.choPerKg || '--'} g CHO por kg)</div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl flex justify-between items-center group transition-all">
                  <div>
                    <div className="text-[9px] font-black uppercase text-slate-400">Calorías de Carga</div>
                    <div className="text-[8px] text-slate-600 font-bold italic">Solo carbohidratos</div>
                  </div>
                  <div className="text-2xl font-black text-white italic">{result?.totalKcal || '--'} <span className="text-xs">kcal</span></div>
                </div>
                <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl flex justify-between items-center group transition-all">
                  <div>
                    <div className="text-[9px] font-black uppercase text-slate-400">Por Comida</div>
                    <div className="text-[8px] text-slate-600 font-bold italic">Repartido en 5 tomas</div>
                  </div>
                  <div className="text-2xl font-black text-white italic">{result?.perMeal || '--'} <span className="text-xs">g</span></div>
                </div>
              </div>
              
              <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl flex items-start gap-3 mb-8">
                <ShieldAlert className="w-5 h-5 text-orange-500 shrink-0" />
                <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic text-justify">
                  Es normal ganar 1-2kg durante la carga. Por cada gramo de glucógeno almacenado, el cuerpo retiene 3g de agua. Esta hidratación es vital para la carrera.
                </p>
              </div>

              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center shadow-lg"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center shadow-lg"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-orange-500 text-orange-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mi Plan de Carga CHO Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center shadow-lg"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl text-center">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-orange-500" /> Inserta este Widget
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-orange-400/50 focus:outline-none resize-none mb-3 cursor-pointer" />
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
            <Trophy className="w-8 h-8 text-orange-500" /> La Ciencia de la Supercompensación de Glucógeno
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                La **Carga de Carbohidratos** no es simplemente comer un plato de pasta la noche antes de una carrera. Es un protocolo fisiológico diseñado para saturar las reservas de glucógeno en el hígado y los músculos esqueléticos. En eventos de resistencia de más de 90 minutos, el glucógeno es el factor limitante del rendimiento; cuando se agota, el atleta experimenta una caída drástica de la intensidad, conocida como "el muro".
              </p>
              <p>
                El objetivo es aumentar los niveles de glucógeno muscular de los valores normales (~100-120 mmol/kg) hasta niveles de supercompensación (~200+ mmol/kg). Esto se logra reduciendo el volumen de entrenamiento (Tapering) mientras se aumenta drásticamente la ingesta de carbohidratos durante 36 a 72 horas. Nuestra calculadora utiliza los protocolos modernos que recomiendan entre **8g y 12g de carbohidratos por kilo de peso corporal**, asegurando que cada fibra muscular esté cargada de combustible para el día de la competición.
              </p>
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center font-mono text-orange-400 text-xl my-4">
                {"$$Total\\,CHO\\,(g) = Peso_{kg} \\times Factor\\,(7\\,a\\,12)$$"}
              </div>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center space-y-4">
              <h3 className="text-xl font-bold text-orange-400 italic mb-4 uppercase text-center">Errores Comunes en la Carga</h3>
              {[
                { t: "Exceso de Fibra", d: "Demasiada fibra (pastas integrales, legumbres) puede causar malestar gástrico el día de la carrera. Prioriza CHO refinados." },
                { t: "Grasas Innecesarias", d: "La carga es de carbohidratos, no de calorías totales. Mantén las grasas bajas para evitar digestiones pesadas." },
                { t: "No Beber Suficiente", d: "Cada gramo de glucógeno necesita 3g de agua para almacenarse. Hidrátate bien." },
                { t: "Probar Alimentos Nuevos", d: "La carga no es el momento de innovar. Usa fuentes de CHO que sepas que toleras bien." }
              ].map((item, i) => (
                <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-left">
                  <div className="font-black text-xs text-white uppercase">{item.t}</div>
                  <div className="text-[10px] text-slate-500 font-bold">{item.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Protocolo de 3 Etapas</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                title: "Día -3: Vaciado y Tapering", 
                text: "Realiza una sesión corta de intensidad moderada para estimular los transportadores de glucosa (GLUT4) sin agotar tus piernas. Empieza a aumentar ligeramente los carbohidratos." 
              },
              { 
                title: "Día -2: Carga Principal", 
                text: "Es el día más importante. Debes alcanzar los gramos calculados (ej. 10g/kg). Divide las tomas en 5-6 comidas pequeñas para facilitar la absorción y evitar la hinchazón." 
              },
              { 
                title: "Día -1: Mantenimiento y Calma", 
                text: "Mantén una ingesta alta pero ligeramente inferior al día anterior. El objetivo es mantener los depósitos llenos y asegurar un vaciado gástrico completo antes de dormir." 
              }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl group hover:border-orange-500/40 transition-all">
                <h3 className="text-orange-500 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-t from-orange-500/10 to-transparent border border-orange-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Maximiza tu Potencia Energética</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            La Calculadora de Carga de Carbohidratos de Sporvit es tu herramienta estratégica para el éxito en endurance. Recuerda que durante estos días, la balanza no es tu amiga; ganar un poco de peso es la señal de que tus depósitos están llenos de energía y agua listos para ser oxidados. Confía en el proceso, sigue los gramos indicados y lánzate a por tu marca personal con el tanque lleno.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Carga Glucógeno", "Nutrición Endurance", "Maratón Prep"].map((tag, i) => (
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