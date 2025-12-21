'use client';
import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, User, Ruler, Scale, Activity, Info, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/store/onboarding';


// 1. Definición de Interfaces para el Estado del Formulario
interface BiometricsData {
  age: string; // Se mantiene como string para la entrada de texto
  gender: 'MALE' | 'FEMALE' | 'OTHER' | '';
  height: string;
  weight: string;
  bodyFatPercentage: string;
}

// 2. Definición de Tipos para los Errores (strings de mensajes)
type BiometricsErrors = Partial<Record<keyof BiometricsData, string | null>>;

export default function Step1BiometricsPage() {
  // 3. Aplicación de Tipado a useState
  const [formData, setFormData] = useState<BiometricsData>({
    age: '',
    gender: '',
    height: '',
    weight: '',
    bodyFatPercentage: ''
  });

  const [errors, setErrors] = useState<BiometricsErrors>({});

  const router = useRouter();

  // 4. Tipado de handleChange
  const handleChange = (field: keyof BiometricsData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    // 5. Tipado explícito de newErrors (esto soluciona el error 2322)
    const newErrors: BiometricsErrors = {};
    
    // Convertir a número para validación
    const age = Number(formData.age);
    if (!age || age < 15 || age > 100) {
      newErrors.age = 'Edad debe estar entre 15 y 100 años';
    }
    
    // Validación de Género (ahora correcta)
    if (!formData.gender) {
      newErrors.gender = 'Selecciona tu género';
    }
    
    // Convertir a número para validación
    const height = Number(formData.height);
    if (!height || height < 120 || height > 250) {
      newErrors.height = 'Altura debe estar entre 120 y 250 cm';
    }
    
    // Convertir a número para validación
    const weight = Number(formData.weight);
    if (!weight || weight < 30 || weight > 300) {
      newErrors.weight = 'Peso debe estar entre 30 y 300 kg';
    }

    // Convertir a número para validación opcional
    const bfp = Number(formData.bodyFatPercentage);
    if (formData.bodyFatPercentage !== '' && (bfp < 3 || bfp > 60)) {
      newErrors.bodyFatPercentage = 'Porcentaje debe estar entre 3% y 60%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const store = useOnboardingStore(); // Añadir al inicio del componente

const handleSubmit = () => {
  if (validate()) {
    // ✅ CONVERTIR STRINGS A NÚMEROS Y GUARDAR
    store.setBiometrics({
      age: Number(formData.age),
      gender: formData.gender as 'MALE' | 'FEMALE' | 'OTHER', // Cast para gender
      weight: Number(formData.weight),
      height: Number(formData.height),
      bodyFatPercentage: formData.bodyFatPercentage 
        ? Number(formData.bodyFatPercentage) 
        : undefined, // Opcional
    });
    
    console.log('Biometrics saved, navigating to step 2...', formData);
    router.push('/onboarding/step-2-objective');
  }
};

  const handleBack = () => {
    console.log('Back to welcome');
  };

  const progress = (1 / 6) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="absolute -top-16 left-0 flex items-center gap-2 opacity-80">
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
            <path d="M 8 8 L 8 14 M 8 8 L 14 8" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M 40 8 L 40 14 M 40 8 L 34 8" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M 18 16 L 18 32" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round"/>
            <path d="M 18 24 L 30 16" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round"/>
            <path d="M 18 24 L 30 32" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round"/>
            <path d="M 8 40 L 8 34 M 8 40 L 14 40" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M 40 40 L 40 34 M 40 40 L 34 40" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <span className="text-sm font-bold text-slate-400">Sporvit</span>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-3xl overflow-hidden">
          
          <div className="border-b border-slate-800 p-8 pb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                  <span className="text-emerald-400 font-bold">1</span>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Paso 1 de 6</div>
                  <h1 className="text-2xl font-bold text-white">Datos Biométricos</h1>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 mb-1">Progreso</div>
                <div className="text-emerald-400 font-bold">{Math.round(progress)}%</div>
              </div>
            </div>
            
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <p className="text-slate-400 text-sm mt-4 leading-relaxed">
              Cuéntanos sobre tu cuerpo para calcular tu metabolismo y personalizar tu plan de nutrición y entrenamiento.
            </p>
          </div>

          <div className="p-8 space-y-6">
            
            <div>
              <label htmlFor="age" className="flex items-center gap-2 mb-2 text-slate-300 font-medium">
                <User className="w-4 h-4 text-emerald-400" />
                Edad
              </label>
              <input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
                placeholder="25"
                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-600"
              />
              {errors.age && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.age}
                </p>
              )}
            </div>

            <div>
              <label className="mb-3 block text-slate-300 font-medium">Género</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'MALE', label: 'Hombre', icon: '👨' },
                  { value: 'FEMALE', label: 'Mujer', icon: '👩' },
                  { value: 'OTHER', label: 'Otro', icon: '🧑' },
                ].map((g) => (
                  <button
                    key={g.value}
                    type="button"
                    // Se asegura que el valor de retorno sea uno de los tipos permitidos
                    onClick={() => handleChange('gender', g.value as 'MALE' | 'FEMALE' | 'OTHER')}
                    className={`relative p-4 text-center rounded-xl border-2 transition-all ${
                      formData.gender === g.value
                        ? 'bg-gradient-to-br from-emerald-600 to-teal-600 border-emerald-500 shadow-lg shadow-emerald-500/30 scale-105'
                        : 'bg-slate-900 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                    }`}
                  >
                    {formData.gender === g.value && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle2 className="w-4 h-4 text-slate-950" />
                      </div>
                    )}
                    <div className="text-2xl mb-2">{g.icon}</div>
                    <div className="text-sm font-medium">{g.label}</div>
                  </button>
                ))}
              </div>
              {errors.gender && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.gender}
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              
              <div>
                <label htmlFor="height" className="flex items-center gap-2 mb-2 text-slate-300 font-medium">
                  <Ruler className="w-4 h-4 text-blue-400" />
                  Altura (cm)
                </label>
                <input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleChange('height', e.target.value)}
                  placeholder="175"
                  className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-600"
                />
                {errors.height && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                    {errors.height}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="weight" className="flex items-center gap-2 mb-2 text-slate-300 font-medium">
                  <Scale className="w-4 h-4 text-purple-400" />
                  Peso Actual (kg)
                </label>
                <input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => handleChange('weight', e.target.value)}
                  placeholder="70.0"
                  className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-600"
                />
                {errors.weight && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                    {errors.weight}
                  </p>
                )}
              </div>

            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <Activity className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <label htmlFor="bodyFatPercentage" className="text-slate-300 font-medium">
                      Porcentaje de Grasa Corporal
                    </label>
                    <span className="text-slate-500 text-xs bg-slate-800 px-2 py-0.5 rounded-full">Opcional</span>
                  </div>
                  <input
                    id="bodyFatPercentage"
                    type="number"
                    step="0.1"
                    value={formData.bodyFatPercentage}
                    onChange={(e) => handleChange('bodyFatPercentage', e.target.value)}
                    placeholder="20.0"
                    className="w-full bg-slate-950 border-2 border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-600 mb-2"
                  />
                  <div className="flex items-start gap-2 text-xs text-slate-500">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>Si no lo conoces, déjalo en blanco. Puedes añadirlo más tarde en tu perfil.</span>
                  </div>
                  {errors.bodyFatPercentage && (
                    <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                      {errors.bodyFatPercentage}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 bg-slate-900 border-2 border-slate-700 text-slate-300 font-bold rounded-xl hover:bg-slate-800 hover:border-slate-600 transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Volver
              </button>
              
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-grow bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              >
                <span>Siguiente Paso</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-slate-500 text-sm">
            ¿Necesitas ayuda?{' '}
            <a href="/contact" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
              Contáctanos
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}