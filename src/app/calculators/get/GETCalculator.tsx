"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Flame, User, Activity, Scale, Ruler, Zap, ShieldAlert, ArrowRight, Share2, Target, TrendingUp
} from 'lucide-react';

export default function GETCalculator() {
  const [formData, setFormData] = useState({
    gender: 'male',
    age: '',
    weight: '',
    height: '',
    activity: '1.2'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const calculateGET = (e: React.FormEvent) => {
    e.preventDefault();
    const { age, weight, height, activity, gender } = formData;
    const A = parseFloat(age), W = parseFloat(weight), H = parseFloat(height), ACT = parseFloat(activity);
    
    let newErrors: Record<string, string> = {};
    if (!A || A < 15) newErrors.age = "Edad mínima 15 años";
    if (!W || W < 30) newErrors.weight = "Peso no válido";
    if (!H || H < 100) newErrors.height = "Altura no válida";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    // 1. GEB (Mifflin-St Jeor)
    let geb = (10 * W) + (6.25 * H) - (5 * A);
    geb = gender === 'male' ? geb + 5 : geb - 161;

    // 2. GET (TDEE)
    const get = geb * ACT;

    setResult({
      geb: Math.round(geb),
      get: Math.round(get),
      goals: {
        loss: Math.round(get - 500),
        maintain: Math.round(get),
        gain: Math.round(get + 500)
      }
    });

    if ((window as any).gtag) {
      (window as any).gtag('event', 'calculate_get', { total_kcal: get });
    }
  };

  const shareText = useMemo(() => 
    result ? `🔥 Mi Gasto Energético Total (GET) es de ${result.get} kcal diarias. ¡Descubre el tuyo en Sporvit!` : "", 
  [result]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden;" title="Calculadora GET Sporvit"></iframe>`,
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
          <TrendingUp className="w-3 h-3" /> Optimización Energética
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Calculadora de Gasto Energético Total (GET)
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
          "No cuentes los días, haz que las calorías cuenten. Calcula tu presupuesto energético real."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        {/* INPUTS */}
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateGET} noValidate className="space-y-6">
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
                {[
                  { id: 'age', label: 'Edad', icon: Activity, placeholder: '25' },
                  { id: 'weight', label: 'Peso (kg)', icon: Scale, placeholder: '75' },
                  { id: 'height', label: 'Altura (cm)', icon: Ruler, placeholder: '175' }
                ].map((input) => (
                  <div key={input.id} className="space-y-2">
                    <label htmlFor={input.id} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <input.icon className="w-3 h-3 text-emerald-500" /> {input.label}
                    </label>
                    <input id={input.id} type="number" value={(formData as any)[input.id]} onChange={(e) => setFormData({...formData, [input.id]: e.target.value})} className={`w-full bg-slate-950 border ${errors[input.id] ? 'border-red-500' : 'border-slate-800'} rounded-xl py-4 px-5 text-white outline-none focus:border-emerald-500 font-bold transition-all`} />
                    {errors[input.id] && <p className="text-red-500 text-[10px] font-bold italic">{errors[input.id]}</p>}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label htmlFor="activity" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nivel de Actividad Semanal</label>
                <select 
                  id="activity" value={formData.activity} onChange={(e) => setFormData({...formData, activity: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                >
                  <option value="1.2">Poco o ningún ejercicio (Sedentario)</option>
                  <option value="1.375">Ejercicio ligero (1-3 días/semana)</option>
                  <option value="1.55">Ejercicio moderado (3-5 días/semana)</option>
                  <option value="1.725">Ejercicio fuerte (6-7 días/semana)</option>
                  <option value="1.9">Ejercicio muy fuerte (Atletas / Trabajo físico)</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg active:scale-[0.98]">
                <Calculator className="w-6 h-6" /> Calcular Gasto Total
              </button>
            </form>
          </div>
        </section>

        {/* RESULTADOS */}
        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
              <div className="text-center mb-8 border-b border-slate-800 pb-8">
                <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Tu Gasto Diario (GET)</p>
                <div className="text-6xl font-black text-white italic tracking-tighter">
                  {result ? result.get : '--'} <span className="text-xl text-slate-600">kcal</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  { label: 'Definición (-500)', val: result?.goals.loss, color: 'text-orange-400' },
                  { label: 'Mantenimiento', val: result?.goals.maintain, color: 'text-emerald-400' },
                  { label: 'Volumen (+500)', val: result?.goals.gain, color: 'text-blue-400' }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                    <div className={`text-[10px] font-black uppercase tracking-widest ${item.color}`}>{item.label}</div>
                    <div className="text-xl font-black text-white italic">{item.val || '--'} <span className="text-[10px] text-slate-600">kcal</span></div>
                  </div>
                ))}
              </div>

              {/* SHARE */}
              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center shadow-lg"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center shadow-lg"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-emerald-500 text-emerald-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mi GET Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center shadow-lg"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          {/* EMBED CODE */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-emerald-500" /> Inserta este Widget
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
            <Flame className="w-8 h-8 text-emerald-500" /> ¿Qué es el GET (TDEE) y por qué es vital para tu físico?
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                El **Gasto Energético Total (GET)**, conocido en inglés como **TDEE**, es el número real de calorías que tu cuerpo quema en un periodo de 24 horas. A diferencia del metabolismo basal, que solo mide la supervivencia, el GET incluye cada movimiento que haces: desde lavarte los dientes hasta una sesión intensa de CrossFit.
              </p>
              <p>
                Entender tu GET es el primer paso para cualquier transformación física. Si tu objetivo es perder grasa, debes consumir menos que tu GET. Si quieres ganar músculo, debes consumir más. Es la base de la **ley de balance energético**, el principio fundamental de la nutrición deportiva moderna.
              </p>
              <h3 className="text-xl font-bold text-white italic">Los Componentes del Gasto Total</h3>
              <p>
                Tu GET no es una cifra estática; se compone de cuatro variables dinámicas: tu Gasto Basal (BMR), el Efecto Térmico de los Alimentos (TEF), la Termogénesis por Actividad Física (EAT) y el **NEAT** (actividad no deportiva), que suele ser el factor más diferenciador entre personas.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-xl font-bold text-emerald-500 italic mb-4 uppercase text-center">Desglose del Gasto Energético</h3>
              {[
                { t: "Gasto Basal (60-70%)", d: "Energía para mantener órganos y vida en reposo." },
                { t: "Efecto Térmico (10%)", d: "Calorías quemadas procesando y digiriendo comida." },
                { t: "Actividad Física (15-30%)", d: "Ejercicio estructurado y NEAT (caminar, moverse)." }
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
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">La Importancia del Factor de Actividad</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "El Error de la Sobreestimación", text: "Muchos usuarios eligen 'Muy Activo' cuando en realidad pasan 8 horas sentados y solo entrenan 1 hora. Esto lleva a consumir demasiadas calorías. Sé honesto con tu nivel de movimiento real diario." },
              { title: "Metabolismo Adaptativo", text: "Cuando estás en déficit por mucho tiempo, tu cuerpo se vuelve más eficiente y tu GET puede bajar ligeramente. Es lo que llamamos adaptación metabólica; por eso los cálculos deben revisarse cada 4-8 semanas." },
              { title: "El Poder del NEAT", text: "Aumentar tu GET no solo depende del gimnasio. Caminar 10.000 pasos al día puede aumentar tu gasto energético más que una sesión de pesas de 45 minutos." }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl group hover:border-emerald-500/40 transition-all">
                <h3 className="text-emerald-500 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-t from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Ciencia aplicada a tu rendimiento</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify md:text-center">
            Nuestra calculadora utiliza la **Ecuación de Mifflin-St Jeor**, validada científicamente como una de las más exactas para estimar el requerimiento calórico. Sin embargo, recuerda que el resultado es una estimación. La forma definitiva de ajustar tu GET es monitorizar tu peso y sensaciones durante 2-3 semanas con una ingesta fija. Utiliza estos datos como tu "punto de partida inteligente" para navegar hacia tu mejor versión física.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Protocolo TDEE", "Fórmula Mifflin-St Jeor", "Nutrición de Precisión"].map((tag, i) => (
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