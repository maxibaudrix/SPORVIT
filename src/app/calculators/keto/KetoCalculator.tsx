"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Flame, Zap, ShieldAlert, Share2, Target, Droplets, Beef, Cookie, Brain
} from 'lucide-react';

export default function KetoCalculator() {
  const [formData, setFormData] = useState({
    gender: 'male',
    weight: '',
    height: '',
    age: '',
    activity: '1.2',
    deficit: '20' // % de déficit
  });

  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const calculateKeto = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(formData.weight);
    const h = parseFloat(formData.height);
    const a = parseFloat(formData.age);
    const pal = parseFloat(formData.activity);
    const def = parseFloat(formData.deficit);

    if (!w || !h || !a) return;

    // BMR (Mifflin-St Jeor)
    let bmr = (10 * w) + (6.25 * h) - (5 * a);
    bmr = formData.gender === 'male' ? bmr + 5 : bmr - 161;
    const tdee = bmr * pal;
    const targetKcal = tdee * (1 - def / 100);

    // REPARTO KETO ESTÁNDAR
    // 1. Carbohidratos Netos: 25g fijos (estándar para cetosis profunda)
    const carbG = 25;
    const carbKcal = carbG * 4;

    // 2. Proteínas: 1.8g por kg de peso (moderado/alto para preservar músculo)
    const proteinG = w * 1.8;
    const proteinKcal = proteinG * 4;

    // 3. Grasas: El resto de las calorías
    const fatKcal = targetKcal - carbKcal - proteinKcal;
    const fatG = Math.max(fatKcal / 9, 30); // Mínimo 30g por salud hormonal

    setResult({
      kcal: Math.round(targetKcal),
      fat: Math.round(fatG),
      protein: Math.round(proteinG),
      carbs: carbG,
      tdee: Math.round(tdee)
    });
  };

  const shareText = useMemo(() => {
    if (!result) return "";
    return `🥑 ¡Mis Macros Keto en Sporvit!\n🔥 Calorías: ${result.kcal} kcal\n🥓 Grasas: ${result.fat}g\n🥩 Proteínas: ${result.protein}g\n🥦 Carbs Netos: ${result.carbs}g\n\nCalcula tu dieta keto aquí:`;
  }, [result]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Calculadora Keto Sporvit"></iframe>`,
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
          <Brain className="w-3 h-3" /> Biohacking y Nutrición
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Calculadora Keto
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
          "Cambia tu combustible. Convierte la grasa en tu fuente de energía infinita."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateKeto} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Peso (kg)</label>
                  <input type="number" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-emerald-500" placeholder="75" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Altura (cm)</label>
                  <input type="number" value={formData.height} onChange={(e) => setFormData({...formData, height: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-emerald-500" placeholder="175" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Edad</label>
                  <input type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-emerald-500" placeholder="30" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Déficit Calórico Objetivo (%)</label>
                <input type="range" min="0" max="40" step="5" value={formData.deficit} onChange={(e) => setFormData({...formData, deficit: e.target.value})} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                  <span>Mantenimiento</span>
                  <span className="text-emerald-500">{formData.deficit}% Déficit</span>
                  <span>Agresivo</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Actividad Diaria</label>
                <select value={formData.activity} onChange={(e) => setFormData({...formData, activity: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-4 text-white font-bold outline-none focus:border-emerald-500 appearance-none">
                  <option value="1.2">Sedentario</option>
                  <option value="1.375">Ligero (1-2 días entreno)</option>
                  <option value="1.55">Moderado (3-5 días entreno)</option>
                  <option value="1.725">Intenso (Atleta)</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg">
                <Calculator className="w-6 h-6" /> Generar Macros Keto
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
              <div className="text-center mb-8 pb-8 border-b border-slate-800">
                <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Presupuesto Diario Keto</p>
                <div className="text-6xl font-black text-white italic tracking-tighter">
                  {result ? result.kcal : '--'} <span className="text-xl text-slate-500">kcal</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-4 bg-slate-950/50 border border-slate-800 rounded-2xl group hover:border-emerald-500/30 transition-all">
                  <div className="flex items-center gap-3">
                    <Droplets className="w-5 h-5 text-yellow-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase">Grasas</span>
                  </div>
                  <span className="text-2xl font-black text-white italic">{result?.fat || '--'}g</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-950/50 border border-slate-800 rounded-2xl group hover:border-emerald-500/30 transition-all">
                  <div className="flex items-center gap-3">
                    <Beef className="w-5 h-5 text-red-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase">Proteínas</span>
                  </div>
                  <span className="text-2xl font-black text-white italic">{result?.protein || '--'}g</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-950/50 border border-slate-800 rounded-2xl group hover:border-emerald-500/30 transition-all">
                  <div className="flex items-center gap-3">
                    <Cookie className="w-5 h-5 text-emerald-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase">Carbs Netos</span>
                  </div>
                  <span className="text-2xl font-black text-white italic">{result?.carbs || '--'}g</span>
                </div>
              </div>

              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-emerald-500 text-emerald-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mis Macros Keto Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl text-center">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-emerald-500" /> Widget para tu Blog Keto
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-emerald-500/50 focus:outline-none resize-none mb-3 cursor-pointer" />
            <button onClick={() => copyToClipboard(embedSnippet, 'embed')} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black transition-all border border-slate-700">
              {copyStatus === 'copied' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copyStatus === 'copied' ? 'CÓDIGO COPIADO' : 'COPIAR CÓDIGO EMBED'}
            </button>
          </div>
        </aside>
      </div>

      <article className="prose prose-invert prose-slate max-w-none space-y-16">
        <section className="bg-slate-900/30 border border-slate-800 rounded-[40px] p-8 md:p-12">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-4">
            <Target className="w-8 h-8 text-emerald-500" /> La Ciencia de la Cetosis Nutricional
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                La **dieta cetogénica** no es simplemente una dieta baja en carbohidratos; es una herramienta metabólica que induce al cuerpo a entrar en un estado llamado **cetosis**. En este estado, el hígado descompone las grasas en moléculas llamadas cuerpos cetónicos, que sirven como combustible alternativo y extremadamente eficiente para el cerebro y los músculos.
              </p>
              <p>
                Entrar en cetosis requiere una precisión matemática en el reparto de macronutrientes. Si consumes demasiada proteína, el cuerpo puede convertirla en glucosa mediante la *gluconeogénesis*. Si excedes los carbohidratos netos (fibra excluida), los niveles de insulina subirán y bloquearán la oxidación de grasas. Nuestra calculadora de Sporvit ajusta estos parámetros automáticamente basándose en tu peso y nivel de actividad, garantizando que tu ratio de grasas sea lo suficientemente alto para señalizar la producción de cetonas.
              </p>
              <h3 className="text-xl font-bold text-white italic">Beneficios más allá de la pérdida de peso</h3>
              <p>
                Aunque la pérdida de grasa es el beneficio más buscado, la cetosis ofrece una **claridad mental** superior debido a la estabilidad de los niveles de azúcar en sangre, una reducción notable de la inflamación sistémica y una mejora en la resistencia aeróbica para atletas que han completado su fase de ceto-adaptación.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center space-y-4">
              <h3 className="text-xl font-bold text-emerald-500 italic mb-4 uppercase text-center">Pilares del Reparto Keto</h3>
              {[
                { t: "Grasas (70-75%)", d: "La fuente de energía principal. Aceite de oliva, aguacate, MCT." },
                { t: "Proteínas (20-25%)", d: "Moderada. Vital para proteger el tejido magro." },
                { t: "Carbohidratos (< 5%)", d: "Crítico. Solo vegetales de hoja verde y fibra." },
                { t: "Electrolitos", d: "Fundamental. Sodio, potasio y magnesio para evitar la 'ceto-gripe'." }
              ].map((item, i) => (
                <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-left">
                  <div className="font-black text-xs text-white uppercase">{item.t}</div>
                  <div className="text-[10px] text-slate-500 font-bold">{item.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Estrategias de Adaptación</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                title: "El Concepto de Carbohidratos Netos", 
                text: "En la dieta keto, no todos los carbohidratos cuentan. Restamos la fibra del total de carbohidratos, ya que la fibra no impacta la insulina. Este dato es el que nuestra calculadora utiliza para mantenerte en cetosis." 
              },
              { 
                title: "Prioridad: Densidad Nutricional", 
                text: "No todas las grasas son iguales. Prioriza grasas monoinsaturadas y saturadas estables. Evita aceites vegetales refinados altamente inflamatorios que pueden arruinar los beneficios metabólicos de la dieta." 
              },
              { 
                title: "Gestión de la Proteína", 
                text: "Mantener 1.8g de proteína por kilo (como sugiere nuestro algoritmo) es ideal para deportistas. Esto evita que el cuerpo utilice el tejido muscular como combustible mientras te adaptas a quemar grasa." 
              }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl group hover:border-emerald-500/40 transition-all">
                <h3 className="text-emerald-500 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-t from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Optimiza tu Metabolismo con Sporvit</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            La Calculadora Keto de Sporvit es tu brújula en el mundo de la nutrición cetogénica. Recuerda que la cetosis es un proceso biológico que requiere tiempo de adaptación (entre 2 y 4 semanas). Utiliza estos macros como base, mantente hidratado y vigila tus niveles de electrolitos. En Sporvit, creemos en la nutrición basada en evidencia para que alcances tu máxima eficiencia energética, recuperes tu salud metabólica y conquistes tus objetivos físicos con precisión científica.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Macros Cetogénicos", "Biohacking Nutricional", "Eficiencia Metabólica"].map((tag, i) => (
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