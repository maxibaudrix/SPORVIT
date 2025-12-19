//src\app\onboarding\step-6-macros\page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles, TrendingUp, Dumbbell, Utensils, Activity, AlertCircle, Edit, Loader2, Calendar, Clock } from 'lucide-react';

// 1. DEFINE TYPES FOR COMPLEX OBJECTS (Phases and Macros)
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

// 2. DEFINE THE MAIN INTERFACE FOR THE useMemo RESULT
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
}


export default function Step6ReviewPage() {
  const router = useRouter();
  const [error, setError] = useState<string>(""); 
  const [plan, setPlan] = useState<any>(null);    
  const [startDate, setStartDate] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Calcular fecha mínima (hoy) y máxima (30 días desde hoy)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  const maxDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Mock data - En producción vendría del store/context
  const mockOnboardingData = {
    biometrics: { age: 32, gender: 'male', weight: 74.5, height: 178, bodyFatPercentage: 15 },
    objective: { primaryGoal: 'performance', targetTimeline: 12, hasCompetition: true, targetDate: '2025-03-15', motivation: 'Quiero completar mi primer Ironman 70.3' },
    activity: { country: 'ES', dailyActivityLevel: 'moderate', dailySteps: '6k-10k', availableDays: ['monday', 'tuesday', 'thursday', 'saturday', 'sunday'], preferredTimes: ['morning', 'evening'], activeCommute: true },
    training: { experienceLevel: 'intermediate', sportType: 'triathlon', sportSubtype: 'olympic', favoriteDiscipline: 'bike', daysPerWeek: 5, sessionDuration: 60, trainingLocation: ['gym', 'outdoor', 'pool'], availableEquipment: ['road_bike', 'pool_access', 'gym_full'], hasInjuries: false },
    nutrition: { dietType: 'omnivore', mealsPerDay: 4, allergies: [], intolerances: ['lactose'], excludedFoods: ['Mariscos'], cookingFrequency: 'regularly' }
  };

  // 3. APPLY THE TYPE TO THE useMemo HOOK
  const calculations: CalculationsResult = useMemo(() => {
    const { age, gender, weight, height } = mockOnboardingData.biometrics;
    let bmr = gender === 'male' ? 10 * weight + 6.25 * height - 5 * age + 5 : 10 * weight + 6.25 * height - 5 * age - 161;
    const activityMultipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };
    const neat = bmr * (activityMultipliers[mockOnboardingData.activity.dailyActivityLevel] - 1);
    const tdeeBase = Math.round(bmr + neat);
    const trainingCaloriesPerDay = Math.round((mockOnboardingData.training.daysPerWeek * 400) / 7);
    const tdee = tdeeBase + trainingCaloriesPerDay;
    const targetCalories = tdee;
    const proteinG = Math.round(weight * 2.0);
    const fatCal = Math.round(targetCalories * 0.30);
    const fatG = Math.round(fatCal / 9);
    const carbsG = Math.round((targetCalories - proteinG * 4 - fatCal) / 4);
    
    const { targetTimeline, hasCompetition } = mockOnboardingData.objective;
    let blockSize = targetTimeline <= 8 ? 2 : targetTimeline <= 16 ? 4 : 6;
    
    // Initialize phases with the correct type and default values
    let phases: PlanningPhases = { base: 0, build: 0, peak: 0, taper: 0, recovery: 0 };
    
    if (hasCompetition) {
      const taperWeeks = targetTimeline >= 2 ? 2 : 1;
      const buildableWeeks = targetTimeline - taperWeeks - 1;
      phases = { base: Math.floor(buildableWeeks * 0.4), build: Math.floor(buildableWeeks * 0.4), peak: buildableWeeks - Math.floor(buildableWeeks * 0.8), taper: taperWeeks, recovery: 1 };
    } else {
      const recoveryWeeks = Math.floor(targetTimeline / 4);
      const trainableWeeks = targetTimeline - recoveryWeeks;
      phases = { base: Math.floor(trainableWeeks * 0.5), build: Math.ceil(trainableWeeks * 0.5), peak: 0, taper: 0, recovery: recoveryWeeks };
    }

    return {
      bmr: Math.round(bmr),
      neat: Math.round(neat),
      tdeeBase,
      trainingCaloriesPerDay,
      tdee,
      targetCalories,
      trainingDayCalories: targetCalories + 200,
      restDayCalories: targetCalories - 200,
      macros: { protein: proteinG, carbs: carbsG, fat: fatG, proteinPercent: Math.round((proteinG * 4 / targetCalories) * 100), carbsPercent: Math.round((carbsG * 4 / targetCalories) * 100), fatPercent: Math.round((fatCal / targetCalories) * 100) },
      blockSize,
      totalBlocks: Math.ceil(targetTimeline / blockSize),
      phases
    };
  }, []);


  const handleGeneratePlan = async () => {
    if (!startDate) return;
    setIsGenerating(true);
    setError(""); // Limpia errores previos

    const planningPayload = {
      startDate,  // ✅ Obligatorio
      biometrics: mockOnboardingData.biometrics,
      objective: {
        goalType: mockOnboardingData.objective.primaryGoal,
        targetTimeline: mockOnboardingData.objective.targetTimeline,
        hasCompetition: mockOnboardingData.objective.hasCompetition,
        targetDate: mockOnboardingData.objective.targetDate,
        motivation: mockOnboardingData.objective.motivation,
      },
      activity: {
        country: mockOnboardingData.activity.country,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        activityLevel: mockOnboardingData.activity.dailyActivityLevel,
        dailySteps: mockOnboardingData.activity.dailySteps,
        availableDays: mockOnboardingData.activity.availableDays,
        preferredTimes: mockOnboardingData.activity.preferredTimes,
      },
      training: {
        level: mockOnboardingData.training.experienceLevel,
        sportType: mockOnboardingData.training.sportType,
        sportSubtype: mockOnboardingData.training.sportSubtype,
        daysPerWeek: mockOnboardingData.training.daysPerWeek,
        sessionDuration: mockOnboardingData.training.sessionDuration,
        location: mockOnboardingData.training.trainingLocation,
        equipment: mockOnboardingData.training.availableEquipment,
        hasInjuries: mockOnboardingData.training.hasInjuries,
        
      },
      nutrition: {
        dietType: mockOnboardingData.nutrition.dietType,
        mealsPerDay: mockOnboardingData.nutrition.mealsPerDay,
        allergies: mockOnboardingData.nutrition.allergies,
        intolerances: mockOnboardingData.nutrition.intolerances,
        excludedFoods: mockOnboardingData.nutrition.excludedFoods,
        cookingFrequency: mockOnboardingData.nutrition.cookingFrequency,
      },
      planning: {
        phases: {
          base: calculations.phases.base,
          build: calculations.phases.build,
          peak: calculations.phases.peak,
          taper: calculations.phases.taper,
          recovery: calculations.phases.recovery
        }
      },
      targets: {
        calories: {
          trainingDay: calculations.trainingDayCalories,
          restDay: calculations.restDayCalories
        },
        macros: calculations.macros
      },
      startPreferences: { startDate }
    };
    
    console.log('📤 [Frontend] Sending payload:', planningPayload);

    try {
      const response = await fetch('/api/planning/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planningPayload),
      });

      // 1. Validar si la respuesta es un JSON antes de intentar leerlo
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("El servidor devolvió un error crítico (500). Revisa la terminal.");
      }

      const data = await response.json();

      // 2. Si la respuesta no es OK, manejamos el error aquí y cortamos la ejecución
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Fallo al generar el plan");
      }

      // 3. Si llegamos aquí, data.success es true
      console.log('✅ [Frontend] Plan generado:', data.plan);
      
      // Guardamos el plan en el estado (esto evitará errores de 'undefined' si lo usas en la UI)
      setPlan(data.plan); 

      // Redirigimos
      router.push(data.redirectTo || '/dashboard');

    } catch (error: any) {
      console.error('❌ [Frontend] Error:', error.message);
      alert(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const progress = 100;

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
            
            {/* Hero Card */}
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
                      <span className="text-white font-bold">{mockOnboardingData.objective.targetTimeline} semanas</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Bloques:</span>
                      <span className="text-white font-bold">{calculations.totalBlocks} × {calculations.blockSize}sem</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-800">
                    <div className="text-xs text-slate-500 mb-2">Fases:</div>
                    <div className="grid grid-cols-5 gap-2">
                      {calculations.phases.base > 0 && <div className="bg-blue-900/30 rounded px-2 py-1.5 text-center"><div className="text-xs text-blue-400">Base</div><div className="text-sm font-bold text-white">{calculations.phases.base}s</div></div>}
                      {calculations.phases.build > 0 && <div className="bg-green-900/30 rounded px-2 py-1.5 text-center"><div className="text-xs text-green-400">Build</div><div className="text-sm font-bold text-white">{calculations.phases.build}s</div></div>}
                      {calculations.phases.peak > 0 && <div className="bg-yellow-900/30 rounded px-2 py-1.5 text-center"><div className="text-xs text-yellow-400">Peak</div><div className="text-sm font-bold text-white">{calculations.phases.peak}s</div></div>}
                      {calculations.phases.taper > 0 && <div className="bg-purple-900/30 rounded px-2 py-1.5 text-center"><div className="text-xs text-purple-400">Taper</div><div className="text-sm font-bold text-white">{calculations.phases.taper}s</div></div>}
                      {calculations.phases.recovery > 0 && <div className="bg-cyan-900/30 rounded px-2 py-1.5 text-center"><div className="text-xs text-cyan-400">Recov</div><div className="text-sm font-bold text-white">{calculations.phases.recovery}s</div></div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <h3 className="font-bold text-white">Perfil y Objetivo</h3>
                  </div>
                  <Edit className="w-4 h-4 text-slate-500" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Básicos:</span>
                    <span className="text-white font-bold">{mockOnboardingData.biometrics.age}a • {mockOnboardingData.biometrics.height}cm / {mockOnboardingData.biometrics.weight}kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Objetivo:</span>
                    <span className="text-emerald-400 font-bold">Rendimiento</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Competición:</span>
                    <span className="text-white font-bold">{mockOnboardingData.objective.targetDate}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-purple-400" />
                    <h3 className="font-bold text-white">Entrenamiento</h3>
                  </div>
                  <Edit className="w-4 h-4 text-slate-500" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Deporte:</span>
                    <span className="text-white font-bold">Triatlón</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nivel:</span>
                    <span className="text-white font-bold">Intermedio</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Frecuencia:</span>
                    <span className="text-white font-bold">{mockOnboardingData.training.daysPerWeek}d × {mockOnboardingData.training.sessionDuration}min</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-green-400" />
                    <h3 className="font-bold text-white">Nutrición</h3>
                  </div>
                  <Edit className="w-4 h-4 text-slate-500" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dieta:</span>
                    <span className="text-white font-bold">Omnívoro</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Comidas/día:</span>
                    <span className="text-white font-bold">{mockOnboardingData.nutrition.mealsPerDay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Restricciones:</span>
                    <span className="text-white font-bold">{mockOnboardingData.nutrition.intolerances.length + mockOnboardingData.nutrition.excludedFoods.length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-orange-400" />
                    <h3 className="font-bold text-white">Actividad</h3>
                  </div>
                  <Edit className="w-4 h-4 text-slate-500" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">País:</span>
                    <span className="text-white font-bold">{mockOnboardingData.activity.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nivel:</span>
                    <span className="text-white font-bold capitalize">{mockOnboardingData.activity.dailyActivityLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Días:</span>
                    <span className="text-white font-bold">{mockOnboardingData.activity.availableDays.length}d disponibles</span>
                  </div>
                </div>
              </div>
            </div>

            {mockOnboardingData.objective.motivation && (
              <div className="bg-gradient-to-br from-purple-900/20 to-slate-900/50 border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💭</div>
                  <div>
                    <div className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-2">Tu Motivación</div>
                    <p className="text-white italic">"{mockOnboardingData.objective.motivation}"</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-yellow-900/20 to-slate-900/50 border border-yellow-500/30 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-bold text-white mb-2">Notas importantes</div>
                  <ul className="space-y-1 text-sm text-slate-300">
                    <li>• Los cálculos son estimaciones. Ajustaremos según tu progreso.</li>
                    <li>• Tu plan se adapta automáticamente cada semana.</li>
                    <li>• Recetas con ingredientes de {mockOnboardingData.activity.country}.</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* Start Date Selector */}
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
              <button onClick={() => router.push('/onboarding/step-5-diet')} disabled={isGenerating} className="px-6 py-3 bg-slate-900 border-2 border-slate-700 text-slate-300 font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                <span className="flex items-center justify-center gap-2"> {/* <-- Único Hijo */}
                  <ArrowLeft className="w-5 h-5" />
                  Volver
                </span>
              </button>
              
              <button onClick={handleGeneratePlan} disabled={isGenerating || !startDate} className="flex-grow bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 px-8 rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100">
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-3"> {/* ÚNICO HIJO */}
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Generando plan...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3"> {/* ÚNICO HIJO */}
                    <Sparkles className="w-6 h-6" />
                    <span>Generar Mi Plan</span>
                    <ArrowRight className="w-5 h-5" />
                  </span>
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