"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Bike, Gauge, Scale, Droplets, Mountain, Share2, ShieldAlert, Zap, Settings2
} from 'lucide-react';

export default function TirePressureCalculator() {
  const [formData, setFormData] = useState({
    riderWeight: '',
    bikeWeight: '9',
    tireWidth: '28',
    surface: 'dry_tarmac', // dry_tarmac, wet_tarmac, gravel, mtb_trail
    setup: 'tubeless' // tube, tubeless, tubular
  });

  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const calculatePressure = (e: React.FormEvent) => {
    e.preventDefault();
    const rw = parseFloat(formData.riderWeight);
    const bw = parseFloat(formData.bikeWeight);
    const tw = parseFloat(formData.tireWidth);
    
    if (!rw || !tw) return;

    const totalWeight = rw + bw;
    
    // Lógica base: A mayor ancho de neumático, menor presión.
    // Constante base aproximada para 28mm en carretera seca
    let basePressure = (totalWeight * 1.1) / (tw / 25);

    // Ajustes por superficie
    const surfaceMultipliers: any = {
      dry_tarmac: 1.0,
      wet_tarmac: 0.92,
      gravel: 0.75,
      mtb_trail: 0.45
    };

    // Ajustes por Setup (Tubeless permite menos presión con seguridad)
    const setupMultipliers: any = {
      tube: 1.05,
      tubeless: 0.95,
      tubular: 1.0
    };

    let finalPressure = basePressure * surfaceMultipliers[formData.surface] * setupMultipliers[formData.setup];

    // Distribución 45% delante / 55% detrás
    const rear = finalPressure * 1.05;
    const front = finalPressure * 0.95;

    setResult({
      frontPsi: Math.round(front),
      rearPsi: Math.round(rear),
      frontBar: (front / 14.504).toFixed(1),
      rearBar: (rear / 14.504).toFixed(1),
      surfaceName: formData.surface.replace('_', ' '),
      setupName: formData.setup
    });
  };

  const shareText = useMemo(() => {
    if (!result) return "";
    return `🚲 Mi presión ideal Sporvit para ${formData.tireWidth}mm (${result.setupName}):\n\n🔹 Delantera: ${result.frontPsi} PSI / ${result.frontBar} BAR\n🔹 Trasera: ${result.rearPsi} PSI / ${result.rearBar} BAR\n\nOptimiza tu rodada aquí:`;
  }, [result, formData]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Calculadora Presión Neumáticos Sporvit"></iframe>`,
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
          <Settings2 className="w-3 h-3" /> Eficiencia Mecánica Pro
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter text-center">
          Calculadora de Presión de Neumáticos
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic text-center">
          "La diferencia entre rodar y volar está en unos pocos PSI."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculatePressure} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 flex items-center gap-2">
                    <Scale className="w-3 h-3 text-blue-500" /> Peso Ciclista (kg)
                  </label>
                  <input type="number" value={formData.riderWeight} onChange={(e) => setFormData({...formData, riderWeight: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-blue-500" placeholder="75" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 flex items-center gap-2">
                    <Bike className="w-3 h-3 text-blue-500" /> Peso Bicicleta (kg)
                  </label>
                  <input type="number" value={formData.bikeWeight} onChange={(e) => setFormData({...formData, bikeWeight: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-blue-500" placeholder="9" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Ancho Real del Neumático (mm)</label>
                <input type="number" value={formData.tireWidth} onChange={(e) => setFormData({...formData, tireWidth: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-blue-500" placeholder="28" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Superficie</label>
                  <select value={formData.surface} onChange={(e) => setFormData({...formData, surface: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-4 text-white font-bold outline-none focus:border-blue-500 appearance-none">
                    <option value="dry_tarmac">Asfalto Seco</option>
                    <option value="wet_tarmac">Asfalto Mojado</option>
                    <option value="gravel">Gravel / Pista</option>
                    <option value="mtb_trail">MTB / Senderos</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Sistema</label>
                  <select value={formData.setup} onChange={(e) => setFormData({...formData, setup: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-4 text-white font-bold outline-none focus:border-blue-500 appearance-none">
                    <option value="tube">Cámara (Inner Tube)</option>
                    <option value="tubeless">Tubeless</option>
                    <option value="tubular">Tubular</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-500 hover:bg-blue-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg active:scale-[0.98]">
                <Gauge className="w-6 h-6" /> Optimizar Presión
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                  <p className="text-[10px] font-black text-blue-400 uppercase mb-2">Delantera</p>
                  <div className="text-4xl font-black text-white italic">{result?.frontPsi || '--'} <span className="text-xs text-slate-500">PSI</span></div>
                  <div className="text-sm font-bold text-slate-600 mt-1">{result?.frontBar || '--'} BAR</div>
                </div>
                <div className="text-center p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                  <p className="text-[10px] font-black text-blue-400 uppercase mb-2">Trasera</p>
                  <div className="text-4xl font-black text-white italic">{result?.rearPsi || '--'} <span className="text-xs text-slate-500">PSI</span></div>
                  <div className="text-sm font-bold text-slate-600 mt-1">{result?.rearBar || '--'} BAR</div>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-blue-500 shrink-0" />
                <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic">
                  Presiones estimadas para máxima eficiencia. No excedas nunca el límite de presión indicado por el fabricante en el flanco del neumático.
                </p>
              </div>

              {result && (
                <div className="grid grid-cols-4 gap-2 mt-8">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-blue-500 text-blue-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mi Presión Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl text-center">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-blue-500" /> Inserta este Widget
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-blue-400/50 focus:outline-none resize-none mb-3 cursor-pointer" />
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
            <Zap className="w-8 h-8 text-blue-500" /> La Ciencia de la Rodadura: Por qué la Presión lo es TODO
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                Durante décadas, el dogma ciclista decía que cuanto más alta era la presión, más rápido rodabas. Hoy, la ciencia y los estudios en laboratorio (como los de *Rolling Resistance*) han demostrado que esto es falso. Una presión excesivamente alta provoca que el neumático rebote en las imperfecciones del asfalto, convirtiendo la energía de avance en energía de vibración vertical.
              </p>
              <p>
                Este fenómeno, conocido como **pérdidas por histéresis e impedancia**, hace que una rueda con menor presión (dentro de un rango óptimo) sea en realidad más rápida. La clave está en permitir que el neumático se deforme ligeramente para absorber las irregularidades del terreno, manteniendo el contacto y la inercia. Nuestra calculadora técnica ajusta tus PSI basándose en tu peso total y el ancho real de la cubierta para maximizar este equilibrio.
              </p>
              <h3 className="text-xl font-bold text-white italic">El Papel del Tubeless</h3>
              <p>
                La tecnología Tubeless ha revolucionado la gestión de presiones. Al eliminar la cámara, eliminamos el riesgo de "pinchazo por pellizco" (snakebite), lo que nos permite bajar entre 10 y 15 PSI adicionales. Esto no solo mejora el agarre y la comodidad, sino que reduce drásticamente la resistencia a la rodadura en superficies que no son perfectamente lisas.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center space-y-4">
              <h3 className="text-xl font-bold text-blue-400 italic mb-4 uppercase text-center">Variables que Dictan tu Presión</h3>
              {[
                { t: "Ancho Interno de Llanta", d: "Afecta al volumen real de aire y la forma del neumático." },
                { t: "Temperatura Ambiental", d: "El aire se expande con el calor; revisa tu presión antes de salir." },
                { t: "Distribución de Peso", d: "La rueda trasera soporta aproximadamente el 55-60% de la carga." },
                { t: "TPI de la Carcasa", d: "Cubiertas con mayor TPI son más flexibles y requieren ajustes finos." }
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
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Presiones según Terreno: Carretera vs Gravel vs MTB</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                title: "Asfalto y Rendimiento", 
                text: "En carretera, buscamos el punto de 'deformación mínima'. Para cubiertas de 28mm en un ciclista de 75kg, la presión ideal suele rondar los 60-70 PSI en seco. Bajar 5-8 PSI en mojado aumenta drásticamente la superficie de contacto y tu seguridad en curvas." 
              },
              { 
                title: "La Revolución del Gravel", 
                text: "En gravel, la presión es tu mejor suspensión. Rodar a 35 PSI con una cubierta de 40mm puede ser la diferencia entre terminar una prueba de 200km o abandonar por fatiga muscular causada por las vibraciones constantes." 
              },
              { 
                title: "MTB: Grip y Control", 
                text: "En montaña, la presión baja es ley. Se busca que los tacos 'muerdan' el terreno. En sistemas tubeless modernos, es común ver presiones de 18-22 PSI, algo impensable hace unos años, permitiendo un control total en zonas técnicas." 
              }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl group hover:border-blue-500/40 transition-all">
                <h3 className="text-blue-500 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-t from-blue-500/10 to-transparent border border-blue-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Tu Seguridad es lo Primero</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            Esta calculadora ofrece un punto de partida optimizado basado en promedios de rendimiento profesional. Sin embargo, factores como el estilo de conducción, el diseño específico de los flancos del neumático y la compatibilidad con llantas "hookless" son críticos. Verifica siempre las especificaciones grabadas en tu cubierta y utiliza un manómetro de calidad. En Sporvit, nuestro objetivo es que cada vatio que generas se traduzca en velocidad real, y la presión de tus neumáticos es la forma más barata y efectiva de mejorar tu bicicleta hoy mismo.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Mecánica de Precisión", "Resistencia a la Rodadura", "Optimización Ciclista"].map((tag, i) => (
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