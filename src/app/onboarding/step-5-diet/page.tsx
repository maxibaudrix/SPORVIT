'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, Salad, AlertCircle, Coffee, Clock, Apple, ChefHat, Flame, Info, CheckCircle2, X } from 'lucide-react';
import { useOnboardingStore } from '@/store/onboarding';

// 1. DEFINE THE EXPLICIT TYPE FOR THE FORM DATA
interface NutritionFormData {
  dietType: string;
  mealsPerDay: string | number; 
  allergies: string[];
  intolerances: string[];
  excludedFoods: string[];
  customExcludedFood: string;
  cookingFrequency: string;
  mealComplexity: string;
  alcoholConsumption: string;
  waterIntake: string;
  breakfastTime: string;
  lunchTime: string;
  dinnerTime: string;
}

export default function Step5NutritionPage() {
  // 2. APPLY THE TYPE TO useState
  const [formData, setFormData] = useState<NutritionFormData>({
    // Tipo de dieta
    dietType: '',
    mealsPerDay: '', // Will be updated to a number on selection
    
    // Alergias e intolerancias
    allergies: [],
    intolerances: [],
    
    // Alimentos excluidos
    excludedFoods: [],
    customExcludedFood: '',
    
    // Preferencias
    cookingFrequency: '',
    mealComplexity: '',
    
    // Hábitos
    alcoholConsumption: '',
    waterIntake: '',
    
    // Horarios de comidas (opcional)
    breakfastTime: '',
    lunchTime: '',
    dinnerTime: ''
  });

  // Errors should be typed similarly for better type safety, but we'll focus on formData for the reported errors
  const [errors, setErrors] = useState<Partial<NutritionFormData>>({});
  const router = useRouter();

  // Use keyof NutritionFormData for type safety in dynamic field updates
  const handleChange = (field: keyof NutritionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined })); // Use undefined or a better error object structure
    }
  };

  // Explicitly type the field parameter for array toggling
  const toggleArrayValue = (field: 'allergies' | 'intolerances' | 'excludedFoods', value: string) => {
    setFormData(prev => {
      // Add explicit type assertion for clarity on array manipulation
      const currentArray = prev[field] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(v => v !== value)
        : [...currentArray, value];
      return { ...prev, [field]: newArray };
    });
  };

  const addCustomExcludedFood = () => {
    if (formData.customExcludedFood.trim()) {
      setFormData(prev => ({
        ...prev,
        excludedFoods: [...prev.excludedFoods, formData.customExcludedFood.trim()],
        customExcludedFood: ''
      }));
    }
  };

  const removeExcludedFood = (food: string) => {
    setFormData(prev => ({
      ...prev,
      excludedFoods: prev.excludedFoods.filter(f => f !== food)
    }));
  };

  const validate = () => {
    const newErrors: Partial<NutritionFormData> = {};
    
    if (!formData.dietType) {
      newErrors.dietType = 'Selecciona tu tipo de dieta';
    }
    
    if (!formData.mealsPerDay) {
      newErrors.mealsPerDay = 'Selecciona cuántas comidas haces';
    }

    if (!formData.cookingFrequency) {
      newErrors.cookingFrequency = 'Indica con qué frecuencia cocinas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 
const setDiet = useOnboardingStore((state) => state.setDiet);

const handleSubmit = () => {
  if (validate()) {
    // ✅ MAPEAR dietType a mayúsculas
    const dietTypeMap: Record<string, 'NONE' | 'OMNIVORE' | 'VEGETARIAN' | 'VEGAN' | 'PESCETARIAN' | 'KETO' | 'PALEO' | 'MEDITERRANEAN' | 'LOW_CARB' | 'CARNIVORE' | 'OTHER'> = {
      'none': 'NONE',
      'ninguna': 'NONE',
      'omnivore': 'OMNIVORE',
      'omnívoro': 'OMNIVORE',
      'vegetarian': 'VEGETARIAN',
      'vegetariano': 'VEGETARIAN',
      'vegan': 'VEGAN',
      'vegano': 'VEGAN',
      'pescetarian': 'PESCETARIAN',
      'pescetariano': 'PESCETARIAN',
      'keto': 'KETO',
      'cetogénica': 'KETO',
      'paleo': 'PALEO',
      'mediterranean': 'MEDITERRANEAN',
      'mediterránea': 'MEDITERRANEAN',
      'low_carb': 'LOW_CARB',
      'baja_carbos': 'LOW_CARB',
      'carnivore': 'CARNIVORE',
      'carnívora': 'CARNIVORE',
      'other': 'OTHER',
      'otra': 'OTHER',
    };

    // ✅ GUARDAR EN STORE
    setDiet({
      dietType: dietTypeMap[formData.dietType.toLowerCase()] || 'NONE',
      allergies: formData.allergies || [],
      excludedIngredients: formData.excludedFoods || [], // ✅ USAR excludedFoods del formulario
    });
    
    console.log('Diet saved, navigating to step 6...', formData);
    router.push('/onboarding/step-6-macros');
  }
};

const handleBack = () => {
  router.push('/onboarding/step-4-training-level');
};

  const progress = (5 / 6) * 100;

  const dietTypes = [
    { value: 'omnivore', label: 'Omnívoro', icon: '🍽️', description: 'Como de todo' },
    { value: 'vegetarian', label: 'Vegetariano', icon: '🥗', description: 'Sin carne ni pescado' },
    { value: 'vegan', label: 'Vegano', icon: '🌱', description: 'Sin productos animales' },
    { value: 'flexitarian', label: 'Flexitariano', icon: '🥙', description: 'Principalmente vegetal' },
    { value: 'pescatarian', label: 'Pescetariano', icon: '🐟', description: 'Con pescado, sin carne' },
    { value: 'keto', label: 'Cetogénico', icon: '🥓', description: 'Bajo en carbos, alto en grasas' },
    { value: 'paleo', label: 'Paleo', icon: '🍖', description: 'Alimentos no procesados' },
    { value: 'mediterranean', label: 'Mediterránea', icon: '🫒', description: 'Dieta mediterránea' },
  ];

  const mealsOptions = [
    { value: 2, label: '2 comidas', subtitle: '+ snacks opcionales', icon: '🍽️' },
    { value: 3, label: '3 comidas', subtitle: 'Desayuno, comida, cena', icon: '🍽️🍽️' },
    { value: 4, label: '4 comidas', subtitle: '+ 1 snack', icon: '🍽️🍽️🍽️' },
    { value: 5, label: '5-6 comidas', subtitle: 'Comidas pequeñas frecuentes', icon: '🍽️🍽️🍽️🍽️' },
  ];

  const commonAllergies = [
    { value: 'dairy', label: 'Lácteos', icon: '🥛' },
    { value: 'eggs', label: 'Huevos', icon: '🥚' },
    { value: 'nuts', label: 'Frutos secos', icon: '🥜' },
    { value: 'shellfish', label: 'Mariscos', icon: '🦐' },
    { value: 'fish', label: 'Pescado', icon: '🐟' },
    { value: 'soy', label: 'Soja', icon: '🫘' },
    { value: 'wheat', label: 'Trigo', icon: '🌾' },
    { value: 'gluten', label: 'Gluten', icon: '🍞' },
  ];

  const commonIntolerances = [
    { value: 'lactose', label: 'Lactosa', icon: '🥛' },
    { value: 'gluten', label: 'Gluten', icon: '🍞' },
    { value: 'fructose', label: 'Fructosa', icon: '🍎' },
    { value: 'fodmap', label: 'FODMAP', icon: '🥦' },
  ];

  const commonExcludedFoods = [
    'Carne roja', 'Cerdo', 'Pescado', 'Mariscos', 
    'Aguacate', 'Espinacas', 'Brócoli', 'Coliflor',
    'Picante', 'Ajo', 'Cebolla', 'Lácteos'
  ];

  const cookingFrequencies = [
    { value: 'never', label: 'Nunca cocino', icon: '🚫', description: 'Prefiero comida preparada' },
    { value: 'rarely', label: 'Rara vez', icon: '😅', description: '1-2 veces por semana' },
    { value: 'occasionally', label: 'Ocasionalmente', icon: '👨‍🍳', description: '3-4 veces por semana' },
    { value: 'regularly', label: 'Regularmente', icon: '🔥', description: '5+ veces por semana' },
    { value: 'advanced', label: 'Soy chef casero', icon: '👨‍🍳', description: 'Me encanta cocinar' },
  ];

  const mealComplexities = [
    { value: 'simple', label: 'Simple', time: '<15 min', icon: '⚡' },
    { value: 'moderate', label: 'Moderado', time: '15-30 min', icon: '🍳' },
    { value: 'complex', label: 'Elaborado', time: '30+ min', icon: '👨‍🍳' },
  ];

  const alcoholOptions = [
    { value: 'never', label: 'Nunca', icon: '🚫' },
    { value: 'rarely', label: 'Rara vez', icon: '🍷', subtitle: '1-2 veces/mes' },
    { value: 'occasionally', label: 'Ocasionalmente', icon: '🍺', subtitle: '1-2 veces/semana' },
    { value: 'regularly', label: 'Regularmente', icon: '🍻', subtitle: '3+ veces/semana' },
  ];

  const waterIntakeOptions = [
    { value: 'low', label: 'Menos de 1.5L', icon: '💧' },
    { value: 'moderate', label: '1.5 - 2.5L', icon: '💧💧' },
    { value: 'high', label: '2.5 - 3.5L', icon: '💧💧💧' },
    { value: 'very-high', label: 'Más de 3.5L', icon: '💧💧💧💧' },
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
                  <span className="text-emerald-400 font-bold">5</span>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Paso 5 de 6</div>
                  <h1 className="text-2xl font-bold text-white">Nutrición y Preferencias</h1>
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
              Personaliza tu plan nutricional según tus preferencias, restricciones y estilo de vida.
            </p>
          </div>

          <div className="p-8 space-y-8">
            
            {/* Diet Type */}
            <div>
              <label className="mb-4  text-slate-300 font-medium flex items-center gap-2">
                <Salad className="w-5 h-5 text-emerald-400" />
                ¿Qué tipo de dieta sigues?
              </label>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {dietTypes.map((diet) => {
                  const isSelected = formData.dietType === diet.value;
                  
                  return (
                    <button
                      key={diet.value}
                      type="button"
                      onClick={() => handleChange('dietType', diet.value)}
                      className={`relative p-4 rounded-xl border-2 transition-all text-center ${
                        isSelected
                          ? 'bg-emerald-600 border-emerald-500 shadow-lg scale-105'
                          : 'bg-slate-900 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle2 className="w-4 h-4 text-slate-950" />
                        </div>
                      )}
                      <div className="text-3xl mb-2">{diet.icon}</div>
                      <div className={`font-bold mb-1 text-sm ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {diet.label}
                      </div>
                      <div className="text-xs text-slate-500">{diet.description}</div>
                    </button>
                  );
                })}
              </div>
              {errors.dietType && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.dietType}
                </p>
              )}
            </div>

            {/* Meals per Day */}
            <div>
              <label className="mb-4  text-slate-300 font-medium flex items-center gap-2">
                <Coffee className="w-5 h-5 text-orange-400" />
                ¿Cuántas comidas haces al día?
              </label>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {mealsOptions.map((option) => {
                  const isSelected = formData.mealsPerDay === option.value;
                  
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleChange('mealsPerDay', option.value)}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'bg-orange-600 border-orange-500 shadow-lg scale-105'
                          : 'bg-slate-900 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle2 className="w-4 h-4 text-slate-950" />
                        </div>
                      )}
                      <div className="text-2xl mb-2">{option.icon}</div>
                      <div className={`font-bold mb-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {option.label}
                      </div>
                      <div className="text-xs text-slate-500">{option.subtitle}</div>
                    </button>
                  );
                })}
              </div>
              {errors.mealsPerDay && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.mealsPerDay}
                </p>
              )}
            </div>

            {/* Allergies */}
            <div className="bg-gradient-to-br from-red-900/20 to-slate-900/50 border border-red-500/30 rounded-xl p-6">
              <label className="mb-4 text-slate-300 font-medium flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                ¿Tienes alergias alimentarias?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {commonAllergies.map((allergy) => {
                  const isSelected = formData.allergies.includes(allergy.value);
                  
                  return (
                    <button
                      key={allergy.value}
                      type="button"
                      onClick={() => toggleArrayValue('allergies', allergy.value)}
                      className={`relative p-3 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'bg-red-600 border-red-500 shadow-lg'
                          : 'bg-slate-950 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-400 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-slate-950" />
                        </div>
                      )}
                      <div className="text-xl mb-1">{allergy.icon}</div>
                      <div className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                        {allergy.label}
                      </div>
                    </button>
                  );
                })}
              </div>
              {formData.allergies.length === 0 && (
                <p className="text-xs text-slate-500 mt-3">Ninguna alergia seleccionada</p>
              )}
            </div>

            {/* Intolerances */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-4">
                <Apple className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-slate-300 font-medium">
                      ¿Tienes intolerancias?
                    </label>
                    <span className="text-slate-500 text-xs bg-slate-800 px-2 py-0.5 rounded-full">Opcional</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {commonIntolerances.map((intolerance) => {
                  const isSelected = formData.intolerances.includes(intolerance.value);
                  
                  return (
                    <button
                      key={intolerance.value}
                      type="button"
                      onClick={() => toggleArrayValue('intolerances', intolerance.value)}
                      className={`relative p-3 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'bg-yellow-600 border-yellow-500 shadow-lg'
                          : 'bg-slate-950 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-slate-950" />
                        </div>
                      )}
                      <div className="text-xl mb-1">{intolerance.icon}</div>
                      <div className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                        {intolerance.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Excluded Foods */}
            <div>
              <label className="mb-4 text-slate-300 font-medium flex items-center gap-2">
                <X className="w-5 h-5 text-purple-400" />
                Alimentos que NO quieres ver en tu plan
                <span className="text-slate-500 text-xs bg-slate-800 px-2 py-0.5 rounded-full ml-auto">Opcional</span>
              </label>
              
              {/* Quick select common foods */}
              <div className="flex flex-wrap gap-2 mb-4">
                {commonExcludedFoods.map((food) => {
                  const isExcluded = formData.excludedFoods.includes(food);
                  return (
                    <button
                      key={food}
                      type="button"
                      onClick={() => {
                        if (isExcluded) {
                          removeExcludedFood(food);
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            excludedFoods: [...prev.excludedFoods, food]
                          }));
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${
                        isExcluded
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {food}
                    </button>
                  );
                })}
              </div>

              {/* Custom food input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.customExcludedFood}
                  onChange={(e) => handleChange('customExcludedFood', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomExcludedFood())}
                  placeholder="Agrega otro alimento..."
                  className="flex-grow bg-slate-950 border-2 border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={addCustomExcludedFood}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all"
                >
                  Agregar
                </button>
              </div>

              {/* Selected excluded foods */}
              {formData.excludedFoods.length > 0 && (
                <div className="mt-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400 mb-2">Alimentos excluidos:</div>
                  <div className="flex flex-wrap gap-2">
                    {formData.excludedFoods.map((food) => (
                      <div
                        key={food}
                        className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-full text-xs font-medium"
                      >
                        <span>{food}</span>
                        <button
                          type="button"
                          onClick={() => removeExcludedFood(food)}
                          className="hover:bg-purple-700 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cooking Frequency */}
            <div>
              <label className="mb-4 text-slate-300 font-medium flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-blue-400" />
                ¿Con qué frecuencia cocinas?
              </label>
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {cookingFrequencies.map((freq) => {
                  const isSelected = formData.cookingFrequency === freq.value;
                  
                  return (
                    <button
                      key={freq.value}
                      type="button"
                      onClick={() => handleChange('cookingFrequency', freq.value)}
                      className={`relative p-4 rounded-xl border-2 transition-all text-center ${
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
                      <div className="text-2xl mb-2">{freq.icon}</div>
                      <div className={`font-bold mb-1 text-sm ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {freq.label}
                      </div>
                      <div className="text-xs text-slate-500">{freq.description}</div>
                    </button>
                  );
                })}
              </div>
              {errors.cookingFrequency && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.cookingFrequency}
                </p>
              )}
            </div>

            {/* Meal Complexity - Optional */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-4">
                <Clock className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-slate-300 font-medium">
                      Complejidad de recetas preferida
                    </label>
                    <span className="text-slate-500 text-xs bg-slate-800 px-2 py-0.5 rounded-full">Opcional</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {mealComplexities.map((complexity) => {
                  const isSelected = formData.mealComplexity === complexity.value;
                  
                  return (
                    <button
                      key={complexity.value}
                      type="button"
                      onClick={() => handleChange('mealComplexity', complexity.value)}
                      className={`relative p-3 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'bg-cyan-600 border-cyan-500 shadow-lg'
                          : 'bg-slate-950 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle2 className="w-3 h-3 text-slate-950" />
                        </div>
                      )}
                      <div className="text-xl mb-1">{complexity.icon}</div>
                      <div className={`text-sm font-bold mb-0.5 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {complexity.label}
                      </div>
                      <div className="text-xs text-slate-400">{complexity.time}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Alcohol Consumption - Optional */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-4">
                <Flame className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-slate-300 font-medium">
                      ¿Consumes alcohol?
                    </label>
                    <span className="text-slate-500 text-xs bg-slate-800 px-2 py-0.5 rounded-full">Opcional</span>
                  </div>
                </div>
              </div>
              <div className="grid sm:grid-cols-4 gap-3">
                {alcoholOptions.map((option) => {
                  const isSelected = formData.alcoholConsumption === option.value;
                  
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleChange('alcoholConsumption', option.value)}
                      className={`relative p-3 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'bg-amber-600 border-amber-500 shadow-lg'
                          : 'bg-slate-950 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle2 className="w-3 h-3 text-slate-950" />
                        </div>
                      )}
                      <div className="text-2xl mb-1">{option.icon}</div>
                      <div className={`text-sm font-bold mb-0.5 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {option.label}
                      </div>
                      {option.subtitle && (
                        <div className="text-xs text-slate-400">{option.subtitle}</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Water Intake - Optional */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0">💧</div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-slate-300 font-medium">
                      ¿Cuánta agua bebes al día?
                    </label>
                    <span className="text-slate-500 text-xs bg-slate-800 px-2 py-0.5 rounded-full">Opcional</span>
                  </div>
                </div>
              </div>
              <div className="grid sm:grid-cols-4 gap-3">
                {waterIntakeOptions.map((option) => {
                  const isSelected = formData.waterIntake === option.value;
                  
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleChange('waterIntake', option.value)}
                      className={`relative p-3 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'bg-blue-600 border-blue-500 shadow-lg'
                          : 'bg-slate-950 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle2 className="w-3 h-3 text-slate-950" />
                        </div>
                      )}
                      <div className="text-2xl mb-1">{option.icon}</div>
                      <div className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {option.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Meal Times - Optional */}
            <div className="bg-gradient-to-br from-indigo-900/20 to-slate-900/50 border border-indigo-500/30 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <Clock className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-slate-300 font-medium">
                      Horarios habituales de comidas
                    </label>
                    <span className="text-slate-500 text-xs bg-slate-800 px-2 py-0.5 rounded-full">Opcional</span>
                  </div>
                  <div className="text-xs text-slate-500 mb-4">Nos ayuda a programar recordatorios y optimizar tu energía</div>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="breakfastTime" className="block text-xs text-slate-400 mb-2">
                    Desayuno
                  </label>
                  <input
                    id="breakfastTime"
                    type="time"
                    value={formData.breakfastTime}
                    onChange={(e) => handleChange('breakfastTime', e.target.value)}
                    className="w-full bg-slate-950 border-2 border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="lunchTime" className="block text-xs text-slate-400 mb-2">
                    Comida
                  </label>
                  <input
                    id="lunchTime"
                    type="time"
                    value={formData.lunchTime}
                    onChange={(e) => handleChange('lunchTime', e.target.value)}
                    className="w-full bg-slate-950 border-2 border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="dinnerTime" className="block text-xs text-slate-400 mb-2">
                    Cena
                  </label>
                  <input
                    id="dinnerTime"
                    type="time"
                    value={formData.dinnerTime}
                    onChange={(e) => handleChange('dinnerTime', e.target.value)}
                    className="w-full bg-slate-950 border-2 border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Summary Info Box */}
            <div className="bg-gradient-to-br from-emerald-900/20 to-slate-900/50 border border-emerald-500/30 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="flex-grow">
                  <div className="font-bold text-white mb-2">Resumen de preferencias</div>
                  <div className="space-y-1 text-sm text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tipo de dieta:</span>
                      <span className="font-medium">{formData.dietType ? dietTypes.find(d => d.value === formData.dietType)?.label : 'No seleccionado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Comidas al día:</span>
                      <span className="font-medium">{formData.mealsPerDay || 'No seleccionado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Alergias:</span>
                      <span className="font-medium">{formData.allergies.length > 0 ? formData.allergies.length : 'Ninguna'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Alimentos excluidos:</span>
                      <span className="font-medium">{formData.excludedFoods.length > 0 ? formData.excludedFoods.length : 'Ninguno'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Frecuencia cocina:</span>
                      <span className="font-medium">{formData.cookingFrequency ? cookingFrequencies.find(c => c.value === formData.cookingFrequency)?.label : 'No seleccionado'}</span>
                    </div>
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
                <span>Último Paso</span>
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