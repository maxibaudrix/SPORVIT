'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, Target, TrendingDown, TrendingUp, Activity, Flame, Trophy, Calendar, Zap, Info, CheckCircle2, Award, AlertCircle } from 'lucide-react';
import { useOnboardingStore } from '@/store/onboarding';

// 1. Definición de Interfaces para el Estado del Formulario
interface ObjectiveData {
  primaryGoal: 'cut' | 'bulk' | 'maintain' | 'recomp' | 'performance' | '';
  goalSpeed: 'slow' | 'moderate' | 'aggressive' | '';
  targetTimeline: number | ''; 
  hasCompetition: boolean | null;
  competitionType: 'race' | 'triathlon' | 'cycling' | 'powerlifting' | 'bodybuilding' | 'crossfit' | 'other' | '';
  targetDate: string;
  motivation: string;
}

// 2. Definición de Tipos para los Errores (mensajes de texto)
type ObjectiveErrors = Partial<Record<keyof ObjectiveData, string | null>>;

// NUEVAS INTERFACES para el resultado de la planificación (useMemo)
interface PlanningPhases {
  base: number;
  build: number;
  peak: number;
  taper: number;
  recovery: number;
}

interface PlanningCalculationResult {
  blockSize: number;
  totalBlocks: number;
  phases: PlanningPhases;
}

