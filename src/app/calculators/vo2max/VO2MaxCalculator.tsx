"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Wind, Activity, Heart, Timer, Share2, ShieldAlert, Target, Award, TrendingUp
} from 'lucide-react';

export default function VO2MaxCalculator() {
  const [method, setMethod] = useState<'cooper' | 'hr'>('cooper');
  const [formData, setFormData] = useState({
    gender: 'male',
    age: '',
    distance: '', // para cooper
    maxHr: '', // para HR ratio
    restHr: '' // para HR ratio
  });

  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const calculateVO2 = (e: React.FormEvent) => {
    e.preventDefault();
    let vo2 = 0;

    if (method === 'cooper') {
      const dist = parseFloat(formData.distance);
      if (!dist) return;
      // Fórmula de Cooper: (Distancia en metros - 504.9) / 44.73
      vo2 = (dist - 504.9) / 44.73;
    } else {
      const max = parseFloat(formData.maxHr);
      const rest = parseFloat(formData.restHr);
      if (!max || !rest) return;
      // Fórmula de Uth et al.: 15.3 * (FC Max / FC Reposo)
      vo2 = 15.3 * (max / rest);
    }

    // Clasificación simplificada
    let category = "Promedio";
    if (vo2 > 55) category = "Atleta Élite";
    else if (vo2 > 45) category = "Excelente";
    else if (vo2 > 35) category = "Bueno";

    setResult({
      vo2: vo2.toFixed(1),
      category,
      method: method === 'cooper' ? 'Test de Cooper' : 'Ratio de FC'
    });
  };

  const shareText = useMemo(() => {
    if (!result) return "";
    return `🫁 Mi capacidad cardiovascular (VO2 Max) en Sporvit:\n\n🔥 Nivel: ${result.vo2} ml/kg/min\n🏆 Categoría: ${result.category}\n\nCalcula tu potencia aeróbica aquí:`;
  }, [result]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Calculadora VO2 Max Sporvit"></iframe>`,
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <Wind className="w-3 h-3" /> Potencia Aeróbica Máxima
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Calculadora de VO2 Max
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
          "El VO2 Max es la medida de tu motor interno. Optimiza tu capacidad de procesar vida."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <div className="flex gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-8">
              {[
                { id: 'cooper', label: 'Test de Cooper', icon: Timer },
                { id: 'hr', label: 'Ratio Cardíaco', icon: Heart }
              ].map((m) => (
                <button
                  key={m.id} onClick={() => setMethod(m.id as any)}
                  className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase transition-all flex flex-col items-center gap-2 ${method === m.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                >
                  <m.icon className="w-4 h-4" />
                  {m.label}
                </button>
              ))}
            </div>

            <form onSubmit={calculateVO2} className="space-y-6">
              {method === 'cooper' ? (
                <div className="space-y-3 animate-in fade-in duration-500">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-indigo-400" /> Distancia recorrida en 12 min (metros)
                  </label>
                  <input type="number" value={formData.distance} onChange={(e) => setFormData({...formData, distance: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-6 px-6 text-3xl text-white outline-none focus:border-indigo-500 font-black" placeholder="2800" />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-500">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">FC Máxima (ppm)</label>
                    <input type="number" value={formData.maxHr} onChange={(e) => setFormData({...formData, maxHr: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-xl text-white outline-none focus:border-indigo-500 font-black" placeholder="190" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">FC Reposo (ppm)</label>
                    <input type="number" value={formData.restHr} onChange={(e) => setFormData({...formData, restHr: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-xl text-white outline-none focus:border-indigo-500 font-black" placeholder="60" />
                  </div>
                </div>
              )}

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg">
                <Calculator className="w-6 h-6" /> Estimar Mi VO2 Max
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center">
              <p className="text-indigo-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Consumo Máximo de Oxígeno</p>
              <div className="text-7xl font-black text-white italic tracking-tighter mb-4">
                {result ? result.vo2 : '--'} <span className="text-2xl text-slate-500">ml/kg/min</span>
              </div>
              <div className="inline-block px-4 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-black uppercase mb-8">
                Categoría: {result?.category || 'Analizando...'}
              </div>

              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center shadow-lg"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center shadow-lg"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-indigo-500 text-indigo-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mi VO2 Max Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center shadow-lg"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl text-center">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-indigo-500" /> Widget Fisiológico
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-indigo-500/50 focus:outline-none resize-none mb-3 cursor-pointer" />
            <button onClick={() => copyToClipboard(embedSnippet, 'embed')} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black transition-all border border-slate-700">
              {copyStatus === 'copied' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copyStatus === 'copied' ? 'CÓDIGO COPIADO' : 'COPIAR CÓDIGO EMBED'}
            </button>
          </div>
        </aside>
      </div>

      <article className="prose prose-invert prose-slate max-w-none space-y-16 mt-20">
        <section className="bg-slate-900/30 border border-slate-800 rounded-[40px] p-8 md:p-12">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-4">
            <Activity className="w-8 h-8 text-indigo-500" /> ¿Qué es el VO2 Max y por qué determina tu Rendimiento?
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                El **VO2 Max**, o consumo máximo de oxígeno, es la métrica reina de la fisiología del ejercicio. Define la capacidad de tu sistema cardiovascular y respiratorio para captar oxígeno del aire, transportarlo a través de la sangre y, lo más importante, la capacidad de tus músculos para extraer y utilizar ese oxígeno en la producción de energía aeróbica.
              </p>
              <p>
                Se expresa en mililitros de oxígeno por kilogramo de peso corporal por minuto ($ml/kg/min$). En términos sencillos, es el tamaño del motor de un atleta. Mientras que un individuo sedentario puede tener un VO2 Max de 30-35, un ciclista profesional o un corredor de maratón de élite puede superar los 80-85. Nuestra calculadora de Sporvit te ofrece una estimación basada en métodos indirectos validados, proporcionándote una brújula sobre tu estado de salud cardiovascular y potencial deportivo.
              </p>
              <h3 className="text-xl font-bold text-white italic">El Test de Cooper: Un Clásico Vigente</h3>
              <p>
                Desarrollado por el Dr. Kenneth Cooper en 1968 para el ejército de EE. UU., este test mide la distancia máxima recorrida en 12 minutos. Su alta correlación con las pruebas de laboratorio lo convierte en la herramienta de campo preferida por entrenadores de todo el mundo.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center space-y-4 text-center">
              <h3 className="text-xl font-bold text-indigo-400 italic mb-4 uppercase">Valores de Referencia (Hombre 20-30 años)</h3>
              {[
                { t: "Elite / Pro", d: "70+ ml/kg/min. Rendimiento de clase mundial." },
                { t: "Excelente", d: "55-65 ml/kg/min. Atleta amateur muy avanzado." },
                { t: "Bueno", d: "45-54 ml/kg/min. Persona activa con buena forma." },
                { t: "Promedio", d: "35-44 ml/kg/min. Nivel de salud estándar." }
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
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Fisiología del Oxígeno: De los Pulmones a la Mitocondria</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                title: "Gasto Cardíaco", 
                text: "El VO2 Max depende del volumen sistólico (sangre bombeada por latido). Un corazón entrenado es más grande y fuerte, permitiendo mover más oxígeno con menos esfuerzo, lo que se traduce en una frecuencia cardíaca en reposo más baja." 
              },
              { 
                title: "Densidad Mitocondrial", 
                text: "No solo importa cuánto oxígeno llega al músculo, sino qué tan eficiente es este para usarlo. El entrenamiento de alta intensidad aumenta el número de mitocondrias, las 'centrales energéticas' donde el oxígeno se convierte en ATP." 
              },
              { 
                title: "Diferencia Arteriovenosa", 
                text: "Es la capacidad de los tejidos para extraer el oxígeno de la sangre. Atletas con un VO2 Max alto tienen una red capilar más densa que facilita este intercambio gaseoso de forma ultra-eficiente." 
              }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl group hover:border-indigo-500/40 transition-all">
                <h3 className="text-indigo-500 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-t from-indigo-500/10 to-transparent border border-indigo-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">¿Cómo Mejorar tu VO2 Max?</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            Para elevar tu techo aeróbico, el método más eficaz es el **HIIT (Entrenamiento de Intervalos de Alta Intensidad)**. Series de 3 a 5 minutos al 90-95% de tu frecuencia cardíaca máxima obligan al sistema cardiovascular a adaptarse al máximo estrés. Sin embargo, no olvides la base: los rodajes largos a intensidad suave (Zona 2) construyen la infraestructura capilar necesaria para soportar esos picos de potencia. En Sporvit, te ayudamos a medir lo que importa para que cada gota de sudor te acerque a una versión más fuerte y longeva de ti mismo.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Potencia Aeróbica", "Fisiología Deportiva", "Test de Cooper Online"].map((tag, i) => (
              <span key={i} className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                {tag}
              </span>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}