"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  User, Ruler, HeartPulse, ShieldAlert, Share2, Activity, Scale, 
  ChevronRight, Activity as HealthIcon
} from 'lucide-react';

export default function WHRCalculator() {
  const [formData, setFormData] = useState({
    gender: 'male',
    height: '',
    waist: '',
    hip: ''
  });

  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(typeof window !== 'undefined' ? window.location.href : ''); }, []);

  const calculateHealthIndices = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(formData.height);
    const w = parseFloat(formData.waist);
    const hi = parseFloat(formData.hip);

    if (!h || !w || !hi) return;

    // 1. WHR (Waist-to-Hip Ratio)
    const whr = w / hi;
    
    // 2. WHtR (Waist-to-Height Ratio)
    const whtr = w / h;

    // Clasificación WHR (OMS)
    let whrStatus = 'Normal';
    let whrColor = 'text-emerald-500';
    
    if (formData.gender === 'male') {
      if (whr >= 0.90 && whr < 1.0) { whrStatus = 'Moderado'; whrColor = 'text-yellow-400'; }
      else if (whr >= 1.0) { whrStatus = 'Alto'; whrColor = 'text-red-500'; }
    } else {
      if (whr >= 0.80 && whr < 0.85) { whrStatus = 'Moderado'; whrColor = 'text-yellow-400'; }
      else if (whr >= 0.85) { whrStatus = 'Alto'; whrColor = 'text-red-500'; }
    }

    // Clasificación WHtR (General)
    let whtrStatus = 'Saludable';
    let whtrColor = 'text-emerald-500';
    if (whtr > 0.5) { whtrStatus = 'Aumento de Riesgo'; whtrColor = 'text-red-500'; }

    setResult({
      whr: whr.toFixed(2),
      whtr: whtr.toFixed(2),
      whrStatus,
      whrColor,
      whtrStatus,
      whtrColor
    });
  };

  const shareText = useMemo(() => {
    if (!result) return "";
    return `❤️ Mi chequeo de salud abdominal en Sporvit:\n\n📏 Ratio Cintura-Cadera: ${result.whr} (${result.whrStatus})\n📉 Ratio Cintura-Altura: ${result.whtr} (${result.whtrStatus})\n\nEvalúa tu riesgo aquí:`;
  }, [result]);

  const copyToClipboard = useCallback(async (text: string, type: 'embed' | 'share') => {
    await navigator.clipboard.writeText(text);
    if (type === 'embed') setCopyStatus('copied');
    else setShareStatus('copied');
    setTimeout(() => { setCopyStatus('idle'); setShareStatus('idle'); }, 2000);
  }, []);

  const embedSnippet = `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden; border:1px solid #1e293b;" title="Calculadora WHR Sporvit"></iframe>`;

  return (
    <div className="pt-8 pb-16 container mx-auto px-4 sm:px-6 max-w-6xl">
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <HeartPulse className="w-3 h-3" /> Diagnóstico Metabólico
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter text-center">
          Salud Abdominal: WHR & WHtR
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic text-center">
          "Donde acumulas la grasa importa más que cuánta pesas."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateHealthIndices} className="space-y-6">
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
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Altura (cm)</label>
                  <input type="number" value={formData.height} onChange={(e) => setFormData({...formData, height: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-emerald-500" placeholder="175" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Cintura (cm)</label>
                  <input type="number" value={formData.waist} onChange={(e) => setFormData({...formData, waist: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-emerald-500" placeholder="85" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Cadera (cm)</label>
                  <input type="number" value={formData.hip} onChange={(e) => setFormData({...formData, hip: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-emerald-500" placeholder="98" />
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg">
                <HealthIcon className="w-6 h-6" /> Analizar Riesgo Metabólico
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6 text-justify">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center">
              <div className="space-y-8 mb-8">
                <div>
                  <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Relación Cintura-Cadera (WHR)</p>
                  <div className="text-5xl font-black text-white italic tracking-tighter">
                    {result ? result.whr : '--'}
                  </div>
                  <div className={`text-[10px] font-black uppercase mt-2 ${result?.whrColor}`}>Riesgo: {result?.whrStatus || '--'}</div>
                </div>

                <div className="border-t border-slate-800 pt-6">
                  <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Relación Cintura-Altura (WHtR)</p>
                  <div className="text-5xl font-black text-white italic tracking-tighter">
                    {result ? result.whtr : '--'}
                  </div>
                  <div className={`text-[10px] font-black uppercase mt-2 ${result?.whtrColor}`}>Estado: {result?.whtrStatus || '--'}</div>
                </div>
              </div>
              
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-start gap-3 mb-8">
                <ShieldAlert className="w-5 h-5 text-emerald-500 shrink-0" />
                <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic">
                  Un ratio Cintura-Altura superior a 0.5 indica una acumulación excesiva de grasa visceral, correlacionada con mayor riesgo de diabetes tipo 2 e hipertensión.
                </p>
              </div>

              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button type="button" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center"><MessageCircle className="w-5 h-5" /></button>
                  <button type="button" onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center"><Send className="w-5 h-5" /></button>
                  <button type="button" onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-emerald-500 text-emerald-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button type="button" onClick={() => window.location.href=`mailto:?subject=Mi Análisis de Salud Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl text-center">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-emerald-500" /> Widget Antropométrico
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-emerald-400/50 focus:outline-none resize-none mb-3 cursor-pointer" />
            <button type="button" onClick={() => copyToClipboard(embedSnippet, 'embed')} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black transition-all border border-slate-700">
              {copyStatus === 'copied' ? <Check className="w-3 h-3 inline mr-1" /> : <Copy className="w-3 h-3 inline mr-1" />}
              {copyStatus === 'copied' ? 'CÓDIGO COPIADO' : 'COPIAR CÓDIGO EMBED'}
            </button>
          </div>
        </aside>
      </div>

      <article className="prose prose-invert prose-slate max-w-none space-y-16 mt-20 text-justify">
        <section className="bg-slate-900/30 border border-slate-800 rounded-[40px] p-8 md:p-12">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-4">
            <HealthIcon className="w-8 h-8 text-emerald-500" /> Más Allá del IMC: La importancia de la Distribución de la Grasa
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg">
              <p>
                Durante décadas, el Índice de Masa Corporal (IMC) ha sido la métrica estándar, pero tiene una falla crítica: no distingue entre músculo y grasa, ni indica dónde se encuentra esta última. La ciencia moderna ha demostrado que la **grasa abdominal o visceral** es la metabólicamente activa y peligrosa, ya que rodea los órganos vitales y libera citoquinas inflamatorias.
              </p>
              <p>
                La **Relación Cintura-Cadera (WHR)** y la **Relación Cintura-Altura (WHtR)** son herramientas superiores para identificar este riesgo. El WHtR es particularmente útil porque aplica una regla universal sencilla: tu cintura debe medir menos de la mitad de tu altura.
              </p>
              
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center space-y-4">
              <h3 className="text-xl font-bold text-emerald-500 italic mb-4 uppercase text-center">Riesgos de la Grasa Visceral</h3>
              {[
                { t: "Resistencia a la Insulina", d: "La grasa abdominal interfiere con el metabolismo de la glucosa, elevando el riesgo de Diabetes Tipo 2." },
                { t: "Inflamación Crónica", d: "El tejido adiposo visceral secreta pro-inflamatorios que dañan las paredes arteriales." },
                { t: "Hipertensión", d: "Existe una correlación directa entre el aumento del perímetro de cintura y la presión arterial elevada." },
                { t: "Hígado Graso", d: "La cercanía de la grasa visceral al sistema porta facilita la acumulación de grasa en el hígado." }
              ].map((item, i) => (
                <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-left">
                  <div className="font-black text-xs text-white uppercase">{item.t}</div>
                  <div className="text-[10px] text-slate-500 font-bold">{item.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}