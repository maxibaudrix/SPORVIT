"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Zap, Scale, Mountain, Trophy, TrendingUp, Share2, ShieldAlert, Gauge
} from 'lucide-react';

export default function PowerToWeightCalculator() {
  const [weight, setWeight] = useState('');
  const [power, setPower] = useState('');
  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const calculateRatio = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const p = parseFloat(power);

    if (!w || !p) return;

    const ratio = p / w;
    
    // Clasificación basada en tablas de Andrew Coggan (Simplificada)
    let category = "Recreativo";
    if (ratio >= 6.0) category = "World Class (Pro)";
    else if (ratio >= 5.0) category = "Excepcional (Cat 1)";
    else if (ratio >= 4.0) category = "Excelente (Cat 2)";
    else if (ratio >= 3.0) category = "Muy Bueno (Cat 3)";
    else if (ratio >= 2.0) category = "Moderado (Cat 4/5)";

    setResult({
      ratio: ratio.toFixed(2),
      category,
      weight: w,
      power: p
    });
  };

  const shareText = useMemo(() => {
    if (!result) return "";
    return `🚴‍♂️ ¡Mi Ratio Potencia-Peso en Sporvit!\n\n⚡ Vatios/Kilo: ${result.ratio} W/kg\n🏆 Categoría: ${result.category}\n\nCalcula tu nivel ciclista aquí:`;
  }, [result]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Calculadora W/kg Sporvit"></iframe>`,
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <Mountain className="w-3 h-3" /> Rendimiento en Montaña
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter text-center">
          Calculadora de Ratio W/kg
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic text-center">
          "La gravedad es el juez definitivo. Descubre tu verdadera potencia relativa."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateRatio} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Scale className="w-3 h-3 text-yellow-500" /> Peso Total (Ciclista + Bici)
                  </label>
                  <input 
                    type="number" step="0.1" value={weight} 
                    onChange={(e) => setWeight(e.target.value)} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-6 px-6 text-3xl text-white outline-none focus:border-yellow-500 transition-all font-black" 
                    placeholder="75" 
                  />
                  <p className="text-[9px] text-slate-600 font-bold italic">Suma tu peso corporal y el de tu equipo completo.</p>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Zap className="w-3 h-3 text-yellow-500" /> Potencia Media (Vatios)
                  </label>
                  <input 
                    type="number" value={power} 
                    onChange={(e) => setPower(e.target.value)} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-6 px-6 text-3xl text-white outline-none focus:border-yellow-500 transition-all font-black" 
                    placeholder="250" 
                  />
                  <p className="text-[9px] text-slate-600 font-bold italic">Usa tu FTP o la potencia media de una subida test.</p>
                </div>
              </div>

              <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg">
                <Calculator className="w-6 h-6" /> Calcular Mi Ratio W/kg
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="text-center mb-8">
                <p className="text-yellow-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Potencia Relativa</p>
                <div className="text-7xl font-black text-white italic tracking-tighter">
                   {result ? result.ratio : '--'} <span className="text-2xl text-slate-500">W/kg</span>
                </div>
              </div>

              <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-2xl mb-8 text-center group transition-all hover:border-yellow-500/30">
                <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                <div className="text-[10px] font-black text-slate-500 uppercase mb-1">Tu Categoría Estimada</div>
                <div className="text-2xl font-black text-white italic uppercase tracking-tighter">{result?.category || '--'}</div>
              </div>

              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center shadow-lg"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center shadow-lg"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-yellow-500 text-yellow-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mi Ratio W/kg Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center shadow-lg"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl text-center">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-yellow-500" /> Inserta este Widget Ciclista
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-yellow-400/50 focus:outline-none resize-none mb-3 cursor-pointer" />
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
            <Zap className="w-8 h-8 text-yellow-500" /> Ratio Potencia-Peso: El Factor "X" del Ciclismo
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                En el ciclismo moderno, los vatios absolutos solo cuentan una parte de la historia. Si ruedas en llano, tu potencia bruta ($W$) y tu aerodinámica ($CdA$) son lo más importante. Sin embargo, en cuanto la carretera empieza a subir, la física cambia drásticamente. En una pendiente, el mayor obstáculo que debe superar un ciclista es la gravedad.
              </p>
              <p>
                Aquí es donde entra en juego el **Ratio Potencia-Peso** (expresado en Vatios por Kilogramo o $W/kg$). Esta métrica nos dice cuánta potencia eres capaz de generar por cada kilo de peso que tienes que desplazar cuesta arriba. Un ciclista que pesa 90kg y genera 300W (3.3 $W/kg$) será superado fácilmente en un puerto por un ciclista de 60kg que genera "solo" 240W (4.0 $W/kg$). La potencia relativa es la que define a los grandes escaladores.
              </p>
              <h3 className="text-xl font-bold text-white italic">La Ecuación de la Montaña</h3>
              <p>
                El ratio se calcula dividiendo tu potencia media sostenida (generalmente tu FTP o potencia umbral funcional) entre tu peso corporal total (incluyendo equipación). Nuestra calculadora de Sporvit utiliza las tablas de referencia competitiva de **Andrew Coggan**, permitiéndote ver dónde te sitúas en el ecosistema ciclista mundial.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center space-y-4">
              <h3 className="text-xl font-bold text-yellow-500 italic mb-4 uppercase text-center">Niveles de Referencia (Hombre/Mujer)</h3>
              {[
                { t: "World Tour (Pro)", d: "6.0 - 6.5+ W/kg. El nivel de los ganadores del Tour de Francia." },
                { t: "Cat 1 / Elite", d: "5.0 - 5.8 W/kg. Ciclistas amateurs de máximo nivel competitivo." },
                { t: "Entusiasta Avanzado", d: "3.5 - 4.5 W/kg. Capaz de realizar grandes marchas cicloturistas." },
                { t: "Promedio Saludable", d: "2.5 - 3.2 W/kg. Ciclista recreativo con entrenamiento regular." }
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
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Cómo mejorar tu Ratio W/kg</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                title: "Aumentar la Potencia (Motor)", 
                text: "Entrenar para elevar tu FTP mediante series de Sweet Spot e intervalos de umbral anaeróbico. Es la forma más saludable de mejorar el ratio sin comprometer la salud o la recuperación." 
              },
              { 
                title: "Optimizar el Peso (Lastre)", 
                text: "Reducir el porcentaje de grasa corporal permite que el mismo motor (tus vatios) tenga que desplazar menos carga. Es crítico hacerlo de forma gradual para no perder masa muscular y potencia absoluta." 
              },
              { 
                title: "El Peso del Equipamiento", 
                text: "Aunque el cuerpo es el factor principal, una bicicleta ligera y componentes eficientes (ruedas de perfil bajo para escalar) pueden sumar ese último 1-2% que necesitas para batir tus PRs en Strava." 
              }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl group hover:border-yellow-500/40 transition-all">
                <h3 className="text-yellow-500 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-t from-yellow-500/10 to-transparent border border-yellow-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Escala hacia tu mejor versión</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            La Calculadora de Ratio Potencia-Peso de Sporvit es la herramienta definitiva para el ciclista analítico. No te obsesiones solo con el peso o solo con los vatios; busca el equilibrio óptimo que te permita rendir en el terreno donde te gusta rodar. Recuerda que, más allá de los números, el ciclismo es un deporte de sensaciones y pasión. Utiliza estos datos para monitorizar tu evolución, ajustar tu entrenamiento y conquistar cada puerto con la precisión de un profesional.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Vatios por Kilo", "Potencia Umbral FTP", "Rendimiento en Escalada"].map((tag, i) => (
              <span key={i} className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-full text-[10px] font-black text-yellow-400 uppercase tracking-widest">
                {tag}
              </span>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}