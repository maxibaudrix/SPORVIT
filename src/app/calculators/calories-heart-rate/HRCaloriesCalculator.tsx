"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Heart, Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Activity, Timer, Scale, User, Zap, ShieldAlert, ArrowRight, Share2 
} from 'lucide-react';

export default function HRCaloriesCalculator() {
  const [formData, setFormData] = useState({
    gender: 'male',
    age: '',
    weight: '',
    avgHR: '',
    duration: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<number | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(window.location.href); }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  };

  const calculateCalories = (e: React.FormEvent) => {
    e.preventDefault();
    const { gender, age, weight, avgHR, duration } = formData;
    const A = parseFloat(age), W = parseFloat(weight), HR = parseFloat(avgHR), T = parseFloat(duration);
    
    let newErrors: Record<string, string> = {};
    if (!A || A < 10) newErrors.age = "Edad no válida";
    if (!W || W < 30) newErrors.weight = "Peso no válido";
    if (!HR || HR < 40) newErrors.avgHR = "Pulsaciones bajas";
    if (!T || T <= 0) newErrors.duration = "Tiempo requerido";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // FÓRMULA DE KEYTEL ET AL. (2005)
    // Male: [(-55.0969 + (0.6309 * HR) + (0.1988 * W) + (0.2017 * A)) / 4.184] * T
    // Female: [(-20.4022 + (0.4472 * HR) - (0.1263 * W) + (0.0740 * A)) / 4.184] * T
    let calories;
    if (gender === 'male') {
      calories = ((-55.0969 + (0.6309 * HR) + (0.1988 * W) + (0.2017 * A)) / 4.184) * T;
    } else {
      calories = ((-20.4022 + (0.4472 * HR) - (0.1263 * W) + (0.0740 * A)) / 4.184) * T;
    }

    setResult(Math.round(Math.max(0, calories)));
    
    if ((window as any).gtag) {
      (window as any).gtag('event', 'calculate_hr_calories', { gender, duration: T });
    }
  };

  const shareText = useMemo(() => 
    result ? `🔥 He quemado ${result} kcal basándome en mi frecuencia cardíaca. ¡Calcula las tuyas en Sporvit!` : "", 
  [result]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; overflow:hidden;" title="Calculadora Calorías FC Sporvit"></iframe>`,
  [currentUrl]);

  const copyToClipboard = useCallback(async (text: string, type: 'embed' | 'share') => {
    await navigator.clipboard.writeText(text);
    if (type === 'embed') setCopyStatus('copied');
    else setShareStatus('copied');
    setTimeout(() => { setCopyStatus('idle'); setShareStatus('idle'); }, 2000);
  }, []);

  return (
    <div className="pt-8 pb-16 container mx-auto px-4 sm:px-6 max-w-6xl">
      {/* HEADER SEO */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <Heart className="w-3 h-3 animate-pulse" /> Bio-Feedback en Tiempo Real
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Calculadora de Calorías por Frecuencia Cardíaca
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
          "Tus latidos no mienten. Traduce tu esfuerzo cardiovascular en energía consumida con precisión clínica."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        {/* CONFIGURACIÓN */}
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={calculateCalories} noValidate className="space-y-6">
              <div className="flex gap-4 p-1 bg-slate-950 rounded-2xl border border-slate-800">
                {(['male', 'female'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleInputChange('gender', g)}
                    className={`flex-1 py-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
                      formData.gender === g ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    <User className="w-4 h-4" /> {g === 'male' ? 'HOMBRE' : 'MUJER'}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { id: 'age', label: 'Edad', icon: Activity, placeholder: '30' },
                  { id: 'weight', label: 'Peso (kg)', icon: Scale, placeholder: '75' },
                  { id: 'avgHR', label: 'FC Media (bpm)', icon: Heart, placeholder: '145' },
                  { id: 'duration', label: 'Tiempo (min)', icon: Timer, placeholder: '45' }
                ].map((input) => (
                  <div key={input.id} className="space-y-2">
                    <label htmlFor={input.id} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <input.icon className="w-3 h-3 text-emerald-500" /> {input.label}
                    </label>
                    <input
                      id={input.id}
                      type="number"
                      value={(formData as any)[input.id]}
                      onChange={(e) => handleInputChange(input.id, e.target.value)}
                      className={`w-full bg-slate-950 border ${errors[input.id] ? 'border-red-500' : 'border-slate-800'} rounded-xl py-4 px-5 text-xl text-white outline-none focus:border-emerald-500 font-black transition-all`}
                      placeholder={input.placeholder}
                      aria-invalid={!!errors[input.id]}
                      aria-required="true"
                    />
                    {errors[input.id] && <p className="text-red-500 text-[10px] font-bold flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> {errors[input.id]}</p>}
                  </div>
                ))}
              </div>

              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] uppercase tracking-tighter flex items-center justify-center gap-4 text-lg active:scale-[0.98]">
                <Zap className="w-6 h-6" /> Procesar Datos Cardíacos
              </button>
            </form>
          </div>
        </section>

        {/* RESULTADOS */}
        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result !== null ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl overflow-hidden relative">
              <div className="text-center mb-8 border-b border-slate-800/50 pb-8">
                <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Energía Consumida</p>
                <div className="text-7xl font-black text-white italic tracking-tighter">
                  {result !== null ? result : '--'} <span className="text-2xl text-slate-500">kcal</span>
                </div>
              </div>

              <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 mb-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                    <Info className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed italic">
                    Este resultado se basa en la <strong>Fórmula de Keytel</strong>, que considera la relación lineal entre el consumo de oxígeno y la frecuencia cardíaca durante el ejercicio aeróbico.
                  </p>
                </div>
              </div>

              {/* SHARE */}
              {result !== null && (
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center shadow-lg" aria-label="WhatsApp"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center shadow-lg" aria-label="Telegram"><Send className="w-5 h-5" /></button>
                  <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus === 'copied' ? 'border-emerald-500 text-emerald-500' : 'border-slate-800 text-slate-400'}`} aria-label="Copiar Enlace">{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button onClick={() => window.location.href=`mailto:?subject=Mis Calorías quemadas&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center shadow-lg" aria-label="Email"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          {/* EMBED CODE */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-emerald-500" /> Widget Profesional
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-emerald-500/50 focus:outline-none resize-none mb-3" />
            <button onClick={() => copyToClipboard(embedSnippet, 'embed')} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
              {copyStatus === 'copied' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copyStatus === 'copied' ? 'CÓDIGO COPIADO' : 'COPIAR CÓDIGO EMBED'}
            </button>
          </div>
        </aside>
      </div>

      {/* CONTENIDO EDUCATIVO ESTRATÉGICO SEO (+800 PALABRAS) */}
      <article className="prose prose-invert prose-slate max-w-none space-y-16">
        <section className="bg-slate-900/30 border border-slate-800 rounded-[40px] p-8 md:p-12">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-4">
            <Heart className="w-8 h-8 text-emerald-500" /> Por qué las Pulsaciones son el Mejor Indicador de Gasto Energético
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                Mientras que las calculadoras basadas en la actividad (METs) estiman las calorías según el tipo de ejercicio, la frecuencia cardíaca nos ofrece una ventana directa al esfuerzo fisiológico real de un individuo. El corazón actúa como una bomba cuya velocidad está intrínsecamente ligada al consumo de oxígeno (VO2).
              </p>
              <p>
                Utilizamos la <strong>Ecuación de Keytel et al.</strong>, desarrollada en 2005 tras un exhaustivo estudio de laboratorio. A diferencia de fórmulas antiguas, esta ecuación integra el peso corporal y la edad como moderadores de la intensidad cardíaca. Esto es vital porque dos personas corriendo a la misma velocidad pueden tener pulsaciones radicalmente distintas dependiendo de su nivel de fitness y su composición corporal.
              </p>
              <h3 className="text-xl font-bold text-white italic">Ventajas frente al cálculo por METs</h3>
              <p>
                El método MET es "estático"; asume que todo el mundo quema lo mismo haciendo la misma actividad. El método por frecuencia cardíaca es "dinámico": si hoy entrenas con fatiga y tus pulsaciones suben más de lo normal para la misma carga, tu gasto calórico real será mayor debido al estrés metabólico adicional.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 space-y-6">
              <h3 className="text-xl font-bold text-emerald-500 italic mb-4 uppercase">Factores que Afectan la Precisión</h3>
              <ul className="space-y-4 text-sm font-medium">
                <li className="flex gap-3"><ArrowRight className="w-4 h-4 text-emerald-500 shrink-0" /> <span><strong>Estado de hidratación:</strong> La deshidratación eleva el pulso sin aumentar necesariamente el gasto calórico (deriva cardíaca).</span></li>
                <li className="flex gap-3"><ArrowRight className="w-4 h-4 text-emerald-500 shrink-0" /> <span><strong>Estimulantes:</strong> La cafeína o pre-entrenos pueden elevar artificialmente las pulsaciones.</span></li>
                <li className="flex gap-3"><ArrowRight className="w-4 h-4 text-emerald-500 shrink-0" /> <span><strong>Temperatura:</strong> El calor extremo obliga al corazón a latir más rápido para refrigerar el cuerpo.</span></li>
              </ul>
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-xs text-slate-400 italic">
                *Para obtener el dato más preciso, utiliza la frecuencia cardíaca promedio de toda la sesión, no el pico máximo alcanzado.
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Cómo Interpretar tus Resultados</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Zonas de Intensidad", text: "Si tus pulsaciones medias están por debajo del 60% de tu FC Máxima, el gasto será predominantemente lipolítico (grasas). Por encima del 80%, el cuerpo prioriza el glucógeno muscular y el gasto calórico total se dispara." },
              { title: "Calorías Totales vs Netas", text: "Nuestra fórmula calcula el gasto bruto durante el ejercicio. Esto incluye tu metabolismo basal durante ese tiempo. No sumes este resultado a tu TDEE sin antes descontar el tiempo de actividad." },
              { title: "Variabilidad por Sexo", text: "Los hombres suelen quemar más calorías para un mismo pulso debido a una mayor masa muscular y niveles de hemoglobina, lo que se refleja en los coeficientes diferenciales de la fórmula Keytel." }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl group hover:border-emerald-500/40 transition-all">
                <h3 className="text-emerald-500 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-t from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Limitaciones del Método</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg">
            Es importante notar que esta fórmula es altamente precisa para <strong>ejercicio aeróbico de estado estacionario</strong> (running, ciclismo, elíptica). En entrenamientos de fuerza pura (Powerlifting) o HIIT de muy corta duración, la relación entre el pulso y el consumo de oxígeno es menos lineal, pudiendo sobreestimar el gasto. En esos casos, recomendamos cruzar los datos con la duración del entrenamiento y la percepción del esfuerzo (RPE).
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Ecuación Keytel 2005", "Validado con Calorimetría", "Específico para Pulsómetros"].map((tag, i) => (
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