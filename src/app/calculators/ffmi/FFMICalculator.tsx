"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Dumbbell, Scale, Ruler, Zap, ShieldAlert, ArrowRight, Share2, Target, Award, Percent
} from 'lucide-react';

export default function FFMICalculator() {
  const [formData, setFormData] = useState({ weight: '', height: '', bodyFat: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const calculateFFMI = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(formData.weight);
    const hCm = parseFloat(formData.height);
    const hM = hCm / 100;
    const bf = parseFloat(formData.bodyFat);
    
    let newErrors: Record<string, string> = {};
    if (!w || w < 30) newErrors.weight = "Peso no válido";
    if (!hCm || hCm < 100) newErrors.height = "Altura no válida";
    if (!bf || bf < 3 || bf > 50) newErrors.bodyFat = "Grasa entre 3% y 50%";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    // 1. Masa Magra (Lean Body Mass)
    const lbm = w * (1 - (bf / 100));
    
    // 2. FFMI Estándar
    const ffmi = lbm / (hM * hM);
    
    // 3. FFMI Normalizado (Ajustado para estandarizar a una altura de 1.8m)
    const normalizedFfmi = ffmi + (6.1 * (1.8 - hM));

    let level = "Promedio";
    let color = "text-slate-400";

    if (normalizedFfmi >= 25) { level = "Potencial Límite / Élite"; color = "text-red-500"; }
    else if (normalizedFfmi >= 22) { level = "Excelente (Avanzado)"; color = "text-emerald-500"; }
    else if (normalizedFfmi >= 20) { level = "Bueno (Intermedio)"; color = "text-blue-400"; }
    else if (normalizedFfmi < 18) { level = "Bajo Desarrollo"; color = "text-slate-500"; }

    setResult({
      ffmi: ffmi.toFixed(1),
      normalized: normalizedFfmi.toFixed(1),
      lbm: lbm.toFixed(1),
      level,
      color
    });

    if ((window as any).gtag) {
      (window as any).gtag('event', 'calculate_ffmi', { ffmi_score: normalizedFfmi });
    }
  };

  const shareText = useMemo(() => 
    result ? `💪 Mi FFMI Normalizado es de ${result.normalized} (${result.level}). ¡Calcula tu potencial genético en Sporvit!` : "", 
  [result]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Calculadora FFMI Sporvit"></iframe>`,
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
          <Dumbbell className="w-3 h-3" /> Análisis de Hipertrofia Élite
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Calculadora de FFMI
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
          "El FFMI es la brújula de tu desarrollo muscular. Descubre tu potencial genético real."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateFFMI} noValidate className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <label htmlFor="weight" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Scale className="w-3 h-3 text-emerald-500" /> Peso (kg)
                  </label>
                  <input
                    id="weight" type="number" value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    className={`w-full bg-slate-950 border ${errors.weight ? 'border-red-500' : 'border-slate-800'} rounded-2xl py-5 px-5 text-xl text-white outline-none focus:border-emerald-500 font-black`}
                    placeholder="85"
                  />
                </div>
                <div className="space-y-3">
                  <label htmlFor="height" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Ruler className="w-3 h-3 text-emerald-500" /> Altura (cm)
                  </label>
                  <input
                    id="height" type="number" value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                    className={`w-full bg-slate-950 border ${errors.height ? 'border-red-500' : 'border-slate-800'} rounded-2xl py-5 px-5 text-xl text-white outline-none focus:border-emerald-500 font-black`}
                    placeholder="180"
                  />
                </div>
                <div className="space-y-3">
                  <label htmlFor="bodyFat" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Percent className="w-3 h-3 text-emerald-500" /> Grasa %
                  </label>
                  <input
                    id="bodyFat" type="number" value={formData.bodyFat}
                    onChange={(e) => setFormData({...formData, bodyFat: e.target.value})}
                    className={`w-full bg-slate-950 border ${errors.bodyFat ? 'border-red-500' : 'border-slate-800'} rounded-2xl py-5 px-5 text-xl text-white outline-none focus:border-emerald-500 font-black`}
                    placeholder="12"
                  />
                </div>
              </div>
              
              {(errors.weight || errors.height || errors.bodyFat) && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-bold italic">
                  * Por favor, revisa que todos los campos sean correctos.
                </div>
              )}

              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg active:scale-[0.98]">
                <Target className="w-6 h-6" /> Analizar Potencial Magro
              </button>
            </form>
          </div>
        </section>

        {/* RESULTADOS */}
        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="text-center mb-8 border-b border-slate-800 pb-8">
                <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">FFMI Normalizado</p>
                <div className="text-7xl font-black text-white italic tracking-tighter">
                  {result ? result.normalized : '--'}
                </div>
                <div className={`mt-2 font-black uppercase italic tracking-widest ${result?.color}`}>
                  {result?.level || 'Calculando...'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                  <p className="text-[9px] text-slate-600 font-black uppercase mb-1">Masa Magra</p>
                  <div className="text-xl font-black text-white italic">{result?.lbm || '--'} <span className="text-xs text-slate-500">kg</span></div>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                  <p className="text-[9px] text-slate-600 font-black uppercase mb-1">FFMI Base</p>
                  <div className="text-xl font-black text-white italic">{result?.ffmi || '--'}</div>
                </div>
              </div>

              {/* SHARE */}
              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center shadow-lg"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center shadow-lg"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-emerald-500 text-emerald-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mi FFMI en Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center shadow-lg"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-emerald-500" /> Widget de Potencial Genético
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
            <Award className="w-8 h-8 text-emerald-500" /> FFMI vs IMC: ¿Por qué el IMC no sirve para culturistas?
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                El IMC es una métrica obsoleta para cualquier persona que entrene fuerza. Como solo tiene en cuenta el peso total, un atleta con gran masa muscular y poca grasa corporal puede ser clasificado erróneamente con "obesidad". El **FFMI (Fat-Free Mass Index)** soluciona esto eliminando la grasa de la ecuación.
              </p>
              <p>
                Este índice permite medir la cantidad de músculo que tienes en relación con tu estatura. Es la herramienta estándar para evaluar el progreso en hipertrofia y, lo más interesante, para identificar el **potencial genético natural**. Un FFMI alto con un porcentaje de grasa bajo es la marca distintiva de un físico de élite.
              </p>
              <h3 className="text-xl font-bold text-white italic">¿Qué es el FFMI Normalizado?</h3>
              <p>
                Las personas más altas tienden a tener FFMI naturalmente más altos. El **FFMI Normalizado** ajusta el cálculo para estandarizarlo a una altura de 1.80m, permitiendo comparaciones justas entre atletas de diferentes estaturas. Es el dato que realmente importa en la comunidad científica y del fitness.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 space-y-6 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-emerald-500 italic mb-4 uppercase text-center">Referencia de Niveles FFMI</h3>
              <div className="space-y-4">
                {[
                  { l: "18 - 19", d: "Promedio / Principiante" },
                  { l: "20 - 21", d: "Buen desarrollo (Intermedio)" },
                  { l: "22 - 23", d: "Desarrollo Superior (Avanzado)" },
                  { l: "24 - 25", d: "Límite Genético Natural" },
                  { l: "> 26", d: "Físico Excepcional / Sospecha PEDs" }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                    <span className="font-black text-white italic">{item.l}</span>
                    <span className="text-[10px] font-black uppercase text-slate-400">{item.d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">El Techo Genético: ¿Hasta dónde puedes llegar?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "El Límite de 25", text: "Estudios realizados en la era pre-esteroides (como el famoso estudio de Kouri et al.) sugieren que un FFMI normalizado de 25 es el límite superior para la gran mayoría de culturistas naturales." },
              { title: "Grasa Corporal y Precisión", text: "El FFMI es más preciso cuando tu grasa corporal es baja (8-15%). En niveles altos de obesidad, la masa magra puede sobreestimarse debido al peso del agua y tejidos de soporte." },
              { title: "Optimización Genética", text: "Si tu FFMI está estancado, enfócate en la sobrecarga progresiva y la densidad nutricional. Superar un FFMI de 22 de forma natural requiere años de consistencia extrema." }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl group hover:border-emerald-500/40 transition-all">
                <h3 className="text-emerald-500 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-t from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">¿Cómo interpretar tu resultado?</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            Si eres principiante, tu FFMI probablemente esté por debajo de 19. No te desanimes; esto significa que tienes un enorme margen de mejora. Los atletas intermedios suelen situarse entre 20 y 22. Si superas el 23, estás en el top 5% de la población que entrena. Recuerda que el FFMI no mide la estética (proporción y simetría), sino la **cantidad pura de masa muscular**. Úsalo para monitorizar tus etapas de volumen y asegurar que el peso que ganas es tejido magro y no solo grasa.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Protocolo Kouri", "Ajuste por Estatura", "Analizador de Masa Magra"].map((tag, i) => (
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