"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Flame, User, Activity, Scale, Ruler, Zap, ShieldAlert, ArrowRight, Share2, Brain
} from 'lucide-react';

export default function GEBCalculator() {
  const [formData, setFormData] = useState({ gender: 'male', age: '', weight: '', height: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<number | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const calculateGEB = (e: React.FormEvent) => {
    e.preventDefault();
    const { age, weight, height, gender } = formData;
    const A = parseFloat(age), W = parseFloat(weight), H = parseFloat(height);
    
    if (!A || A < 15) { setErrors({ age: "Edad mínima 15 años" }); return; }
    if (!W || W < 30) { setErrors({ weight: "Peso no válido" }); return; }
    if (!H || H < 100) { setErrors({ height: "Altura no válida" }); return; }
    setErrors({});

    // FÓRMULA MIFFLIN-ST JEOR
    let geb = (10 * W) + (6.25 * H) - (5 * A);
    geb = gender === 'male' ? geb + 5 : geb - 161;

    setResult(Math.round(geb));
  };

  const shareText = useMemo(() => result ? `🔥 Mi Gasto Energético Basal (GEB) es de ${result} kcal. ¡Calcula tu metabolismo en Sporvit!` : "", [result]);
  const embedSnippet = useMemo(() => `<iframe src="${currentUrl}" width="100%" height="900px" frameborder="0" style="border-radius:24px; overflow:hidden;" title="Calculadora GEB Sporvit"></iframe>`, [currentUrl]);

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
          <Brain className="w-3 h-3" /> Bioquímica Metabólica
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Calculadora de Gasto Energético Basal (GEB)
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
          "Tu metabolismo base es el motor de tu existencia. Conócelo para dominar tu nutrición."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateGEB} noValidate className="space-y-8">
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'age', label: 'Edad', icon: Activity, placeholder: '25' },
                  { id: 'weight', label: 'Peso (kg)', icon: Scale, placeholder: '75' },
                  { id: 'height', label: 'Altura (cm)', icon: Ruler, placeholder: '175' }
                ].map((input) => (
                  <div key={input.id} className="space-y-2">
                    <label htmlFor={input.id} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <input.icon className="w-3 h-3 text-emerald-500" /> {input.label}
                    </label>
                    <input id={input.id} type="number" value={(formData as any)[input.id]} onChange={(e) => setFormData({...formData, [input.id]: e.target.value})} className={`w-full bg-slate-950 border ${errors[input.id] ? 'border-red-500' : 'border-slate-800'} rounded-xl py-4 px-5 text-white outline-none focus:border-emerald-500 font-bold`} />
                    {errors[input.id] && <p className="text-red-500 text-[10px] font-bold">{errors[input.id]}</p>}
                  </div>
                ))}
              </div>

              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg active:scale-[0.98]">
                <Calculator className="w-6 h-6" /> Obtener GEB
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center">
              <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Gasto Metabólico en Reposo</p>
              <div className="text-7xl font-black text-white italic tracking-tighter">
                {result || '--'} <span className="text-2xl text-slate-500 ml-1">kcal</span>
              </div>
              
              <div className="mt-8 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl text-xs text-slate-400 italic">
                Este es el número de calorías que quemas simplemente por existir, sin contar ninguna actividad física.
              </div>

              {result && (
                <div className="mt-8 pt-8 border-t border-slate-800 grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-emerald-500 text-emerald-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mi GEB en Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          {/* EMBED CODE BLOCK */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-emerald-500" /> Inserta esta herramienta en tu Blog
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
            <Flame className="w-8 h-8 text-emerald-500" /> ¿Qué es el Gasto Energético Basal (GEB)?
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                El **Gasto Energético Basal (GEB)**, a menudo intercambiado con la Tasa Metabólica Basal (TMB), representa la cantidad mínima de energía (calorías) que tu cuerpo consume para mantener sus funciones vitales básicas en reposo absoluto, en un estado de vigilia y en una temperatura ambiental neutra.
              </p>
              <p>
                Este gasto cubre procesos involuntarios como la **respiración**, la **circulación sanguínea**, la regulación térmica, la síntesis de nuevas células y el funcionamiento del cerebro y otros órganos. Sorprendentemente, el GEB representa entre el **60% y el 75%** del gasto energético total diario de la mayoría de las personas sedentarias.
              </p>
              <h3 className="text-xl font-bold text-white italic">La Fórmula de Mifflin-St Jeor</h3>
              <p>
                Nuestra calculadora utiliza la ecuación de **Mifflin-St Jeor**, introducida en 1990. Actualmente, es considerada la más precisa para estimar el GEB en la población moderna, superando a la clásica de Harris-Benedict, especialmente en individuos con sobrepeso o mucha masa muscular, ya que ajusta de forma más eficiente los coeficientes de peso y altura.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center space-y-4">
              <h3 className="text-xl font-bold text-emerald-500 italic mb-4 uppercase text-center">Factores que Afectan tu GEB</h3>
              {[
                { t: "Masa Muscular", d: "El músculo es metabólicamente activo. A más músculo, mayor GEB." },
                { t: "Edad", d: "El metabolismo tiende a disminuir un 2-3% por década tras los 20 años." },
                { t: "Genética", d: "Tu herencia biológica determina tu velocidad metabólica base." },
                { t: "Género", d: "Los hombres suelen tener un GEB un 5-10% superior debido a la masa magra." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                   <Zap className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                   <div>
                     <div className="font-black text-xs text-white uppercase">{item.t}</div>
                     <div className="text-[10px] text-slate-500 font-bold">{item.d}</div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Cómo Usar este Dato en tu Plan</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Nunca comas menos que tu GEB", text: "Un error común es bajar las calorías por debajo del metabolismo basal. Esto puede provocar una ralentización metabólica severa, fatiga extrema y problemas hormonales a largo plazo." },
              { title: "Base para el TDEE", text: "Tu GEB es el cimiento. Para saber tus calorías totales, debes multiplicar este número por tu factor de actividad (sedentario, moderado, intenso)." },
              { title: "Optimización Metabólica", text: "Si quieres aumentar tu GEB, la mejor estrategia es el entrenamiento de fuerza. Ganar 2kg de músculo puede quemar calorías extra incluso mientras duermes." }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl group hover:border-emerald-500/40 transition-all">
                <h3 className="text-emerald-500 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-t from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Mitos del Metabolismo "Lento"</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            Mucha gente cree tener un metabolismo lento por genética. Sin embargo, la ciencia muestra que el GEB de dos personas con el mismo peso y altura rara vez varía más de un 10%. La diferencia real en el gasto calórico diario suele estar en el **NEAT** (actividad no deportiva como caminar o estar de pie) y en el cumplimiento de la dieta. Utiliza esta calculadora como una herramienta de empoderamiento para tomar el control de tu energía y alcanzar tus objetivos físicos con inteligencia.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Protocolo Mifflin-St Jeor", "Metabolismo de Precisión", "SEO & A11Y Optimized"].map((tag, i) => (
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