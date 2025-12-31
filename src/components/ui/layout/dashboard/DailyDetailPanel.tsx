'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, Dumbbell, Utensils, FileText } from 'lucide-react';
import { DayEvent } from '@/types/calendar';
import { formatDateLong, getDayName } from '@/lib/utils/calendar';
import WorkoutDetail, { EmptyWorkoutState } from '@/components/dashboard/WorkoutDetail';

interface DailyDetailPanelProps {
  date: Date;
  events: DayEvent[];
  isOpen: boolean;
  onClose: () => void;
  onPreviousDay: () => void;
  onNextDay: () => void;
}

type TabType = 'workouts' | 'nutrition' | 'notes';

export default function DailyDetailPanel({
  date,
  events,
  isOpen,
  onClose,
  onPreviousDay,
  onNextDay,
}: DailyDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('workouts');

  // Reset to workouts tab when opening
  useEffect(() => {
    if (isOpen) {
      setActiveTab('workouts');
    }
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const workouts = events.filter(e => e.type === 'workout');
  const meals = events.filter(e => e.type === 'meal');

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-full md:w-[600px] lg:w-[700px] bg-slate-950 border-l border-slate-800 z-50 flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={onPreviousDay}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                aria-label="Día anterior"
              >
                <ChevronLeft className="w-5 h-5 text-slate-400" />
              </button>
              
              <div className="text-center px-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium text-slate-400 uppercase tracking-wide">
                    {getDayName(date)}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">
                  {formatDateLong(date)}
                </h2>
              </div>

              <button
                onClick={onNextDay}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                aria-label="Día siguiente"
              >
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-t border-slate-800">
            <TabButton
              icon={<Dumbbell className="w-4 h-4" />}
              label="Entrenamientos"
              count={workouts.length}
              active={activeTab === 'workouts'}
              onClick={() => setActiveTab('workouts')}
            />
            <TabButton
              icon={<Utensils className="w-4 h-4" />}
              label="Nutrición"
              count={meals.length}
              active={activeTab === 'nutrition'}
              onClick={() => setActiveTab('nutrition')}
            />
            <TabButton
              icon={<FileText className="w-4 h-4" />}
              label="Notas"
              active={activeTab === 'notes'}
              onClick={() => setActiveTab('notes')}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'workouts' && (
            <WorkoutsTab workouts={workouts} date={date} />
          )}
          {activeTab === 'nutrition' && (
            <NutritionTab meals={meals} date={date} />
          )}
          {activeTab === 'notes' && (
            <NotesTab date={date} />
          )}
        </div>
      </div>
    </>
  );
}

// ============================================
// TAB BUTTON COMPONENT
// ============================================
interface TabButtonProps {
  icon: React.ReactNode;
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}

