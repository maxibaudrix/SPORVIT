"use client";

import React, { useState, useEffect } from 'react';
import { 
  Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  Flame, User, Activity, Share2 
} from 'lucide-react';

interface CalculationResult {
  bmr: number;
  tdee: number;
  goals: {
    loseWeight: number;
    maintain: number;
    gainWeight: number;
  };
}

export default function CalorieRequirementCalculator() {
  const [formData, setFormData] = useState({
    gender: 'male',
    age: '',
    weight: '',
    height: '',
    activity: '1.2'
  });
  
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { 
    setCurrentUrl(window.location.href); 
  }, []);

  const calculateCalories = (e: React.FormEvent) => {
    e.preventDefault();
    const age = parseFloat(formData.age);
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const activity = parseFloat(formData.activity);

    if (!age || !weight || !height) return;

    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr = formData.gender === 'male' ? bmr + 5 : bmr - 161;
    const tdee = bmr * activity;

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      goals: {
        loseWeight: Math.round(tdee - 500),
        maintain: Math.round(tdee),
        gainWeight: Math.round(tdee + 500)
      }
    });
  };

  const copyToClipboard = (text: string, type: 'embed' | 'share' = 'embed') => {
    navigator.clipboard.writeText(text);
    if (type === 'embed') {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } else {
      setShareStatus('copied');
      setTimeout(() => setShareStatus('idle'), 2000);
    }
  };

  const shareText = result 
    ? `¡Mi requerimiento calórico diario es de ${result.tdee} kcal! Calcúlalo tú también en Sporvit:` 
    : "Calcula tu requerimiento calórico en Sporvit:";

  const embedSnippet = `<iframe src="${currentUrl}" width="100%" height="850px" frameborder="0" style="border-radius:20px; overflow:hidden;" title="Calculadora de Requerimiento Calórico Sporvit"></iframe>`;

  return (
    <div className="pt-8 pb-16 container mx-auto px-4 sm:px-6 max-w-6xl">
      {/* HEADER */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
          <Flame className="w-3 h-3" /> Nutrición Inteligente
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Calculadora de Requerimiento Calórico
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
          "Ajusta tu ingesta energética para dominar tu composición corporal."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* FORMULARIO */}
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
            <form onSubmit={calculateCalories} className="space-y-6">
              <div className="flex gap-4 p-1 bg-slate-950 rounded-2xl border border-slate-800">
                {(['male', 'female'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setFormData({...formData, gender: g})}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      formData.gender === g ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <User className="w-4 h-4" /> {g === 'male' ? 'HOMBRE' : 'MUJER'}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Edad</label>
                  <input type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white outline-none focus:border-emerald-500 font-bold" placeholder="25" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Peso (kg)</label>
                  <input type="number" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white outline-none focus:border-emerald-500 font-bold" placeholder="75" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Altura (cm)</label>
                  <input type="number" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white outline-none focus:border-emerald-500 font-bold" placeholder="180" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nivel de Actividad</label>
                <select value={formData.activity} onChange={e => setFormData({...formData, activity: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white outline-none focus:border-emerald-500 font-bold appearance-none">
                  <option value="1.2">Sedentario (Oficina / Sin ejercicio)</option>
                  <option value="1.375">Ligero (1-3 días de deporte)</option>
                  <option value="1.55">Moderado (3-5 días de deporte)</option>
                  <option value="1.725">Fuerte (6-7 días de deporte)</option>
                  <option value="1.9">Muy fuerte (Atleta / Trabajo físico)</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-5 px-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-3">
                <Calculator className="w-5 h-5" /> Calcular Requerimiento
              </button>
            </form>
          </div>
        </section>

        {/* RESULTADOS Y COMPARTIR */}
        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-40 grayscale pointer-events-none transition-all'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl">
              <div className="text-center mb-6 pb-6 border-b border-slate-800">
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-1">Tu Gasto Energético Total (TDEE)</p>
                <div className="text-4xl md:text-5xl font-black text-white tracking-tighter inline-flex items-baseline gap-2">
                  {result ? result.tdee : '--'} 
                  <span className="text-lg text-emerald-500 italic">kcal</span>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Déficit (Perder Grasa)', val: result?.goals.loseWeight, color: 'text-orange-400' },
                  { label: 'Mantenimiento', val: result?.goals.maintain, color: 'text-emerald-400' },
                  { label: 'Superávit (Ganar Músculo)', val: result?.goals.gainWeight, color: 'text-blue-400' }
                ].map((item, i) => (
                  <div key={i} className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 flex justify-between items-center">
                    <div>
                      <div className={`text-[10px] font-bold uppercase tracking-widest ${item.color} mb-1`}>{item.label}</div>
                      <div className="text-xl font-black text-white">{item.val || '--'} <span className="text-[10px] text-slate-600 uppercase">kcal/día</span></div>
                    </div>
                    <Flame className={`w-5 h-5 ${item.color} opacity-20`} />
                  </div>
                ))}
              </div>

              {/* BLOQUE COMPARTIR RESULTADOS */}
              {result && (
                <div className="mt-6 pt-6 border-t border-slate-800">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-3 text-center">
                    Compartir Resultados
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    <button 
                      onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`, '_blank')}
                      className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 hover:border-green-500/30 transition-all flex justify-center shadow-lg"
                      aria-label="Compartir en WhatsApp"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </button>
                    
                    <button 
                      onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`, '_blank')}
                      className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 hover:border-blue-400/30 transition-all flex justify-center shadow-lg"
                      aria-label="Compartir en Telegram"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                    
                    <button 
                      onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')}
                      className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${
                        shareStatus === 'copied' 
                          ? 'border-emerald-500 text-emerald-500' 
                          : 'border-slate-800 text-slate-400 hover:border-emerald-500/30 hover:text-emerald-400'
                      }`}
                      aria-label={shareStatus === 'copied' ? 'Enlace copiado' : 'Copiar enlace'}
                    >
                      {shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                    
                    <button 
                      onClick={() => window.location.href=`mailto:?subject=${encodeURIComponent('Mi Requerimiento Calórico - Sporvit')}&body=${encodeURIComponent(shareText + "\n\n" + currentUrl)}`}
                      className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 hover:border-amber-400/30 transition-all flex justify-center shadow-lg"
                      aria-label="Compartir por email"
                    >
                      <Mail className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* EMBED CODE */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4 text-white uppercase tracking-wider font-bold text-xs justify-center">
              <Code className="w-4 h-4 text-emerald-400" /> Inserta en tu Web
            </div>
            <textarea readOnly value={embedSnippet} className="w-full h-20 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-emerald-500/70 focus:outline-none resize-none" />
            <button onClick={() => copyToClipboard(embedSnippet, 'embed')} className="mt-3 w-full py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
              {copyStatus === 'copied' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copyStatus === 'copied' ? 'COPIADO' : 'COPIAR CÓDIGO'}
            </button>
          </div>
        </aside>
      </div>

      {/* EDUCATIONAL */}
      <section className="mt-20 max-w-4xl mx-auto space-y-8">
        <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3 italic uppercase tracking-tighter">
            <Info className="w-6 h-6 text-emerald-500" /> Entendiendo tu TDEE
          </h2>
          <div className="prose prose-invert prose-slate max-w-none">
            <p className="text-slate-400 leading-relaxed mb-4">
              El <strong>Gasto Energético Total Diario (TDEE)</strong> es una estimación de cuántas calorías quemas al día cuando se tiene en cuenta el ejercicio. Se calcula determinando primero tu Tasa Metabólica Basal y multiplicándola por un factor de actividad.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Utilizamos la fórmula de <strong>Mifflin-St Jeor</strong>, considerada la más precisa por la comunidad científica nutricional actual. Conocer este número es vital: si comes más de este número, ganarás peso; si comes menos, perderás peso.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}