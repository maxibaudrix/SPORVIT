'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Dumbbell, Utensils, FileText, ChevronDown, Clock, ChefHat, BedDouble, Droplet, Footprints, Sparkles } from 'lucide-react';
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
          <div className="space-y-4">
            {workouts.length > 0 ? (
              workouts.map((workout) => (
                <WorkoutDetail
                  key={workout.id}
                  workout={workout}
                />
              ))
            ) : (
              <RestDayCard totalCalories={meals.reduce((sum, meal) => sum + (meal.totalCalories || 0), 0)} />
            )}
          </div>
        )}

        {/* Tab: Nutrición */}
        {activeTab === 'nutrition' && (
          <NutritionTab meals={meals} />
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

// Componente NutritionTab con estado compartido para expansión
function NutritionTab({ meals }: { meals: any[] }) {
  const [expandedMealId, setExpandedMealId] = useState<string | null>(null);

  const toggleMeal = (mealId: string) => {
    setExpandedMealId(expandedMealId === mealId ? null : mealId);
  };

  if (meals.length === 0) {
    return (
      <div className="text-center py-12">
        <Utensils className="w-16 h-16 text-slate-700 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-400 mb-2">
          No hay comidas planificadas
        </h3>
        <p className="text-sm text-slate-500">
          Agrega comidas a tu plan nutricional
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {meals.map((meal, index) => (
        <MealCard
          key={meal.id}
          meal={meal}
          index={index}
          isExpanded={expandedMealId === meal.id}
          onToggle={() => toggleMeal(meal.id)}
        />
      ))}
    </div>
  );
}

// Componente MealCard con detalle expandible
function MealCard({
  meal,
  index,
  isExpanded,
  onToggle
}: {
  meal: any;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const [isCompleted, setIsCompleted] = useState(false);

  // TODO: En producción, estos datos vendrían de meal.recipe o de la API
  // Por ahora mostramos estructura sin datos ficticios extensos
  const hasRecipe = false; // meal.recipe !== undefined

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

  const handleCheckboxToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCompleted(!isCompleted);
  };

  return (
    <div
      className={`
        w-full bg-slate-800/50 border-2 rounded-xl overflow-hidden
        transition-all duration-300
        ${isExpanded
          ? 'border-amber-500 shadow-xl shadow-amber-500/10'
          : 'border-slate-700 hover:border-slate-600'
        }
      `}
    >
      {/* Header - Clickable para expandir */}
      <button
        onClick={onToggle}
        className="w-full p-4 sm:p-5 text-left"
        aria-expanded={isExpanded}
        aria-label={`Expandir detalles de ${meal.title || getMealTypeLabel(meal.mealType)}`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-medium px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full flex-shrink-0">
                {getMealTypeLabel(meal.mealType)}
              </span>
              {/* Badge indicando que es expandible */}
              {!isExpanded && (
                <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded flex items-center gap-1 animate-pulse">
                  <ChevronDown className="w-3 h-3" />
                  Ver receta
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-white line-clamp-1">
              {meal.title || `Comida ${index + 1}`}
            </h3>
          </div>

          <div className="flex items-center gap-2 ml-2">
            {/* Checkbox de completado */}
            <button
              onClick={handleCheckboxToggle}
              className={`
                w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0
                ${isCompleted
                  ? 'bg-emerald-500 border-emerald-500'
                  : 'bg-transparent border-slate-600 hover:border-slate-500'
                }
              `}
              aria-label={`Marcar ${meal.title || getMealTypeLabel(meal.mealType)} como completado`}
            >
              {isCompleted && (
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            {/* Chevron de expansión */}
            <div
              className={`
                p-2 rounded-lg transition-all duration-300 flex-shrink-0
                ${isExpanded ? 'bg-amber-500/20' : 'bg-slate-700/50'}
              `}
            >
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-300 ${
                  isExpanded ? 'rotate-180 text-amber-400' : 'text-slate-400'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Macros Grid - Altura fija */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 min-h-[64px] sm:min-h-[72px]">
          <div className="bg-slate-900/50 rounded-lg p-2 sm:p-3 text-center flex flex-col justify-center">
            <p className="text-lg sm:text-xl font-bold text-emerald-400">
              {meal.totalCalories}
            </p>
            <p className="text-[9px] sm:text-xs text-slate-400 mt-0.5">Calorías</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-2 sm:p-3 text-center flex flex-col justify-center">
            <p className="text-lg sm:text-xl font-bold text-blue-400">
              {meal.totalProteinG}g
            </p>
            <p className="text-[9px] sm:text-xs text-slate-400 mt-0.5">Proteína</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-2 sm:p-3 text-center flex flex-col justify-center">
            <p className="text-lg sm:text-xl font-bold text-amber-400">
              {meal.totalCarbsG}g
            </p>
            <p className="text-[9px] sm:text-xs text-slate-400 mt-0.5">Carbos</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-2 sm:p-3 text-center flex flex-col justify-center">
            <p className="text-lg sm:text-xl font-bold text-purple-400">
              {meal.totalFatG}g
            </p>
            <p className="text-[9px] sm:text-xs text-slate-400 mt-0.5">Grasas</p>
          </div>
        </div>
      </button>

      {/* Detalle Expandible - Se expande hacia abajo */}
      {isExpanded && (
        <div className="border-t border-slate-700 bg-slate-900/30 p-4 sm:p-6 space-y-4">
          {hasRecipe ? (
            <>
              {/* TODO: Mostrar ingredientes e instrucciones de meal.recipe */}
              <div className="text-center py-8">
                <ChefHat className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400">
                  Receta disponible próximamente
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <ChefHat className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-400 mb-2">
                No hay receta disponible para esta comida
              </p>
              <p className="text-xs text-slate-500">
                Los datos de ingredientes e instrucciones se mostrarán aquí cuando estén disponibles
              </p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
            <button className="flex-1 min-h-[44px] px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors text-sm">
              Marcar completado
            </button>
            <button className="min-h-[44px] px-4 py-2.5 border border-slate-600 hover:border-slate-500 text-slate-300 rounded-lg font-medium transition-colors text-sm">
              Editar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente RestDayCard para días de descanso
function RestDayCard({ totalCalories }: { totalCalories: number }) {
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-2 border-slate-700 rounded-xl p-6 sm:p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-slate-700/50 rounded-full flex items-center justify-center">
          <BedDouble className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          🛌 DÍA DE DESCANSO
        </h3>
        <p className="text-slate-400">
          Hoy tu cuerpo se recupera
        </p>
      </div>

      {/* Recomendaciones */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
            <BedDouble className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-sm text-slate-300">
            Prioriza el sueño (8h)
          </p>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            <Droplet className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-sm text-slate-300">
            Hidrátate bien
          </p>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
            <Footprints className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-sm text-slate-300">
            Caminata ligera opcional
          </p>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-sm text-slate-300">
            Estiramientos suaves
          </p>
        </div>
      </div>

      {/* Calorías del día */}
      <div className="pt-4 border-t border-slate-700">
        <div className="bg-slate-900/50 rounded-lg p-4 text-center">
          <p className="text-sm text-slate-400 mb-1">Calorías hoy</p>
          <p className="text-2xl font-bold text-emerald-400">
            {totalCalories.toLocaleString()} <span className="text-sm text-slate-500">kcal</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">(día de descanso)</p>
        </div>
      </div>
    </div>
  );
}
