"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Info, Calculator, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Header } from '@/components/ui/layout/public/Header';
import { Footer } from '@/components/ui/layout/public/Footer';

// --- Componentes UI Internos ---
const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-sm font-medium text-slate-300 mb-2">{children}</label>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input 
    {...props} 
    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-600"
  />
);

export default function FFMICalculatorPage() {
  // State
  const [weight, setWeight] = useState<number | ''>(75);
  const [height, setHeight] = useState<number | ''>(175);
  const [bodyFat, setBodyFat] = useState<number | ''>(15);
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  
  // Results State
  const [ffmi, setFfmi] = useState<number>(0);
  const [normalizedFfmi, setNormalizedFfmi] = useState<number>(0);
  const [leanMass, setLeanMass] = useState<number>(0);
  const [fatMass, setFatMass] = useState<number>(0);
  const [category, setCategory] = useState<{ label: string, color: string, desc: string }>({ label: '', color: '', desc: '' });

  // Cálculo en tiempo real
  useEffect(() => {
    if (weight && height && bodyFat !== '') {
      const w = Number(weight); // kg
      const h = Number(height) / 100; // metros
      const bf = Number(bodyFat); // porcentaje

      // 1. Masa Grasa y Magra
      const fatMassVal = w * (bf / 100);
      const leanMassVal = w * (1 - (bf / 100));

      // 2. FFMI
      // Fórmula: Lean Mass / (Height * Height)
      const ffmiVal = leanMassVal / (h * h);

      // 3. Normalized FFMI
      // Fórmula: FFMI + 6.1 * (1.8 - Height)
      // Normaliza para una altura base de 1.8m
      const normalizedVal = ffmiVal + 6.1 * (1.8 - h);

      setLeanMass(leanMassVal);
      setFatMass(fatMassVal);
      setFfmi(ffmiVal);
      setNormalizedFfmi(normalizedVal);

      // 4. Categorización (Basada en escalas estándar para hombres naturales)
      // Nota: Para mujeres las escalas son diferentes, aquí simplificamos para el MVP o asumimos estándar general.
      if (normalizedVal < 18) setCategory({ label: 'Bajo', color: 'text-slate-400', desc: 'Masa muscular por debajo de la media.' });
      else if (normalizedVal < 20) setCategory({ label: 'Promedio', color: 'text-emerald-400', desc: 'Constitución atlética normal.' });
      else if (normalizedVal < 22) setCategory({ label: 'Encima del Promedio', color: 'text-blue-400', desc: 'Notable desarrollo muscular.' });
      else if (normalizedVal < 24) setCategory({ label: 'Excelente', color: 'text-purple-400', desc: 'Nivel avanzado de culturismo natural.' });
      else if (normalizedVal < 26) setCategory({ label: 'Superior / Élite', color: 'text-orange-400', desc: 'Límite genético natural potencial.' });
      else setCategory({ label: 'Sospechoso', color: 'text-red-500', desc: 'Poco probable de alcanzar de forma natural.' });
    }
  }, [weight, height, bodyFat]);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30">
      

      <main className="pt-16 pb-16 container mx-auto px-4 sm:px-6 max-w-5xl">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/calculators" className="hover:text-white transition-colors">Calculadoras</Link>
          <span className="text-slate-700">/</span>
          <span className="text-emerald-400">FFMI</span>
        </div>

        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Calculadora FFMI
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            El <strong className="text-white">Índice de Masa Libre de Grasa</strong> es el indicador definitivo de tu desarrollo muscular real, independiente de tu altura.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* --- INPUT SECTION (Columna Izquierda) --- */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-500" /> Tus Datos
              </h3>

              <div className="space-y-5">
                {/* Weight */}
                <div>
                  <div className="flex justify-between mb-1">
                    <Label>Peso Corporal</Label>
                    <span className="text-xs text-slate-500">kg</span>
                  </div>
                  <Input 
                    type="number" 
                    value={weight} 
                    onChange={(e) => setWeight(parseFloat(e.target.value))}
                    placeholder="Ej: 75"
                  />
                </div>

                {/* Height */}
                <div>
                  <div className="flex justify-between mb-1">
                    <Label>Altura</Label>
                    <span className="text-xs text-slate-500">cm</span>
                  </div>
                  <Input 
                    type="number" 
                    value={height} 
                    onChange={(e) => setHeight(parseFloat(e.target.value))}
                    placeholder="Ej: 175"
                  />
                </div>

                {/* Body Fat */}
                <div>
                  <div className="flex justify-between mb-1">
                    <Label>Porcentaje de Grasa</Label>
                    <span className="text-xs text-slate-500">%</span>
                  </div>
                  <Input 
                    type="number" 
                    value={bodyFat} 
                    onChange={(e) => setBodyFat(parseFloat(e.target.value))}
                    placeholder="Ej: 15"
                  />
                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Si no lo sabes, usa el escáner visual de Sporvit.
                  </p>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-emerald-900/10 border border-emerald-500/20 p-4 rounded-xl text-sm text-emerald-200/80">
              <p>
                <strong>¿Sabías que?</strong> El FFMI normaliza tu masa muscular según tu altura. Es mucho más útil que el IMC para atletas, ya que no penaliza tener mucho músculo.
              </p>
            </div>
          </div>

          {/* --- RESULTS SECTION (Columna Derecha) --- */}
          <div className="lg:col-span-7">
            {ffmi > 0 ? (
              <div className="space-y-6">
                
                {/* Main Score Card */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-orange-500"></div>
                  
                  <p className="text-slate-400 text-sm uppercase tracking-widest font-bold mb-2">Tu FFMI Ajustado</p>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-6xl md:text-7xl font-black text-white tracking-tight">
                      {normalizedFfmi.toFixed(1)}
                    </span>
                  </div>
                  
                  <div className={`mt-4 inline-flex px-4 py-1 rounded-full bg-slate-950 border border-slate-800 text-sm font-bold ${category.color}`}>
                    {category.label}
                  </div>
                  <p className="mt-4 text-slate-300 max-w-md mx-auto">
                    {category.desc}
                  </p>
                </div>

                {/* Secondary Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl text-center">
                    <p className="text-xs text-slate-500 mb-1">Masa Magra</p>
                    <p className="text-2xl font-bold text-blue-400">{leanMass.toFixed(1)} <span className="text-sm font-normal text-slate-500">kg</span></p>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl text-center">
                    <p className="text-xs text-slate-500 mb-1">Masa Grasa</p>
                    <p className="text-2xl font-bold text-orange-400">{fatMass.toFixed(1)} <span className="text-sm font-normal text-slate-500">kg</span></p>
                  </div>
                </div>

                {/* Scale Visualization */}
                <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-2xl">
                  <h4 className="text-sm font-bold text-white mb-6">¿Dónde te sitúas?</h4>
                  <div className="relative h-4 bg-slate-800 rounded-full w-full">
                    {/* Gradient Bar */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-slate-600 via-emerald-500 to-orange-500 opacity-20"></div>
                    
                    {/* Markers */}
                    <div className="absolute top-0 bottom-0 left-[25%] w-0.5 bg-slate-600 h-6 -mt-1"></div> {/* 18 */}
                    <div className="absolute top-0 bottom-0 left-[50%] w-0.5 bg-slate-600 h-6 -mt-1"></div> {/* 20 */}
                    <div className="absolute top-0 bottom-0 left-[75%] w-0.5 bg-slate-600 h-6 -mt-1"></div> {/* 22 */}
                    <div className="absolute top-0 bottom-0 left-[90%] w-0.5 bg-slate-600 h-6 -mt-1"></div> {/* 25 */}

                    {/* User Indicator */}
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)] transition-all duration-500"
                      style={{ 
                        left: `${Math.min(Math.max(((normalizedFfmi - 16) / (26 - 16)) * 100, 0), 100)}%` 
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono">
                    <span>16</span>
                    <span>18 (Media)</span>
                    <span>22 (Exc.)</span>
                    <span>26 (Límite)</span>
                  </div>
                </div>

                {/* CTA Contextual */}
                <div className="mt-8 p-6 bg-gradient-to-r from-indigo-900/40 to-slate-900 rounded-2xl border border-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-white mb-1">Mejora tu FFMI con IA</h4>
                    <p className="text-sm text-slate-400">Obtén un plan de hipertrofia personalizado.</p>
                  </div>
                  <Link href="/register" className="px-6 py-3 bg-white text-indigo-950 font-bold rounded-xl hover:bg-indigo-50 transition-colors text-sm whitespace-nowrap">
                    Crear Plan
                  </Link>
                </div>

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 bg-slate-900/20 border border-slate-800 border-dashed rounded-2xl text-slate-500">
                <Calculator className="w-12 h-12 mb-4 opacity-20" />
                <p>Introduce tus datos para ver el análisis completo.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* --- SEO CONTENT (Below Fold) --- */}
        <section className="mt-24 max-w-3xl mx-auto prose prose-invert prose-headings:text-white prose-p:text-slate-400 prose-a:text-emerald-400">
          <h2>¿Qué es el FFMI?</h2>
          <p>
            El <strong>Fat Free Mass Index</strong> (Índice de Masa Libre de Grasa) es una alternativa al IMC diseñada específicamente para atletas y culturistas. A diferencia del IMC, que solo tiene en cuenta el peso total, el FFMI distingue entre masa muscular y grasa.
          </p>
          <h3>¿Por qué es importante?</h3>
          <p>
            Un FFMI alto indica una gran cantidad de masa muscular en relación con tu altura. Es el mejor indicador para saber cuán cerca estás de tu <strong>límite genético natural</strong>.
          </p>
          <ul>
            <li><strong>18-20:</strong> Constitución media masculina.</li>
            <li><strong>20-22:</strong> Atleta natural con buen desarrollo.</li>
            <li><strong>23-25:</strong> Nivel superior, alcanzable tras años de entrenamiento serio.</li>
            <li><strong>25+:</strong> Extremadamente raro de forma natural, a menudo asociado con el uso de sustancias exógenas.</li>
          </ul>
        </section>

      </main>


    </div>
  );
}