function TabButton({ icon, label, count, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 flex items-center justify-center gap-2 px-4 py-3
        border-b-2 transition-all
        ${active 
          ? 'border-emerald-500 text-emerald-400' 
          : 'border-transparent text-slate-500 hover:text-slate-300'
        }
      `}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
      {count !== undefined && (
        <span className={`
          text-xs font-bold px-1.5 py-0.5 rounded-full
          ${active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}
        `}>
          {count}
        </span>
      )}
    </button>
  );
}

// ============================================
// WORKOUTS TAB
// ============================================
function WorkoutsTab({ workouts, date }: { workouts: DayEvent[]; date: Date }) {
  const [isAdding, setIsAdding] = useState(false);

  // Handlers
  const handleUpdate = async (workoutId: string, updates: any) => {
    try {
      const response = await fetch(`/api/dashboard/workout/${workoutId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Error updating workout');

      // TODO: Refetch events
      console.log('✅ Workout updated');
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const handleComplete = async (workoutId: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/dashboard/workout/${workoutId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) throw new Error('Error toggling completion');

      // TODO: Refetch events
      console.log('✅ Workout completion toggled');
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const handleDelete = async (workoutId: string) => {
    try {
      const response = await fetch(`/api/dashboard/workout/${workoutId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error deleting workout');

      // TODO: Refetch events
      console.log('🗑️ Workout deleted');
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const handleAddWorkout = () => {
    setIsAdding(true);
    // TODO: Show add workout modal
    console.log('Adding workout for:', date);
  };

  if (workouts.length === 0) {
    return (
      <EmptyWorkoutState onAddWorkout={handleAddWorkout} />
    );
  }

  return (
    <div className="p-6 space-y-4">
      {workouts.map((workout) => {
        // Convertir DayEvent a WorkoutData
        const workoutData = {
          id: workout.id,
          date: workout.date,
          workoutType: workout.type === 'workout' ? workout.workoutType : 'rest',
          title: workout.type === 'workout' ? workout.title : 'Descanso',
          description: workout.type === 'workout' ? workout.description : undefined,
          durationMinutes: workout.type === 'workout' ? workout.durationMinutes : 0,
          estimatedCalories: workout.type === 'workout' ? workout.estimatedCalories : 0,
          completed: workout.type === 'workout' ? workout.completed : false,
          completedAt: workout.type === 'workout' ? workout.completedAt : null,
        };

        return (
          <WorkoutDetail
            key={workout.id}
            workout={workoutData}
            onUpdate={handleUpdate}
            onComplete={handleComplete}
            onDelete={handleDelete}
          />
        );
      })}
    </div>
  );
}

// ============================================
// NUTRITION TAB
// ============================================
function NutritionTab({ meals, date }: { meals: DayEvent[]; date: Date }) {
  if (meals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
          <Utensils className="w-8 h-8 text-slate-600" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Sin comidas programadas
        </h3>
        <p className="text-slate-400 mb-6">
          No hay comidas registradas para este día
        </p>
        <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors">
          Añadir Comida
        </button>
      </div>
    );
  }

  const totalCalories = meals.reduce((sum, meal) => 
    meal.type === 'meal' ? sum + meal.totalCalories : sum, 0
  );
  const totalProtein = meals.reduce((sum, meal) => 
    meal.type === 'meal' ? sum + meal.totalProteinG : sum, 0
  );
  const totalCarbs = meals.reduce((sum, meal) => 
    meal.type === 'meal' ? sum + meal.totalCarbsG : sum, 0
  );
  const totalFat = meals.reduce((sum, meal) => 
    meal.type === 'meal' ? sum + meal.totalFatG : sum, 0
  );

  return (
    <div className="p-6 space-y-4">
      {/* Daily summary */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
        <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wide">
          Resumen del Día
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">
              {totalCalories.toFixed(0)}
            </div>
            <div className="text-xs text-slate-500">kcal</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {totalProtein.toFixed(0)}g
            </div>
            <div className="text-xs text-slate-500">Proteína</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {totalCarbs.toFixed(0)}g
            </div>
            <div className="text-xs text-slate-500">Carbos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">
              {totalFat.toFixed(0)}g
            </div>
            <div className="text-xs text-slate-500">Grasas</div>
          </div>
        </div>
      </div>

      {/* Meals list */}
      {meals.map((meal) => (
        <div
          key={meal.id}
          className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                {meal.type === 'meal' ? meal.mealType : 'Comida'}
              </span>
              <div className="text-lg font-bold text-white mt-1">
                {meal.type === 'meal' ? meal.totalCalories : 0} kcal
              </div>
            </div>
          </div>

          {meal.type === 'meal' && (
            <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
              <span>P: {meal.totalProteinG.toFixed(0)}g</span>
              <span>C: {meal.totalCarbsG.toFixed(0)}g</span>
              <span>G: {meal.totalFatG.toFixed(0)}g</span>
            </div>
          )}

          <button className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors text-sm">
            Ver Receta Completa
          </button>
        </div>
      ))}
    </div>
  );
}

// ============================================
// NOTES TAB
// ============================================
function NotesTab({ date }: { date: Date }) {
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // TODO: Load notes from API
  // TODO: Auto-save on change

  return (
    <div className="p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">
          Notas del día
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="¿Cómo te sentiste hoy? ¿Algo que destacar?"
          className="w-full h-48 px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none resize-none"
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-slate-500">
            {isSaving ? 'Guardando...' : 'Guardado automáticamente'}
          </span>
          <span className="text-xs text-slate-600">
            {notes.length} caracteres
          </span>
        </div>
      </div>

      {/* Quick suggestions */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">
          Etiquetas rápidas
        </label>
        <div className="flex flex-wrap gap-2">
          {['💪 Buen entrenamiento', '😴 Cansado', '🔥 Motivado', '⚡ Energético', '🤕 Molestias'].map((tag) => (
            <button
              key={tag}
              onClick={() => setNotes(notes + (notes ? '\n' : '') + tag)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}