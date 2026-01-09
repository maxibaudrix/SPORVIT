'use client';

import { WorkoutEvent } from '@/types/calendar';
import { Dumbbell, Clock, Flame, Calendar, CheckCircle2, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface WorkoutDetailsProps {
  event: WorkoutEvent;
  mode: 'view' | 'edit';
  onEdit: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
}

export function WorkoutDetails({ event, mode, onEdit, onDelete, onToggleComplete }: WorkoutDetailsProps) {
  const formattedDate = format(event.date, "EEEE d 'de' MMMM", { locale: es });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <Dumbbell className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {event.title}
            </h2>
            <p className="text-sm text-slate-400 capitalize">
              {formattedDate}
            </p>
          </div>
        </div>

        {mode === 'view' && (
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
              title="Editar"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 rounded-lg hover:bg-red-900/20 transition-colors text-slate-400 hover:text-red-400"
              title="Eliminar"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Status Badge */}
      {event.completed && (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium text-emerald-400">
            Completado el {event.completedAt && format(new Date(event.completedAt), "d 'de' MMMM", { locale: es })}
          </span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-slate-400">Duración</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {event.durationMinutes} <span className="text-sm text-slate-400">min</span>
          </div>
          {event.actualDurationMin && (
            <div className="text-xs text-slate-500 mt-1">
              Real: {event.actualDurationMin} min
            </div>
          )}
        </div>

        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="text-sm text-slate-400">Calorías</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {event.estimatedCalories} <span className="text-sm text-slate-400">kcal</span>
          </div>
          {event.actualCalories && (
            <div className="text-xs text-slate-500 mt-1">
              Real: {event.actualCalories} kcal
            </div>
          )}
        </div>

        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-slate-400">Tipo</span>
          </div>
          <div className="text-lg font-bold text-white capitalize">
            {translateWorkoutType(event.workoutType)}
          </div>
        </div>
      </div>

      {/* Description */}
      {event.description && (
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-3">
            Descripción
          </h3>
          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
            {event.description}
          </p>
        </div>
      )}

      {/* Series and Reps (if available in description) */}
      {event.description && parseExercises(event.description).length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-3">
            Ejercicios
          </h3>
          <div className="space-y-2">
            {parseExercises(event.description).map((exercise, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50">
                <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-red-400">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">{exercise.name}</div>
                  <div className="text-sm text-slate-400 mt-1">{exercise.details}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Button */}
      {!event.completed && mode === 'view' && (
        <button
          onClick={onToggleComplete}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5" />
          Marcar como completado
        </button>
      )}

      {event.completed && mode === 'view' && (
        <button
          onClick={onToggleComplete}
          className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
        >
          Marcar como no completado
        </button>
      )}
    </div>
  );
}

// Helper functions
function translateWorkoutType(type: string): string {
  const translations: Record<string, string> = {
    'strength': 'Fuerza',
    'cardio': 'Cardio',
    'running': 'Running',
    'cycling': 'Ciclismo',
    'swimming': 'Natación',
    'hiit': 'HIIT',
    'yoga': 'Yoga',
    'stretching': 'Estiramientos',
    'rest': 'Descanso',
    'active_recovery': 'Recuperación activa',
  };
  return translations[type] || type;
}

// Parse exercises from description (simple parser)
function parseExercises(description: string): Array<{ name: string; details: string }> {
  const exercises: Array<{ name: string; details: string }> = [];

  // Try to parse common formats:
  // "- Exercise name: 3x10"
  // "1. Exercise name (3 series x 10 reps)"
  const lines = description.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Format: "- Exercise: details" or "1. Exercise: details"
    const match = trimmed.match(/^[\-\d.]+\s*([^:]+):(.+)$/);
    if (match) {
      exercises.push({
        name: match[1].trim(),
        details: match[2].trim()
      });
    }
  }

  return exercises;
}
