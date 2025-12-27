"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Dumbbell, Calculator, Info, Code, Copy, Check, MessageCircle, 
  Send, Mail, Activity, TrendingUp, ShieldAlert, Zap, Share2 
} from 'lucide-react';

// ============================================
// LOGICA DE CÁLCULO (useMemo)
// ============================================
const FORMULAS = {
  brzycki: (w: number, r: number) => w / (1.0278 - 0.0278 * r),
  epley: (w: number, r: number) => w * (1 + r / 30),
};

export default function OneRMCalculator() {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [errors, setErrors] = useState<{weight?: string, reps?: string}>({});
  const [result, setResult] = useState<{oneRM: number, table: {pct: number, weight: number}[]} | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  // Reset de errores al editar
  const handleInputChange = (field: 'weight' | 'reps', value: string) => {
    if (field === 'weight') setWeight(value);
    if (field === 'reps') setReps(value);
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const calculate1RM = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const r = parseInt(reps);
    let newErrors: {weight?: string, reps?: string} = {};

    if (!w || w <= 0) newErrors.weight = "Introduce un peso válido";
    if (!r || r <= 0 || r > 12) newErrors.reps = "Las fórmulas son precisas hasta 12 reps";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const brzycki = FORMULAS.brzycki(w, r);
    const epley = FORMULAS.epley(w, r);
    const average1RM = Math.round((brzycki + epley) / 2);

    const table = [95, 90, 85, 80, 75, 70, 60, 50].map(pct => ({
      pct,
      weight: Math.round(average1RM * (pct / 100))
    }));

    setResult({ oneRM: average1RM, table });
    if ((window as any).gtag) {
      (window as any).gtag('event', 'calculate_1rm', { weight: w, reps: r });
    }
  };

  const shareText = useMemo(() => 
    result ? `💪 ¡Mi 1RM estimado es de ${result.oneRM}kg! Descubre el tuyo en Sporvit:` : "", 
  [result]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="900px" frameborder="0" style="border-radius:20px; overflow:hidden;" title="Calculadora 1RM Sporvit"></iframe>`,
  [currentUrl]);

  const copyToClipboard = useCallback(async (text: string, type: 'embed' | 'share') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'embed') setCopyStatus('copied');
      else setShareStatus('copied');
      setTimeout(() => { setCopyStatus('idle'); setShareStatus('idle'); }, 2000);
    } catch (err) { console.error("Error al copiar", err); }
  }, []);

  return (
    <div className="pt-8 pb-16 container mx-auto px-4 sm:px-6 max-w-6xl">
      {/* HEADER SEO H1 */}
      <header className="text-center mb-12 animate-in fade-in duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-6">
          <TrendingUp className="w-3 h-3" /> RENDIMIENTO ELITE
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Calculadora de 1RM (Repetición Máxima)
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
          "No adivines tu fuerza, mídela. La precisión en tus cargas es la diferencia entre estancarse o progresar."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculate1RM} noValidate className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label htmlFor="weight" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Dumbbell className="w-3 h-3 text-emerald-500" /> Peso Levantado (kg)
                  </label>
                  <input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className={`w-full bg-slate-950 border ${errors.weight ? 'border-red-500' : 'border-slate-800'} rounded-2xl py-5 px-6 text-xl text-white outline-none focus:border-emerald-500 transition-all font-black`}
                    placeholder="100"
                    aria-required="true"
                    aria-invalid={!!errors.weight}
                  />
                  {errors.weight && <p className="text-red-400 text-xs font-bold flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> {errors.weight}</p>}
                </div>

                <div className="space-y-3">
                  <label htmlFor="reps" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Activity className="w-3 h-3 text-emerald-500" /> Repeticiones Realizadas
                  </label>
                  <input
                    id="reps"
                    type="number"
                    value={reps}
                    onChange={(e) => handleInputChange('reps', e.target.value)}
                    className={`w-full bg-slate-950 border ${errors.reps ? 'border-red-500' : 'border-slate-800'} rounded-2xl py-5 px-6 text-xl text-white outline-none focus:border-emerald-500 transition-all font-black`}
                    placeholder="5"
                    aria-required="true"
                    aria-invalid={!!errors.reps}
                  />
                  {errors.reps && <p className="text-red-400 text-xs font-bold flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> {errors.reps}</p>}
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] uppercase tracking-tighter flex items-center justify-center gap-4 text-lg active:scale-[0.98]"
              >
                <Calculator className="w-6 h-6" /> Calcular Mi Máxima
              </button>
            </form>
          </div>

          {/* EDUCATIONAL CONTENT (SEO +800 palabras - Resumen estructura) */}
          <article className="mt-12 prose prose-invert prose-slate max-w-none space-y-12">
            <section className="bg-slate-900/30 border border-slate-800 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 italic uppercase tracking-tighter flex items-center gap-3">
                <Info className="w-6 h-6 text-emerald-500" /> ¿Qué es el 1RM y por qué importa?
              </h2>
              <p className="text-slate-400 leading-relaxed text-lg">
                La <strong>Repetición Máxima (1RM)</strong> es la mayor cantidad de peso que puedes levantar en un ejercicio específico una sola vez con técnica perfecta. Es el "estándar de oro" para medir la fuerza absoluta en deportes como el Powerlifting, Crossfit y culturismo.
              </p>
              <h3 className="text-xl font-bold text-slate-200 mt-8 mb-4 italic">Ventajas de calcular tu 1RM</h3>
              <ul role="list" className="space-y-4 text-slate-400">
                <li role="listitem" className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                  <span><strong>Programación de intensidades:</strong> Permite usar porcentajes precisos (ej. trabajar al 80% de tu 1RM) para hipertrofia o fuerza.</span>
                </li>
                <li role="listitem" className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                  <span><strong>Seguridad:</strong> Estimar el 1RM mediante repeticiones submáximas (como 5 o 8 reps) es mucho más seguro para las articulaciones que intentar un levantamiento máximo real.</span>
                </li>
              </ul>
            </section>
            
            {/* Aquí añadirías más contenido para llegar a las 800+ palabras requeridas para SEO */}
          </article>
        </section>

        {/* COLUMNA DERECHA: RESULTADOS */}
        <aside className="lg:col-span-5 space-y-6">
          <div className={`transition-all duration-1000 transform ${result ? 'opacity-100 translate-y-0 scale-100' : 'opacity-20 translate-y-4 grayscale pointer-events-none'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Dumbbell className="w-32 h-32 text-white" />
              </div>

              <div className="text-center mb-8 pb-8 border-b border-slate-800/50">
                <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Tu 1RM Estimado</p>
                <div className="text-6xl md:text-7xl font-black text-white tracking-tighter inline-flex items-baseline gap-2">
                  {result ? result.oneRM : '--'} 
                  <span className="text-2xl text-slate-500 italic font-bold">kg</span>
                </div>
              </div>

              {/* TABLA DE PORCENTAJES */}
              <div className="space-y-2 mb-8" role="list">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 text-center">Tabla de Cargas de Entrenamiento</p>
                {result?.table.map((row, i) => (
                  <div key={i} role="listitem" className="flex justify-between items-center bg-slate-950/50 border border-slate-800/50 p-3 rounded-xl hover:border-emerald-500/30 transition-colors group">
                    <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-400 transition-colors">{row.pct}% de intensidad</span>
                    <span className="text-lg font-black text-white">{row.weight} <span className="text-[10px] text-slate-600">KG</span></span>
                  </div>
                ))}
              </div>

              {/* BLOQUE COMPARTIR */}
              {result && (
                <div className="mt-6 pt-6 border-t border-slate-800">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4 text-center">Comparte tu Fuerza</p>
                  <div className="grid grid-cols-4 gap-2">
                    <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 hover:border-green-500/30 transition-all flex justify-center shadow-lg"><MessageCircle className="w-5 h-5" /></button>
                    <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 hover:border-blue-400/30 transition-all flex justify-center shadow-lg"><Send className="w-5 h-5" /></button>
                    <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-emerald-500 text-emerald-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                    <button onClick={() => window.location.href=`mailto:?subject=Mi 1RM en Sporvit&body=${shareText} ${currentUrl}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 hover:border-amber-400/30 transition-all flex justify-center shadow-lg"><Mail className="w-5 h-5" /></button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* EMBED CODE BOX */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4 text-white uppercase tracking-wider font-bold text-[10px] justify-center">
              <Code className="w-4 h-4 text-emerald-400" /> Inserta esta herramienta
            </div>
            <textarea 
              readOnly 
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              value={embedSnippet}
              className="w-full h-32 sm:h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-emerald-500/70 focus:outline-none resize-none cursor-pointer"
            />
            <button 
              onClick={() => copyToClipboard(embedSnippet, 'embed')}
              className="mt-3 w-full py-3 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              {copyStatus === 'copied' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              {copyStatus === 'copied' ? 'CÓDIGO COPIADO' : 'COPIAR CÓDIGO EMBED'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}