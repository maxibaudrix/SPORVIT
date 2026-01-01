"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Scale, Ruler, Activity, Zap, ShieldAlert, ArrowRight, Share2, Target, Heart
} from 'lucide-react';

// ============================================
// NUEVO: Añadir interfaz Props con compact
// ============================================
interface Props {
  compact?: boolean;
}

// ============================================
// NUEVO: Añadir parámetro { compact = false }
// ============================================
export default function BMICalculator({ compact = false }: Props) {
  const [formData, setFormData] = useState({ weight: '', height: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  
  // ============================================
  // ELIMINADO en modo compact: estados de copy/share
  // Mantenidos para versión completa
  // ============================================
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  // ============================================
  // ELIMINADO en modo compact: tracking de URL
  // Solo necesario para embed/share
  // ============================================
  useEffect(() => { 
    if (!compact) {
      setCurrentUrl(window.location.href); 
    }
  }, [compact]);

  // ============================================
  // MANTENIDO: Lógica de cálculo (CORE - sin cambios)
  // ============================================
  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(formData.weight);
    const h = parseFloat(formData.height) / 100; // cm a m
    
    if (!w || w < 20 || w > 400) { setErrors({ weight: "Peso no válido" }); return; }
    if (!h || h < 0.5 || h > 2.5) { setErrors({ height: "Altura no válida" }); return; }
    setErrors({});

    const bmi = w / (h * h);
    let category = "";
    let color = "";

    if (bmi < 18.5) { category = "Bajo Peso"; color = "text-blue-400"; }
    else if (bmi < 25) { category = "Peso Normal"; color = "text-emerald-500"; }
    else if (bmi < 30) { category = "Sobrepeso"; color = "text-yellow-400"; }
    else { category = "Obesidad"; color = "text-red-500"; }

    setResult({
      value: bmi.toFixed(1),
      category,
      color,
      healthyRange: {
        min: (18.5 * (h * h)).toFixed(1),
        max: (24.9 * (h * h)).toFixed(1)
      }
    });

    // ============================================
    // ELIMINADO en modo compact: Google Analytics
    // ============================================
    if (!compact && (window as any).gtag) {
      (window as any).gtag('event', 'calculate_bmi', { bmi_value: bmi });
    }
  };

  // ============================================
  // ELIMINADO en modo compact: Share text
  // ============================================
  const shareText = useMemo(() => 
    compact ? "" : (result ? `📊 Mi IMC es de ${result.value} (${result.category}). ¡Calcula el tuyo en Sporvit!` : ""), 
  [result, compact]);

  // ============================================
  // ELIMINADO en modo compact: Embed snippet
  // ============================================
  const embedSnippet = useMemo(() => 
    compact ? "" : `<iframe src="${currentUrl}" width="100%" height="850px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Calculadora IMC Sporvit"></iframe>`,
  [currentUrl, compact]);

  // ============================================
  // ELIMINADO en modo compact: copyToClipboard
  // ============================================
  const copyToClipboard = useCallback(async (text: string, type: 'embed' | 'share') => {
    if (compact) return;
    await navigator.clipboard.writeText(text);
    if (type === 'embed') setCopyStatus('copied');
    else setShareStatus('copied');
    setTimeout(() => { setCopyStatus('idle'); setShareStatus('idle'); }, 2000);
  }, [compact]);

  // ============================================
  // NUEVO: Renderizado condicional según compact
  // ============================================
  if (compact) {
    // ========== MODO SIDEBAR (COMPACTO) ==========
    return (
      <div className="p-4 space-y-6">
        {/* Formulario compacto */}
        <form onSubmit={calculateBMI} noValidate className="space-y-4">
          <div className="space-y-4">
            {/* Input Peso */}
            <div className="space-y-2">
              <label htmlFor="weight-compact" className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-2">
                <Scale className="w-3 h-3 text-emerald-500" /> Peso (kg)
              </label>
              <input
                id="weight-compact"
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
                className={`w-full bg-slate-950 border ${errors.weight ? 'border-red-500' : 'border-slate-800'} rounded-xl py-3 px-4 text-lg text-white outline-none focus:border-emerald-500 transition-all`}
                placeholder="70"
              />
              {errors.weight && <p className="text-red-400 text-xs">{errors.weight}</p>}
            </div>

            {/* Input Altura */}
            <div className="space-y-2">
              <label htmlFor="height-compact" className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-2">
                <Ruler className="w-3 h-3 text-emerald-500" /> Altura (cm)
              </label>
              <input
                id="height-compact"
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({...formData, height: e.target.value})}
                className={`w-full bg-slate-950 border ${errors.height ? 'border-red-500' : 'border-slate-800'} rounded-xl py-3 px-4 text-lg text-white outline-none focus:border-emerald-500 transition-all`}
                placeholder="175"
              />
              {errors.height && <p className="text-red-400 text-xs">{errors.height}</p>}
            </div>
          </div>

          {/* Botón Calcular */}
          <button 
            type="submit" 
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Calculator className="w-4 h-4" /> Calcular
          </button>
        </form>

        {/* Resultados compactos */}
        {result && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-3">
            <p className="text-emerald-500 font-bold uppercase text-xs text-center">Resultado</p>
            
            {/* Valor IMC */}
            <div className={`text-5xl font-black text-center ${result.color}`}>
              {result.value}
            </div>
            
            {/* Categoría */}
            <div className="text-center text-sm font-bold text-white uppercase">
              {result.category}
            </div>
            
            {/* Rango saludable */}
            <div className="pt-3 border-t border-slate-800">
              <p className="text-xs text-slate-500 text-center mb-1">Rango Saludable</p>
              <div className="text-sm font-bold text-emerald-400 text-center">
                {result.healthyRange.min}kg - {result.healthyRange.max}kg
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ========== MODO PÁGINA COMPLETA (ORIGINAL) ==========
  return (
    <div className="pt-8 pb-16 container mx-auto px-4 sm:px-6 max-w-6xl">
      {/* ============================================
          HEADER - Solo en versión completa
          ============================================ */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <Heart className="w-3 h-3" /> Salud y Bienestar
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Calculadora de IMC
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
          "El primer paso para mejorar tu salud es conocer tu estado actual. Mide tu Índice de Masa Corporal."
        </p>
      </header>

      {/* ============================================
          FORMULARIO Y RESULTADOS - Versión completa
          ============================================ */}
      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateBMI} noValidate className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label htmlFor="weight" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Scale className="w-3 h-3 text-emerald-500" /> Peso Corporal (kg)
                  </label>
                  <input
                    id="weight" type="number" value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    className={`w-full bg-slate-950 border ${errors.weight ? 'border-red-500' : 'border-slate-800'} rounded-2xl py-6 px-6 text-2xl text-white outline-none focus:border-emerald-500 transition-all font-black`}
                    placeholder="70" aria-invalid={!!errors.weight}
                  />
                  {errors.weight && <p className="text-red-500 text-[10px] font-bold italic">{errors.weight}</p>}
                </div>

                <div className="space-y-3">
                  <label htmlFor="height" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Ruler className="w-3 h-3 text-emerald-500" /> Altura (cm)
                  </label>
                  <input
                    id="height" type="number" value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                    className={`w-full bg-slate-950 border ${errors.height ? 'border-red-500' : 'border-slate-800'} rounded-2xl py-6 px-6 text-2xl text-white outline-none focus:border-emerald-500 transition-all font-black`}
                    placeholder="175" aria-invalid={!!errors.height}
                  />
                  {errors.height && <p className="text-red-500 text-[10px] font-bold italic">{errors.height}</p>}
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] uppercase tracking-tighter flex items-center justify-center gap-4 text-lg active:scale-[0.98]">
                <Calculator className="w-6 h-6" /> Calcular IMC
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
              <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Tu Resultado</p>
              <div className={`text-7xl font-black italic tracking-tighter ${result?.color || 'text-white'}`}>
                {result ? result.value : '--'}
              </div>
              <div className="mt-2 text-xl font-black text-white uppercase italic tracking-widest">
                {result?.category || 'Analizando...'}
              </div>
              
              <div className="mt-8 p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Rango Saludable Sugerido</p>
                <div className="text-lg font-black text-emerald-400 italic">
                  {result ? `${result.healthyRange.min}kg - ${result.healthyRange.max}kg` : '--'}
                </div>
              </div>

              {/* ============================================
                  SHARE BUTTONS - Solo en versión completa
                  ============================================ */}
              {result && (
                <div className="mt-8 pt-8 border-t border-slate-800 grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center shadow-lg"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center shadow-lg"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-emerald-500 text-emerald-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mi IMC en Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center shadow-lg"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          {/* ============================================
              EMBED WIDGET - Solo en versión completa
              ============================================ */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
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

      {/* ============================================
          ARTÍCULOS EDUCATIVOS - Solo en versión completa
          ============================================ */}
      <article className="prose prose-invert prose-slate max-w-none space-y-16">
        <section className="bg-slate-900/30 border border-slate-800 rounded-[40px] p-8 md:p-12">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-4">
            <Info className="w-8 h-8 text-emerald-500" /> ¿Qué es el IMC y por qué se sigue utilizando?
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                El **Índice de Masa Corporal (IMC)** es una fórmula matemática desarrollada por el estadístico Adolphe Quetelet en el siglo XIX. Se utiliza como un método de detección rápido y económico para categorizar el peso de una persona en relación con su estatura.
              </p>
              <p>
                Aunque es una herramienta de diagnóstico clínico común, en Sporvit recordamos que el IMC es una métrica de **población**, no de composición corporal individual. Es excelente para identificar riesgos de salud asociados al sobrepeso y la obesidad en grandes grupos, pero tiene limitaciones importantes para atletas y entusiastas del fitness.
              </p>
              <h3 className="text-xl font-bold text-white italic">Clasificación de la OMS</h3>
              <p>
                La Organización Mundial de la Salud (OMS) establece rangos claros: menos de 18.5 es bajo peso, de 18.5 a 24.9 es el rango saludable, de 25 a 29.9 se considera sobrepeso y más de 30 indica obesidad. Estos rangos se correlacionan con el riesgo de desarrollar enfermedades cardiovasculares y metabólicas.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center space-y-4">
              <h3 className="text-xl font-bold text-emerald-500 italic mb-4 uppercase text-center">Rangos de Clasificación</h3>
              {[
                { t: "< 18.5", d: "Bajo Peso", c: "text-blue-400" },
                { t: "18.5 - 24.9", d: "Normal (Saludable)", c: "text-emerald-500" },
                { t: "25.0 - 29.9", d: "Sobrepeso", c: "text-yellow-400" },
                { t: "> 30.0", d: "Obesidad", c: "text-red-500" }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  <span className="font-black text-white">{item.t}</span>
                  <span className={`font-black uppercase text-xs ${item.c}`}>{item.d}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">La Paradoja del Atleta</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Músculo vs Grasa", text: "El IMC no distingue entre tejido adiposo y masa muscular. Un culturista con un 8% de grasa corporal puede tener un IMC de 'Obesidad' debido a su gran densidad muscular." },
              { title: "Distribución de Grasa", text: "Dos personas con el mismo IMC pueden tener riesgos de salud muy distintos. La grasa visceral (abdominal) es mucho más peligrosa que la grasa periférica." },
              { title: "Densidad Ósea", text: "Factores como la densidad de los huesos y la hidratación no se tienen en cuenta, lo que puede sesgar ligeramente los resultados en personas con estructuras óseas grandes." }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl group hover:border-emerald-500/40 transition-all">
                <h3 className="text-emerald-500 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-t from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">¿Debo preocuparme por mi IMC?</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            El IMC es un punto de partida, no un destino final. Si tu IMC es alto pero haces ejercicio regularmente y tienes una buena masa muscular, es probable que tu salud metabólica sea excelente. Por el contrario, existen personas con un IMC "normal" pero con un exceso de grasa abdominal (falsos delgados) que tienen riesgos elevados. Utiliza esta calculadora como un chequeo rápido, pero complementa siempre con medidas como el porcentaje de grasa corporal o el perímetro de cintura para una imagen real de tu salud.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Protocolo OMS", "Diagnóstico Básico", "IMC"].map((tag, i) => (
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