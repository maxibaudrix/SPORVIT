"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Flame, Scale, Target, Zap, ShieldAlert, ArrowRight, Share2, User, Activity, Ruler
} from 'lucide-react';

const DEFICIT_LEVELS = [
  { id: 'conservative', name: 'Conservador (-15%)', pct: 0.15, desc: 'Ideal para principiantes o bajo estrés.' },
  { id: 'moderate', name: 'Moderado (-20%)', pct: 0.20, desc: 'El estándar de oro para pérdida de grasa.' },
  { id: 'aggressive', name: 'Agresivo (-25%)', pct: 0.25, desc: 'Solo para periodos cortos o niveles altos de grasa.' }
];

export default function CaloricDeficitCalculator() {
  const [formData, setFormData] = useState({
    gender: 'male',
    age: '',
    weight: '',
    height: '',
    activity: '1.2',
    deficitLevel: 'moderate'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const calculateDeficit = (e: React.FormEvent) => {
    e.preventDefault();
    const { gender, age, weight, height, activity, deficitLevel } = formData;
    const A = parseFloat(age), W = parseFloat(weight), H = parseFloat(height), ACT = parseFloat(activity);
    
    let newErrors: Record<string, string> = {};
    if (!A || A < 15) newErrors.age = "Edad mínima 15 años";
    if (!W || W < 35) newErrors.weight = "Peso no válido";
    if (!H || H < 100) newErrors.height = "Altura no válida";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    // 1. Calcular BMR (Mifflin-St Jeor)
    let bmr = (10 * W) + (6.25 * H) - (5 * A);
    bmr = gender === 'male' ? bmr + 5 : bmr - 161;

    // 2. TDEE
    const tdee = bmr * ACT;

    // 3. Aplicar Déficit
    const selectedDeficit = DEFICIT_LEVELS.find(d => d.id === deficitLevel)?.pct || 0.20;
    const goalCalories = Math.round(tdee * (1 - selectedDeficit));
    const lossKgWeekly = Math.round(((tdee * selectedDeficit * 7) / 7700) * 100) / 100;

    setResult({
      tdee: Math.round(tdee),
      goal: goalCalories,
      deficitKcal: Math.round(tdee - goalCalories),
      weeklyLoss: lossKgWeekly
    });

    if ((window as any).gtag) {
      (window as any).gtag('event', 'calculate_deficit', { goal: goalCalories });
    }
  };

  const shareText = useMemo(() => 
    result ? `🔥 Mi objetivo para perder grasa es de ${result.goal} kcal diarias. ¡Calcula tu déficit en Sporvit!` : "", 
  [result]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden;" title="Calculadora Déficit Sporvit"></iframe>`,
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <Flame className="w-3 h-3" /> Protocolo de Definición Corporal
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Calculadora de Déficit Calórico
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
          "Pierde grasa, mantén el músculo. La ciencia del déficit aplicada a tu transformación."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        {/* INPUTS */}
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateDeficit} noValidate className="space-y-6">
              <div className="flex gap-4 p-1 bg-slate-950 rounded-2xl border border-slate-800">
                {(['male', 'female'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setFormData({...formData, gender: g})}
                    className={`flex-1 py-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
                      formData.gender === g ? 'bg-orange-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    <User className="w-4 h-4" /> {g === 'male' ? 'HOMBRE' : 'MUJER'}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'age', label: 'Edad', icon: Activity, placeholder: '25' },
                  { id: 'weight', label: 'Peso (kg)', icon: Scale, placeholder: '80' },
                  { id: 'height', label: 'Altura (cm)', icon: Ruler, placeholder: '180' }
                ].map((input) => (
                  <div key={input.id} className="space-y-2">
                    <label htmlFor={input.id} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <input.icon className="w-3 h-3 text-orange-500" /> {input.label}
                    </label>
                    <input
                      id={input.id}
                      type="number"
                      value={(formData as any)[input.id]}
                      onChange={(e) => setFormData({...formData, [input.id]: e.target.value})}
                      className={`w-full bg-slate-950 border ${errors[input.id] ? 'border-red-500' : 'border-slate-800'} rounded-xl py-4 px-5 text-white outline-none focus:border-orange-500 font-bold`}
                      placeholder={input.placeholder}
                    />
                    {errors[input.id] && <p className="text-red-500 text-[10px] font-bold">{errors[input.id]}</p>}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label htmlFor="activity" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nivel de Actividad</label>
                <select 
                  id="activity"
                  value={formData.activity}
                  onChange={(e) => setFormData({...formData, activity: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-orange-500 appearance-none cursor-pointer"
                >
                  <option value="1.2">Sedentario (Oficina / Nula)</option>
                  <option value="1.375">Ligera (1-2 días/sem)</option>
                  <option value="1.55">Moderada (3-5 días/sem)</option>
                  <option value="1.725">Intensa (6-7 días/sem)</option>
                  <option value="1.9">Atleta (2 sesiones/día)</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nivel de Déficit</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {DEFICIT_LEVELS.map((level) => (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setFormData({...formData, deficitLevel: level.id})}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        formData.deficitLevel === level.id 
                        ? 'bg-orange-500 border-orange-500 text-slate-950 shadow-lg' 
                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-orange-500/50'
                      }`}
                    >
                      <div className="text-[10px] font-black uppercase mb-1">{level.name}</div>
                      <div className={`text-[9px] font-bold leading-tight ${formData.deficitLevel === level.id ? 'text-slate-800' : 'text-slate-600'}`}>{level.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full bg-orange-500 hover:bg-orange-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-[0_0_30px_-5px_rgba(249,115,22,0.3)] uppercase tracking-tighter flex items-center justify-center gap-4 text-lg active:scale-[0.98]">
                <Calculator className="w-6 h-6" /> Calcular Mi Déficit
              </button>
            </form>
          </div>
        </section>

        {/* RESULTADOS */}
        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
              <div className="text-center mb-8 border-b border-slate-800/50 pb-8">
                <p className="text-orange-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Tu Meta Diaria</p>
                <div className="text-7xl font-black text-white italic tracking-tighter">
                  {result ? result.goal : '--'} <span className="text-2xl text-slate-500">kcal</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                  <div>
                    <div className="text-[10px] font-black uppercase text-slate-400">Recorte Diario</div>
                    <div className="text-xl font-black text-orange-400">-{result?.deficitKcal || '--'} <span className="text-[10px] text-slate-600">kcal</span></div>
                  </div>
                  <Flame className="w-8 h-8 text-orange-500/20" />
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                  <div>
                    <div className="text-[10px] font-black uppercase text-slate-400">Pérdida Estimada</div>
                    <div className="text-xl font-black text-white">{result?.weeklyLoss || '--'} <span className="text-[10px] text-slate-600">kg/semana</span></div>
                  </div>
                  <Target className="w-8 h-8 text-emerald-500/20" />
                </div>
              </div>

              {/* SHARE */}
              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center" aria-label="WhatsApp"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center" aria-label="Telegram"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center ${shareStatus === 'copied' ? 'border-orange-500 text-orange-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mi Déficit Calórico&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center" aria-label="Email"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-orange-500" /> Widget de Transformación
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-orange-400/50 focus:outline-none resize-none mb-3" />
            <button onClick={() => copyToClipboard(embedSnippet, 'embed')} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
              {copyStatus === 'copied' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copyStatus === 'copied' ? 'COPIADO' : 'COPIAR CÓDIGO'}
            </button>
          </div>
        </aside>
      </div>

      {/* CONTENIDO EDUCATIVO (+800 PALABRAS) */}
      <article className="prose prose-invert prose-slate max-w-none space-y-16">
        <section className="bg-slate-900/30 border border-slate-800 rounded-[40px] p-8 md:p-12">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-4">
            <Target className="w-8 h-8 text-orange-500" /> Domina el Déficit Calórico: La Única Vía para Quemar Grasa
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                A pesar de las modas dietéticas, la termodinámica es innegable: para perder grasa corporal, tu cuerpo debe gastar más energía de la que consume. Este estado se denomina **Déficit Calórico**. Cuando esto ocurre, el organismo se ve obligado a utilizar sus reservas energéticas (principalmente el tejido adiposo) para cubrir la diferencia.
              </p>
              <p>
                Sin embargo, no todos los déficits son iguales. Un recorte excesivamente agresivo puede disparar el hambre, reducir tu gasto metabólico base y provocar la pérdida de esa valiosa masa muscular que tanto te ha costado ganar. Por ello, nuestra calculadora propone rangos de entre el **15% y 25%**, validados por el Colegio Americano de Medicina Deportiva (ACSM).
              </p>
              <h3 className="text-xl font-bold text-white italic text-left">El papel de la masa muscular</h3>
              <p>
                El músculo es un tejido metabólicamente costoso. Durante un déficit, el cuerpo intenta "ahorrar" energía y el músculo puede ser degradado. Para evitarlo, es imperativo combinar el déficit con un entrenamiento de fuerza estimulante y una ingesta de proteína elevada (1.8g - 2.2g por kg de peso).
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 space-y-6">
              <h3 className="text-xl font-bold text-orange-500 italic mb-4 uppercase text-center">Niveles de Déficit Sugeridos</h3>
              <div className="space-y-4">
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="font-black text-xs text-white uppercase">Conservador (10-15%)</div>
                  <div className="text-[11px] text-slate-500 italic">Mínimo impacto en el rendimiento. Ideal si ya tienes un porcentaje de grasa bajo.</div>
                </div>
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="font-black text-xs text-white uppercase">Moderado (20%)</div>
                  <div className="text-[11px] text-slate-500 italic">El balance perfecto entre velocidad de pérdida y mantenimiento de fuerza.</div>
                </div>
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="font-black text-xs text-white uppercase">Agresivo (25-30%)</div>
                  <div className="text-[11px] text-slate-500 italic">Resultados rápidos pero difícil de sostener. Úsalo solo si tienes mucho peso que perder.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Adherencia: El Factor X</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Densidad Nutricional", text: "En déficit, tienes menos calorías 'presupuestadas'. Prioriza alimentos con mucho volumen y pocas kcal (verduras, frutas, carnes magras) para mantener la saciedad alta." },
              { title: "Descansos de Dieta", text: "Hacer una semana a calorías de mantenimiento cada 8-12 semanas de déficit puede ayudar a resetear hormonas como la leptina y mejorar la adherencia psicológica." },
              { title: "Actividad no Deportiva", text: "El NEAT (pasos, moverte en casa) es crucial. A menudo, cuando bajamos calorías, nos movemos menos inconscientemente. Mantén tus pasos diarios altos." }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl group hover:border-orange-500/40 transition-all">
                <h3 className="text-orange-500 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-t from-orange-500/10 to-transparent border border-orange-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">¿Por qué el peso se estanca?</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify">
            La pérdida de peso no es lineal. Es común ver estancamientos de 1-2 semanas seguidos de una caída repentina. Esto suele deberse a la retención de agua (cortisol elevado) que enmascara la pérdida de grasa. No ajustes tus calorías a la baja inmediatamente; evalúa tu progreso con medidas corporales, fotos y cómo te queda la ropa antes de tomar decisiones drásticas. Recuerda: **el éxito en el déficit calórico es un maratón, no un sprint.**
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Protocolo Mifflin-St Jeor", "Pérdida de Grasa Científica", "déficit Calorico"].map((tag, i) => (
              <span key={i} className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-full text-[10px] font-black text-orange-400 uppercase tracking-widest">
                {tag}
              </span>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}