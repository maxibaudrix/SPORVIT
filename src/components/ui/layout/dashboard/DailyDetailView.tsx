'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Dumbbell, Utensils, FileText, ChevronDown, Clock, ChefHat } from 'lucide-react';
import { DayEvent } from '@/types/calendar';
import { formatDateLong, getDayName } from '@/lib/utils/calendar';
import WorkoutDetail, { EmptyWorkoutState } from '@/components/dashboard/WorkoutDetail';
import TimerWidget from '@/components/ui/layout/dashboard/TimerWidget';

interface DailyDetailViewProps {
  date: Date;
  events: DayEvent[];
  onPreviousDay: () => void;
  onNextDay: () => void;
}

type TabType = 'workouts' | 'nutrition' | 'notes';

export default function DailyDetailView({
  date,
  events,
  onPreviousDay,
  onNextDay,
}: DailyDetailViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('workouts');

  const workouts = events.filter(e => e.type === 'workout');
  const meals = events.filter(e => e.type === 'meal');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* Header con navegación */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between">
          {/* Navegación de días */}
          <button
            onClick={onPreviousDay}
            className="p-3 hover:bg-slate-800 rounded-xl transition-all duration-200 hover:scale-105"
            aria-label="Día anterior"
          >
            <ChevronLeft className="w-6 h-6 text-slate-400 hover:text-white" />
          </button>

          {/* Información del día */}
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                {getDayName(date)}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              {formatDateLong(date)}
            </h2>
          </div>

          {/* Navegación siguiente */}
          <button
            onClick={onNextDay}
            className="p-3 hover:bg-slate-800 rounded-xl transition-all duration-200 hover:scale-105"
            aria-label="Día siguiente"
          >
            <ChevronRight className="w-6 h-6 text-slate-400 hover:text-white" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-6 bg-slate-800/50 p-1.5 rounded-xl">
          <button
            onClick={() => setActiveTab('workouts')}
            className={`
              flex-1 flex items-center justify-center gap-1.5 px-2 sm:px-4 py-3 rounded-lg
              font-medium transition-all duration-200 text-sm sm:text-base
              ${activeTab === 'workouts'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }
            `}
          >
            <Dumbbell className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Entrenamiento</span>
            <span className="sm:hidden">Workout</span>
            {workouts.length > 0 && (
              <span className={`
                text-xs px-1.5 py-0.5 rounded-full flex-shrink-0
                ${activeTab === 'workouts' ? 'bg-white/20' : 'bg-slate-700'}
              `}>
                {workouts.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('nutrition')}
            className={`
              flex-1 flex items-center justify-center gap-1.5 px-2 sm:px-4 py-3 rounded-lg
              font-medium transition-all duration-200 text-sm sm:text-base
              ${activeTab === 'nutrition'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }
            `}
          >
            <Utensils className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Nutrición</span>
            <span className="sm:hidden">Food</span>
            {meals.length > 0 && (
              <span className={`
                text-xs px-1.5 py-0.5 rounded-full flex-shrink-0
                ${activeTab === 'nutrition' ? 'bg-white/20' : 'bg-slate-700'}
              `}>
                {meals.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`
              flex-1 flex items-center justify-center gap-1.5 px-2 sm:px-4 py-3 rounded-lg
              font-medium transition-all duration-200 text-sm sm:text-base
              ${activeTab === 'notes'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }
            `}
          >
            <FileText className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Notas</span>
            <span className="sm:hidden">Notes</span>
          </button>
        </div>
      </div>

      {/* Contenido de los tabs */}
      <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
        {/* Tab: Entrenamientos */}
        {activeTab === 'workouts' && (
          <div className="space-y-6">
            {/* Timer Widget - Sticky en la parte superior */}
            <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm rounded-xl p-4 border border-slate-700 shadow-lg">
              <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Cronómetro de Entrenamiento
              </h3>
              <TimerWidget />
            </div>

            {/* Lista de entrenamientos */}
            <div className="space-y-4">
              {workouts.length > 0 ? (
                workouts.map((workout) => (
                  <WorkoutDetail
                    key={workout.id}
                    workout={workout}
                  />
                ))
              ) : (
                <EmptyWorkoutState />
              )}
            </div>
          </div>
        )}

        {/* Tab: Nutrición */}
        {activeTab === 'nutrition' && (
          <div className="space-y-4">
            {meals.length > 0 ? (
              meals.map((meal, index) => (
                <MealCard key={meal.id} meal={meal} index={index} />
              ))
            ) : (
              <div className="text-center py-12">
                <Utensils className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-400 mb-2">
                  No hay comidas planificadas
                </h3>
                <p className="text-sm text-slate-500">
                  Agrega comidas a tu plan nutricional
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab: Notas */}
        {activeTab === 'notes' && (
          <div>
            <textarea
              className="w-full h-64 bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Escribe tus notas del día aquí..."
            />
            <button className="mt-4 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors">
              Guardar notas
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente MealCard con detalle expandible
function MealCard({ meal, index }: { meal: any; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock data para demostración - en producción vendría de la API
  const recipeData = {
    prepTime: '15 min',
    difficulty: 'Fácil',
    servings: 1,
    ingredients: [
      { name: 'Pechuga de pollo', amount: '150g' },
      { name: 'Arroz integral', amount: '80g (crudo)' },
      { name: 'Brócoli', amount: '100g' },
      { name: 'Aceite de oliva', amount: '1 cucharada' },
      { name: 'Sal y pimienta', amount: 'Al gusto' },
    ],
    instructions: [
      'Cocina el arroz integral siguiendo las instrucciones del paquete',
      'Sazona la pechuga de pollo con sal y pimienta',
      'Calienta el aceite de oliva en una sartén a fuego medio',
      'Cocina la pechuga de pollo 6-7 minutos por cada lado hasta que esté dorada',
      'Mientras tanto, cocina el brócoli al vapor durante 5-6 minutos',
      'Sirve el pollo cortado en rodajas sobre el arroz, acompañado del brócoli',
    ],
    tags: ['Alto en proteína', 'Bajo en grasa', 'Post-workout'],
  };

  const getMealTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      breakfast: 'Desayuno',
      lunch: 'Almuerzo',
      dinner: 'Cena',
      snack: 'Snack',
      pre_workout: 'Pre-Entrenamiento',
      post_workout: 'Post-Entrenamiento',
    };
    return types[type] || type;
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden transition-all duration-300">
      {/* Header - Siempre visible */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full">
                {getMealTypeLabel(meal.mealType)}
              </span>
              {recipeData.tags.slice(0, 2).map((tag, i) => (
                <span key={i} className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="text-lg font-semibold text-white">
              {meal.title || `Comida ${index + 1}`}
            </h3>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors ml-4"
          >
            <ChevronDown
              className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {/* Macros Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-900/50 rounded-lg p-3 text-center">
            <p className="text-xl sm:text-2xl font-bold text-emerald-400">
              {meal.totalCalories}
            </p>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-1">Calorías</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 text-center">
            <p className="text-xl sm:text-2xl font-bold text-blue-400">
              {meal.totalProteinG}g
            </p>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-1">Proteína</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 text-center">
            <p className="text-xl sm:text-2xl font-bold text-amber-400">
              {meal.totalCarbsG}g
            </p>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-1">Carbos</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 text-center">
            <p className="text-xl sm:text-2xl font-bold text-purple-400">
              {meal.totalFatG}g
            </p>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-1">Grasas</p>
          </div>
        </div>
      </div>

      {/* Detalle Expandible */}
      {isExpanded && (
        <div className="border-t border-slate-700 bg-slate-900/30 p-6 space-y-6 animate-in slide-in-from-top-2 duration-300">
          {/* Info de la receta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{recipeData.prepTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <ChefHat className="w-4 h-4" />
              <span>{recipeData.difficulty}</span>
            </div>
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              <span>{recipeData.servings} porción</span>
            </div>
          </div>

          {/* Ingredientes */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
              Ingredientes
            </h4>
            <ul className="space-y-2">
              {recipeData.ingredients.map((ingredient, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 flex-shrink-0"></span>
                  <span className="text-slate-300">
                    <strong className="text-white">{ingredient.amount}</strong> {ingredient.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instrucciones */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-amber-500 rounded-full"></span>
              Instrucciones
            </h4>
            <ol className="space-y-3">
              {recipeData.instructions.map((instruction, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="flex-shrink-0 w-6 h-6 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="text-slate-300 leading-relaxed">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            <button className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors text-sm">
              Marcar como completado
            </button>
            <button className="px-4 py-2 border border-slate-600 hover:border-slate-500 text-slate-300 rounded-lg font-medium transition-colors text-sm">
              Editar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
