"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Zap, Droplets, Target, ShieldAlert, Share2, Timer, Trophy, Waves, Bike, Footprints
} from 'lucide-react';

export default function TriathlonNutritionCalculator() {
  const [formData, setFormData] = useState({
    distance: '70.3', // sprint, olympic, 70.3, ironman
    targetTime: '5', // horas totales
    weight: '',
    intensity: 'high' // moderate, high, elite
  });

  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const calculateNutrition = (e: React.FormEvent) => {
    e.preventDefault();
    const hours = parseFloat(formData.targetTime);
    const w = parseFloat(formData.weight);
    
    if (!hours || !w) return;

    // Lógica de Carbohidratos (CHO) por hora según distancia/intensidad
    let choPerHour = 60;
    if (formData.distance === '70.3') choPerHour = 80;
    if (formData.distance === 'ironman') choPerHour = 90;
    if (formData.intensity === 'elite') choPerHour = 105;

    // Hidratación: ~700ml/h promedio ajustado
    const fluidPerHour = 750; 
    // Sodio: ~700mg/h promedio
    const sodiumPerHour = 800;

    setResult({
      totalCho: Math.round(choPerHour * hours),
      choPerHour,
      totalFluid: (fluidPerHour * hours / 1000).toFixed(1),
      totalSodium: Math.round(sodiumPerHour * hours),
      segments: [
        { icon: Waves, name: 'Swim', cho: '0g (Pre-carga)', fluid: '0ml' },
        { icon: Bike, name: 'Bike', cho: `${choPerHour + 10}g/h`, fluid: '800ml/h' },
        { icon: Footprints, name: 'Run', cho: `${choPerHour - 10}g/h`, fluid: '600ml/h' }
      ]
    });
  };

  const shareText = useMemo(() => {
    if (!result) return "";
    return `🏁 Mi Plan Nutricional Triatlón en Sporvit:\n\n⚡ CHO: ${result.choPerHour}g/h\n💧 Hidratación Total: ${result.totalFluid}L\n🧂 Sodio: ${result.totalSodium}mg\n\nNo choques contra el muro, planifica aquí:`;
  }, [result]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Calculadora Nutricion Triatlon Sporvit"></iframe>`,
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <Trophy className="w-3 h-3" /> El Cuarto Segmento: Nutrición
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Calculadora Nutricional Triatlón
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
          "La diferencia entre un podio y un DNF se mide en gramos de carbohidratos."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateNutrition} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Distancia del Evento</label>
                  <select value={formData.distance} onChange={(e) => setFormData({...formData, distance: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-4 text-white font-bold outline-none focus:border-amber-500 appearance-none">
                    <option value="sprint">Sprint</option>
                    <option value="olympic">Olímpico</option>
                    <option value="70.3">Media Distancia (70.3)</option>
                    <option value="ironman">Larga Distancia (Full)</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Tiempo Objetivo (Horas)</label>
                  <input type="number" step="0.1" value={formData.targetTime} onChange={(e) => setFormData({...formData, targetTime: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-4 text-white font-bold outline-none focus:border-amber-500" placeholder="5" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Peso Corporal (kg)</label>
                  <input type="number" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-4 text-white font-bold outline-none focus:border-amber-500" placeholder="70" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nivel / Intensidad</label>
                  <select value={formData.intensity} onChange={(e) => setFormData({...formData, intensity: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-4 text-white font-bold outline-none focus:border-amber-500 appearance-none">
                    <option value="moderate">Moderado (Disfrutar)</option>
                    <option value="high">Alto (Competir AG)</option>
                    <option value="elite">Élite (Entrenado para 100g+ CHO)</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg">
                <Calculator className="w-6 h-6" /> Generar Estrategia de Carrera
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
              <div className="text-center mb-8 border-b border-slate-800 pb-6">
                <p className="text-amber-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Aporte Energético Sugerido</p>
                <div className="text-6xl font-black text-white italic tracking-tighter">
                   {result?.choPerHour || '--'} <span className="text-xl text-slate-500">g CHO/h</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
                    <div className="text-[8px] font-black text-slate-500 uppercase mb-1">Hidratación Total</div>
                    <div className="text-xl font-black text-white italic">{result?.totalFluid || '--'}L</div>
                </div>
                <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
                    <div className="text-[8px] font-black text-slate-500 uppercase mb-1">Sodio Total</div>
                    <div className="text-xl font-black text-white italic">{result?.totalSodium || '--'}mg</div>
                </div>
              </div>

              <div className="space-y-2 mb-8">
                {result?.segments.map((seg: any) => (
                  <div key={seg.name} className="flex justify-between items-center bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2">
                      <seg.icon className="w-4 h-4 text-amber-500" />
                      <span className="text-[10px] font-black text-white uppercase">{seg.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 italic">{seg.cho} | {seg.fluid}</span>
                  </div>
                ))}
              </div>

              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center shadow-lg"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center shadow-lg"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-amber-500 text-amber-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mi Plan Nutricional Triatlón&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center shadow-lg"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl text-center">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-amber-500" /> Inserta este Planificador
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-amber-500/50 focus:outline-none resize-none mb-3 cursor-pointer" />
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
            <Zap className="w-8 h-8 text-amber-500" /> Nutrición en Triatlón: La Ciencia de la Resistencia Extrema
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                En el triatlón de larga distancia, el cuerpo humano se enfrenta a un desafío energético sin precedentes. A intensidades competitivas, los depósitos de glucógeno muscular y hepático se agotan en aproximadamente 90 a 120 minutos. Sin un aporte externo constante de energía, el rendimiento cae drásticamente, lo que comúnmente se conoce como **"chocar contra el muro"**.
              </p>
              <p>
                Nuestra calculadora de Sporvit utiliza los protocolos más actualizados de nutrición deportiva. Mientras que hace una década se recomendaban 60g de carbohidratos por hora, hoy sabemos que mediante el entrenamiento del sistema digestivo y el uso de transportadores múltiples (glucosa/fructosa en ratio 2:1 o 1:0.8), los atletas pueden absorber entre **90g y 120g de CHO/hora**. Esta mayor disponibilidad de energía protege el glucógeno muscular para los kilómetros finales del maratón.
              </p>
              <h3 className="text-xl font-bold text-white italic">Entrenar el Estómago</h3>
              <p>
                La nutrición es tan entrenable como tu VDOT o tu FTP. No intentes alcanzar los 90g/h el día de la carrera si no lo has practicado en tus entrenamientos largos. El sistema digestivo debe adaptarse a procesar altas cargas de carbohidratos bajo el estrés del ejercicio y la redistribución del flujo sanguíneo.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center space-y-4">
              <h3 className="text-xl font-bold text-amber-500 italic mb-4 uppercase text-center">Protocolo por Distancia</h3>
              {[
                { t: "Sprint / Olímpico", d: "Enfoque en intensidad. 30-60g CHO/h es suficiente." },
                { t: "70.3 (Media)", d: "Crítico. 60-90g CHO/h. Control estricto de sales." },
                { t: "Ironman (Larga)", d: "Supervivencia y rendimiento. 80-100g+ CHO/h. Hidratación constante." },
                { t: "Sodio (Sal)", d: "Vital para evitar calambres e hiponatremia. 500-1000mg/h." }
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
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Estrategia por Segmentos</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                title: "Natación y Pre-Carrera", 
                text: "No puedes comer mientras nadas. La nutrición del Swim se basa en una pre-carga adecuada (30-45 min antes) y una hidratación óptima. Al salir del agua (T1), tu cuerpo está en déficit; el ciclismo es el momento de recuperar." 
              },
              { 
                title: "Ciclismo: Tu Tanque", 
                text: "Es el segmento más fácil para ingerir sólidos, semisólidos y líquidos. Debes consumir el 60-70% de tus carbohidratos totales aquí. Un estómago vacío al empezar a correr es una garantía de fracaso." 
              },
              { 
                title: "Carrera: Digestión Difícil", 
                text: "El impacto del running dificulta la absorción. Aquí priorizamos geles de alta absorción y líquidos. El objetivo es mantener el ritmo de glucosa sin provocar malestar gastrointestinal." 
              }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl group hover:border-amber-500/40 transition-all">
                <h3 className="text-amber-500 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-t from-amber-500/10 to-transparent border border-amber-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Domina tu Evento con Sporvit</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            Esta calculadora ofrece una base científica para tu estrategia. Sin embargo, la tasa de sudoración y la tolerancia gástrica son individuales. Prueba tu plan en los entrenamientos tipo "Brick" (Bici + Correr) para ajustar los miligramos de sodio y los gramos de azúcar. En Sporvit, nuestro objetivo es que cruces la meta con fuerza, no solo por tu entrenamiento físico, sino por una inteligencia nutricional superior. Planifica, entrena y conquista.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Estrategia CHO/h", "Prevención del Muro", "Nutrición Endurance Pro"].map((tag, i) => (
              <span key={i} className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-full text-[10px] font-black text-amber-500 uppercase tracking-widest">
                {tag}
              </span>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}