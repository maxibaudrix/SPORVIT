'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles, TrendingUp, Dumbbell, Utensils, Activity, AlertCircle, Edit, Loader2, Calendar, Clock } from 'lucide-react';
import { useOnboardingStore } from '@/store/onboarding';

// Types para cálculos
interface PlanningPhases {
  base: number;
  build: number;
  peak: number;
  taper: number;
  recovery: number;
}

interface Macros {
  protein: number;
  carbs: number;
  fat: number;
  proteinPercent: number;
  carbsPercent: number;
  fatPercent: number;
}

interface CalculationsResult {
  bmr: number;
  neat: number;
  tdeeBase: number;
  trainingCaloriesPerDay: number;
  tdee: number;
  targetCalories: number;
  trainingDayCalories: number;
  restDayCalories: number;
  macros: Macros;
  blockSize: number;
  totalBlocks: number;
  phases: PlanningPhases;
  targetTimeline: number;
}

export default function Step6ReviewPage() {
  const router = useRouter();
  const [startDate, setStartDate] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // ✅ OBTENER DATOS DEL STORE (sin variable store)
  const biometrics = useOnboardingStore((state) => state.biometrics);
  const goal = useOnboardingStore((state) => state.goal);
  const activity = useOnboardingStore((state) => state.activity);
  const training = useOnboardingStore((state) => state.training);
  const diet = useOnboardingStore((state) => state.diet);

  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  const maxDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const hasCompleteData = useMemo(() => {
    return !!(
      biometrics?.age &&
      biometrics?.weight &&
      biometrics?.height &&
      goal?.goalType &&
      activity?.activityLevel &&
      training?.trainingLevel &&
      training?.trainingFrequency &&
      diet?.dietType
    );
  }, [biometrics, goal, activity, training, diet]);

  const calculations: CalculationsResult = useMemo(() => {
    if (!hasCompleteData) {
      return {
        bmr: 0, neat: 0, tdeeBase: 0, trainingCaloriesPerDay: 0, tdee: 0,
        targetCalories: 0, trainingDayCalories: 0, restDayCalories: 0,
        macros: { protein: 0, carbs: 0, fat: 0, proteinPercent: 0, carbsPercent: 0, fatPercent: 0 },
        blockSize: 4, totalBlocks: 3,
        phases: { base: 0, build: 0, peak: 0, taper: 0, recovery: 0 },
        targetTimeline: 12,
      };
    }

    const { age, gender, weight, height } = biometrics!;
    
    let bmr = gender === 'MALE' 
      ? 10 * weight + 6.25 * height - 5 * age + 5 
      : 10 * weight + 6.25 * height - 5 * age - 161;

    const activityMultipliers: Record<string, number> = { 
      SEDENTARY: 1.2, LIGHTLY_ACTIVE: 1.375, MODERATELY_ACTIVE: 1.55, 
      VERY_ACTIVE: 1.725, SUPER_ACTIVE: 1.9
    };
    
    const activityLevel = activity!.activityLevel;
    const neat = bmr * (activityMultipliers[activityLevel] - 1);
    const tdeeBase = Math.round(bmr + neat);

    const freqMap: Record<string, number> = {
      '1_2': 1.5, '3_4': 3.5, '5_6': 5.5, 'DOUBLE': 7
    };
    const trainingDays = freqMap[training!.trainingFrequency] || 3;
    const trainingCaloriesPerDay = Math.round((trainingDays * 400) / 7);
    const tdee = tdeeBase + trainingCaloriesPerDay;

    let targetCalories = tdee;
    const goalType = goal!.goalType;

    if (goalType === 'LOSE') {
      targetCalories = Math.round(tdee * 0.85);
    } else if (goalType === 'GAIN') {
      targetCalories = Math.round(tdee * 1.10);
    } else if (goalType === 'RECOMP') {
      targetCalories = tdee;
    }

    const proteinG = Math.round(weight * 2.0);
    const fatCal = Math.round(targetCalories * 0.30);
    const fatG = Math.round(fatCal / 9);
    const carbsG = Math.round((targetCalories - proteinG * 4 - fatCal) / 4);
    
    const targetTimeline = goal?.targetTimeline || 12; // Usar el valor guardado del formulario
    let blockSize = targetTimeline <= 8 ? 2 : targetTimeline <= 16 ? 4 : 6;

    const recoveryWeeks = Math.floor(targetTimeline / 4);
    const trainableWeeks = targetTimeline - recoveryWeeks;
    const phases: PlanningPhases = { 
      base: Math.floor(trainableWeeks * 0.5), 
      build: Math.ceil(trainableWeeks * 0.5), 
      peak: 0, taper: 0, recovery: recoveryWeeks 
    };

    return {
      bmr: Math.round(bmr), neat: Math.round(neat), tdeeBase, trainingCaloriesPerDay,
      tdee, targetCalories,
      trainingDayCalories: targetCalories + 200,
      restDayCalories: targetCalories - 200,
      macros: { 
        protein: proteinG, carbs: carbsG, fat: fatG, 
        proteinPercent: Math.round((proteinG * 4 / targetCalories) * 100), 
        carbsPercent: Math.round((carbsG * 4 / targetCalories) * 100), 
        fatPercent: Math.round((fatCal / targetCalories) * 100) 
      },
      blockSize, totalBlocks: Math.ceil(targetTimeline / blockSize),
      phases, targetTimeline,
    };
  }, [hasCompleteData, biometrics, goal, activity, training]);

  const handleGeneratePlan = async () => {
    if (!startDate) {
      alert('Por favor selecciona una fecha de inicio');
      return;
    }
    if (!hasCompleteData) {
      alert('Faltan datos del onboarding. Por favor completa todos los pasos.');
      return;
    }
    
    setIsGenerating(true);

    try {
      const planningPayload = {
        biometrics: {
          age: biometrics!.age, 
          gender: biometrics!.gender,
          weight: biometrics!.weight, 
          height: biometrics!.height,
          bodyFatPercentage: biometrics!.bodyFatPercentage,
        },
        objective: {
          goalType: goal!.goalType, 
          targetWeight: goal!.targetWeight,
          goalSpeed: goal!.goalSpeed,
          targetTimeline: goal!.targetTimeline || 4,
        },
        activity: {
          activityLevel: activity!.activityLevel,
          sittingHours: activity!.sittingHours,
          workType: activity!.workType,
          availableDays: activity!.availableDays, // ✅ AÑADIR
          preferredTimes: activity!.preferredTimes, // ✅ AÑADIR
        },
        training: {
          trainingLevel: training!.trainingLevel,
          trainingFrequency: training!.trainingFrequency,
          trainingTypes: training!.trainingTypes,
          sessionDuration: training!.sessionDuration,
          intensity: training!.intensity,
        },
        nutrition: {  // ✅ CAMBIAR "diet" a "nutrition"
          dietType: diet!.dietType,
          mealsPerDay: 4, // ✅ AÑADIR (puedes leerlo del formulario si existe)
          allergies: diet!.allergies || [],
          intolerances: [], // ✅ AÑADIR si existe en el formulario
          excludedFoods: diet!.excludedIngredients || [],
          cookingFrequency: 'regularly', // ✅ AÑADIR (puedes leerlo del formulario si existe)
        },
        startDate, 
        calculations,
      };

      console.log('[Step 6] Sending payload to backend:', planningPayload);

      // ✅ LLAMADA REAL AL BACKEND
      const response = await fetch('/api/planning/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planningPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al generar el plan');
      }

      console.log('[Step 6] Plan generation response:', data);

      // Mostrar mensaje de éxito
      if (data.message) {
        alert(`✅ ${data.message}`);
      }

      router.push(data.redirectTo || '/dashboard');

    } catch (error: any) {
      console.error('[Step 6] Error:', error);
      alert(`❌ Error al generar el plan:\n${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const progress = 100;

  if (!hasCompleteData) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Datos incompletos</h2>
          <p className="text-slate-400 mb-6">
            Parece que faltan datos del onboarding. Por favor completa todos los pasos anteriores.
          </p>
          <button
            onClick={() => router.push('/onboarding/step-1-biometrics')}
            className="px-6 py-3 bg-emerald-500 rounded-xl font-bold hover:bg-emerald-600 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative w-full max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        
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
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Paso 6 de 6</div>
                  <h1 className="text-2xl font-bold text-white">Revisión Final</h1>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 mb-1">Progreso</div>
                <div className="text-emerald-400 font-bold">{progress}%</div>
              </div>
            </div>
            
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>

            <p className="text-slate-400 text-sm mt-4 leading-relaxed">
              Revisa tu perfil y los cálculos de tu plan personalizado antes de generar tu programa completo.
            </p>
          </div>

          <div className="p-8 space-y-6">
            
            <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border border-emerald-500/30 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-6 h-6 text-emerald-400" />
                  <h2 className="text-2xl font-bold text-white">Tu Plan Personalizado</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-slate-950/50 rounded-xl p-5 border border-slate-800">
                    <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">TDEE Total</div>
                    <div className="text-3xl font-bold text-white mb-1">{calculations.tdee.toLocaleString()}</div>
                    <div className="text-xs text-slate-400">kcal/día</div>
                    <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-500">
                      BMR: {calculations.bmr} + NEAT: {calculations.neat}
                    </div>
                  </div>

                  <div className="bg-slate-950/50 rounded-xl p-5 border border-emerald-500/30">
                    <div className="text-xs text-emerald-400 mb-2 uppercase tracking-wider font-bold">Calorías Objetivo</div>
                    <div className="text-3xl font-bold text-emerald-400 mb-1">{calculations.targetCalories.toLocaleString()}</div>
                    <div className="text-xs text-slate-400">kcal/día</div>
                    <div className="mt-3 pt-3 border-t border-slate-800 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Entreno:</span>
                        <span className="text-white font-bold">{calculations.trainingDayCalories}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-slate-500">Descanso:</span>
                        <span className="text-white font-bold">{calculations.restDayCalories}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950/50 rounded-xl p-5 border border-slate-800">
                    <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Macros Diarios</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Proteína</span>
                        <span className="font-bold text-white">{calculations.macros.protein}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Carbos</span>
                        <span className="font-bold text-white">{calculations.macros.carbs}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Grasas</span>
                        <span className="font-bold text-white">{calculations.macros.fat}g</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/50 rounded-xl p-5 border border-slate-800">
                  <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Duración:</span>
                      <span className="text-white font-bold">{calculations.targetTimeline} semanas</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Bloques:</span>
                      <span className="text-white font-bold">{calculations.totalBlocks} × {calculations.blockSize}sem</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-800">
                    <div className="text-xs text-slate-500 mb-2">Fases:</div>
                    <div className="grid grid-cols-3 gap-2">
                      {calculations.phases.base > 0 && <div className="bg-blue-900/30 rounded px-2 py-1.5 text-center"><div className="text-xs text-blue-400">Base</div><div className="text-sm font-bold text-white">{calculations.phases.base}s</div></div>}
                      {calculations.phases.build > 0 && <div className="bg-green-900/30 rounded px-2 py-1.5 text-center"><div className="text-xs text-green-400">Build</div><div className="text-sm font-bold text-white">{calculations.phases.build}s</div></div>}
                      {calculations.phases.recovery > 0 && <div className="bg-cyan-900/30 rounded px-2 py-1.5 text-center"><div className="text-xs text-cyan-400">Recov</div><div className="text-sm font-bold text-white">{calculations.phases.recovery}s</div></div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <h3 className="font-bold text-white">Perfil y Objetivo</h3>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Básicos:</span>
                    <span className="text-white font-bold">{biometrics?.age}a • {biometrics?.height}cm / {biometrics?.weight}kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Objetivo:</span>
                    <span className="text-emerald-400 font-bold capitalize">
                      {goal?.goalType === 'LOSE' ? 'Perder peso' :
                       goal?.goalType === 'GAIN' ? 'Ganar músculo' :
                       goal?.goalType === 'MAINTAIN' ? 'Mantener' :
                       goal?.goalType === 'RECOMP' ? 'Recomposición' : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-purple-400" />
                    <h3 className="font-bold text-white">Entrenamiento</h3>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tipos:</span>
                    <span className="text-white font-bold">{training?.trainingTypes?.join(', ') || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nivel:</span>
                    <span className="text-white font-bold capitalize">{training?.trainingLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Frecuencia:</span>
                    <span className="text-white font-bold">{training?.trainingFrequency}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-green-400" />
                    <h3 className="font-bold text-white">Nutrición</h3>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dieta:</span>
                    <span className="text-white font-bold capitalize">{diet?.dietType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Alergias:</span>
                    <span className="text-white font-bold">{diet?.allergies?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Excluidos:</span>
                    <span className="text-white font-bold">{diet?.excludedIngredients?.length || 0}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-orange-400" />
                    <h3 className="font-bold text-white">Actividad</h3>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nivel:</span>
                    <span className="text-white font-bold capitalize">{activity?.activityLevel?.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Horas sentado:</span>
                    <span className="text-white font-bold">{activity?.sittingHours || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tipo trabajo:</span>
                    <span className="text-white font-bold capitalize">{activity?.workType || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-900/20 to-slate-900/50 border border-yellow-500/30 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-bold text-white mb-2">Notas importantes</div>
                  <ul className="space-y-1 text-sm text-slate-300">
                    <li>• Los cálculos son estimaciones. Ajustaremos según tu progreso.</li>
                    <li>• Tu plan se adapta automáticamente cada semana.</li>
                    <li>• Recetas adaptadas a tus preferencias.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-900/20 to-slate-900/50 border border-emerald-500/30 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="flex-grow">
                  <div className="font-bold text-white mb-2">¿Cuándo quieres empezar?</div>
                  <p className="text-sm text-slate-400 mb-4">
                    Selecciona la fecha en la que comenzará tu plan personalizado.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={minDate}
                      max={maxDate}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white font-medium focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all w-full sm:w-auto"
                    />
                    {startDate && (
                      <div className="flex items-center gap-2 text-emerald-400 text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          Inicio: {new Date(startDate + 'T00:00:00').toLocaleDateString('es-ES', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long' 
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => router.push('/onboarding/step-5-diet')} 
                disabled={isGenerating} 
                className="px-6 py-3 bg-slate-900 border-2 border-slate-700 text-slate-300 font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Volver</span>
              </button>
              
              <button 
                onClick={handleGeneratePlan} 
                disabled={isGenerating || !startDate} 
                className="flex-grow bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 px-8 rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Generando plan...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    <span>Generar Mi Plan</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            {isGenerating && (
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                <div className="flex items-center gap-3 mb-3">
                  <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                  <span className="font-bold text-white">Generando semana 1...</span>
                </div>
                <div className="space-y-2 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Contexto creado</span>
              </div>
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>Generando semana 1 con IA...</span>
              </div>
              <div className="flex items-center gap-2 text-blue-400">
                <Clock className="w-4 h-4" />
                <span>Semanas 2-12 se generarán en segundo plano</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>

    <div className="text-center mt-6">
      <p className="text-slate-500 text-sm">
        ¿Necesitas modificar algo?{' '}
        <button
          onClick={() => router.push('/onboarding/step-1-biometrics')}
          className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
        >
          Volver a editar
        </button>
      </p>
    </div>

  </div>
</div>
);
}