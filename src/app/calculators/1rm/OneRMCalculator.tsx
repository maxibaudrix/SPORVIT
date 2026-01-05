"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Dumbbell, Zap, ShieldAlert, ArrowRight, Share2, Target, Trophy, Activity, BarChart
} from 'lucide-react';

// ============================================
// NUEVO: Interfaz Props con compact
// ============================================
interface Props {
  compact?: boolean;
}

// ============================================
// NUEVO: Parámetro { compact = false }
// ============================================
export default function OneRMCalculator({ compact = false }: Props) {
  const [formData, setFormData] = useState({ weight: '', reps: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  
  // ============================================
  // CONDICIONAL: Estados solo para versión completa
  // ============================================
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { 
    // ============================================
    // CONDICIONAL: Solo cargar URL en versión completa
    // ============================================
    if (typeof window !== 'undefined' && !compact) {
      setCurrentUrl(window.location.href); 
    }
  }, [compact]);

  // ============================================
  // MANTENIDO: Lógica de cálculo CORE (sin cambios)
  // ============================================
  const calculate1RM = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(formData.weight);
    const r = parseInt(formData.reps);
    
    if (!w || w <= 0) { setErrors({ weight: "Peso inválido" }); return; }
    if (!r || r < 1 || r > 12) { setErrors({ reps: "Usa de 1 a 12 reps para precisión" }); return; }
    setErrors({});

    // 1. Brzycki: 1RM = Peso / (1.0278 - (0.0278 * Reps))
    const brzycki = w / (1.0278 - (0.0278 * r));
    
    // 2. Epley: 1RM = Peso * (1 + (Reps / 30))
    const epley = w * (1 + (r / 30));

    // Usamos el promedio para el resultado principal
    const avg1RM = Math.round((brzycki + epley) / 2);

    // Tabla de porcentajes
    const percentages = [95, 90, 85, 80, 75, 70, 60, 50].map(p => ({
      pct: p,
      val: Math.round(avg1RM * (p / 100))
    }));

    setResult({
      oneRM: avg1RM,
      brzycki: Math.round(brzycki),
      epley: Math.round(epley),
      percentages
    });

    // ============================================
    // CONDICIONAL: Analytics solo en versión completa
    // ============================================
    if (!compact && (window as any).gtag) {
      (window as any).gtag('event', 'calculate_1rm', { value: avg1RM });
    }
  };

  // ============================================
  // CONDICIONAL: Share text solo para versión completa
  // ============================================
  const shareText = useMemo(() => {
    if (!result || compact) return "";
    return `🏋️‍♂️ ¡He estimado mi 1RM en Sporvit!\n\nFuerza Máxima: ${result.oneRM} kg\nCarga al 80%: ${result.percentages.find((p:any)=>p.pct===80).val} kg\n\nCalcula tu potencial aquí:`;
  }, [result, compact]);

  // ============================================
  // CONDICIONAL: Embed snippet solo para versión completa
  // ============================================
  const embedSnippet = useMemo(() => 
    compact ? "" : `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Calculadora 1RM Sporvit"></iframe>`,
  [currentUrl, compact]);

  // ============================================
  // CONDICIONAL: copyToClipboard solo para versión completa
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
        <form onSubmit={calculate1RM} noValidate className="space-y-4">
          <div className="space-y-4">
            {/* Input Peso */}
            <div className="space-y-2">
              <label htmlFor="weight-compact" className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-2">
                <Dumbbell className="w-3 h-3 text-red-500" /> Peso Levantado (kg)
              </label>
              <input
                id="weight-compact"
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
                className={`w-full bg-slate-950 border ${errors.weight ? 'border-red-500' : 'border-slate-800'} rounded-xl py-3 px-4 text-lg text-white outline-none focus:border-red-500 transition-all`}
                placeholder="100"
              />
              {errors.weight && <p className="text-red-400 text-xs">{errors.weight}</p>}
            </div>

            {/* Input Reps */}
            <div className="space-y-2">
              <label htmlFor="reps-compact" className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-2">
                <Activity className="w-3 h-3 text-red-500" /> Repeticiones (1-12)
              </label>
              <input
                id="reps-compact"
                type="number"
                value={formData.reps}
                onChange={(e) => setFormData({...formData, reps: e.target.value})}
                className={`w-full bg-slate-950 border ${errors.reps ? 'border-red-500' : 'border-slate-800'} rounded-xl py-3 px-4 text-lg text-white outline-none focus:border-red-500 transition-all`}
                placeholder="5"
              />
              {errors.reps && <p className="text-red-400 text-xs">{errors.reps}</p>}
            </div>
          </div>

          {/* Botón Calcular */}
          <button 
            type="submit" 
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Target className="w-4 h-4" /> Calcular 1RM
          </button>
        </form>

        {/* Resultados compactos */}
        {result && (
          <div className="space-y-4">
            {/* Resultado principal */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
              <p className="text-red-500 font-bold uppercase text-xs mb-2">Tu 1RM Estimado</p>
              <div className="text-5xl font-black text-white mb-3">
                {result.oneRM} <span className="text-lg text-slate-500">kg</span>
              </div>
              
              {/* Fórmulas */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800">
                <div className="bg-slate-950/50 p-2 rounded-lg">
                  <div className="text-[9px] text-slate-500 uppercase mb-1">Brzycki</div>
                  <div className="text-sm font-bold text-white">{result.brzycki}kg</div>
                </div>
                <div className="bg-slate-950/50 p-2 rounded-lg">
                  <div className="text-[9px] text-slate-500 uppercase mb-1">Epley</div>
                  <div className="text-sm font-bold text-white">{result.epley}kg</div>
                </div>
              </div>
            </div>

            {/* Porcentajes más relevantes (compacto) */}
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase mb-2 text-center">Cargas de Entrenamiento</p>
              <div className="grid grid-cols-4 gap-2">
                {[90, 85, 80, 75].map(pct => {
                  const pctData = result.percentages.find((p: any) => p.pct === pct);
                  return (
                    <div key={pct} className="bg-slate-950/50 border border-slate-800 p-2 rounded-lg text-center">
                      <div className="text-[9px] text-red-500 font-bold">{pct}%</div>
                      <div className="text-sm font-bold text-white">{pctData?.val}<span className="text-[8px] text-slate-500">kg</span></div>
                    </div>
                  );
                })}
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <Trophy className="w-3 h-3" /> Máximo Potencial Mecánico
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Calculadora de 1RM
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
          "Conoce tu límite sin cruzarlo. Fuerza de precisión para atletas inteligentes."
        </p>
      </header>

      {/* GRID PRINCIPAL */}
      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        
        {/* COLUMNA FORMULARIO */}
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculate1RM} noValidate className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label htmlFor="weight" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Dumbbell className="w-3 h-3 text-red-500" /> Peso Levantado (kg)
                  </label>
                  <input
                    id="weight" type="number" value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    className={`w-full bg-slate-950 border ${errors.weight ? 'border-red-500' : 'border-slate-800'} rounded-2xl py-6 px-6 text-2xl text-white outline-none focus:border-red-500 transition-all font-black`}
                    placeholder="100"
                  />
                  {errors.weight && <p className="text-red-500 text-[10px] font-bold italic">{errors.weight}</p>}
                </div>

                <div className="space-y-3">
                  <label htmlFor="reps" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Activity className="w-3 h-3 text-red-500" /> Repeticiones (al fallo)
                  </label>
                  <input
                    id="reps" type="number" value={formData.reps}
                    onChange={(e) => setFormData({...formData, reps: e.target.value})}
                    className={`w-full bg-slate-950 border ${errors.reps ? 'border-red-500' : 'border-slate-800'} rounded-2xl py-6 px-6 text-2xl text-white outline-none focus:border-red-500 transition-all font-black`}
                    placeholder="5"
                  />
                  {errors.reps && <p className="text-red-500 text-[10px] font-bold italic">{errors.reps}</p>}
                </div>
              </div>

              <button type="submit" className="w-full bg-red-500 hover:bg-red-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg active:scale-[0.98]">
                <Target className="w-6 h-6" /> Estimar Mi Fuerza Máxima
              </button>
            </form>
          </div>
        </section>

        {/* COLUMNA RESULTADOS */}
        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center">
              <p className="text-red-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Tu 1RM Estimado</p>
              <div className="text-7xl font-black text-white italic tracking-tighter mb-4">
                {result ? result.oneRM : '--'} <span className="text-2xl text-slate-500">kg</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                  <div className="text-[8px] font-black text-slate-600 uppercase mb-1 tracking-widest">Brzycki</div>
                  <div className="text-lg font-black text-white italic">{result?.brzycki || '--'}kg</div>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                  <div className="text-[8px] font-black text-slate-600 uppercase mb-1 tracking-widest">Epley</div>
                  <div className="text-lg font-black text-white italic">{result?.epley || '--'}kg</div>
                </div>
              </div>

              {/* ============================================
                  SHARE BUTTONS - Solo en versión completa
                  ============================================ */}
              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center shadow-lg"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center shadow-lg"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-red-500 text-red-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mi 1RM en Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center shadow-lg"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          {/* ============================================
              EMBED WIDGET - Solo en versión completa
              ============================================ */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-red-500" /> Widget para tu Web de Fuerza
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-red-500/50 focus:outline-none resize-none mb-3 cursor-pointer" />
            <button onClick={() => copyToClipboard(embedSnippet, 'embed')} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest border border-slate-700">
              {copyStatus === 'copied' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copyStatus === 'copied' ? 'CÓDIGO COPIADO' : 'COPIAR CÓDIGO EMBED'}
            </button>
          </div>
        </aside>
      </div>

      {/* ============================================
          PORCENTAJES - Siempre visible si hay resultado
          ============================================ */}
      {result && (
        <section className="mb-20">
           <h3 className="text-center text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Porcentajes de Entrenamiento Basados en tu 1RM</h3>
           <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
              {result.percentages.map((p: any) => (
                <div key={p.pct} className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl text-center group hover:border-red-500/30 transition-all">
                  <div className="text-[10px] font-black text-red-500 mb-1">{p.pct}%</div>
                  <div className="text-xl font-black text-white italic">{p.val}<span className="text-[8px] text-slate-500 ml-1">kg</span></div>
                </div>
              ))}
           </div>
        </section>
      )}

      {/* ============================================
          ARTÍCULOS EDUCATIVOS - Solo en versión completa
          ============================================ */}
      <article className="prose prose-invert prose-slate max-w-none space-y-16">
        <section className="bg-slate-900/30 border border-slate-800 rounded-[40px] p-8 md:p-12">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-4">
            <Info className="w-8 h-8 text-red-500" /> ¿Qué es el 1RM y por qué no deberías probarlo cada semana?
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                El **1RM (Una Repetición Máxima)** es la mayor cantidad de peso que puedes levantar en un ejercicio específico para una sola repetición manteniendo una técnica impecable. Es el indicador definitivo de tu **fuerza absoluta**.
              </p>
              <p>
                Aunque conocer tu 1RM es vital para programar tus entrenamientos, probarlo de forma real (llegando al límite) supone un estrés altísimo para el sistema nervioso central y un riesgo elevado de lesión. Por eso, los entrenadores profesionales utilizamos calculadoras de estimación basadas en fórmulas como las de **Brzycki o Epley**. Estas fórmulas permiten predecir tu 1RM a partir de un peso que puedas manejar entre 2 y 12 repeticiones, ofreciendo una precisión del 95-98% sin poner en riesgo tus articulaciones.
              </p>
              <h3 className="text-xl font-bold text-white italic text-left">Fórmula de Brzycki: El Estándar de Oro</h3>
              <p>
                Matt Brzycki desarrolló esta fórmula en 1993, y sigue siendo la más utilizada en gimnasios de todo el mundo. Es especialmente precisa cuando el número de repeticiones realizadas es bajo (menos de 8-10 reps).
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-red-500 italic mb-4 uppercase text-center">Cómo interpretar los porcentajes</h3>
              {[
                { t: "90-95% 1RM", d: "Fuerza máxima. Rangos de 1-3 repeticiones." },
                { t: "80-85% 1RM", d: "Fuerza-Hipertrofia. El rango ideal para ganar potencia." },
                { t: "70-75% 1RM", d: "Hipertrofia pura. Rangos de 8-12 repeticiones." },
                { t: "50-60% 1RM", d: "Resistencia muscular o calentamiento dinámico." }
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
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Consejos para una estimación precisa</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Fallo Técnico, no Muscular", text: "Para que la calculadora sea exacta, debes introducir las repeticiones que has hecho hasta el fallo técnico (cuando la técnica se degrada), no hasta que la barra se te caiga encima." },
              { title: "Rango de Repeticiones", text: "Evita usar series de más de 12 repeticiones para estimar tu 1RM. Cuantas más repeticiones haces, más entra en juego la resistencia muscular y menos precisa es la fórmula de fuerza pura." },
              { title: "Ejercicios Multiarticulares", text: "Usa esta herramienta principalmente para grandes levantamientos como Press de Banca, Sentadilla, Peso Muerto y Press Militar. En ejercicios de aislamiento, el 1RM no es una métrica relevante." }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl group hover:border-red-500/40 transition-all">
                <h3 className="text-red-500 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-t from-red-500/10 to-transparent border border-red-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Lleva tu fuerza al siguiente nivel</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            La Calculadora de 1RM de Sporvit no es solo una cifra de vanidad; es tu herramienta de programación más valiosa. Si tu programa dice "3x5 al 80%", ahora sabes exactamente cuántos kilos poner en la barra. Revisa tu 1RM estimado cada 4-6 semanas para ajustar tus cargas y asegurar que estás aplicando una sobrecarga progresiva real. Recuerda: la fuerza es una habilidad que se construye con paciencia, datos y una técnica impecable.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Fórmula Brzycki", "Fórmula Epley", "Programación de Fuerza"].map((tag, i) => (
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