"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Flame, User, Activity, Zap, ShieldCheck, ArrowRight, Target, Brain
} from 'lucide-react';

export default function HarrisBenedictCalculator() {
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => {
      const newErrs = { ...prev };
      delete newErrs[field];
      return newErrs;
    });
  };

  const calculateHB = (e: React.FormEvent) => {
    e.preventDefault();
    const { gender, age, weight, height, activity } = formData;
    const a = parseFloat(age), w = parseFloat(weight), h = parseFloat(height), act = parseFloat(activity);
    
    let newErrors: Record<string, string> = {};
    if (!a || a < 15 || a > 100) newErrors.age = "Edad entre 15 y 100 años";
    if (!w || w < 30 || w > 250) newErrors.weight = "Peso entre 30 y 250 kg";
    if (!h || h < 100 || h > 250) newErrors.height = "Altura entre 100 y 250 cm";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Fórmula Revisada Harris-Benedict (Roza & Shizgal, 1984)
    let bmr;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a);
    } else {
      bmr = 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a);
    }

    const tdee = bmr * act;
    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      goals: {
        loss: Math.round(tdee * 0.8),
        maintain: Math.round(tdee),
        gain: Math.round(tdee * 1.1)
      }
    });

    if ((window as any).gtag) {
      (window as any).gtag('event', 'calculate_hb', { gender, tdee });
    }
  };

  const shareText = useMemo(() => 
    result ? `Mi metabolismo basal es de ${result.bmr} kcal. ¡Calcula el tuyo con la fórmula Harris-Benedict en Sporvit!` : "", 
  [result]);

  const embedSnippet = useMemo(() => 
    `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:20px; overflow:hidden;" title="Calculadora Harris-Benedict Sporvit"></iframe>`,
  [currentUrl]);

  const copyToClipboard = useCallback(async (text: string, type: 'embed' | 'share') => {
    await navigator.clipboard.writeText(text);
    if (type === 'embed') setCopyStatus('copied');
    else setShareStatus('copied');
    setTimeout(() => { setCopyStatus('idle'); setShareStatus('idle'); }, 2000);
  }, []);

  return (
    <div className="pt-8 pb-20 container mx-auto px-4 sm:px-6 max-w-6xl">
      {/* SECCIÓN H1 Y HEADER */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <Brain className="w-3 h-3" /> Bioquímica Aplicada
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Calculadora de Calorías Harris-Benedict
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
          "La precisión en el cálculo metabólico es el cimiento de cualquier transformación física sostenible."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        {/* INPUTS */}
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
            <form onSubmit={calculateHB} noValidate className="space-y-6">
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'age', label: 'Edad', icon: Activity, placeholder: '28' },
                  { id: 'weight', label: 'Peso (kg)', icon: Target, placeholder: '75' },
                  { id: 'height', label: 'Altura (cm)', icon: ArrowRight, placeholder: '178' }
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
                      className={`w-full bg-slate-950 border ${errors[input.id] ? 'border-red-500' : 'border-slate-800'} rounded-xl py-4 px-5 text-white outline-none focus:border-emerald-500 font-bold transition-all`}
                      placeholder={input.placeholder}
                      aria-invalid={!!errors[input.id]}
                    />
                    {errors[input.id] && <p className="text-red-500 text-[10px] font-bold">{errors[input.id]}</p>}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label htmlFor="activity" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nivel de Actividad Diaria</label>
                <select 
                  id="activity"
                  value={formData.activity}
                  onChange={(e) => handleInputChange('activity', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white outline-none focus:border-emerald-500 font-bold appearance-none cursor-pointer"
                >
                  <option value="1.2">Sedentario (Oficina / Reposo)</option>
                  <option value="1.375">Ligero (1-2 días / semana)</option>
                  <option value="1.55">Moderado (3-5 días / semana)</option>
                  <option value="1.725">Intenso (6-7 días / semana)</option>
                  <option value="1.9">Atleta (2 sesiones diarias / Trabajo duro)</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-5 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-3">
                <Calculator className="w-5 h-5" /> Calcular Metabolismo
              </button>
            </form>
          </div>
        </section>

        {/* RESULTADOS */}
        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-8 border-b border-slate-800 pb-8">
                <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Tasa Metabólica Basal (TMB)</p>
                <div className="text-5xl font-black text-white italic tracking-tighter">
                  {result ? result.bmr : '--'} <span className="text-xl text-slate-600">kcal</span>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Gasto Total (TDEE)', val: result?.tdee, desc: 'Mantenimiento actual', color: 'text-white' },
                  { label: 'Déficit Sugerido', val: result?.goals.loss, desc: 'Pérdida de grasa segura', color: 'text-orange-400' },
                  { label: 'Superávit Sugerido', val: result?.goals.gain, desc: 'Ganancia muscular limpia', color: 'text-blue-400' }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-slate-950/50 border border-slate-800 rounded-2xl group hover:border-emerald-500/30 transition-all">
                    <div>
                      <div className={`text-[10px] font-black uppercase tracking-widest ${item.color}`}>{item.label}</div>
                      <div className="text-[10px] text-slate-600 font-bold italic">{item.desc}</div>
                    </div>
                    <div className="text-2xl font-black text-white italic">{item.val || '--'}</div>
                  </div>
                ))}
              </div>

              {/* SHARE BLOCK */}
              {result && (
                <div className="mt-8 pt-8 border-t border-slate-800">
                  <div className="grid grid-cols-4 gap-2">
                    <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center"><MessageCircle className="w-5 h-5" /></button>
                    <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center"><Send className="w-5 h-5" /></button>
                    <button onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center ${shareStatus === 'copied' ? 'border-emerald-500 text-emerald-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                    <button onClick={() => window.location.href=`mailto:?subject=Mis Calorías HB&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center"><Mail className="w-5 h-5" /></button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* EMBED */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-emerald-500" /> Widget para tu web
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-emerald-500/50 focus:outline-none resize-none cursor-pointer mb-3" />
            <button onClick={() => copyToClipboard(embedSnippet, 'embed')} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
              {copyStatus === 'copied' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copyStatus === 'copied' ? 'Copiado' : 'Copiar Código'}
            </button>
          </div>
        </aside>
      </div>

      {/* CONTENIDO EDUCATIVO (SEO +800 Palabras) */}
      <article className="prose prose-invert prose-slate max-w-none space-y-16">
        <section className="bg-slate-900/30 border border-slate-800 rounded-[40px] p-8 md:p-12">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-4">
            <Flame className="w-8 h-8 text-emerald-500" /> La Ecuación de Harris-Benedict: Ciencia Tras el Metabolismo
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg">
              <p>
                La calculadora Harris-Benedict es una herramienta fundamental en la nutrición moderna, utilizada para estimar la **Tasa Metabólica Basal (TMB)**. Este valor representa la energía mínima que tu cuerpo necesita para mantener sus funciones vitales en reposo: respiración, circulación sanguínea, regulación térmica y síntesis celular.
              </p>
              <p>
                Publicada originalmente en 1919 por James Arthur Harris y Francis Gano Benedict, esta fórmula revolucionó la dietética. Sin embargo, en Sporvit utilizamos la **versión revisada por Roza y Shizgal en 1984**, que ajusta los coeficientes para reflejar mejor la composición corporal de la población contemporánea, reduciendo el margen de error histórico.
              </p>
              <h3 className="text-xl font-bold text-white italic">¿Cómo se calcula exactamente?</h3>
              <p>
                A diferencia de fórmulas simplistas, Harris-Benedict tiene en cuenta el sexo biológico, la edad, el peso y la estatura. Esto se debe a que el tejido muscular es metabólicamente más activo que el tejido graso, y los hombres suelen tener una mayor proporción de masa magra, mientras que el metabolismo tiende a ralentizarse con la edad debido a la pérdida progresiva de sarcopenia natural.
              </p>
            </div>
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg bg-slate-950/40 p-8 rounded-3xl border border-slate-800">
              <h3 className="text-xl font-bold text-emerald-500 italic">Del TMB al TDEE: El Factor de Actividad</h3>
              <p>
                Conocer tu TMB es solo el 60-70% de la ecuación. Para saber cuántas calorías debes consumir realmente, aplicamos el **TDEE (Total Daily Energy Expenditure)**. Multiplicamos tu metabolismo base por un factor de actividad:
              </p>
              <ul className="space-y-4">
                <li className="flex gap-3"><Zap className="w-5 h-5 text-emerald-500 shrink-0" /> <span><strong>Sedentario (1.2):</strong> Actividad mínima, trabajos de oficina.</span></li>
                <li className="flex gap-3"><Zap className="w-5 h-5 text-emerald-500 shrink-0" /> <span><strong>Moderado (1.55):</strong> Entrenamiento 3-5 veces por semana.</span></li>
                <li className="flex gap-3"><Zap className="w-5 h-5 text-emerald-500 shrink-0" /> <span><strong>Atleta (1.9):</strong> Actividad física extrema o trabajos de construcción.</span></li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">Aplicación Práctica en tu Dieta</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Déficit Calórico", text: "Para perder grasa de forma saludable, se recomienda restar entre un 15% y 20% a tu TDEE. Un déficit demasiado agresivo (>500 kcal) puede provocar pérdida de masa muscular y desajustes hormonales." },
              { title: "Mantenimiento", text: "Es el 'punto de equilibrio'. Consumir exactamente lo que gastas permite estabilizar el peso y mejorar el rendimiento deportivo sin fluctuaciones en la balanza." },
              { title: "Superávit Calórico", text: "Indispensable para la hipertrofia. Un exceso ligero (10% extra) proporciona los sustratos necesarios para la síntesis de proteína muscular minimizando la ganancia de grasa." }
            ].map((box, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl">
                <h3 className="text-emerald-500 font-black italic mb-4 uppercase tracking-widest">{box.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{box.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-8 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">¿Es Harris-Benedict 100% Exacta?</h2>
          <p className="text-slate-400 leading-relaxed mb-6">
            Ninguna fórmula es perfecta. Harris-Benedict puede sobreestimar el gasto en personas con obesidad (debido a que el tejido graso quema poca energía) o subestimarlo en atletas de élite con gran masa muscular. En esos casos, fórmulas como Katch-McArdle son preferibles. Sin embargo, para el 90% de la población, Harris-Benedict sigue siendo el estándar de oro por su equilibrio entre simplicidad y precisión científica.
          </p>
          <div className="flex justify-center gap-4">
            <div className="px-4 py-2 bg-slate-950 rounded-full border border-slate-800 text-[10px] font-black text-emerald-500 uppercase tracking-widest">Aprobado por Nutricionistas</div>
            <div className="px-4 py-2 bg-slate-950 rounded-full border border-slate-800 text-[10px] font-black text-emerald-500 uppercase tracking-widest">Precisión Científica</div>
          </div>
        </section>
      </article>
    </div>
  );
}