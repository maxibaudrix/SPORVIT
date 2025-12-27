"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Scale, Zap, ShieldAlert, ArrowRight, Share2, Target, Award, Brain, Utensils
} from 'lucide-react';

const PROTEIN_RANGES = [
  { id: 'sedentary', name: 'Salud General / Sedentario', factor: 1.0, desc: 'Mantenimiento básico de funciones vitales.' },
  { id: 'endurance', name: 'Atleta de Resistencia (Cardio)', factor: 1.4, desc: 'Reparación tras sesiones aeróbicas largas.' },
  { id: 'hypertrophy', name: 'Ganancia Muscular (Pesas)', factor: 1.8, desc: 'Rango óptimo para síntesis de proteína muscular.' },
  { id: 'cutting', name: 'Definición (Pérdida de Grasa)', factor: 2.2, desc: 'Máxima protección del músculo en déficit.' }
];

export default function ProteinCalculator() {
  const [formData, setFormData] = useState({ weight: '', goal: 'hypertrophy' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const calculateProtein = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(formData.weight);
    const selectedRange = PROTEIN_RANGES.find(r => r.id === formData.goal);
    
    if (!w || w < 30 || w > 300) {
      setErrors({ weight: "Introduce un peso válido entre 30 y 300 kg" });
      return;
    }
    setErrors({});

    const totalProtein = Math.round(w * (selectedRange?.factor || 1.8));
    const perMeal = Math.round(totalProtein / 4); // Basado en 4 comidas al día

    setResult({
      total: totalProtein,
      perMeal,
      factor: selectedRange?.factor,
      goalName: selectedRange?.name
    });

    if ((window as any).gtag) {
      (window as any).gtag('event', 'calculate_protein', { goal: formData.goal, total: totalProtein });
    }
  };

  const shareText = useMemo(() => 
    result ? `💪 Mi objetivo de proteína diaria es de ${result.total}g. ¡Calcula el tuyo con Sporvit!` : "", 
  [result]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="900px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Calculadora Proteínas Sporvit"></iframe>`,
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <Zap className="w-3 h-3" /> Síntesis Proteica Avanzada
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Calculadora de Ingesta de Proteínas
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
          "La proteína no es un suplemento; es el cimiento de tu arquitectura física."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateProtein} noValidate className="space-y-8">
              <div className="space-y-3">
                <label htmlFor="weight" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Scale className="w-3 h-3 text-blue-400" /> Peso Corporal (kg)
                </label>
                <input
                  id="weight" type="number" value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  className={`w-full bg-slate-950 border ${errors.weight ? 'border-red-500' : 'border-slate-800'} rounded-2xl py-6 px-6 text-3xl text-white outline-none focus:border-blue-400 transition-all font-black`}
                  placeholder="80" aria-invalid={!!errors.weight}
                />
                {errors.weight && <p className="text-red-500 text-[10px] font-bold flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> {errors.weight}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Selecciona tu Perfil de Entrenamiento</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PROTEIN_RANGES.map((range) => (
                    <button
                      key={range.id} type="button" onClick={() => setFormData({...formData, goal: range.id})}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        formData.goal === range.id 
                        ? 'bg-blue-500 border-blue-500 text-slate-950 shadow-lg' 
                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-blue-400/50'
                      }`}
                    >
                      <div className="text-[10px] font-black uppercase mb-1">{range.name}</div>
                      <div className={`text-[9px] font-bold leading-tight ${formData.goal === range.id ? 'text-slate-800' : 'text-slate-600'}`}>{range.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-500 hover:bg-blue-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)] uppercase tracking-tighter flex items-center justify-center gap-4 text-lg active:scale-[0.98]">
                <Calculator className="w-6 h-6" /> Obtener Mi Requerimiento
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
              <div className="text-center mb-8 border-b border-slate-800 pb-8">
                <p className="text-blue-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Gramos Diarios Recomendados</p>
                <div className="text-7xl font-black text-white italic tracking-tighter">
                  {result ? result.total : '--'} <span className="text-2xl text-slate-500">g</span>
                </div>
                <div className="mt-2 text-xs font-bold text-slate-400 italic">
                  Ratio: {result ? result.factor : '--'}g por cada kilo de peso
                </div>
              </div>

              <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 mb-8 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-black uppercase text-slate-400">Por comida</div>
                    <div className="text-[9px] text-slate-600 font-bold">Dividido en 4 tomas</div>
                  </div>
                </div>
                <div className="text-3xl font-black text-white italic">{result?.perMeal || '--'} <span className="text-xs">g</span></div>
              </div>

              {/* SHARE */}
              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center shadow-lg"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center shadow-lg"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-blue-500 text-blue-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mis Proteínas en Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center shadow-lg"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-blue-400" /> Inserta este Widget
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-blue-400/50 focus:outline-none resize-none mb-3 cursor-pointer" />
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
            <Award className="w-8 h-8 text-blue-400" /> Proteína: El Macro Maestro de la Composición Corporal
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                La proteína es el único macronutriente capaz de construir y reparar tejidos. En el contexto deportivo, la ingesta proteica determina si el estímulo del entrenamiento se traduce en **hipertrofia** (ganancia muscular) o simplemente en fatiga acumulada.
              </p>
              <p>
                Nuestra calculadora utiliza los estándares más rigurosos de la nutrición deportiva. Mientras que la RDA general recomienda 0.8g/kg para evitar deficiencias, la ciencia moderna demuestra que para individuos activos, esta cifra es insuficiente. Un rango de **1.6g a 2.2g por kilo** es el "punto dulce" para optimizar la masa magra sin desperdiciar recursos.
              </p>
              <h3 className="text-xl font-bold text-white italic">Efecto Térmico y Saciedad</h3>
              <p>
                Más allá de construir músculo, la proteína es tu mejor aliada para perder grasa. Tiene el mayor **Efecto Térmico de los Alimentos (TEF)**, lo que significa que tu cuerpo gasta hasta un 30% de las calorías de la proteína solo para digerirla. Además, es el nutriente que más señales de saciedad envía al cerebro, reduciendo el hambre en dietas hipocalóricas.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-xl font-bold text-blue-400 italic mb-4 uppercase text-center">Rangos según Objetivo</h3>
              {[
                { t: "Salud Sedentaria", v: "0.8 - 1.2 g/kg", d: "Mínimo biológico recomendado." },
                { t: "Resistencia (Cardio)", v: "1.2 - 1.4 g/kg", d: "Repara el daño por volumen aeróbico." },
                { t: "Fuerza / Hipertrofia", v: "1.6 - 2.0 g/kg", d: "Maximiza la síntesis proteica." },
                { t: "Definición Agresiva", v: "2.2 - 2.5 g/kg", d: "Evita la pérdida muscular en déficit." }
              ].map((item, i) => (
                <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-black text-xs text-white uppercase">{item.t}</span>
                    <span className="font-black text-blue-400 italic">{item.v}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Calidad y Distribución</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Valor Biológico", text: "No todas las proteínas son iguales. Las fuentes de origen animal suelen tener un perfil de aminoácidos completo. Si eres vegano, combina cereales y legumbres para asegurar que obtienes toda la leucina necesaria." },
              { title: "El Umbral de Leucina", text: "Para 'encender' la maquinaria de construcción muscular, cada comida debería tener al menos 20-30g de proteína de alta calidad. Esto asegura que superas el umbral de leucina necesario para la síntesis." },
              { title: "Proteína Antes de Dormir", text: "Consumir una fuente de digestión lenta (como caseína o lácteos) antes de dormir puede mejorar la recuperación nocturna y mantener un balance de nitrógeno positivo durante el ayuno." }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl group hover:border-blue-500/40 transition-all">
                <h3 className="text-blue-400 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-t from-blue-500/10 to-transparent border border-blue-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Mitos sobre el Daño Renal</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            Es un mito persistente que las dietas altas en proteína dañan los riñones en personas sanas. La evidencia científica actual demuestra que los riñones sanos se adaptan perfectamente a ingestas elevadas sin pérdida de función. Sin embargo, si tienes una patología renal previa, consulta siempre con un médico. Para el resto de atletas, una ingesta alta de proteína es la herramienta más segura y efectiva para transformar el cuerpo y mejorar el rendimiento deportivo.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Protocolo ISSN", "Optimizado para Hipertrofia", "A11Y & SEO Compliant"].map((tag, i) => (
              <span key={i} className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-widest">
                {tag}
              </span>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}