export default function Step2ObjectivePage() {
  const [formData, setFormData] = useState<ObjectiveData>({
    primaryGoal: '',
    goalSpeed: '',
    targetTimeline: '',
    hasCompetition: null,
    competitionType: '',
    targetDate: '',
    motivation: ''
  });

  const [errors, setErrors] = useState<ObjectiveErrors>({});
  const router = useRouter();

  const handleChange = (field: keyof ObjectiveData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Cálculo automático de blockSize y fases (Tipado explícito con PlanningCalculationResult | null)
  const planningCalculation: PlanningCalculationResult | null = useMemo(() => {
    if (!formData.targetTimeline) return null;

    const weeks = Number(formData.targetTimeline);
    if (isNaN(weeks) || weeks <= 0) return null;

    let blockSize = 4;
    
    // Inicializar 'phases' con la interfaz correcta y valores iniciales
    let phases: PlanningPhases = {
        base: 0,
        build: 0,
        peak: 0,
        taper: 0,
        recovery: 0,
    };

    // Determinar blockSize según duración
    if (weeks <= 8) {
      blockSize = 2;
    } else if (weeks <= 16) {
      blockSize = 4;
    } else {
      blockSize = 6;
    }

    // Si hay competición, calcular taper
    if (formData.hasCompetition && formData.targetDate) {
      const taperWeeks = weeks >= 12 ? 2 : 1;
      const recoveryWeeks = 1;
      const buildableWeeks = weeks - taperWeeks - recoveryWeeks;
      
      const baseWeeks = Math.floor(buildableWeeks * 0.4);
      const buildWeeks = Math.floor(buildableWeeks * 0.4);
      const peakWeeks = buildableWeeks - baseWeeks - buildWeeks;

      phases = {
        base: baseWeeks,
        build: buildWeeks,
        peak: peakWeeks,
        taper: taperWeeks,
        recovery: recoveryWeeks
      };
    } else {
      // Sin competición: solo base/build con recovery periódico
      const recoveryWeeks = Math.floor(weeks / 4);
      const trainableWeeks = weeks - recoveryWeeks;
      
      phases = {
        base: Math.floor(trainableWeeks * 0.5),
        build: Math.ceil(trainableWeeks * 0.5),
        peak: 0,
        taper: 0,
        recovery: recoveryWeeks
      };
    }

    // Asegurar que el objeto retornado coincide con PlanningCalculationResult
    return {
      blockSize,
      totalBlocks: Math.ceil(weeks / blockSize),
      phases
    };
  }, [formData.targetTimeline, formData.hasCompetition, formData.targetDate]);

  const validate = () => {
    const newErrors: ObjectiveErrors = {};
    
    if (!formData.primaryGoal) {
      newErrors.primaryGoal = 'Selecciona tu objetivo principal';
    }
    
    if (formData.primaryGoal === 'cut' || formData.primaryGoal === 'bulk') {
      if (!formData.goalSpeed) {
        newErrors.goalSpeed = 'Selecciona la velocidad de progreso';
      }
    }
    
    if (!formData.targetTimeline) {
      newErrors.targetTimeline = 'Selecciona un plazo estimado';
    }

    // Corrección del error 'Type 'string' is not assignable to type 'boolean'.'
    // La propiedad hasCompetition es 'boolean | null', el error se produce si es 'null'.
    if (formData.hasCompetition === null) {
      newErrors.hasCompetition = 'Indica si tienes una competición';
    }

    if (formData.hasCompetition && !formData.competitionType) {
      newErrors.competitionType = 'Selecciona el tipo de evento';
    }

    if (formData.hasCompetition && !formData.targetDate) {
      newErrors.targetDate = 'Ingresa la fecha de tu competición';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const setGoal = useOnboardingStore((state) => state.setGoal);

const handleSubmit = () => {
  if (!validate()) return;

  const goalTypeMap: Record<string, 'LOSE' | 'GAIN' | 'MAINTAIN' | 'RECOMP'> = {
    'cut': 'LOSE',
    'bulk': 'GAIN',
    'maintain': 'MAINTAIN',
    'recomp': 'RECOMP',
    'performance': 'MAINTAIN',
  };

  // ✅ GUARDAR EN STORE
  setGoal({
    goalType: goalTypeMap[formData.primaryGoal] || 'MAINTAIN',
    targetWeight: undefined,
    goalSpeed: formData.goalSpeed?.toUpperCase() as 'SLOW' | 'MODERATE' | 'AGGRESSIVE',
    targetTimeline: Number(formData.targetTimeline)
  });

  console.log('Goal saved:', useOnboardingStore.getState());
  router.push('/onboarding/step-3-activity');
};

const handleBack = () => {
  router.push('/onboarding/step-1-biometrics');
};
  const progress = (2 / 6) * 100;

  const goals = [
    { 
      value: 'cut', 
      label: 'Perder Grasa', 
      icon: TrendingDown, 
      color: 'text-red-400', 
      bgColor: 'bg-red-500/10', 
      borderColor: 'border-red-500',
      description: 'Reducir porcentaje de grasa corporal'
    },
    { 
      value: 'bulk', 
      label: 'Ganar Músculo', 
      icon: TrendingUp, 
      color: 'text-blue-400', 
      bgColor: 'bg-blue-500/10', 
      borderColor: 'border-blue-500',
      description: 'Aumentar masa muscular magra'
    },
    { 
      value: 'maintain', 
      label: 'Mantener Peso', 
      icon: Activity, 
      color: 'text-green-400', 
      bgColor: 'bg-green-500/10', 
      borderColor: 'border-green-500',
      description: 'Mantener composición corporal actual'
    },
    { 
      value: 'recomp', 
      label: 'Recomposición', 
      icon: Flame, 
      color: 'text-purple-400', 
      bgColor: 'bg-purple-500/10', 
      borderColor: 'border-purple-500',
      description: 'Perder grasa y ganar músculo simultáneamente'
    },
    { 
      value: 'performance', 
      label: 'Rendimiento', 
      icon: Trophy, 
      color: 'text-yellow-400', 
      bgColor: 'bg-yellow-500/10', 
      borderColor: 'border-yellow-500',
      description: 'Optimizar rendimiento deportivo'
    },
  ];

  const speeds = [
    { value: 'slow', label: 'Sostenible', duration: '0.25-0.5 kg/semana', icon: '🐢', recommended: true },
    { value: 'moderate', label: 'Moderado', duration: '0.5-0.75 kg/semana', icon: '🚶', recommended: false },
    { value: 'aggressive', label: 'Agresivo', duration: '0.75-1 kg/semana', icon: '🏃', recommended: false },
  ];

  const timelines = [
    { value: 4, label: '4 semanas', subtitle: 'Plan corto' },
    { value: 8, label: '8 semanas', subtitle: 'Recomendado para principiantes' },
    { value: 12, label: '12 semanas', subtitle: 'Cambios sostenibles' },
    { value: 16, label: '16 semanas', subtitle: 'Transformación completa' },
    { value: 24, label: '6+ meses', subtitle: 'Objetivos ambiciosos' },
  ];

  const competitionTypes = [
    { value: 'race', label: 'Carrera', icon: '🏃‍♂️' },
    { value: 'triathlon', label: 'Triatlón', icon: '🏊‍♂️' },
    { value: 'cycling', label: 'Ciclismo', icon: '🚴' },
    { value: 'powerlifting', label: 'Powerlifting', icon: '🏋️' },
    { value: 'bodybuilding', label: 'Físicoculturismo', icon: '💪' },
    { value: 'crossfit', label: 'CrossFit', icon: '⚡' },
    { value: 'other', label: 'Otro', icon: '🎯' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Logo */}
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
          
          {/* Header */}
          <div className="border-b border-slate-800 p-8 pb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                  <span className="text-emerald-400 font-bold">2</span>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Paso 2 de 6</div>
                  <h1 className="text-2xl font-bold text-white">Tu Objetivo</h1>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 mb-1">Progreso</div>
                <div className="text-emerald-400 font-bold">{Math.round(progress)}%</div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <p className="text-slate-400 text-sm mt-4 leading-relaxed">
              Define tu meta principal y el ritmo al que quieres alcanzarla. Esto nos ayudará a calcular tus calorías y macros ideales.
            </p>
          </div>

          <div className="p-8 space-y-8">
            
            {/* Primary Goal */}
            <div>
              {/* Se remueve 'block' de la etiqueta que ya tiene 'flex' */}
              <label className="mb-4 text-slate-300 font-medium flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                ¿Cuál es tu objetivo principal?
              </label>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {goals.map((goal) => {
                  const Icon = goal.icon;
                  const isSelected = formData.primaryGoal === goal.value;
                  
                  return (
                    <button
                      key={goal.value}
                      type="button"
                      onClick={() => handleChange('primaryGoal', goal.value)}
                      className={`relative p-5 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? `${goal.bgColor} ${goal.borderColor} shadow-lg scale-105`
                          : 'bg-slate-900 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle2 className="w-4 h-4 text-slate-950" />
                        </div>
                      )}
                      <Icon className={`w-8 h-8 mb-3 ${isSelected ? goal.color : 'text-slate-500'}`} />
                      <div className={`font-bold mb-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {goal.label}
                      </div>
                      <div className="text-xs text-slate-500">{goal.description}</div>
                    </button>
                  );
                })}
              </div>
              {errors.primaryGoal && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.primaryGoal}
                </p>
              )}
            </div>

            {/* Goal Speed (conditional) */}
            {(formData.primaryGoal === 'cut' || formData.primaryGoal === 'bulk') && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* Se remueve 'block' de la etiqueta que ya tiene 'flex' */}
                <label className="mb-4 text-slate-300 font-medium flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  ¿A qué velocidad?
                </label>
                <div className="grid gap-3">
                  {speeds.map((speed) => {
                    const isSelected = formData.goalSpeed === speed.value;
                    
                    return (
                      <button
                        key={speed.value}
                        type="button"
                        onClick={() => handleChange('goalSpeed', speed.value)}
                        className={`relative p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                          isSelected
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-500 shadow-lg shadow-emerald-500/20'
                            : 'bg-slate-900 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                            <CheckCircle2 className="w-4 h-4 text-slate-950" />
                          </div>
                        )}
                        <div className="text-3xl">{speed.icon}</div>
                        <div className="flex-grow text-left">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                              {speed.label}
                            </span>
                            {speed.recommended && (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                Recomendado
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400">{speed.duration}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {errors.goalSpeed && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                    {errors.goalSpeed}
                  </p>
                )}
              </div>
            )}

            {/* Target Timeline */}
            <div>
              {/* Se remueve 'block' de la etiqueta que ya tiene 'flex' */}
              <label className="mb-4 text-slate-300 font-medium flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                ¿En cuánto tiempo quieres lograrlo?
              </label>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {timelines.map((timeline) => {
                  const isSelected = formData.targetTimeline === timeline.value;
                  
                  return (
                    <button
                      key={timeline.value}
                      type="button"
                      onClick={() => handleChange('targetTimeline', timeline.value)}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500 shadow-lg shadow-blue-500/20 scale-105'
                          : 'bg-slate-900 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle2 className="w-4 h-4 text-slate-950" />
                        </div>
                      )}
                      <div className={`font-bold text-lg mb-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {timeline.label}
                      </div>
                      <div className="text-xs text-slate-400">{timeline.subtitle}</div>
                    </button>
                  );
                })}
              </div>
              {errors.targetTimeline && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.targetTimeline}
                </p>
              )}
            </div>

            {/* Competition Question - NUEVO */}
            <div className="bg-gradient-to-br from-purple-900/20 to-slate-900/50 border border-purple-500/30 rounded-xl p-6">
              {/* Se remueve 'block' de la etiqueta que ya tiene 'flex' */}
              <label className="mb-4 text-slate-300 font-medium flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                ¿Tienes una competición o evento específico?
              </label>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => handleChange('hasCompetition', true)}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    formData.hasCompetition === true
                      ? 'bg-purple-600 border-purple-500 shadow-lg'
                      : 'bg-slate-950 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {formData.hasCompetition === true && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-2xl mb-2">🏆</div>
                    <div className={`font-bold ${formData.hasCompetition === true ? 'text-white' : 'text-slate-300'}`}>
                      Sí, tengo una
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleChange('hasCompetition', false);
                    handleChange('competitionType', '');
                    handleChange('targetDate', '');
                  }}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    formData.hasCompetition === false
                      ? 'bg-slate-700 border-slate-600 shadow-lg'
                      : 'bg-slate-950 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {formData.hasCompetition === false && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className={`font-bold ${formData.hasCompetition === false ? 'text-white' : 'text-slate-300'}`}>
                      Solo fitness general
                    </div>
                  </div>
                </button>
              </div>
              {errors.hasCompetition && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.hasCompetition}
                </p>
              )}

              {/* Competition Type - Conditional */}
              {formData.hasCompetition && (
                <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <label className="mb-3 block text-sm text-slate-400">Tipo de evento</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                    {competitionTypes.map((comp) => {
                      const isSelected = formData.competitionType === comp.value;
                      return (
                        <button
                          key={comp.value}
                          type="button"
                          onClick={() => handleChange('competitionType', comp.value)}
                          className={`relative p-3 rounded-lg border-2 transition-all ${
                            isSelected
                              ? 'bg-purple-600 border-purple-500'
                              : 'bg-slate-950 border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-purple-400 rounded-full flex items-center justify-center">
                              <CheckCircle2 className="w-3 h-3 text-slate-950" />
                            </div>
                          )}
                          <div className="text-xl mb-1">{comp.icon}</div>
                          <div className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                            {comp.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {errors.competitionType && (
                    <p className="text-red-400 text-xs mb-3 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                      {errors.competitionType}
                    </p>
                  )}

                  <label htmlFor="targetDate" className="mb-2 block text-sm text-slate-400">
                    Fecha de la competición
                  </label>
                  <input
                    id="targetDate"
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => handleChange('targetDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-slate-950 border-2 border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  />
                  {errors.targetDate && (
                    <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                      {errors.targetDate}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Planning Preview */}
            {planningCalculation && (
              <div className="bg-gradient-to-br from-emerald-900/20 to-slate-900/50 border border-emerald-500/30 rounded-xl p-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-grow">
                    <div className="font-bold text-white mb-2 flex items-center gap-2">
                      📊 Preview de tu Plan
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Duración total:</span>
                        <span className="text-white font-bold">{formData.targetTimeline} semanas</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Bloques de entrenamiento:</span>
                        <span className="text-white font-bold">{planningCalculation.totalBlocks} bloques × {planningCalculation.blockSize} semanas</span>
                      </div>
                      <div className="border-t border-slate-700 pt-2 mt-2">
                        <div className="text-xs text-slate-500 mb-2">Distribución de fases:</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {/* Ahora se accede a las propiedades de forma segura gracias al tipado de PlanningPhases */}
                          {planningCalculation.phases.base > 0 && (
                            <div className="bg-slate-800 rounded px-2 py-1">
                              <span className="text-slate-400">Base: </span>
                              <span className="text-white font-bold">{planningCalculation.phases.base}sem</span>
                            </div>
                          )}
                          {planningCalculation.phases.build > 0 && (
                            <div className="bg-slate-800 rounded px-2 py-1">
                              <span className="text-slate-400">Build: </span>
                              <span className="text-white font-bold">{planningCalculation.phases.build}sem</span>
                            </div>
                          )}
                          {planningCalculation.phases.peak > 0 && (
                            <div className="bg-slate-800 rounded px-2 py-1">
                              <span className="text-slate-400">Peak: </span>
                              <span className="text-white font-bold">{planningCalculation.phases.peak}sem</span>
                            </div>
                          )}
                          {planningCalculation.phases.taper > 0 && (
                            <div className="bg-purple-900/30 rounded px-2 py-1">
                              <span className="text-purple-400">Taper: </span>
                              <span className="text-white font-bold">{planningCalculation.phases.taper}sem</span>
                            </div>
                          )}
                          {planningCalculation.phases.recovery > 0 && (
                            <div className="bg-blue-900/30 rounded px-2 py-1">
                              <span className="text-blue-400">Recovery: </span>
                              <span className="text-white font-bold">{planningCalculation.phases.recovery}sem</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Optional: Motivation */}
            <div className="bg-gradient-to-br from-emerald-900/20 to-slate-900/50 border border-emerald-500/20 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <label htmlFor="motivation" className="text-slate-300 font-medium">
                      ¿Qué te motivó a empezar hoy?
                    </label>
                    <span className="text-slate-500 text-xs bg-slate-800 px-2 py-0.5 rounded-full">Opcional</span>
                  </div>
                  <textarea
                    id="motivation"
                    value={formData.motivation}
                    onChange={(e) => handleChange('motivation', e.target.value)}
                    placeholder="Ej: Quiero sentirme más fuerte y con energía en mi día a día"
                    maxLength={280}
                    rows={3}
                    className="w-full bg-slate-950 border-2 border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-600 resize-none mb-2"
                  />
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      <span>Recordaremos esto en momentos difíciles</span>
                    </div>
                    <span>{formData.motivation.length}/280</span>
                  </div>
                </div>
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