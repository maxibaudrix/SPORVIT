// src/app/calculators/heart-rate-zones/HRZonesCalculator.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Heart, Calculator, Info, Share2, Code, Copy, 
  MessageCircle, Send, Mail, Check, ExternalLink, Activity, Zap, AlertCircle, ArrowRight
} from 'lucide-react';

// ============================================
// TIPOS
// ============================================
interface Zone {
  name: string;
  pct: string;
  range: string;
  desc: string;
  color: string;
}

interface CalculationResult {
  mhr: number;
  rhr: number;
  hrr: number;
  zones: Zone[];
}

interface FormData {
  age: string;
  restingHR: string;
}

interface ValidationError {
  field: 'age' | 'restingHR' | 'general';
  message: string;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export default function HRZonesCalculator() {
  const [formData, setFormData] = useState<FormData>({ age: '', restingHR: '60' });
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [validationError, setValidationError] = useState<ValidationError | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { 
    setCurrentUrl(window.location.href); 
  }, []);

  // ============================================
  // VALIDACIÓN DE DATOS
  // ============================================
  const validateInputs = (age: number, rhr: number): ValidationError | null => {
    if (!age || isNaN(age)) {
      return { field: 'age', message: 'Por favor ingresa tu edad' };
    }
    
    if (age < 18 || age > 100) {
      return { field: 'age', message: 'La edad debe estar entre 18 y 100 años' };
    }
    
    if (!rhr || isNaN(rhr)) {
      return { field: 'restingHR', message: 'Por favor ingresa tu FC en reposo' };
    }
    
    if (rhr < 30 || rhr > 100) {
      return { field: 'restingHR', message: 'La FC en reposo debe estar entre 30 y 100 BPM' };
    }

    const mhr = 220 - age;
    if (mhr <= rhr) {
      return { field: 'general', message: 'Tu FC en reposo no puede ser mayor o igual a tu FC máxima. Verifica los datos.' };
    }

    return null;
  };

  // ============================================
  // CÁLCULO DE ZONAS (MÉTODO KARVONEN)
  // ============================================
  const calculateZones = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const age = parseFloat(formData.age);
    const rhr = parseFloat(formData.restingHR);

    // Validar inputs
    const error = validateInputs(age, rhr);
    if (error) {
      setValidationError(error);
      return;
    }

    // Fórmula de Karvonen: FC objetivo = ((FC máx - FC reposo) × % intensidad) + FC reposo
    const mhr = 220 - age;
    const hrr = mhr - rhr; // Heart Rate Reserve

    const zones: Zone[] = [
      { 
        name: "Zona 1: Recuperación", 
        pct: "50-60%", 
        range: `${Math.round(hrr * 0.5 + rhr)} - ${Math.round(hrr * 0.6 + rhr)}`, 
        desc: "Calentamiento y recuperación activa. Ideal para días de descanso activo.", 
        color: "text-blue-400" 
      },
      { 
        name: "Zona 2: Quema de Grasa", 
        pct: "60-70%", 
        range: `${Math.round(hrr * 0.6 + rhr)} - ${Math.round(hrr * 0.7 + rhr)}`, 
        desc: "Base aeróbica y oxidación de grasas. Entrenamientos largos y sostenidos.", 
        color: "text-emerald-400" 
      },
      { 
        name: "Zona 3: Aeróbica", 
        pct: "70-80%", 
        range: `${Math.round(hrr * 0.7 + rhr)} - ${Math.round(hrr * 0.8 + rhr)}`, 
        desc: "Mejora del sistema cardiovascular. Tempo runs y entrenamientos moderados.", 
        color: "text-yellow-400" 
      },
      { 
        name: "Zona 4: Anaeróbica", 
        pct: "80-90%", 
        range: `${Math.round(hrr * 0.8 + rhr)} - ${Math.round(hrr * 0.9 + rhr)}`, 
        desc: "Aumenta el umbral de lactato. Intervalos de alta intensidad.", 
        color: "text-orange-400" 
      },
      { 
        name: "Zona 5: VO2 Máx", 
        pct: "90-100%", 
        range: `${Math.round(hrr * 0.9 + rhr)} - ${Math.round(mhr)}`, 
        desc: "Esfuerzo máximo de corta duración. Sprints y competiciones.", 
        color: "text-red-500" 
      }
    ];

