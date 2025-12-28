"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Flame, Scale, Target, Zap, ShieldAlert, ArrowRight, Share2, Brain, Percent, Activity
} from 'lucide-react';

export default function KatchMcArdleCalculator() {
  const [formData, setFormData] = useState({ weight: '', bodyFat: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const calculateKatch = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(formData.weight);
    const bf = parseFloat(formData.bodyFat);
    
    if (!w || w < 30) { setErrors({ weight: "Peso no válido" }); return; }
    if (!bf || bf < 3 || bf > 60) { setErrors({ bodyFat: "Grasa corporal no válida" }); return; }
    setErrors({});

    // 1. Calcular Masa Magra (LBM)
    const lbm = w * (1 - (bf / 100));

    // 2. FÓRMULA KATCH-MCARDLE: BMR = 370 + (21.6 * LBM)
    const bmr = 370 + (21.6 * lbm);

    setResult({
      bmr: Math.round(bmr),
      lbm: lbm.toFixed(1),
      weight: w,
      bodyFat: bf
    });

    if ((window as any).gtag) {
      (window as any).gtag('event', 'calculate_katch_mcardle', { bmr_val: bmr });
    }
  };

  // SHARE TEXT: Incluye resultados detallados
  const shareText = useMemo(() => {
    if (!result) return "";
    return `🔥 ¡He calculado mi Metabolismo Real en Sporvit!\n\nMetabolismo Basal (Katch-McArdle): ${result.bmr} kcal/día\nMasa Magra: ${result.lbm} kg\n\nCalcula el tuyo aquí:`;
  }, [result]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="900px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Calculadora Katch-McArdle Sporvit"></iframe>`,
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
          <Brain className="w-3 h-3" /> Fisiología Metabólica de Élite
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Calculadora Katch-McArdle
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
          "El músculo es el tejido más caro de mantener. Descubre cuánto consume tu masa magra."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateKatch} noValidate className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label htmlFor="weight" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Scale className="w-3 h-3 text-emerald-500" /> Peso Total (kg)
                  </label>
                  <input
                    id="weight" type="number" value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    className={`w-full bg-slate-950 border ${errors.weight ? 'border-red-500' : 'border-slate-800'} rounded-2xl py-6 px-6 text-2xl text-white outline-none focus:border-emerald-500 transition-all font-black`}
                    placeholder="85"
                  />
                  {errors.weight && <p className="text-red-500 text-[10px] font-bold italic">{errors.weight}</p>}
                </div>

                <div className="space-y-3">
                  <label htmlFor="bodyFat" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Percent className="w-3 h-3 text-emerald-500" /> Grasa Corporal (%)
                  </label>
                  <input
                    id="bodyFat" type="number" value={formData.bodyFat}
                    onChange={(e) => setFormData({...formData, bodyFat: e.target.value})}
                    className={`w-full bg-slate-950 border ${errors.bodyFat ? 'border-red-500' : 'border-slate-800'} rounded-2xl py-6 px-6 text-2xl text-white outline-none focus:border-emerald-500 transition-all font-black`}
                    placeholder="15"
                  />
                  {errors.bodyFat && <p className="text-red-500 text-[10px] font-bold italic">{errors.bodyFat}</p>}
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg active:scale-[0.98]">
                <Calculator className="w-6 h-6" /> Obtener Metabolismo Real
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
              <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Metabolismo Basal (BMR)</p>
              <div className="text-7xl font-black text-white italic tracking-tighter mb-4">
                {result ? result.bmr : '--'} <span className="text-2xl text-slate-500">kcal</span>
              </div>
              
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 mb-8 flex justify-between items-center">
                <div className="text-left">
                  <div className="text-[10px] font-black uppercase text-slate-400">Masa Magra Calculada</div>
                  <div className="text-[9px] text-slate-600 font-bold italic">Base biológica del cálculo</div>
                </div>
                <div className="text-3xl font-black text-white italic">{result?.lbm || '--'} <span className="text-xs">kg</span></div>
              </div>

              {/* SHARE */}
              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center shadow-lg"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center shadow-lg"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-emerald-500 text-emerald-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mi BMR Katch-McArdle&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center shadow-lg"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

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

      <article className="prose prose-invert prose-slate max-w-none space-y-16">
        <section className="bg-slate-900/30 border border-slate-800 rounded-[40px] p-8 md:p-12">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-4">
            <Info className="w-8 h-8 text-emerald-500" /> Katch-McArdle: La Fórmula Definitiva para el Atleta
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                A diferencia de fórmulas genéricas como Mifflin-St Jeor o Harris-Benedict, la **Fórmula de Katch-McArdle** ignora variables como la altura o el sexo biológico. ¿Por qué? Porque estas fórmulas tradicionales usan la altura y el sexo solo para "adivinar" cuánta masa magra tienes.
              </p>
              <p>
                Katch-McArdle va directamente a la fuente: la **Masa Corporal Magra (LBM)**. Una vez que conoces tu porcentaje de grasa corporal, puedes determinar exactamente cuántos kilos de tejido metabólicamente activo posees. Como el músculo es el tejido que consume la gran mayoría de tus calorías en reposo, esta fórmula ofrece una precisión inigualable para culturistas, atletas de fuerza y personas con composiciones corporales fuera del promedio.
              </p>
              <h3 className="text-xl font-bold text-white italic text-left">El Poder Metabólico del Músculo</h3>
              <p>
                El tejido muscular es metabólicamente costoso. Mantener un kilo de músculo requiere mucha más energía que mantener un kilo de tejido graso. Por ello, si tienes un porcentaje de grasa bajo y mucha musculatura, las calculadoras normales subestimarán tus necesidades calóricas. Katch-McArdle corrige este error dándole al músculo el protagonismo que merece.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-emerald-500 italic mb-4 uppercase text-center">Comparativa de Precisión</h3>
              {[
                { t: "Katch-McArdle", d: "Ideal para atletas que conocen su % de grasa." },
                { t: "Mifflin-St Jeor", d: "Estándar para población general (desconoce grasa)." },
                { t: "Harris-Benedict", d: "Fórmula clásica, tiende a sobreestimar en la actualidad." },
                { t: "Cunningham", d: "Similar a Katch, muy utilizada en nutrición deportiva." }
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
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Cómo optimizar tu tasa metabólica</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Entrenamiento de Fuerza", text: "La única forma de aumentar significativamente tu metabolismo basal es aumentando tu masa magra. El entrenamiento con pesas es la inversión metabólica más rentable a largo plazo." },
              { title: "Densidad Nutricional", text: "Tu metabolismo basal no es solo quemar energía; es reparar tejidos. Consumir suficiente proteína es vital para que tu LBM se mantenga y la fórmula de Katch siga siendo precisa." },
              { title: "Medición de Grasa", text: "Para que esta calculadora sea efectiva, necesitas un dato de grasa corporal fiable (DEXA, plicómetro o báscula de bioimpedancia de alta calidad). Un error del 5% en la grasa puede alterar el resultado en 100-150 kcal." }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl group hover:border-emerald-500/40 transition-all">
                <h3 className="text-emerald-500 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-t from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Tu motor biológico bajo control</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            La Calculadora Katch-McArdle de Sporvit te ofrece el dato más honesto sobre tu consumo energético básico. Utiliza este número como tu cimiento para calcular tu Gasto Energético Total (TDEE). Recuerda que conocer tu metabolismo basal es el primer paso para dominar tu composición corporal; te permite ajustar tus calorías con la confianza de que estás alimentando tu masa muscular y no tus reservas de grasa.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Fórmula Katch-McArdle", "Metabolismo Magro", "Masa Magra"].map((tag, i) => (
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