'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, Dumbbell, TrendingUp, Zap, AlertTriangle, Settings, CheckCircle2, Info, Bike, Waves, Footprints as Run, Target } from 'lucide-react';
import { useOnboardingStore } from '@/store/onboarding';

// 1. FIX: Define the FormDataState interface to explicitly type the state object.
interface FormDataState {
  // Perfil deportivo
  experienceLevel: string;
  sportType: string;
  sportSubtype: string;
  
  // Solo para multideporte (triatlón)
  favoriteDiscipline: string;
  leastFavoriteDiscipline: string;
  
  // Datos de rendimiento (opcionales)
  runPaceZ2: string;
  // Note: Using string for consistency, although input type is number.
  ftpWatts: string | number; 
  swim100mPace: string;
  
  // Frecuencia y volumen
  // Note: daysPerWeek and sessionDuration options are numbers (type: number)
  daysPerWeek: string | number; 
  sessionDuration: string | number; 
  
  // Equipamiento
  trainingLocation: string[]; // Array of strings
  availableEquipment: string[]; // Array of strings
  
  // Lesiones
  hasInjuries: boolean | null;
  injuryDetails: string;
}

export default function Step4TrainingPage() {
  // 2. FIX: Apply the explicit type to useState
  const [formData, setFormData] = useState<FormDataState>({
    // Perfil deportivo
    experienceLevel: '',
    sportType: '',
    sportSubtype: '',
    
    // Solo para multideporte (triatlón)
    favoriteDiscipline: '',
    leastFavoriteDiscipline: '',
    
    // Datos de rendimiento (opcionales)
    runPaceZ2: '',
    ftpWatts: '',
    swim100mPace: '',
    
    // Frecuencia y volumen
    daysPerWeek: '',
    sessionDuration: '',
    
    // Equipamiento
    trainingLocation: [],
    availableEquipment: [],
    
    // Lesiones
    hasInjuries: null,
    injuryDetails: ''
  });

  const [errors, setErrors] = useState<{ [key in keyof FormDataState]?: string | null }>({});
  const router = useRouter();

  const handleChange = (field: keyof FormDataState, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const toggleArrayValue = (field: 'trainingLocation' | 'availableEquipment', value: string) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(v => v !== value)
        : [...currentArray, value];
      return { ...prev, [field]: newArray } as FormDataState;
    });
  };

  const validate = () => {
    const newErrors: { [key in keyof FormDataState]?: string } = {};
    
    if (!formData.experienceLevel) {
      newErrors.experienceLevel = 'Selecciona tu nivel de experiencia';
    }
    
    if (!formData.sportType) {
      newErrors.sportType = 'Selecciona tu deporte principal';
    }

    if (formData.sportType === 'triathlon' && !formData.sportSubtype) {
      newErrors.sportSubtype = 'Selecciona la distancia de triatlón';
    }

    if (!formData.daysPerWeek) {
      newErrors.daysPerWeek = 'Selecciona cuántos días puedes entrenar';
    }

    if (!formData.sessionDuration) {
      newErrors.sessionDuration = 'Selecciona la duración de tus sesiones';
    }

    if (formData.trainingLocation.length === 0) {
      newErrors.trainingLocation = 'Selecciona al menos un lugar';
    }

    if (formData.availableEquipment.length === 0) {
      newErrors.availableEquipment = 'Selecciona al menos una opción';
    }

    if (formData.hasInjuries === null) {
      newErrors.hasInjuries = 'Indica si tienes lesiones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const store = useOnboardingStore();

const handleSubmit = () => {
  if (validate()) {
    // ✅ MAPEAR experienceLevel a trainingLevel
    const trainingLevelMap: Record<string, 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'> = {
      'beginner': 'BEGINNER',
      'principiante': 'BEGINNER',
      'intermediate': 'INTERMEDIATE',
      'intermedio': 'INTERMEDIATE',
      'advanced': 'ADVANCED',
      'avanzado': 'ADVANCED',
    };

    // ✅ MAPEAR daysPerWeek a trainingFrequency
    const frequencyMap: Record<number, '1_2' | '3_4' | '5_6' | 'DOUBLE'> = {
      1: '1_2',
      2: '1_2',
      3: '3_4',
      4: '3_4',
      5: '5_6',
      6: '5_6',
      7: 'DOUBLE',
    };

    // ✅ MAPEAR sessionDuration
    const durationMap: Record<number, 'UNDER_30' | '30_60' | '60_90' | 'OVER_90'> = {
      30: 'UNDER_30',
      45: '30_60',
      60: '30_60',
      90: '60_90',
      120: 'OVER_90',
    };

    // ✅ CREAR trainingTypes desde sportType
    const trainingTypes: string[] = [];
    if (formData.sportType) {
      trainingTypes.push(formData.sportType);
    }
    if (formData.sportSubtype) {
      trainingTypes.push(formData.sportSubtype);
    }

    // ✅ MAPEAR intensity (si no existe en formData, usar default)
    const intensityMap: Record<string, 'LOW' | 'MODERATE' | 'HIGH'> = {
      'low': 'LOW',
      'bajo': 'LOW',
      'moderate': 'MODERATE',
      'moderado': 'MODERATE',
      'high': 'HIGH',
      'alto': 'HIGH',
    };

    // ✅ GUARDAR EN STORE
    store.setTraining({
      trainingLevel: trainingLevelMap[formData.experienceLevel.toLowerCase()] || 'INTERMEDIATE',
      trainingFrequency: frequencyMap[Number(formData.daysPerWeek)] || '3_4',
      trainingTypes: trainingTypes.length > 0 ? trainingTypes : ['general'],
      sessionDuration: durationMap[Number(formData.sessionDuration)] || '30_60',
      intensity: 'MODERATE', // ✅ Siempre usar MODERATE por defecto ya que no está en el formulario // Default si no existe
    });
    
    console.log('Training saved, navigating to step 5...', formData);
    router.push('/onboarding/step-5-diet');
  }
};

const handleBack = () => {
  router.push('/onboarding/step-3-activity');
};
  const progress = (4 / 6) * 100;

  const experienceLevels = [
    {
      value: 'beginner',
      label: 'Principiante',
      icon: '🌱',
      description: 'Menos de 6 meses entrenando',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500'
    },
    {
      value: 'intermediate',
      label: 'Intermedio',
      icon: '💪',
      description: '6 meses - 2 años',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500'
    },
    {
      value: 'advanced',
      label: 'Avanzado',
      icon: '🏆',
      description: 'Más de 2 años',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500'
    },
  ];

  const sportTypes = [
    { value: 'strength', label: 'Fuerza/Gimnasio', icon: '🏋️', description: 'Pesas, hipertrofia, powerlifting' },
    { value: 'running', label: 'Running', icon: '🏃', description: 'Carreras de ruta o pista' },
    { value: 'cycling', label: 'Ciclismo', icon: '🚴', description: 'Carretera, MTB, gravel' },
    { value: 'swimming', label: 'Natación', icon: '🏊', description: 'Piscina o aguas abiertas' },
    { value: 'triathlon', label: 'Triatlón', icon: '🏊‍♂️', description: 'Natación + bici + carrera' },
    { value: 'crossfit', label: 'CrossFit', icon: '⚡', description: 'Entrenamiento funcional' },
    { value: 'hiit', label: 'HIIT/Cardio', icon: '🔥', description: 'Alta intensidad, circuitos' },
    { value: 'calisthenics', label: 'Calistenia', icon: '🤸', description: 'Peso corporal, parkour' },
    { value: 'combat', label: 'Deportes de combate', icon: '🥊', description: 'Boxeo, MMA, artes marciales' },
    { value: 'team', label: 'Deportes de equipo', icon: '⚽', description: 'Fútbol, basket, rugby' },
    { value: 'yoga', label: 'Yoga/Pilates', icon: '🧘', description: 'Flexibilidad y mindfulness' },
    { value: 'other', label: 'Otro', icon: '🎯', description: 'Especifica en notas' },
  ];

  // Subdisciplinas condicionales
  const triathlonDistances = [
    { value: 'sprint', label: 'Sprint', distance: '750m / 20km / 5km' },
    { value: 'olympic', label: 'Olímpico', distance: '1.5km / 40km / 10km' },
    { value: 'half-ironman', label: 'Half Ironman', distance: '1.9km / 90km / 21km' },
    { value: 'ironman', label: 'Ironman', distance: '3.8km / 180km / 42km' },
  ];

  const strengthStyles = [
    { value: 'hypertrophy', label: 'Hipertrofia', icon: '💪' },
    { value: 'powerlifting', label: 'Powerlifting', icon: '🏋️' },
    { value: 'bodybuilding', label: 'Culturismo', icon: '🦾' },
    { value: 'general', label: 'General', icon: '⚡' },
  ];

  const runningDistances = [
    { value: '5k', label: '5K' },
    { value: '10k', label: '10K' },
    { value: 'half', label: 'Media Maratón' },
    { value: 'marathon', label: 'Maratón' },
    { value: 'ultra', label: 'Ultra' },
  ];

  const triathlonDisciplines = [
    { value: 'swim', label: 'Natación', icon: '🏊' },
    { value: 'bike', label: 'Ciclismo', icon: '🚴' },
    { value: 'run', label: 'Carrera', icon: '🏃' },
  ];

  const daysOptions = [
    { value: 2, label: '2 días' },
    { value: 3, label: '3 días' },
    { value: 4, label: '4 días' },
    { value: 5, label: '5 días' },
    { value: 6, label: '6+ días' },
  ];

  const durationOptions = [
    { value: 30, label: '30 min', icon: '⚡' },
    { value: 45, label: '45 min', icon: '🔥' },
    { value: 60, label: '60 min', icon: '💪' },
    { value: 90, label: '90+ min', icon: '🏆' },
  ];

  const trainingLocations = [
    { value: 'gym', label: 'Gimnasio', icon: '🏢' },
    { value: 'home', label: 'Casa', icon: '🏠' },
    { value: 'outdoor', label: 'Al aire libre', icon: '🌳' },
    { value: 'pool', label: 'Piscina', icon: '🏊' },
    { value: 'track', label: 'Pista', icon: '🏃' },
  ];

  const equipmentOptions = [
    { value: 'gym_full', label: 'Gimnasio completo', icon: '🏋️' },
    { value: 'dumbbells', label: 'Mancuernas/Pesas', icon: '💪' },
    { value: 'barbell', label: 'Barra olímpica', icon: '🏋️‍♂️' },
    { value: 'kettlebell', label: 'Kettlebells', icon: '⚫' },
    { value: 'resistance_bands', label: 'Bandas elásticas', icon: '🔗' },
    { value: 'pull_up_bar', label: 'Barra dominadas', icon: '🤸' },
    { value: 'road_bike', label: 'Bicicleta carretera', icon: '🚴' },
    { value: 'indoor_trainer', label: 'Rodillo', icon: '🎡' },
    { value: 'pool_access', label: 'Acceso a piscina', icon: '🏊' },
    { value: 'running_shoes', label: 'Zapatillas running', icon: '👟' },
    { value: 'cardio_machines', label: 'Máquinas cardio', icon: '📊' },
    { value: 'none', label: 'Solo peso corporal', icon: '🤸' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        
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
                  <span className="text-emerald-400 font-bold">4</span>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Paso 4 de 6</div>
                  <h1 className="text-2xl font-bold text-white">Perfil Deportivo</h1>
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
              Cuéntanos sobre tu experiencia deportiva para crear un plan de entrenamiento perfectamente adaptado a ti.
            </p>
          </div>

          <div className="p-8 space-y-8">
            
            {/* Experience Level */}
            <div>
              {/* FIX: Removed 'block' class to resolve CSS conflict with 'flex' */}
              <label className="mb-4 text-slate-300 font-medium flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                ¿Cuál es tu nivel de experiencia?
              </label>
              <div className="grid sm:grid-cols-3 gap-4">
                {experienceLevels.map((level) => {
                  const isSelected = formData.experienceLevel === level.value;
                  
                  return (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => handleChange('experienceLevel', level.value)}
                      className={`relative p-5 rounded-xl border-2 transition-all text-center ${
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
                      <div className="text-4xl mb-3">{level.icon}</div>
                      <div className={`font-bold mb-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {level.label}
                      </div>
                      <div className="text-xs text-slate-500">{level.description}</div>
                    </button>
                  );
                })}
              </div>
              {errors.experienceLevel && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.experienceLevel}
                </p>
              )}
            </div>

            {/* Sport Type */}
            <div>
              {/* FIX: Removed 'block' class to resolve CSS conflict with 'flex' */}
              <label className="mb-4 text-slate-300 font-medium flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-blue-400" />
                ¿Qué tipo de entrenamiento practicas principalmente?
              </label>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {sportTypes.map((sport) => {
                  const isSelected = formData.sportType === sport.value;
                  
                  return (
                    <button
                      key={sport.value}
                      type="button"
                      onClick={() => {
                        handleChange('sportType', sport.value);
                        handleChange('sportSubtype', '');
                      }}
                      className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'bg-blue-600 border-blue-500 shadow-lg scale-105'
                          : 'bg-slate-900 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle2 className="w-4 h-4 text-slate-950" />
                        </div>
                      )}
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{sport.icon}</span>
                        <span className={`font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                          {sport.label}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">{sport.description}</div>
                    </button>
                  );
                })}
              </div>
              {errors.sportType && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.sportType}
                </p>
              )}
            </div>

            {/* Triathlon Subdiscipline - Conditional */}
            {formData.sportType === 'triathlon' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 bg-gradient-to-br from-purple-900/20 to-slate-900/50 border border-purple-500/30 rounded-xl p-6">
                <label className="mb-4 block text-slate-300 font-medium">
                  ¿Qué distancia de triatlón?
                </label>
                <div className="grid sm:grid-cols-2 gap-3 mb-6">
                  {triathlonDistances.map((dist) => {
                    const isSelected = formData.sportSubtype === dist.value;
                    return (
                      <button
                        key={dist.value}
                        type="button"
                        onClick={() => handleChange('sportSubtype', dist.value)}
                        className={`relative p-3 rounded-lg border-2 transition-all text-left ${
                          isSelected
                            ? 'bg-purple-600 border-purple-500 shadow-lg'
                            : 'bg-slate-950 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 w-5 h-5 bg-purple-400 rounded-full flex items-center justify-center shadow-lg">
                            <CheckCircle2 className="w-3 h-3 text-slate-950" />
                          </div>
                        )}
                        <div className={`font-bold mb-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                          {dist.label}
                        </div>
                        <div className="text-xs text-slate-400">{dist.distance}</div>
                      </button>
                    );
                  })}
                </div>
                {errors.sportSubtype && (
                  <p className="text-red-400 text-xs mb-4 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                    {errors.sportSubtype}
                  </p>
                )}

                {/* Favorite/Least Favorite Discipline */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm text-slate-400">Disciplina favorita</label>
                    <div className="space-y-2">
                      {triathlonDisciplines.map((disc) => {
                        const isSelected = formData.favoriteDiscipline === disc.value;
                        return (
                          <button
                            key={disc.value}
                            type="button"
                            onClick={() => handleChange('favoriteDiscipline', disc.value)}
                            className={`w-full p-2 rounded-lg border-2 transition-all flex items-center gap-2 ${
                              isSelected
                                ? 'bg-green-600 border-green-500'
                                : 'bg-slate-950 border-slate-700 hover:border-slate-600'
                            }`}
                          >
                            <span className="text-lg">{disc.icon}</span>
                            <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                              {disc.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-slate-400">Disciplina menos favorita</label>
                    <div className="space-y-2">
                      {triathlonDisciplines.map((disc) => {
                        const isSelected = formData.leastFavoriteDiscipline === disc.value;
                        return (
                          <button
                            key={disc.value}
                            type="button"
                            onClick={() => handleChange('leastFavoriteDiscipline', disc.value)}
                            className={`w-full p-2 rounded-lg border-2 transition-all flex items-center gap-2 ${
                              isSelected
                                ? 'bg-red-600 border-red-500'
                                : 'bg-slate-950 border-slate-700 hover:border-slate-600'
                            }`}
                          >
                            <span className="text-lg">{disc.icon}</span>
                            <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                              {disc.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Strength Subtype - Conditional */}
            {formData.sportType === 'strength' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <label className="mb-3 block text-sm text-slate-400">¿Qué estilo de entrenamiento?</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {strengthStyles.map((style) => {
                    const isSelected = formData.sportSubtype === style.value;
                    return (
                      <button
                        key={style.value}
                        type="button"
                        onClick={() => handleChange('sportSubtype', style.value)}
                        className={`relative p-3 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'bg-orange-600 border-orange-500 shadow-lg'
                            : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 text-slate-950" />
                          </div>
                        )}
                        <div className="text-xl mb-1">{style.icon}</div>
                        <div className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                          {style.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Running Distance - Conditional */}
            {formData.sportType === 'running' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <label className="mb-3 block text-sm text-slate-400">¿Qué distancias corres?</label>
                <div className="flex flex-wrap gap-2">
                  {runningDistances.map((dist) => {
                    const isSelected = formData.sportSubtype === dist.value;
                    return (
                      <button
                        key={dist.value}
                        type="button"
                        onClick={() => handleChange('sportSubtype', dist.value)}
                        className={`px-4 py-2 rounded-full border-2 transition-all font-bold text-sm ${
                          isSelected
                            ? 'bg-red-600 border-red-500 text-white'
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        {dist.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Performance Data - Optional */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-4">
                <Target className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-slate-300 font-medium">
                      Datos de rendimiento actuales
                    </label>
                    <span className="text-slate-500 text-xs bg-slate-800 px-2 py-0.5 rounded-full">Opcional</span>
                  </div>
                  <div className="text-xs text-slate-500 mb-4">Nos ayuda a calibrar mejor tu plan de entrenamiento</div>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {(formData.sportType === 'running' || formData.sportType === 'triathlon') && (
                  <div>
                    <label htmlFor="runPaceZ2" className="block text-xs text-slate-400 mb-2">
                      Pace Z2 (min/km)
                    </label>
                    <input
                      id="runPaceZ2"
                      type="text"
                      value={formData.runPaceZ2}
                      onChange={(e) => handleChange('runPaceZ2', e.target.value)}
                      placeholder="5:30"
                      className="w-full bg-slate-950 border-2 border-slate-700 rounded-lg px-3 py-2 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all placeholder:text-slate-600 text-sm"
                    />
                  </div>
                )}

                {(formData.sportType === 'cycling' || formData.sportType === 'triathlon') && (
                  <div>
                    <label htmlFor="ftpWatts" className="block text-xs text-slate-400 mb-2">
                      FTP (watts)
                    </label>
                    <input
                      id="ftpWatts"
                      type="number"
                      // Ensure value is handled correctly for number input
                      value={formData.ftpWatts || ''} 
                      onChange={(e) => handleChange('ftpWatts', e.target.value)}
                      placeholder="250"
                      className="w-full bg-slate-950 border-2 border-slate-700 rounded-lg px-3 py-2 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all placeholder:text-slate-600 text-sm"
                    />
                  </div>
                )}

                {(formData.sportType === 'swimming' || formData.sportType === 'triathlon') && (
                  <div>
                    <label htmlFor="swim100mPace" className="block text-xs text-slate-400 mb-2">
                      Ritmo 100m (min:seg)
                    </label>
                    <input
                      id="swim100mPace"
                      type="text"
                      value={formData.swim100mPace}
                      onChange={(e) => handleChange('swim100mPace', e.target.value)}
                      placeholder="2:00"
                      className="w-full bg-slate-950 border-2 border-slate-700 rounded-lg px-3 py-2 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all placeholder:text-slate-600 text-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Days per Week */}
            <div>
              {/* FIX: Removed 'block' class to resolve CSS conflict with 'flex' */}
              <label className="mb-4 text-slate-300 font-medium flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-400" />
                ¿Cuántos días por semana puedes entrenar?
              </label>
              <div className="grid grid-cols-5 gap-3">
                {daysOptions.map((option) => {
                  const isSelected = formData.daysPerWeek === option.value;
                  
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleChange('daysPerWeek', option.value)}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'bg-orange-600 border-orange-500 shadow-lg scale-110'
                          : 'bg-slate-900 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle2 className="w-4 h-4 text-slate-950" />
                        </div>
                      )}
                      <div className={`text-center font-bold text-lg ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {option.value}
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.daysPerWeek && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.daysPerWeek}
                </p>
              )}
            </div>

            {/* Session Duration */}
            <div>
              {/* FIX: Removed 'block' class to resolve CSS conflict with 'flex' */}
              <label className="mb-4 text-slate-300 font-medium flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-400" />
                ¿Cuánto tiempo tienes por sesión?
              </label>
              <div className="grid sm:grid-cols-4 gap-3">
                {durationOptions.map((option) => {
                  const isSelected = formData.sessionDuration === option.value;
                  
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleChange('sessionDuration', option.value)}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'bg-cyan-600 border-cyan-500 shadow-lg scale-105'
                          : 'bg-slate-900 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle2 className="w-4 h-4 text-slate-950" />
                        </div>
                      )}
                      <div className="text-2xl mb-2">{option.icon}</div>
                      <div className={`font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {option.label}
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.sessionDuration && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.sessionDuration}
                </p>
              )}
            </div>

            {/* Training Location */}
            <div>
              <label className="mb-4 block text-slate-300 font-medium">
                ¿Dónde entrenas?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {trainingLocations.map((location) => {
                  const isSelected = formData.trainingLocation.includes(location.value);
                  
                  return (
                    <button
                      key={location.value}
                      type="button"
                      onClick={() => toggleArrayValue('trainingLocation', location.value)}
                      className={`relative p-3 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'bg-teal-600 border-teal-500 shadow-lg'
                          : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-teal-400 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle2 className="w-3 h-3 text-slate-950" />
                        </div>
                      )}
                      <div className="text-2xl mb-2">{location.icon}</div>
                      <div className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                        {location.label}
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.trainingLocation && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.trainingLocation}
                </p>
              )}
            </div>

            {/* Available Equipment */}
            <div>
              <label className="mb-4 block text-slate-300 font-medium">
                ¿Qué equipo tienes disponible?
              </label>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {equipmentOptions.map((equipment) => {
                  const isSelected = formData.availableEquipment.includes(equipment.value);
                  
                  return (
                    <button
                      key={equipment.value}
                      type="button"
                      onClick={() => toggleArrayValue('availableEquipment', equipment.value)}
                      className={`relative p-3 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-500 shadow-lg'
                          : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-indigo-400 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle2 className="w-3 h-3 text-slate-950" />
                        </div>
                      )}
                      {/* The flex/block conflict was likely here, on the button's internal div/span, but it's not immediately visible. The previous fix targeted labels, so I'll check if the button itself had block. It did not. */}
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{equipment.icon}</span>
                        <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                          {equipment.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.availableEquipment && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.availableEquipment}
                </p>
              )}
            </div>

            {/* Injuries */}
            <div className="bg-gradient-to-br from-red-900/20 to-slate-900/50 border border-red-500/30 rounded-xl p-6">
              {/* FIX: Removed 'block' class to resolve CSS conflict with 'flex' */}
              <label className="mb-4 text-slate-300 font-medium flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                ¿Tienes lesiones o molestias recientes?
              </label>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => handleChange('hasInjuries', true)}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    formData.hasInjuries === true
                      ? 'bg-red-600 border-red-500 shadow-lg'
                      : 'bg-slate-950 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {formData.hasInjuries === true && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-400 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-2xl mb-2">⚠️</div>
                    <div className={`font-bold ${formData.hasInjuries === true ? 'text-white' : 'text-slate-300'}`}>
                      Sí, tengo molestias
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleChange('hasInjuries', false);
                    handleChange('injuryDetails', '');
                  }}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    formData.hasInjuries === false
                      ? 'bg-green-600 border-green-500 shadow-lg'
                      : 'bg-slate-950 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {formData.hasInjuries === false && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-2xl mb-2">✅</div>
                    <div className={`font-bold ${formData.hasInjuries === false ? 'text-white' : 'text-slate-300'}`}>
                      No, estoy bien
                    </div>
                  </div>
                </button>
              </div>
              {errors.hasInjuries && (
                <p className="text-red-400 text-xs mb-4 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.hasInjuries}
                </p>
              )}

              {formData.hasInjuries && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <label htmlFor="injuryDetails" className="mb-2 block text-sm text-slate-400">
                    Describe tus molestias o lesiones
                  </label>
                  <textarea
                    id="injuryDetails"
                    value={formData.injuryDetails}
                    onChange={(e) => handleChange('injuryDetails', e.target.value)}
                    placeholder="Ej: Dolor en rodilla derecha al correr, molestia en hombro izquierdo..."
                    rows={3}
                    className="w-full bg-slate-950 border-2 border-slate-700 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all placeholder:text-slate-600 resize-none"
                  />
                  <div className="mt-2 flex items-start gap-2 text-xs text-slate-500">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-400" />
                    <span>Adaptaremos tu plan para evitar ejercicios que puedan agravar tus molestias.</span>
                  </div>
                </div>
              )}
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