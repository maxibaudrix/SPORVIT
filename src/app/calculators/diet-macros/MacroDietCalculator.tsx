"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Flame, Scale, Target, Zap, ShieldAlert, ArrowRight, Share2, Brain, Salad, Apple
} from 'lucide-react';

const DIET_PROTOCOLS = {
  balanced: { name: 'Equilibrada (OMS)', p: 20, c: 50, f: 30, desc: 'Recomendación estándar de salud.' },
  mediterranean: { name: 'Mediterránea', p: 15, c: 50, f: 35, desc: 'Alta en grasas saludables y fibra.' },
  paleo: { name: 'Paleolítica', p: 30, c: 20, f: 50, desc: 'Enfoque en proteínas y grasas naturales.' },
  keto: { name: 'Cetogénica (Keto)', p: 25, c: 5, f: 70, desc: 'Mínimo carbohidrato para cetosis.' },
  zone: { name: 'Dieta de la Zona', p: 30, c: 40, f: 30, desc: 'Control hormonal 40-30-30.' },
  high_protein: { name: 'Alta Proteína', p: 40, c: 35, f: 25, desc: 'Máxima preservación muscular.' }
};

export default function MacroDietCalculator() {
  const [formData, setFormData] = useState({ calories: '', dietType: 'mediterranean' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const calculateMacros = (e: React.FormEvent) => {
    e.preventDefault();
    const kcal = parseFloat(formData.calories);
    const diet = (DIET_PROTOCOLS as any)[formData.dietType];

    if (!kcal || kcal < 800 || kcal > 10000) {
      setErrors({ calories: "Introduce calorías entre 800 y 10,000" });
      return;
    }
    setErrors({});

    const pG = Math.round((kcal * (diet.p / 100)) / 4);
    const cG = Math.round((kcal * (diet.c / 100)) / 4);
    const fG = Math.round((kcal * (diet.f / 100)) / 9);

    setResult({
      p: pG, c: cG, f: fG,
      kcal,
      name: diet.name,
      dist: { p: diet.p, c: diet.c, f: diet.f }
    });

    if ((window as any).gtag) {
      (window as any).gtag('event', 'calculate_diet_macros', { diet: diet.name });
    }
  };

  // SHARE TEXT CORREGIDO: Con resultados
  const shareText = useMemo(() => {
    if (!result) return "";
    return `🥗 Mis macros para dieta ${result.name} (${result.kcal} kcal):\n\nProteína: ${result.p}g\nCarbohidratos: ${result.c}g\nGrasas: ${result.f}g\n\nCalcula los tuyos en Sporvit:`;
  }, [result]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Calculadora Macros Dieta Sporvit"></iframe>`,
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
          <Apple className="w-3 h-3" /> Bio-Nutrición Especializada
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Calculadora de Macronutrientes por Dieta
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
          "Diferentes objetivos requieren diferentes estrategias. Adapta tus macros a tu filosofía dietética."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateMacros} noValidate className="space-y-8">
              <div className="space-y-3">
                <label htmlFor="calories" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Flame className="w-3 h-3 text-emerald-500" /> Calorías Diarias (TDEE)
                </label>
                <input
                  id="calories" type="number" value={formData.calories}
                  onChange={(e) => setFormData({...formData, calories: e.target.value})}
                  className={`w-full bg-slate-950 border ${errors.calories ? 'border-red-500' : 'border-slate-800'} rounded-2xl py-6 px-6 text-3xl text-white outline-none focus:border-emerald-500 transition-all font-black`}
                  placeholder="2400"
                />
                {errors.calories && <p className="text-red-500 text-[10px] font-bold italic">{errors.calories}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Salad className="w-3 h-3 text-emerald-500" /> Protocolo Dietético
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(DIET_PROTOCOLS).map(([key, value]) => (
                    <button
                      key={key} type="button" onClick={() => setFormData({...formData, dietType: key})}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        formData.dietType === key 
                        ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-lg' 
                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-emerald-500/50'
                      }`}
                    >
                      <div className="text-[10px] font-black uppercase mb-1">{value.name}</div>
                      <div className={`text-[9px] font-bold leading-tight ${formData.dietType === key ? 'text-slate-800' : 'text-slate-600'}`}>{value.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg active:scale-[0.98]">
                <Calculator className="w-6 h-6" /> Obtener Reparto de Macros
              </button>
            </form>
          </div>
        </section>

        {/* RESULTADOS */}
        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-8 text-center">Plan para Dieta {result?.name}</h2>
              
              <div className="space-y-4 mb-8">
                {[
                  { l: 'Proteínas', v: result?.p, p: result?.dist.p, c: 'bg-red-500' },
                  { l: 'Carbohidratos', v: result?.c, p: result?.dist.c, c: 'bg-blue-500' },
                  { l: 'Grasas', v: result?.f, p: result?.dist.f, c: 'bg-orange-500' }
                ].map((item, i) => (
                  <div key={i} className="bg-slate-950/50 border border-slate-800 p-5 rounded-2xl flex justify-between items-center group transition-all">
                    <div>
                      <div className="text-[10px] font-black uppercase text-slate-300 mb-1">{item.l}</div>
                      <div className="flex items-center gap-2">
                         <div className={`h-1.5 w-12 rounded-full ${item.c} opacity-30`} />
                         <span className="text-[9px] text-slate-600 font-bold">{item.p}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-white italic">{item.v || '--'}<span className="text-xs text-slate-500 ml-1">g</span></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* SHARE */}
              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center shadow-lg"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center shadow-lg"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-emerald-500 text-emerald-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mis Macros Dieta en Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center shadow-lg"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-emerald-500" /> Inserta esta herramienta
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
            <Info className="w-8 h-8 text-emerald-500" /> Macros por Dieta: ¿Cuál elegir?
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                No existe una dieta universal perfecta. Cada protocolo dietético altera el reparto de **macronutrientes** para buscar un efecto metabólico o fisiológico concreto. Mientras que una persona puede florecer con una dieta alta en carbohidratos para el rendimiento deportivo, otra puede preferir un enfoque cetogénico por claridad mental o control del hambre.
              </p>
              <p>
                Nuestra calculadora te permite aplicar los porcentajes exactos de las dietas más famosas y científicamente validadas sobre tu presupuesto calórico total. Esto te saca de las conjeturas y te da números reales para empezar a planificar tus comidas hoy mismo.
              </p>
              <h3 className="text-xl font-bold text-white italic text-left">La Dieta Mediterránea</h3>
              <p>
                Considerada por muchos como la más saludable a largo plazo, prioriza las grasas monoinsaturadas (aceite de oliva, frutos secos) y mantiene los carbohidratos en un nivel moderado. Es excelente para la salud cardiovascular y la longevidad.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-emerald-500 italic mb-4 uppercase text-center">Resumen de Enfoques</h3>
              {[
                { t: "Keto", d: "Induce cetosis quemando grasa como combustible." },
                { t: "Paleo", d: "Enfocada en alimentos no procesados y alta proteína." },
                { t: "Zona", d: "Busca el equilibrio hormonal 40-30-30 en cada comida." },
                { t: "Equilibrada", d: "Siguiendo guías de la OMS para población general." }
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
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Entendiendo los Macronutrientes</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Densidad Calórica", text: "Recuerda que las grasas tienen 9 kcal por gramo, mientras que proteínas y carbohidratos tienen solo 4. Por eso, en dietas altas en grasa (Paleo/Keto), el volumen total de comida suele ser visualmente menor." },
              { title: "Adherencia es Éxito", text: "La mejor dieta del mundo no sirve si no puedes seguirla. Elige un protocolo que se alinee con tus gustos personales y estilo de vida, no solo con un objetivo a corto plazo." },
              { title: "Flexibilidad Metabólica", text: "Cambiar de protocolo puede ayudar a tu cuerpo a ser más eficiente usando diferentes fuentes de energía. No tengas miedo de experimentar bajo supervisión." }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl group hover:border-emerald-500/40 transition-all">
                <h3 className="text-emerald-500 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-t from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Tu nutrición, tus reglas</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            Utiliza esta calculadora como una base estructural. Una vez tengas tus gramos de P, C y F, asegúrate de cubrirlos con alimentos de alta calidad nutricional. La dieta no es solo una hoja de cálculo; es el combustible que determina tu salud, tu energía diaria y tu rendimiento en el gimnasio. En Sporvit, creemos en la nutrición basada en datos para obtener resultados reales.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Protocolos Científicos", "Nutrición Personalizada", "A11Y & SEO Optimized"].map((tag, i) => (
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