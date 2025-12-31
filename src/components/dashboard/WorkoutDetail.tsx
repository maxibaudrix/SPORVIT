'use client';

import React, { useState } from 'react';
import { 
  Dumbbell, 
  Clock, 
  Flame, 
  CheckCircle2, 
  Circle,
  Pencil,
  Trash2,
  Plus,
  X,
  Save
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number | string; // puede ser "10-12" o "AMRAP"
  weight?: number;
  restSeconds?: number;
  notes?: string;
}

export interface WorkoutData {
  id: string;
  date: Date;
  workoutType: string;
  title: string;
  description?: string;
  durationMinutes: number;
  estimatedCalories: number;
  completed: boolean;
  completedAt?: Date | null;
  actualDurationMin?: number | null;
  actualCalories?: number | null;
  exercises?: Exercise[]; // Futuro: migrar a JSON field
}

interface WorkoutDetailProps {
  workout: WorkoutData;
  onUpdate?: (workoutId: string, updates: Partial<WorkoutData>) => Promise<void>;
  onComplete?: (workoutId: string, completed: boolean) => Promise<void>;
  onDelete?: (workoutId: string) => Promise<void>;
  readOnly?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export default function WorkoutDetail({
  workout,
  onUpdate,
  onComplete,
  onDelete,
  readOnly = false
}: WorkoutDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(workout.title);
  const [editedDuration, setEditedDuration] = useState(workout.durationMinutes);
  const [editedDescription, setEditedDescription] = useState(workout.description || '');
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Parse exercises from description (temporal hasta migración)
  const exercises: Exercise[] = workout.exercises || [];

  // ============================================
  // HANDLERS
  // ============================================

  const handleSaveEdit = async () => {
    if (!onUpdate) return;

    try {
      await onUpdate(workout.id, {
        title: editedTitle,
        durationMinutes: editedDuration,
        description: editedDescription,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating workout:', error);
      alert('Error al guardar cambios');
    }
  };

  const handleCancelEdit = () => {
    setEditedTitle(workout.title);
    setEditedDuration(workout.durationMinutes);
    setEditedDescription(workout.description || '');
    setIsEditing(false);
  };

  const handleToggleComplete = async () => {
    if (!onComplete) return;

    setIsCompleting(true);
    try {
      await onComplete(workout.id, !workout.completed);
    } catch (error) {
      console.error('Error toggling completion:', error);
      alert('Error al marcar workout');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    const confirmed = confirm('¿Seguro que quieres eliminar este entrenamiento?');
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await onDelete(workout.id);
    } catch (error) {
      console.error('Error deleting workout:', error);
      alert('Error al eliminar workout');
    } finally {
      setIsDeleting(false);
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className={`
      bg-slate-900/50 border rounded-xl p-4 space-y-4
      ${workout.completed ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-slate-800'}
    `}>
      
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          {/* Icon */}
          <div className={`
            w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
            ${workout.completed 
              ? 'bg-emerald-500/20 text-emerald-400' 
              : 'bg-slate-800 text-slate-400'
            }
          `}>
            <Dumbbell className="w-5 h-5" />
          </div>

          {/* Title & Type */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
                placeholder="Título del workout"
              />
            ) : (
              <h3 className="font-bold text-white truncate">{workout.title}</h3>
            )}
            
            <p className="text-xs text-slate-400 mt-0.5 capitalize">
              {workout.workoutType.replace('_', ' ')}
            </p>
          </div>
        </div>

        {/* Actions */}
        {!readOnly && (
          <div className="flex items-center gap-1 flex-shrink-0">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveEdit}
                  className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors"
                  title="Guardar"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-1.5 text-slate-400 hover:bg-slate-800 rounded transition-colors"
                  title="Cancelar"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                  title="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded transition-colors disabled:opacity-50"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* STATS */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Clock className="w-4 h-4" />
          {isEditing ? (
            <input
              type="number"
              value={editedDuration}
              onChange={(e) => setEditedDuration(parseInt(e.target.value) || 0)}
              className="w-16 bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-white text-xs focus:border-emerald-500 focus:outline-none"
              min="1"
            />
          ) : (
            <span>{workout.durationMinutes} min</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <Flame className="w-4 h-4" />
          <span>{workout.estimatedCalories} kcal</span>
        </div>

        {workout.completed && workout.completedAt && (
          <div className="text-xs text-emerald-400">
            ✓ Completado {new Date(workout.completedAt).toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        )}
      </div>

      {/* DESCRIPTION */}
      {(workout.description || isEditing) && (
        <div className="pt-3 border-t border-slate-800">
          {isEditing ? (
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none min-h-[80px]"
              placeholder="Descripción del workout..."
            />
          ) : (
            <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">
              {workout.description}
            </p>
          )}
        </div>
      )}

      {/* EXERCISES LIST (futuro) */}
      {exercises.length > 0 && (
        <div className="pt-3 border-t border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Ejercicios ({exercises.length})
          </h4>
          <div className="space-y-2">
            {exercises.map((exercise, index) => (
              <div 
                key={exercise.id}
                className="bg-slate-950/50 rounded-lg p-3 border border-slate-800"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-medium text-white text-sm">
                      {index + 1}. {exercise.name}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {exercise.sets} series × {exercise.reps} reps
                      {exercise.weight && ` · ${exercise.weight}kg`}
                      {exercise.restSeconds && ` · ${exercise.restSeconds}s descanso`}
                    </div>
                    {exercise.notes && (
                      <p className="text-xs text-slate-500 mt-1 italic">{exercise.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COMPLETE BUTTON */}
      {!readOnly && (
        <div className="pt-3 border-t border-slate-800">
          <button
            onClick={handleToggleComplete}
            disabled={isCompleting}
            className={`
              w-full py-2.5 rounded-lg font-medium text-sm transition-all
              flex items-center justify-center gap-2
              ${workout.completed
                ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {isCompleting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : workout.completed ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Marcar como pendiente
              </>
            ) : (
              <>
                <Circle className="w-4 h-4" />
                Marcar como completado
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================
// EMPTY STATE
// ============================================

export function EmptyWorkoutState({ onAddWorkout }: { onAddWorkout?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
        <Dumbbell className="w-8 h-8 text-slate-600" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">
        Sin entrenamientos programados
      </h3>
      <p className="text-sm text-slate-400 mb-6 max-w-sm">
        No hay entrenamientos para este día. Añade uno para comenzar.
      </p>
      {onAddWorkout && (
        <button
          onClick={onAddWorkout}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Añadir entrenamiento
        </button>
      )}
    </div>
  );
}