    setResult({ mhr, rhr, hrr, zones });

    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'calculate_hr_zones', {
        age: age,
        resting_hr: rhr,
        max_hr: mhr,
      });
    }
  };

  // ============================================
  // TEXTOS PARA COMPARTIR
  // ============================================
  const shareText = useMemo(() => {
    if (result) {
      return `🎯 Mis zonas de entrenamiento calculadas con Sporvit:\n\n` +
             `💓 FC Máxima: ${result.mhr} BPM\n` +
             `🔥 Zona 2 (Quema Grasa): ${result.zones[1].range} BPM\n\n` +
             `Calcula las tuyas aquí:`;
    }
    return `Calcula tus zonas de frecuencia cardíaca para entrenar mejor con Sporvit.`;
  }, [result]);

  // ============================================
  // COPIAR AL PORTAPAPELES
  // ============================================
  const copyToClipboard = (text: string, type: 'embed' | 'share') => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      if (type === 'embed') {
        setCopyStatus('copied');
        setTimeout(() => setCopyStatus('idle'), 2000);
      } else {
        setShareStatus('copied');
        setTimeout(() => setShareStatus('idle'), 2000);
      }
    } catch (err) {
      console.error('Error al copiar:', err);
    }
    
    document.body.removeChild(textArea);
  };

  const embedSnippet = `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:20px; overflow:hidden;" scrolling="no" title="Calculadora de Zonas de Frecuencia Cardíaca Sporvit"></iframe>`;

  // ============================================
  // STRUCTURED DATA (JSON-LD)
  // ============================================
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de Zonas de Frecuencia Cardíaca - Sporvit",
    "url": currentUrl,
    "description": "Calcula tus zonas de entrenamiento cardiovascular basadas en la fórmula de Karvonen (FC Máxima y FC en Reposo). Obtén tus rangos personalizados para optimizar tu rendimiento.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    },
    "featureList": [
      "Cálculo con fórmula de Karvonen",
      "5 zonas de entrenamiento personalizadas",
      "Código embed para integración web",
      "Compartir resultados en redes sociales"
    ],
    "author": {
      "@type": "Organization",
      "name": "Sporvit",
      "url": "https://sporvit.com"
    }
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} 
      />

      <div className="pt-16 pb-16 container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* ============================================
            HEADER
        ============================================ */}
        <header className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium mb-6">
            <Heart className="w-3 h-3 animate-pulse" /> Entrenamiento por Zonas
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic">
            Calculadora de Zonas de Frecuencia Cardíaca
          </h1>
          
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
            "No entrenes a ciegas. Descubre tus rangos exactos para cada objetivo fisiológico con el método Karvonen."
          </p>
        </header>

        {/* ============================================
            GRID PRINCIPAL
        ============================================ */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* ============================================
              FORMULARIO (Columna Izquierda)
          ============================================ */}
          <section className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
              
              <form onSubmit={calculateZones} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Input: Edad */}
                  <div className="space-y-2">
                    <label 
                      htmlFor="age-input" 
                      className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1"
                    >
                      Edad (años)
                    </label>
                    <input 
                      id="age-input"
                      type="number" 
                      min="18"
                      max="100"
                      value={formData.age} 
                      onChange={e => {
                        setFormData({...formData, age: e.target.value});
                        setValidationError(null);
                      }}
                      className={`w-full bg-slate-950 border rounded-xl py-4 px-5 text-white outline-none focus:border-emerald-500 text-lg font-bold transition-colors ${
                        validationError?.field === 'age' ? 'border-red-500' : 'border-slate-800'
                      }`}
                      placeholder="25" 
                      required 
                      aria-label="Ingresa tu edad en años"
                      aria-required="true"
                      aria-invalid={validationError?.field === 'age'}
                      aria-describedby={validationError?.field === 'age' ? 'age-error' : undefined}
                    />
                    {validationError?.field === 'age' && (
                      <p id="age-error" className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {validationError.message}
                      </p>
                    )}
                  </div>

                  {/* Input: FC Reposo */}
                  <div className="space-y-2">
                    <label 
                      htmlFor="resting-hr-input" 
                      className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1"
                    >
                      FC Reposo (BPM)
                    </label>
                    <input 
                      id="resting-hr-input"
                      type="number" 
                      min="30"
                      max="100"
                      value={formData.restingHR} 
                      onChange={e => {
                        setFormData({...formData, restingHR: e.target.value});
                        setValidationError(null);
                      }}
                      className={`w-full bg-slate-950 border rounded-xl py-4 px-5 text-white outline-none focus:border-emerald-500 text-lg font-bold transition-colors ${
                        validationError?.field === 'restingHR' ? 'border-red-500' : 'border-slate-800'
                      }`}
                      placeholder="60" 
                      required 
                      aria-label="Ingresa tu frecuencia cardíaca en reposo en pulsaciones por minuto"
                      aria-required="true"
                      aria-invalid={validationError?.field === 'restingHR'}
                      aria-describedby={validationError?.field === 'restingHR' ? 'rhr-error' : undefined}
                    />
                    {validationError?.field === 'restingHR' && (
                      <p id="rhr-error" className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {validationError.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Error General */}
                {validationError?.field === 'general' && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-400 text-sm">{validationError.message}</p>
                  </div>
                )}

                {/* Botón Calcular */}
                <button 
                  type="submit" 
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-5 px-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-3 active:scale-[0.98]"
                  aria-label="Calcular mis zonas de frecuencia cardíaca"
                >
                  <Activity className="w-5 h-5" /> Calcular Mis Zonas
                </button>
              </form>
            </div>
            
            {/* Info: Método Karvonen */}
            <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-500" /> 
                ¿Qué es el Método Karvonen?
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Este método es más preciso que solo usar la edad (220 - edad), ya que considera tu <strong className="text-emerald-400">Frecuencia Cardíaca de Reserva</strong> (FC Máxima - FC Reposo), reflejando mejor tu estado de forma actual y nivel de condicionamiento cardiovascular.
              </p>
            </div>

            {/* Tip: Cómo medir FC en reposo */}
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6">
              <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                💡 Tip: ¿Cómo medir tu FC en reposo?
              </h3>
              <ul className="text-sm text-slate-400 leading-relaxed space-y-1">
                <li>• Mídela al despertar, antes de levantarte de la cama</li>
                <li>• Usa un pulsómetro o smartwatch para mayor precisión</li>
                <li>• Toma la medida durante 3-5 días y calcula el promedio</li>
              </ul>
            </div>
          </section>

          {/* ============================================
              RESULTADOS (Columna Derecha)
          ============================================ */}
          <aside className="lg:col-span-5 space-y-6">
            <div className={`transition-all duration-700 ${result ? 'opacity-100 scale-100' : 'opacity-40 grayscale pointer-events-none scale-95'}`}>
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl">
                
                {/* FC Máxima */}
                <div className="text-center mb-6 pb-6 border-b border-slate-800">
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-1">
                    Tu Frecuencia Cardíaca Máxima
                  </p>
                  <div className="text-4xl md:text-5xl font-black text-white tracking-tighter inline-flex items-baseline gap-2">
                    {result ? result.mhr : '--'} 
                    <span className="text-lg text-emerald-500">BPM</span>
                  </div>
                  {result && (
                    <p className="text-[10px] text-slate-600 mt-2">
                      FC Reserva: {result.hrr} BPM
                    </p>
                  )}
                </div>

                {/* Zonas de Entrenamiento */}
                <div className="space-y-3" role="list" aria-label="Zonas de entrenamiento">
                  {result ? result.zones.map((z: Zone) => (
                    <div 
                      key={z.name} 
                      className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 group hover:bg-slate-900/50 transition-colors"
                      role="listitem"
                    >
                      <div className="flex-1">
                        <div className={`text-[10px] font-bold uppercase tracking-widest ${z.color} mb-1`}>
                          {z.pct}
                        </div>
                        <div className="text-sm font-bold text-white mb-1">
                          {z.name}
                        </div>
                        <div className="text-[10px] text-slate-500 leading-tight pr-0 sm:pr-4">
                          {z.desc}
                        </div>
                      </div>
                      <div className="text-left sm:text-right min-w-[100px]">
                        <div className="text-xl font-black text-white">
                          {z.range}
                        </div>
                        <div className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">
                          BPM
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-slate-600">
                      <Heart className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="text-sm">Completa el formulario para ver tus zonas</p>
                    </div>
                  )}
                </div>

                {/* Botones Compartir */}
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
                        onClick={() => window.location.href=`mailto:?subject=${encodeURIComponent('Mis Zonas de FC - Sporvit')}&body=${encodeURIComponent(shareText + "\n\n" + currentUrl)}`}
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

            {/* Embed Code */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4 text-white uppercase tracking-wider font-bold text-sm justify-center">
                <Code className="w-5 h-5 text-emerald-400" /> 
                Inserta en tu Web
              </div>
              <textarea 
                readOnly 
                value={embedSnippet} 
                onClick={(e) => e.currentTarget.select()}
                className="w-full h-32 sm:h-28 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs sm:text-[10px] font-mono text-emerald-500/70 focus:outline-none focus:border-emerald-500/50 resize-none shadow-inner transition-colors" 
                aria-label="Código HTML para insertar esta calculadora en tu sitio web"
              />
              <button
                onClick={() => copyToClipboard(embedSnippet, 'embed')}
                className={`mt-3 w-full py-2 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  copyStatus === 'copied'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                }`}
                aria-label={copyStatus === 'copied' ? 'Código copiado' : 'Copiar código embed'}
              >
                {copyStatus === 'copied' ? (
                  <>
                    <Check className="w-4 h-4" /> Código Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copiar Código
                  </>
                )}
              </button>
            </div>
          </aside>
        </div>

        {/* ============================================
            CONTENIDO EDUCATIVO (SEO)
        ============================================ */}
        <section className="mt-20 max-w-4xl mx-auto space-y-12">
          <div className="prose prose-invert prose-slate max-w-none">
            
            {/* ¿Qué son las zonas de FC? */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center gap-3">
                <Heart className="w-7 h-7 text-red-500" />
                ¿Qué son las zonas de frecuencia cardíaca?
              </h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                Las zonas de frecuencia cardíaca dividen tu capacidad cardiovascular en 5 rangos de intensidad, cada uno con beneficios fisiológicos específicos para tu entrenamiento. Entrenar en la zona correcta te permite optimizar resultados según tus objetivos: desde quemar grasa hasta mejorar tu VO2 máximo.
              </p>
              <p className="text-slate-400 leading-relaxed">
                Conocer tus zonas personalizadas te ayuda a evitar el sobreentrenamiento, maximizar la eficiencia de cada sesión y progresar de forma sistemática. Ya seas corredor, ciclista, nadador o practiques cualquier deporte de resistencia, entrenar por zonas es fundamental para alcanzar tu máximo potencial.
              </p>
            </div>

            {/* Por qué Karvonen */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-8">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Zap className="w-6 h-6 text-emerald-500" />
                ¿Por qué usar la fórmula de Karvonen?
              </h3>
              <p className="text-slate-400 leading-relaxed mb-4">
                A diferencia del método tradicional simplificado (220 - edad), la fórmula de Karvonen considera tu <strong className="text-emerald-400">frecuencia cardíaca en reposo</strong>, ofreciendo rangos más personalizados según tu nivel de forma física actual.
              </p>
              <p className="text-slate-400 leading-relaxed">
                Una persona entrenada tendrá una FC en reposo más baja (40-50 BPM), mientras que una persona sedentaria puede tener 70-80 BPM. Esta diferencia es crucial: Karvonen ajusta tus zonas según tu condición real, no solo tu edad. El resultado son rangos de entrenamiento mucho más precisos y efectivos.
              </p>
            </div>

            {/* Cómo usar tus zonas */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-8">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Activity className="w-6 h-6 text-blue-500" />
                ¿Cómo usar tus zonas en el entrenamiento?
              </h3>
              <div className="space-y-4 text-slate-400 leading-relaxed">
                <div>
                  <h4 className="text-emerald-400 font-bold mb-1">🏃 Para quemar grasa y mejorar resistencia</h4>
                  <p>Entrena principalmente en Zona 2 (60-70%). Sesiones largas de 45-90 minutos a ritmo conversacional.</p>
                </div>
                <div>
                  <h4 className="text-yellow-400 font-bold mb-1">🚴 Para mejorar tu forma cardiovascular</h4>
                  <p>Combina Zona 2 como base con intervalos en Zona 3 (70-80%). Ejemplo: 3x10min en Z3 con 5min de recuperación.</p>
                </div>
                <div>
                  <h4 className="text-orange-400 font-bold mb-1">⚡ Para aumentar tu umbral de lactato</h4>
                  <p>Entrenamientos de tempo en Zona 4 (80-90%). Sesiones de 20-40 minutos totales a ritmo desafiante pero sostenible.</p>
                </div>
                <div>
                  <h4 className="text-red-500 font-bold mb-1">🔥 Para mejorar tu potencia máxima</h4>
                  <p>Intervalos cortos en Zona 5 (90-100%). Series de 1-4 minutos al máximo esfuerzo con recuperación completa.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
            CTA FINAL
        ============================================ */}
        <section className="mt-16 bg-gradient-to-br from-emerald-900/20 to-slate-900 border border-emerald-500/20 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            ¿Quieres llevar tu entrenamiento al siguiente nivel?
          </h2>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            Únete a Sporvit y obtén planes de entrenamiento personalizados que se ajustan automáticamente a tus zonas de frecuencia cardíaca.
          </p>
          <a 
            href="/onboarding"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl transition-all shadow-xl"
          >
            Crear mi Plan Gratis <ArrowRight className="w-5 h-5" />
          </a>
        </section>

      </div>
    </>
  );
}