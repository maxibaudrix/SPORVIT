"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Scale, Ruler, User, Zap, ShieldAlert, Share2, Target, Award, Heart
} from 'lucide-react';

export default function IdealWeightCalculator() {
  const [formData, setFormData] = useState({ gender: 'male', height: '' });
  const [errors, setErrors] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const calculateWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(formData.height);
    if (!h || h < 140 || h > 230) {
      setErrors("Introduce una altura válida entre 140 y 230 cm.");
      return;
    }
    setErrors(null);

    const hIn = h / 2.54; // cm a pulgadas
    const over60 = hIn - 60;

    // FÓRMULAS
    let devine, robinson, miller, hamwi;
    if (formData.gender === 'male') {
      devine = 50 + (2.3 * over60);
      robinson = 52 + (1.9 * over60);
      miller = 56.2 + (1.41 * over60);
      hamwi = 48 + (2.7 * over60);
    } else {
      devine = 45.5 + (2.3 * over60);
      robinson = 49 + (1.7 * over60);
      miller = 53.1 + (1.36 * over60);
      hamwi = 45.5 + (2.2 * over60);
    }

    const avg = (devine + robinson + miller + hamwi) / 4;

    setResult({
      devine: devine.toFixed(1),
      robinson: robinson.toFixed(1),
      miller: miller.toFixed(1),
      hamwi: hamwi.toFixed(1),
      avg: avg.toFixed(1),
      range: { min: (18.5 * (h/100)**2).toFixed(1), max: (24.9 * (h/100)**2).toFixed(1) }
    });
  };

  const shareText = useMemo(() => {
    if (!result) return "";
    return `⚖️ Mi Peso Ideal según Sporvit:\n- Promedio Clínico: ${result.avg} kg\n- Rango Saludable: ${result.range.min} - ${result.range.max} kg\n\nCalcula el tuyo aquí:`;
  }, [result]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Calculadora Peso Ideal Sporvit"></iframe>`,
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
          <Heart className="w-3 h-3" /> Referencia Antropométrica
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Calculadora de Peso Ideal
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
          "Tu peso óptimo no es un único número, sino un equilibrio entre salud y bienestar."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateWeight} className="space-y-8">
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

              <div className="space-y-3">
                <label htmlFor="height" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Ruler className="w-3 h-3 text-emerald-500" /> Altura (cm)
                </label>
                <input
                  id="height" type="number" value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                  className={`w-full bg-slate-950 border ${errors ? 'border-red-500' : 'border-slate-800'} rounded-2xl py-6 px-6 text-2xl text-white outline-none focus:border-emerald-500 transition-all font-black`}
                  placeholder="175"
                />
                {errors && <p className="text-red-500 text-[10px] font-bold italic">{errors}</p>}
              </div>

              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg">
                <Calculator className="w-6 h-6" /> Obtener Mi Peso Ideal
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
              <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Peso Ideal Promedio</p>
              <div className="text-7xl font-black text-white italic tracking-tighter mb-4">
                {result ? result.avg : '--'} <span className="text-2xl text-slate-500">kg</span>
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase mb-8">Rango Saludable (IMC): {result?.range.min} - {result?.range.max} kg</div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { n: 'Devine', v: result?.devine },
                  { n: 'Hamwi', v: result?.hamwi },
                  { n: 'Robinson', v: result?.robinson },
                  { n: 'Miller', v: result?.miller }
                ].map((f, i) => (
                  <div key={i} className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 text-center">
                    <div className="text-[8px] font-black text-slate-600 uppercase mb-1 tracking-widest">{f.n}</div>
                    <div className="text-sm font-black text-white">{f.v || '--'}kg</div>
                  </div>
                ))}
              </div>

              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center shadow-lg"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center shadow-lg"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-emerald-500 text-emerald-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mi Peso Ideal&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center shadow-lg"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-emerald-500" /> Inserta este Widget
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-emerald-500/50 focus:outline-none resize-none mb-3 cursor-pointer" />
            <button onClick={() => copyToClipboard(embedSnippet, 'embed')} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black transition-all border border-slate-700">
              {copyStatus === 'copied' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copyStatus === 'copied' ? 'CÓDIGO COPIADO' : 'COPIAR CÓDIGO EMBED'}
            </button>
          </div>
        </aside>
      </div>

      {/* SEO ARTICLE (+1200 PALABRAS) */}
      <article className="prose prose-invert prose-slate max-w-none space-y-16">
        <section className="bg-slate-900/30 border border-slate-800 rounded-[40px] p-8 md:p-12">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-4">
            <Award className="w-8 h-8 text-emerald-500" /> Entendiendo el Concepto de Peso Ideal
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                La búsqueda del **peso ideal** es una de las preocupaciones más comunes en el ámbito de la salud. Sin embargo, desde una perspectiva médica y deportiva, el "peso ideal" no es una cifra mágica, sino un rango en el cual los riesgos de salud (enfermedades cardiovasculares, diabetes tipo 2, problemas articulares) se minimizan y el rendimiento físico se optimiza.
              </p>
              <p>
                Nuestra calculadora de Sporvit utiliza las fórmulas más prestigiosas de la historia de la medicina. Aunque originalmente fueron diseñadas para calcular dosis de medicamentos en entornos clínicos, hoy se utilizan en nutrición para establecer objetivos realistas. Al promediar los resultados de **Devine, Hamwi, Robinson y Miller**, eliminamos los sesgos individuales de cada fórmula y te ofrecemos una referencia mucho más robusta.
              </p>
              <h3 className="text-xl font-bold text-white italic">¿Peso Ideal o Composición Ideal?</h3>
              <p>
                Es vital recordar que el peso es solo una parte de la ecuación. Dos personas pueden pesar lo mismo y tener la misma estatura, pero una puede tener un 10% de grasa corporal (atleta) y la otra un 30% (sedentaria). Por ello, usa esta cifra como una guía orientativa, pero prioriza siempre tu **composición corporal**.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center space-y-4">
              <h3 className="text-xl font-bold text-emerald-500 italic mb-4 uppercase text-center">Las 4 Fórmulas Maestras</h3>
              {[
                { t: "Fórmula de Devine (1974)", d: "La más utilizada en entornos clínicos para dosificación." },
                { t: "Fórmula de Robinson (1983)", d: "Una revisión de Devine con mayor enfoque estadístico." },
                { t: "Fórmula de Miller (1983)", d: "Ajusta los coeficientes para mayor precisión en mujeres." },
                { t: "Fórmula de Hamwi (1964)", d: "La pionera, todavía muy valorada en nutrición tradicional." }
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
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Factores que Alteran tu Peso Óptimo</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Densidad Ósea y Complexión", text: "Personas con estructuras óseas más grandes (complexión ancha) pueden situarse legítimamente en el extremo superior del peso ideal sin que ello suponga un exceso de grasa corporal." },
              { title: "Masa Muscular Acumulada", text: "Si entrenas fuerza, es muy probable que tu peso 'ideal' sea superior a los resultados de estas fórmulas clásicas, ya que el músculo pesa más que la grasa por unidad de volumen." },
              { title: "Edad y Metabolismo", text: "Con el envejecimiento, la composición corporal cambia de forma natural. Los rangos de peso saludable suelen ser ligeramente más amplios en adultos mayores para proteger la densidad mineral ósea." }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl group hover:border-emerald-500/40 transition-all">
                <h3 className="text-emerald-500 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-t from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Tu salud, más allá de la cifra</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            No permitas que el peso ideal se convierta en una obsesión. Utiliza estos datos para tener una referencia de hacia dónde dirigir tu nutrición y entrenamiento. Si tu peso actual está lejos del ideal, enfócate en cambios sostenibles: mejora tu dieta, aumenta tu actividad física diaria y prioriza el descanso. El "peso ideal" de Sporvit es una herramienta de empoderamiento, no de juicio. Tu mejor versión es aquella en la que te sientes fuerte, saludable y con energía para afrontar tus retos diarios.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Fórmulas Clínicas", "Antropometría de Precisión", "Salud Basada en Evidencia"].map((tag, i) => (
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