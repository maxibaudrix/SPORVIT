'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, Activity, Footprints, Armchair, Coffee, Briefcase, Bike, Info, CheckCircle2, TrendingUp, Globe, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { useOnboardingStore } from '@/store/onboarding';

// 1. Definición de Interfaces
interface ActivityData {
  dailyActivityLevel: string;
  dailySteps: string;
  sittingHours: string;
  workType: string;
  activeCommute: boolean | null;
  country: string;
  timezone: string;
  availableDays: string[];
  preferredTimes: string[];
}

// 2. Tipo para errores
type ActivityErrors = Partial<Record<keyof ActivityData, string | null>>;

export default function Step3ActivityPage() {
  // 3. Estado tipado
  const [formData, setFormData] = useState<ActivityData>({
    dailyActivityLevel: '',
    dailySteps: '',
    sittingHours: '',
    workType: '',
    activeCommute: null,
    country: '',
    timezone: '',
    availableDays: [],
    preferredTimes: []
  });

  const [errors, setErrors] = useState<ActivityErrors>({});
  const router = useRouter();

  const handleChange = (field: keyof ActivityData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const toggleArrayValue = (field: 'availableDays' | 'preferredTimes', value: string) => {
    setFormData(prev => {
      const currentArray = prev[field];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(v => v !== value)
        : [...currentArray, value];
      return { ...prev, [field]: newArray };
    });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors: ActivityErrors = {};
    
    if (!formData.dailyActivityLevel) {
      newErrors.dailyActivityLevel = 'Selecciona tu nivel de actividad diaria';
    }
    
    if (!formData.dailySteps) {
      newErrors.dailySteps = 'Selecciona tu rango de pasos diarios';
    }

    if (!formData.country) {
      newErrors.country = 'Selecciona tu país';
    }

    if (formData.availableDays.length === 0) {
      newErrors.availableDays = 'Selecciona al menos un día';
    }

    if (formData.preferredTimes.length === 0) {
      newErrors.preferredTimes = 'Selecciona al menos un horario';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const setActivity = useOnboardingStore((state) => state.setActivity); 

const handleSubmit = () => {
  if (validate()) {
    const activityLevelMap: Record<string, 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE' | 'SUPER_ACTIVE'> = {
      'sedentary': 'SEDENTARY',
      'light': 'LIGHTLY_ACTIVE',
      'lightly_active': 'LIGHTLY_ACTIVE',
      'moderate': 'MODERATELY_ACTIVE',
      'moderately_active': 'MODERATELY_ACTIVE',
      'active': 'VERY_ACTIVE',
      'very_active': 'VERY_ACTIVE',
      'super_active': 'SUPER_ACTIVE',
    };

    const sittingHoursMap: Record<string, '' | 'LESS_THAN_4H' | '4H_6H' | '6H_8H' | 'MORE_THAN_8H'> = {
      'less_than_4h': 'LESS_THAN_4H',
      'less_4h': 'LESS_THAN_4H',
      '4h_6h': '4H_6H',
      '6h_8h': '6H_8H',
      'more_than_8h': 'MORE_THAN_8H',
      'more_8h': 'MORE_THAN_8H',
    };

    const workTypeMap: Record<string, '' | 'DESK' | 'MIXED' | 'ACTIVE' | 'PHYSICAL'> = {
      'desk': 'DESK',
      'mixed': 'MIXED',
      'active': 'ACTIVE',
      'physical': 'PHYSICAL',
    };

    // ✅ GUARDAR EN STORE CON NUEVOS CAMPOS
    setActivity({
      activityLevel: activityLevelMap[formData.dailyActivityLevel.toLowerCase()] || 'MODERATELY_ACTIVE',
      sittingHours: sittingHoursMap[formData.sittingHours.toLowerCase()] || '',
      workType: workTypeMap[formData.workType.toLowerCase()] || '',
      availableDays: formData.availableDays, // ✅ NUEVO
      preferredTimes: formData.preferredTimes, // ✅ NUEVO
    });
    
    console.log('Activity saved, navigating to step 4...', formData);
    router.push('/onboarding/step-4-training-level');
  }
};

  const handleBack = () => {
    router.push('/onboarding/step-2-objective');
  };

  const progress = (3 / 6) * 100;

  const activityLevels = [
    {
      value: 'sedentary',
      label: 'Sedentario',
      icon: Armchair,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500',
      description: 'Principalmente sentado/a',
      details: 'Trabajo de oficina, poco movimiento diario',
      multiplier: '1.2x'
    },
    {
      value: 'light',
      label: 'Ligera',
      icon: Coffee,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500',
      description: 'Algo de movimiento',
      details: 'Algunas actividades durante el día, paseos cortos',
      multiplier: '1.375x'
    },
    {
      value: 'moderate',
      label: 'Moderada',
      icon: Activity,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500',
      description: 'De pie con frecuencia',
      details: 'Trabajo activo, caminar regularmente',
      multiplier: '1.55x'
    },
    {
      value: 'active',
      label: 'Activa',
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500',
      description: 'Trabajo físico',
      details: 'Movimiento constante, trabajo manual o de pie',
      multiplier: '1.725x'
    },
  ];

  const stepRanges = [
    { value: 'under-3k', label: 'Menos de 3,000', icon: '🛋️', steps: '<3K pasos/día' },
    { value: '3k-6k', label: '3,000 - 6,000', icon: '🚶', steps: '3-6K pasos/día' },
    { value: '6k-10k', label: '6,000 - 10,000', icon: '🚶‍♂️', steps: '6-10K pasos/día' },
    { value: '10k-plus', label: 'Más de 10,000', icon: '🏃', steps: '10K+ pasos/día' },
  ];

  const sittingOptions = [
    { value: 'low', label: 'Menos de 4h', icon: '✨' },
    { value: 'moderate', label: '4-6 horas', icon: '⏱️' },
    { value: 'high', label: '6-8 horas', icon: '💺' },
    { value: 'very-high', label: 'Más de 8h', icon: '🪑' },
  ];

  const workTypes = [
    { value: 'desk', label: 'Escritorio', description: 'Oficina, remoto, estudios', icon: '💻' },
    { value: 'mixed', label: 'Mixto', description: 'Combina sentado y de pie', icon: '🔄' },
    { value: 'standing', label: 'De pie', description: 'Retail, enseñanza, hospitality', icon: '🧍' },
    { value: 'physical', label: 'Físico', description: 'Construcción, delivery, deporte', icon: '💪' },
  ];

  const countries = [
    { value: 'ES', label: 'España', flag: '🇪🇸', timezone: 'Europe/Madrid' },
    { value: 'MX', label: 'México', flag: '🇲🇽', timezone: 'America/Mexico_City' },
    { value: 'AR', label: 'Argentina', flag: '🇦🇷', timezone: 'America/Argentina/Buenos_Aires' },
    { value: 'CO', label: 'Colombia', flag: '🇨🇴', timezone: 'America/Bogota' },
    { value: 'CL', label: 'Chile', flag: '🇨🇱', timezone: 'America/Santiago' },
    { value: 'PE', label: 'Perú', flag: '🇵🇪', timezone: 'America/Lima' },
    { value: 'US', label: 'Estados Unidos', flag: '🇺🇸', timezone: 'America/New_York' },
    { value: 'OTHER', label: 'Otro', flag: '🌍', timezone: 'UTC' },
  ];

  const weekDays = [
    { value: 'monday', label: 'L', fullLabel: 'Lunes' },
    { value: 'tuesday', label: 'M', fullLabel: 'Martes' },
    { value: 'wednesday', label: 'X', fullLabel: 'Miércoles' },
    { value: 'thursday', label: 'J', fullLabel: 'Jueves' },
    { value: 'friday', label: 'V', fullLabel: 'Viernes' },
    { value: 'saturday', label: 'S', fullLabel: 'Sábado' },
    { value: 'sunday', label: 'D', fullLabel: 'Domingo' },
  ];

  const timeSlots = [
    { value: 'morning', label: 'Mañana', icon: '🌅', time: '6:00 - 12:00' },
    { value: 'midday', label: 'Mediodía', icon: '☀️', time: '12:00 - 14:00' },
    { value: 'afternoon', label: 'Tarde', icon: '🌤️', time: '14:00 - 18:00' },
    { value: 'evening', label: 'Noche', icon: '🌙', time: '18:00 - 23:00' },
  ];

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.value === countryCode);
    handleChange('country', countryCode);
    if (country) {
      handleChange('timezone', country.timezone);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        
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
                  <span className="text-emerald-400 font-bold">3</span>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Paso 3 de 6</div>
                  <h1 className="text-2xl font-bold text-white">Actividad y Disponibilidad</h1>
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
              Tu actividad diaria y disponibilidad nos ayudan a personalizar tu plan de entrenamiento y calcular tu gasto calórico.
            </p>
          </div>

          <div className="p-8 space-y-8">
            
            {/* Country/Region */}
            <div>
              {/* Se eliminó 'block' para evitar conflicto con 'flex' */}
              <label className="mb-4 text-slate-300 font-medium flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-400" />
                ¿En qué país vives?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {countries.map((country) => {
                  const isSelected = formData.country === country.value;
                  
                  return (
                    <button
                      key={country.value}
                      type="button"
                      onClick={() => handleCountryChange(country.value)}
                      className={`relative p-3 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-500 shadow-lg scale-105'
                          : 'bg-slate-950 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-indigo-400 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle2 className="w-3 h-3 text-slate-950" />
                        </div>
                      )}
                      <div className="flex flex-col items-center gap-1 mb-1">
                        <span className="text-2xl">{country.flag}</span>
                        <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                          {country.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
               {errors.country && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.country}
                </p>
              )}
            </div>

            {/* Daily Activity Level */}
            <div>
              {/* Se eliminó 'block' para evitar conflicto con 'flex' */}
              <label className="mb-4 text-slate-300 font-medium flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                ¿Cómo describirías tu actividad diaria?
              </label>
              <div className="grid sm:grid-cols-2 gap-4">
                {activityLevels.map((level) => {
                  const Icon = level.icon;
                  const isSelected = formData.dailyActivityLevel === level.value;
                  
                  return (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => handleChange('dailyActivityLevel', level.value)}
                      className={`relative p-5 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? `${level.bgColor} ${level.borderColor} shadow-lg scale-105`
                          : 'bg-slate-900 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle2 className="w-4 h-4 text-slate-950" />
                        </div>
                      )}
                      <div className="flex items-start gap-3 mb-3">
                        <Icon className={`w-7 h-7 ${isSelected ? level.color : 'text-slate-500'}`} />
                        <div className="flex-grow">
                          <div className={`font-bold mb-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                            {level.label}
                          </div>
                          <div className="text-xs text-slate-400">{level.description}</div>
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 bg-slate-950/50 rounded-lg px-2 py-1.5 mt-2">
                        {level.details}
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="text-[10px] font-mono text-slate-500">{level.multiplier}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.dailyActivityLevel && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.dailyActivityLevel}
                </p>
              )}
            </div>

            {/* Daily Steps */}
            <div>
              {/* Se eliminó 'block' para evitar conflicto con 'flex' */}
              <label className="mb-4 text-slate-300 font-medium flex items-center gap-2">
                <Footprints className="w-5 h-5 text-blue-400" />
                ¿Cuántos pasos caminas al día aproximadamente?
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                {stepRanges.map((range) => {
                  const isSelected = formData.dailySteps === range.value;
                  
                  return (
                    <button
                      key={range.value}
                      type="button"
                      onClick={() => handleChange('dailySteps', range.value)}
                      className={`relative p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 border-blue-500 shadow-lg shadow-blue-500/20 scale-105'
                          : 'bg-slate-900 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle2 className="w-4 h-4 text-slate-950" />
                        </div>
                      )}
                      <div className="text-2xl">{range.icon}</div>
                      <div className="flex-grow text-left">
                        <div className={`font-bold mb-0.5 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                          {range.label}
                        </div>
                        <div className="text-xs text-slate-400">{range.steps}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.dailySteps && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.dailySteps}
                </p>
              )}
            </div>

            {/* Días disponibles */}
            <div>
              {/* Se eliminó 'block' para evitar conflicto con 'flex' */}
              <label className="mb-4 text-slate-300 font-medium flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-purple-400" />
                ¿Qué días puedes entrenar?
              </label>
              <div className="flex justify-center gap-2">
                {weekDays.map((day) => {
                  const isSelected = formData.availableDays.includes(day.value);
                  
                  return (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleArrayValue('availableDays', day.value)}
                      className={`relative w-12 h-12 rounded-xl border-2 transition-all font-bold ${
                        isSelected
                          ? 'bg-purple-600 border-purple-500 shadow-lg text-white scale-110'
                          : 'bg-slate-900 border-slate-700 hover:border-slate-600 text-slate-400'
                      }`}
                      title={day.fullLabel}
                    >
                      {day.label}
                      {isSelected && (
                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-purple-400 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-slate-950" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              {errors.availableDays && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1 text-center">
                  <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.availableDays}
                </p>
              )}
            </div>

            {/* Horarios preferidos */}
            <div>
              {/* Se eliminó 'block' para evitar conflicto con 'flex' */}
              <label className="mb-4 text-slate-300 font-medium flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                ¿En qué horarios prefieres entrenar?
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                {timeSlots.map((slot) => {
                  const isSelected = formData.preferredTimes.includes(slot.value);
                  
                  return (
                    <button
                      key={slot.value}
                      type="button"
                      onClick={() => toggleArrayValue('preferredTimes', slot.value)}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'bg-cyan-600 border-cyan-500 shadow-lg'
                          : 'bg-slate-900 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle2 className="w-4 h-4 text-slate-950" />
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{slot.icon}</div>
                        <div className="text-left flex-grow">
                          <div className={`font-bold mb-0.5 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                            {slot.label}
                          </div>
                          <div className="text-xs text-slate-400">{slot.time}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.preferredTimes && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.preferredTimes}
                </p>
              )}
            </div>

            {/* Optional: Sitting Hours */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-4">
                <Armchair className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-slate-300 font-medium">
                      ¿Cuántas horas pasas sentado/a al día?
                    </label>
                    <span className="text-slate-500 text-xs bg-slate-800 px-2 py-0.5 rounded-full">Opcional</span>
                  </div>
                  <div className="text-xs text-slate-500 mb-3">Incluye trabajo, transporte, tiempo frente a pantallas</div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {sittingOptions.map((option) => {
                  const isSelected = formData.sittingHours === option.value;
                  
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleChange('sittingHours', option.value)}
                      className={`relative p-3 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'bg-purple-600 border-purple-500 shadow-lg'
                          : 'bg-slate-950 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-purple-400 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-slate-950" />
                        </div>
                      )}
                      <div className="text-xl mb-1">{option.icon}</div>
                      <div className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                        {option.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional: Work Type */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-4">
                <Briefcase className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-slate-300 font-medium">
                      ¿Qué tipo de trabajo realizas?
                    </label>
                    <span className="text-slate-500 text-xs bg-slate-800 px-2 py-0.5 rounded-full">Opcional</span>
                  </div>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-3">
                {workTypes.map((work) => {
                  const isSelected = formData.workType === work.value;
                  
                  return (
                    <button
                      key={work.value}
                      type="button"
                      onClick={() => handleChange('workType', work.value)}
                      className={`relative p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'bg-yellow-600 border-yellow-500 shadow-lg'
                          : 'bg-slate-950 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle2 className="w-3 h-3 text-slate-950" />
                        </div>
                      )}
                      <div className="text-2xl">{work.icon}</div>
                      <div className="text-left">
                        <div className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                          {work.label}
                        </div>
                        <div className="text-[10px] text-slate-400">{work.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional: Active Commute */}
            <div className="bg-gradient-to-br from-teal-900/20 to-slate-900/50 border border-teal-500/20 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-4">
                <Bike className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-slate-300 font-medium">
                      ¿Vas caminando o en bici al trabajo/estudio?
                    </label>
                    <span className="text-slate-500 text-xs bg-slate-800 px-2 py-0.5 rounded-full">Opcional</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleChange('activeCommute', true)}
                  className={`relative p-3 rounded-lg border-2 transition-all ${
                    formData.activeCommute === true
                      ? 'bg-teal-600 border-teal-500 shadow-lg'
                      : 'bg-slate-950 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {formData.activeCommute === true && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-teal-400 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-3 h-3 text-slate-950" />
                    </div>
                  )}
                  <div className={`text-center font-bold ${formData.activeCommute === true ? 'text-white' : 'text-slate-300'}`}>
                    ✅ Sí
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('activeCommute', false)}
                  className={`relative p-3 rounded-lg border-2 transition-all ${
                    formData.activeCommute === false
                      ? 'bg-slate-700 border-slate-600 shadow-lg'
                      : 'bg-slate-950 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {formData.activeCommute === false && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-slate-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className={`text-center font-bold ${formData.activeCommute === false ? 'text-white' : 'text-slate-300'}`}>
                    ❌ No
                  </div>
                </button>
              </div>
            </div>

            {/* Navigation buttons */}
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

        {/* Help link */}
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