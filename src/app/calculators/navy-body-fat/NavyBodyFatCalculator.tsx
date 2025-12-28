"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Target, Percent, Ruler, User, ShieldAlert, Share2, Activity, Zap
} from 'lucide-react';

export default function NavyBodyFatCalculator() {
  const [formData, setFormData] = useState({ 
    gender: 'male', weight: '', height: '', neck: '', waist: '', hips: '' 
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const calculateNavyBF = (e: React.FormEvent) => {
    e.preventDefault();
    const { gender, weight, height, neck, waist, hips } = formData;
    const W = parseFloat(weight), H = parseFloat(height), N = parseFloat(neck), WA = parseFloat(waist), HI = parseFloat(hips);

    if (!W || !H || !N || !WA || (gender === 'female' && !HI)) {
      setErrors({ general: "Por favor, completa todos los campos requeridos." });
      return;
    }
    setErrors({});

    let bodyFat = 0;
    // Fórmulas de la Marina (Unidades métricas)
    if (gender === 'male') {
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(WA - N) + 0.15456 * Math.log10(H)) - 450;
    } else {
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(WA + HI - N) + 0.221 * Math.log10(H)) - 450;
    }

    const fatKg = (bodyFat / 100) * W;
    const leanKg = W - fatKg;

    setResult({
      bf: bodyFat.toFixed(1),
      fatMass: fatKg.toFixed(1),
      leanMass: leanKg.toFixed(1),
      category: bodyFat < 6 ? 'Esencial' : bodyFat < 14 ? 'Atleta' : bodyFat < 18 ? 'Fitness' : bodyFat < 25 ? 'Aceptable' : 'Sobrepeso'
    });
  };

  const shareText = useMemo(() => {
    if (!result) return "";
    return `📊 Mi composición corporal según el Método Marina (Sporvit):\n\n- Grasa Corporal: ${result.bf}%\n- Masa Magra: ${result.leanMass} kg\n- Categoría: ${result.category}\n\nCalcula tu porcentaje real aquí:`;
  }, [result]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Calculadora Marina Sporvit"></iframe>`,
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
          <Activity className="w-3 h-3" /> Estándar de la US Navy
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Calculadora de Grasa Corporal
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
          "La cinta métrica no miente. Obtén una estimación científica de tu composición corporal."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        {/* INPUTS */}
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateNavyBF} className="space-y-6">
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
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Peso (kg)</label>
                  <input type="number" step="0.1" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-emerald-500" placeholder="80" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Altura (cm)</label>
                  <input type="number" value={formData.height} onChange={(e) => setFormData({...formData, height: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-emerald-500" placeholder="180" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Perímetro Cuello (cm)</label>
                  <input type="number" step="0.1" value={formData.neck} onChange={(e) => setFormData({...formData, neck: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-emerald-500" placeholder="40" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Perímetro Cintura (cm)</label>
                  <input type="number" step="0.1" value={formData.waist} onChange={(e) => setFormData({...formData, waist: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-emerald-500" placeholder="90" />
                </div>
                {formData.gender === 'female' && (
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Perímetro Cadera (cm)</label>
                    <input type="number" step="0.1" value={formData.hips} onChange={(e) => setFormData({...formData, hips: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-emerald-500" placeholder="100" />
                  </div>
                )}
              </div>

              {errors.general && <p className="text-red-500 text-xs font-bold text-center italic">{errors.general}</p>}

              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg">
                <Calculator className="w-6 h-6" /> Calcular Composición
              </button>
            </form>
          </div>
        </section>

        {/* RESULTADOS */}
        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center">
              <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Grasa Corporal Total</p>
              <div className="text-7xl font-black text-white italic tracking-tighter mb-4">
                {result ? result.bf : '--'} <span className="text-2xl text-slate-500">%</span>
              </div>
              <div className="inline-block px-4 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-black uppercase mb-8">
                Categoría: {result?.category || 'Analizando...'}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                  <div className="text-[8px] font-black text-slate-500 uppercase mb-1">Masa Magra</div>
                  <div className="text-xl font-black text-white italic">{result?.leanMass || '--'}kg</div>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                  <div className="text-[8px] font-black text-slate-500 uppercase mb-1">Masa Grasa</div>
                  <div className="text-xl font-black text-white italic">{result?.fatMass || '--'}kg</div>
                </div>
              </div>

              {/* SHARE */}
              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center shadow-lg"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center shadow-lg"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-emerald-500 text-emerald-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mi Grasa Corporal&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center shadow-lg"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          {/* EMBED */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-emerald-500" /> Widget Profesional
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-emerald-500/50 focus:outline-none resize-none mb-3 cursor-pointer" />
            <button onClick={() => copyToClipboard(embedSnippet, 'embed')} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black transition-all border border-slate-700">
              {copyStatus === 'copied' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copyStatus === 'copied' ? 'CÓDIGO COPIADO' : 'COPIAR CÓDIGO EMBED'}
            </button>
          </div>
        </aside>
      </div>

      {/* SEO ARTICLE (+1000 PALABRAS) */}
      <article className="prose prose-invert prose-slate max-w-none space-y-16">
        <section className="bg-slate-900/30 border border-slate-800 rounded-[40px] p-8 md:p-12">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-4">
            <Target className="w-8 h-8 text-emerald-500" /> El Método de la Marina de EE. UU.: Composición sin Básculas
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                A menudo nos obsesionamos con el peso total en la báscula, pero ese número es engañoso. El verdadero indicador de salud y rendimiento es la **composición corporal**: el equilibrio entre tu masa muscular y tu porcentaje de grasa. El Método de la Marina (Navy Method) fue desarrollado para estimar la grasa de los reclutas de forma rápida y sorprendentemente precisa.
              </p>
              <p>
                Este sistema utiliza logaritmos que comparan la circunferencia del cuello, la cintura y (en mujeres) la cadera, en relación con la altura. Aunque no sustituye a un escaneo DEXA, tiene un margen de error de apenas un 3-4%, lo cual es superior a la mayoría de las básculas de bioimpedancia domésticas que varían según tu nivel de hidratación.
              </p>
              <h3 className="text-xl font-bold text-white italic">¿Por qué el cuello y la cintura?</h3>
              <p>
                La ciencia detrás de esto indica que la grasa visceral y abdominal (medida en la cintura) es el mayor predictor de riesgo metabólico, mientras que el cuello suele mantenerse estable incluso con cambios musculares, sirviendo como una referencia estructural sólida.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center space-y-4">
              <h3 className="text-xl font-bold text-emerald-500 italic mb-4 uppercase text-center">Rangos Saludables (Hombres/Mujeres)</h3>
              <div className="space-y-3">
                {[
                  { t: "Grasa Esencial", h: "2-5%", m: "10-13%", c: "text-red-400" },
                  { t: "Atletas", h: "6-13%", m: "14-20%", c: "text-blue-400" },
                  { t: "Fitness", h: "14-17%", m: "21-24%", c: "text-emerald-500" },
                  { t: "Promedio", h: "18-24%", m: "25-31%", c: "text-slate-400" }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                    <span className={`font-black text-[10px] uppercase ${item.c}`}>{item.t}</span>
                    <span className="text-xs text-white font-bold">{item.h} / {item.m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Cómo Tomar las Medidas Correctamente</h2>
          <p className="text-center text-slate-400 max-w-3xl mx-auto italic mb-12">"La precisión del cálculo depende enteramente de la precisión de tu cinta métrica."</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "El Cuello", text: "Mide justo debajo de la laringe (nuez), con la cinta ligeramente inclinada hacia abajo en la parte frontal. No tenses el cuello ni aprietes la cinta." },
              { title: "La Cintura", text: "Hombres: mide horizontalmente a la altura del ombligo. Mujeres: mide en la parte más estrecha (cintura natural), generalmente por encima del ombligo." },
              { title: "La Cadera (Mujeres)", text: "Mide la circunferencia más ancha de las nalgas. Asegúrate de que la cinta esté perfectamente paralela al suelo." }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl group hover:border-emerald-500/40 transition-all">
                <h3 className="text-emerald-500 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-t from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Interpretación de Resultados y Salud</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            Este método es especialmente útil para seguir tu progreso en una fase de **recomposición corporal**. Si el peso en la báscula no baja, pero tus perímetros de cintura disminuyen mientras el cuello se mantiene, estás perdiendo grasa y ganando músculo. Recuerda que un porcentaje de grasa muy bajo (debajo del 8% en hombres o 15% en mujeres) puede afectar negativamente a tu sistema hormonal. Utiliza esta herramienta de forma mensual para ajustar tu nutrición y entrenamiento con Sporvit.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["US Navy Standard", "Antropometría Científica", "Grasa Corporal"].map((tag, i) => (
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