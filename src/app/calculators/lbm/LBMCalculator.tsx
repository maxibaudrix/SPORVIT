"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Scale, Ruler, Activity, Zap, ShieldAlert, Share2, Target, Award, User
} from 'lucide-react';

export default function LBMCalculator() {
  const [formData, setFormData] = useState({ gender: 'male', weight: '', height: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const calculateLBM = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(formData.weight);
    const h = parseFloat(formData.height);
    
    if (!w || w < 30) { setErrors({ weight: "Peso no válido" }); return; }
    if (!h || h < 100) { setErrors({ height: "Altura no válida" }); return; }
    setErrors({});

    // FÓRMULA DE BOER
    let lbm = 0;
    if (formData.gender === 'male') {
      lbm = (0.407 * w) + (0.267 * h) - 19.2;
    } else {
      lbm = (0.252 * w) + (0.473 * h) - 48.3;
    }

    const fatMass = w - lbm;
    const lbmPct = (lbm / w) * 100;

    setResult({
      lbm: lbm.toFixed(1),
      fatMass: fatMass.toFixed(1),
      pct: lbmPct.toFixed(1),
      total: w
    });

    if ((window as any).gtag) {
      (window as any).gtag('event', 'calculate_lbm', { lbm_value: lbm });
    }
  };

  // SHARE TEXT: Incluyendo resultados reales
  const shareText = useMemo(() => {
    if (!result) return "";
    return `💪 ¡He calculado mi Masa Magra (LBM) en Sporvit!\n\nMasa Magra: ${result.lbm} kg (${result.pct}%)\nMasa Grasa: ${result.fatMass} kg\n\nAnaliza tu composición corporal aquí:`;
  }, [result]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="900px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Calculadora LBM Sporvit"></iframe>`,
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
          <Activity className="w-3 h-3" /> Análisis de Composición Vital
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Calculadora de Masa Corporal Magra (LBM)
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
          "No eres solo un número en la báscula. Descubre cuánto de tu peso es potencia pura."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateLBM} noValidate className="space-y-8">
              <div className="flex gap-4 p-1 bg-slate-950 rounded-2xl border border-slate-800">
                {(['male', 'female'] as const).map((g) => (
                  <button
                    key={g} type="button" onClick={() => setFormData({...formData, gender: g})}
                    className={`flex-1 py-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
                      formData.gender === g ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    <User className="w-4 h-4" /> {g === 'male' ? 'HOMBRE' : 'MUJER'}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label htmlFor="weight" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Scale className="w-3 h-3 text-emerald-500" /> Peso Total (kg)
                  </label>
                  <input
                    id="weight" type="number" value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    className={`w-full bg-slate-950 border ${errors.weight ? 'border-red-500' : 'border-slate-800'} rounded-2xl py-6 px-6 text-2xl text-white outline-none focus:border-emerald-500 transition-all font-black`}
                    placeholder="80"
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
                    placeholder="175"
                  />
                  {errors.height && <p className="text-red-500 text-[10px] font-bold italic">{errors.height}</p>}
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg active:scale-[0.98]">
                <Calculator className="w-6 h-6" /> Calcular Masa Magra
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="text-center mb-8 border-b border-slate-800 pb-8">
                <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Tu Masa Magra (LBM)</p>
                <div className="text-7xl font-black text-white italic tracking-tighter">
                  {result ? result.lbm : '--'} <span className="text-2xl text-slate-500">kg</span>
                </div>
                <div className="mt-2 text-sm font-black text-emerald-400/80 italic">
                  Representa el {result?.pct || '--'}% de tu peso total
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-5 bg-slate-950/50 border border-slate-800 rounded-2xl group transition-all">
                  <div>
                    <div className="text-[10px] font-black uppercase text-slate-400">Masa Grasa Estimada</div>
                    <div className="text-[9px] text-slate-600 font-bold italic">Tejido adiposo total</div>
                  </div>
                  <div className="text-2xl font-black text-white italic">{result?.fatMass || '--'} <span className="text-xs">kg</span></div>
                </div>
              </div>

              {/* SHARE */}
              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center shadow-lg"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center shadow-lg"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-emerald-500 text-emerald-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mi Masa Magra Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center shadow-lg"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-emerald-500" /> Widget Profesional de Composición
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
            <Info className="w-8 h-8 text-emerald-500" /> Masa Corporal Magra (LBM): Más allá de la Báscula
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                La **Masa Corporal Magra (Lean Body Mass)** es todo el peso de tu cuerpo que no es grasa. Incluye tus músculos, huesos, órganos, agua corporal y tejido conectivo. A diferencia del peso total, la LBM es el componente metabólicamente activo de tu cuerpo; es el "motor" que quema calorías incluso cuando duermes.
              </p>
              <p>
                Para cualquier deportista, la LBM es una métrica mucho más importante que el IMC o el peso total. Conocer tu masa magra te permite calcular con precisión tus necesidades de proteína y ajustar tus calorías para asegurar que, si estás perdiendo peso, sea tejido graso y no preciada masa muscular.
              </p>
              <h3 className="text-xl font-bold text-white italic text-left">Fórmula de Boer: El Estándar de Oro</h3>
              <p>
                Nuestra calculadora utiliza la **ecuación de Boer**, validada como una de las formas más precisas de estimar la masa magra basándose únicamente en la altura y el peso. Aunque el método más exacto es un escaneo DEXA, la fórmula de Boer ofrece una correlación extremadamente alta para el seguimiento diario del progreso.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-emerald-500 italic mb-4 uppercase text-center">¿Qué incluye la LBM?</h3>
              {[
                { t: "Masa Muscular", d: "El principal motor del rendimiento físico." },
                { t: "Densidad Ósea", d: "La estructura que soporta tus levantamientos." },
                { t: "Órganos Vitales", d: "Tejidos con el mayor gasto metabólico por kilo." },
                { t: "Agua Corporal", d: "Esencial para la hidratación y volumen celular." }
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
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Por qué tu LBM determina tu éxito</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Metabolismo Basal", text: "Cada kilo de masa magra quema significativamente más energía en reposo que un kilo de grasa. Aumentar tu LBM es la forma más efectiva de 'acelerar' tu metabolismo de forma permanente." },
              { title: "Recomposición Corporal", text: "Al monitorizar tu LBM, puedes saber si tu plan de nutrición está funcionando. Si pierdes peso pero tu LBM se mantiene estable, estás logrando una pérdida de grasa exitosa." },
              { title: "Rendimiento y Fuerza", text: "Existe una correlación directa entre la sección transversal del músculo (parte de la LBM) y el potencial de fuerza. Más masa magra suele traducirse en mayores levantamientos." }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl group hover:border-emerald-500/40 transition-all">
                <h3 className="text-emerald-500 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-t from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Optimiza tu Potencial</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            Utiliza este dato para ajustar tu ingesta de proteínas (recomendamos entre 1.8g y 2.2g por kilo de masa magra para mantenimiento). Recuerda que la masa magra es un tejido difícil de construir pero fácil de proteger con el entrenamiento de fuerza adecuado y una nutrición de precisión. No te obsesiones con el peso total; enfócate en mejorar tu porcentaje de masa magra y verás cómo tu estética y rendimiento se transforman radicalmente.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Ecuación de Boer", "Métrica de Recomposición", "Masa Muscular"].map((tag, i) => (
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