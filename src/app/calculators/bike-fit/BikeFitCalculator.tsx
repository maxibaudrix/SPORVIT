"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Bike, Ruler, ChevronRight, Share2, ShieldAlert, Zap, Settings, ArrowUpCircle
} from 'lucide-react';

export default function BikeFitCalculator() {
  const [formData, setFormData] = useState({
    bikeType: 'road', // road, mtb, gravel
    height: '',
    inseam: '', // entrepierna
  });

  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const calculateFit = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(formData.height);
    const inseam = parseFloat(formData.inseam);
    
    if (!h || !inseam) return;

    // 1. TALLA DE CUADRO
    let frameSize = 0;
    let unit = 'cm';
    
    if (formData.bikeType === 'road') {
      frameSize = inseam * 0.665;
      unit = 'cm';
    } else if (formData.bikeType === 'mtb') {
      frameSize = (inseam * 0.226);
      unit = '" (pulgadas)';
    } else {
      frameSize = inseam * 0.63; // Gravel suele ser ligeramente más pequeño que carretera
      unit = 'cm';
    }

    // 2. ALTURA DE SILLÍN (Método LeMond: Entrepierna * 0.883)
    const saddleHeight = inseam * 0.883;

    setResult({
      frame: frameSize.toFixed(1),
      unit,
      saddle: saddleHeight.toFixed(1),
      inseam,
      type: formData.bikeType.toUpperCase()
    });
  };

  const shareText = useMemo(() => {
    if (!result) return "";
    return `🚲 Mi Configuración Bike Fit en Sporvit (${result.type}):\n\n📏 Talla Cuadro: ${result.frame}${result.unit}\n🔝 Altura Sillín: ${result.saddle} cm (desde eje pedalier)\n\nCalcula tu talla aquí:`;
  }, [result]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Calculadora Bike Fit Sporvit"></iframe>`,
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
          <Settings className="w-3 h-3" /> Biomecánica y Rendimiento
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter text-center">
          Calculadora de Talla y Configuración
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic text-center">
          "La bicicleta debe ser una extensión de tu cuerpo, no un obstáculo para tu potencia."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateFit} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Tipo de Bicicleta</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'road', label: 'Carretera' },
                    { id: 'mtb', label: 'Montaña' },
                    { id: 'gravel', label: 'Gravel' }
                  ].map((t) => (
                    <button key={t.id} type="button" onClick={() => setFormData({...formData, bikeType: t.id})} className={`py-3 rounded-xl border text-[10px] font-black transition-all ${formData.bikeType === t.id ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-white'}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 flex items-center gap-2">
                    <Ruler className="w-3 h-3 text-blue-500" /> Altura Total (cm)
                  </label>
                  <input type="number" value={formData.height} onChange={(e) => setFormData({...formData, height: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-blue-500" placeholder="175" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 flex items-center gap-2">
                    <ArrowUpCircle className="w-3 h-3 text-blue-500" /> Entrepierna (cm)
                  </label>
                  <input type="number" value={formData.inseam} onChange={(e) => setFormData({...formData, inseam: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-blue-500" placeholder="82" />
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg">
                <Bike className="w-6 h-6" /> Obtener Mi Configuración
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="text-center mb-8 border-b border-slate-800 pb-6">
                <p className="text-blue-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Talla Sugerida Cuadro</p>
                <div className="text-6xl font-black text-white italic tracking-tighter">
                  {result ? result.frame : '--'} <span className="text-xl text-slate-500">{result?.unit === 'cm' ? 'cm' : '"'}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl flex justify-between items-center group transition-all">
                  <div>
                    <div className="text-[9px] font-black uppercase text-slate-400">Altura Sillín</div>
                    <div className="text-[8px] text-slate-600 font-bold italic">Desde centro pedalier</div>
                  </div>
                  <div className="text-2xl font-black text-white italic">{result?.saddle || '--'} <span className="text-xs">cm</span></div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-start gap-3 mb-8">
                <ShieldAlert className="w-5 h-5 text-blue-500 shrink-0" />
                <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic">
                  Estas medidas son una guía biomecánica inicial. Cada fabricante tiene una geometría propia; consulta siempre su tabla de tallas específica.
                </p>
              </div>

              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-blue-500 text-blue-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mi Configuración Ciclista Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center"><Mail className="w-5 h-5" /></button>
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
            <Zap className="w-8 h-8 text-blue-500" /> La Ciencia del Bike Fit: Por qué la Talla es el Primer Paso
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                El **Bike Fit** no es solo para ciclistas profesionales de la UCI. Es una necesidad básica para cualquier persona que pase más de una hora sobre el sillín. Una bicicleta que no se ajusta a tus proporciones corporales es ineficiente: desperdicias vatios en cada pedalada y obligas a tus músculos y articulaciones a trabajar en ángulos antinaturales.
              </p>
              <p>
                Nuestra calculadora utiliza la medida de la **entrepierna** como eje central del cálculo. ¿Por qué? Porque la altura total puede ser engañosa; dos personas de 1,80m pueden tener longitudes de pierna muy distintas, lo que cambiaría drásticamente su talla de cuadro y su altura de sillín. Al integrar los métodos de **LeMond** y el sistema de coeficientes por tipo de bicicleta (Carretera, MTB, Gravel), Sporvit te ofrece un punto de partida biomecánicamente sólido.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center space-y-4">
              <h3 className="text-xl font-bold text-blue-400 italic mb-4 uppercase text-center">Consecuencias de un Mal Ajuste</h3>
              {[
                { t: "Dolor Anterior de Rodilla", d: "Sillín demasiado bajo. Aumenta la presión en la rótula." },
                { t: "Dolor Lumbar", d: "Cuadro demasiado largo o sillín demasiado alto." },
                { t: "Adormecimiento de Manos", d: "Demasiada carga en el manillar por un cuadro grande." },
                { t: "Pérdida de Potencia", d: "Extensión ineficiente de la pierna en el punto muerto inferior." }
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
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Métodos de Configuración Explicados</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                title: "Método Greg LeMond", 
                text: "Desarrollado por el tres veces ganador del Tour de Francia. Establece que la distancia desde el centro del eje pedalier hasta la parte superior del sillín debe ser el 88.3% de la medida de tu entrepierna. Es el estándar de oro para ciclistas de carretera." 
              },
              { 
                title: "Geometría MTB vs Carretera", 
                text: "En montaña, el cuadro se mide en pulgadas y suele ser más pequeño para permitir mayor maniobrabilidad y espacio libre sobre el tubo superior. En carretera, la precisión en cm es clave para la aerodinámica y la eficiencia sostenida." 
              },
              { 
                title: "El Factor de la Entrepierna", 
                text: "Para medirla correctamente, ponte de pie contra una pared sin zapatos y coloca un libro entre tus piernas presionando hacia arriba (simulando la presión del sillín). La distancia desde el borde superior del libro hasta el suelo es tu medida maestra." 
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
          <h2 className="text-2xl font-bold text-white mb-6">Optimiza tu Experiencia Ciclista</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            Recuerda que estas medidas son el punto de partida técnico. Factores como la flexibilidad de tu cadera, la longitud de las bielas y el retroceso del sillín (setback) requieren ajustes milimétricos basados en sensaciones. Una vez tengas tu talla ideal y altura de sillín con la calculadora de Sporvit, realiza salidas cortas y ajusta de 2 en 2 milímetros hasta encontrar tu zona de confort total. Disfrutar del ciclismo comienza con una bicicleta que te respeta.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Biomecánica LeMond", "Configuración de Cuadro", "Eficiencia en Pedalada"].map((tag, i) => (
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