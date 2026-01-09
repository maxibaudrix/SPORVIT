'use client';

import { MealEvent } from '@/types/calendar';
import { Utensils, Clock, Flame, Edit2, Trash2, Coffee, Cookie, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface MealDetailsProps {
  event: MealEvent;
  mode: 'view' | 'edit';
  onEdit: () => void;
  onDelete: () => void;
}

export function MealDetails({ event, mode, onEdit, onDelete }: MealDetailsProps) {
  const formattedDate = format(event.date, "EEEE d 'de' MMMM", { locale: es });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
            {getMealIcon(event.mealType)}
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
              {getMealTypeLabel(event.mealType)}
            </p>
            <h2 className="text-2xl font-bold text-white mb-1">
              {event.title || 'Comida'}
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

      {/* Calories Card */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/30">
        <div className="flex items-center gap-3 mb-3">
          <Flame className="w-6 h-6 text-orange-400" />
          <span className="text-sm text-slate-400">Calorías Totales</span>
        </div>
        <div className="text-4xl font-black text-white">
          {event.totalCalories} <span className="text-xl text-slate-400">kcal</span>
        </div>
      </div>

      {/* Macros Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Proteínas</div>
          <div className="text-2xl font-bold text-blue-400">
            {event.totalProteinG.toFixed(1)}
            <span className="text-sm text-slate-400 ml-1">g</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {Math.round((event.totalProteinG * 4 / event.totalCalories) * 100)}%
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Carbohidratos</div>
          <div className="text-2xl font-bold text-yellow-400">
            {event.totalCarbsG.toFixed(1)}
            <span className="text-sm text-slate-400 ml-1">g</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {Math.round((event.totalCarbsG * 4 / event.totalCalories) * 100)}%
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Grasas</div>
          <div className="text-2xl font-bold text-green-400">
            {event.totalFatG.toFixed(1)}
            <span className="text-sm text-slate-400 ml-1">g</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {Math.round((event.totalFatG * 9 / event.totalCalories) * 100)}%
          </div>
        </div>
      </div>

      {/* Macro Bars Visualization */}
      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
          Distribución de macronutrientes
        </h3>
        <div className="h-4 rounded-full overflow-hidden flex">
          <div
            className="bg-blue-500"
            style={{
              width: `${(event.totalProteinG * 4 / event.totalCalories) * 100}%`
            }}
            title={`Proteínas: ${event.totalProteinG.toFixed(1)}g`}
          />
          <div
            className="bg-yellow-500"
            style={{
              width: `${(event.totalCarbsG * 4 / event.totalCalories) * 100}%`
            }}
            title={`Carbohidratos: ${event.totalCarbsG.toFixed(1)}g`}
          />
          <div
            className="bg-green-500"
            style={{
              width: `${(event.totalFatG * 9 / event.totalCalories) * 100}%`
            }}
            title={`Grasas: ${event.totalFatG.toFixed(1)}g`}
          />
        </div>
      </div>

      {/* Notes/Recipe */}
      {event.notes && (
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-3">
            {event.notes.includes('Ingredientes:') ? 'Receta' : 'Notas'}
          </h3>
          <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
            {parseRecipe(event.notes)}
          </div>
        </div>
      )}

      {/* Time */}
      {event.startTime && (
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Clock className="w-4 h-4" />
          <span>Hora sugerida: {event.startTime}</span>
        </div>
      )}
    </div>
  );
}

// Helper functions
function getMealTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'breakfast': 'Desayuno',
    'lunch': 'Almuerzo',
    'dinner': 'Cena',
    'snack': 'Snack',
    'snack_1': 'Snack',
    'snack_2': 'Snack',
    'pre_workout': 'Pre-entreno',
    'post_workout': 'Post-entreno',
  };
  return labels[type] || type;
}

function getMealIcon(type: string) {
  const iconClass = "w-8 h-8 text-orange-400";

  switch (type) {
    case 'breakfast':
      return <Coffee className={iconClass} />;
    case 'lunch':
    case 'dinner':
      return <Utensils className={iconClass} />;
    case 'snack':
    case 'snack_1':
    case 'snack_2':
      return <Cookie className={iconClass} />;
    case 'pre_workout':
    case 'post_workout':
      return <Zap className={iconClass} />;
    default:
      return <Utensils className={iconClass} />;
  }
}

// Parse recipe with better formatting
function parseRecipe(notes: string) {
  // Split by common sections
  const sections = notes.split(/\n(?=Ingredientes:|Instrucciones:|Preparación:)/gi);

  return (
    <div className="space-y-4">
      {sections.map((section, index) => {
        const lines = section.split('\n').filter(l => l.trim());

        if (lines.length === 0) return null;

        const isIngredients = lines[0].toLowerCase().includes('ingredientes');
        const isInstructions = lines[0].toLowerCase().includes('instrucciones') ||
                                lines[0].toLowerCase().includes('preparación');

        return (
          <div key={index}>
            {(isIngredients || isInstructions) && (
              <h4 className="font-bold text-white mb-2">{lines[0]}</h4>
            )}
            <div className={isIngredients ? 'space-y-1' : 'space-y-2'}>
              {lines.slice(isIngredients || isInstructions ? 1 : 0).map((line, i) => (
                <div key={i} className={isInstructions ? 'pl-4' : ''}>
                  {line}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
