'use client';

import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';

interface ManualRecipeFormProps {
  onSubmit: (recipeData: ManualRecipeData) => Promise<void>;
  onCancel: () => void;
  mealType: string;
}

export interface ManualRecipeData {
  name: string;
  servings: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  notes?: string;
}

export const ManualRecipeForm = ({ onSubmit, onCancel, mealType }: ManualRecipeFormProps) => {
  const [formData, setFormData] = useState<ManualRecipeData>({
    name: '',
    servings: 1,
    calories: undefined,
    protein: undefined,
    carbs: undefined,
    fat: undefined,
    notes: '',
  });

  const [showNutrition, setShowNutrition] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validación
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (formData.servings < 1) {
      newErrors.servings = 'Debe haber al menos 1 porción';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = <K extends keyof ManualRecipeData>(
    field: K,
    value: ManualRecipeData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando se actualiza
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const getMealTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      breakfast: 'desayuno',
      lunch: 'almuerzo',
      dinner: 'cena',
      snack: 'snack',
      snack_1: 'snack',
      snack_2: 'snack',
      pre_workout: 'pre-entreno',
      post_workout: 'post-entreno',
    };
    return labels[type] || type;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-white">Agregar Receta Manual</h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <p className="text-sm text-slate-400">
          Para tu {getMealTypeLabel(mealType)}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6 max-w-2xl">
          {/* Nombre de la receta */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
              Nombre de la receta *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Ej: Mi batido post-entreno"
              className={`w-full px-4 py-3 bg-slate-900/50 border ${
                errors.name ? 'border-red-500' : 'border-slate-800'
              } rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Porciones */}
          <div>
            <label htmlFor="servings" className="block text-sm font-medium text-slate-300 mb-2">
              Número de porciones
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updateField('servings', Math.max(1, formData.servings - 1))}
                disabled={formData.servings <= 1}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 transition-colors"
              >
                <Minus className="w-5 h-5 text-white" />
              </button>
              <div className="flex-1 max-w-[120px]">
                <input
                  id="servings"
                  type="number"
                  min="1"
                  value={formData.servings}
                  onChange={(e) => updateField('servings', parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white text-center focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              <button
                type="button"
                onClick={() => updateField('servings', formData.servings + 1)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
              <span className="text-sm text-slate-400">porción(es)</span>
            </div>
            {errors.servings && (
              <p className="mt-1 text-sm text-red-400">{errors.servings}</p>
            )}
          </div>

          {/* Información nutricional (opcional) */}
          <div>
            <button
              type="button"
              onClick={() => setShowNutrition(!showNutrition)}
              className="w-full flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <span className="text-sm font-medium text-slate-300">
                📊 Información nutricional (opcional)
              </span>
              <span className="text-sm text-slate-400">
                {showNutrition ? 'Ocultar ▲' : 'Agregar ▼'}
              </span>
            </button>

            {showNutrition && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {/* Calorías */}
                <div>
                  <label htmlFor="calories" className="block text-sm text-slate-400 mb-2">
                    Calorías (kcal)
                  </label>
                  <input
                    id="calories"
                    type="number"
                    min="0"
                    value={formData.calories || ''}
                    onChange={(e) => updateField('calories', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Proteína */}
                <div>
                  <label htmlFor="protein" className="block text-sm text-slate-400 mb-2">
                    Proteína (g)
                  </label>
                  <input
                    id="protein"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.protein || ''}
                    onChange={(e) => updateField('protein', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Carbohidratos */}
                <div>
                  <label htmlFor="carbs" className="block text-sm text-slate-400 mb-2">
                    Carbohidratos (g)
                  </label>
                  <input
                    id="carbs"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.carbs || ''}
                    onChange={(e) => updateField('carbs', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Grasas */}
                <div>
                  <label htmlFor="fat" className="block text-sm text-slate-400 mb-2">
                    Grasas (g)
                  </label>
                  <input
                    id="fat"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.fat || ''}
                    onChange={(e) => updateField('fat', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Notas */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-slate-300 mb-2">
              Notas (opcional)
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Ingredientes, preparación, recordatorios..."
              rows={4}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
            />
          </div>
        </div>
      </form>

      {/* Footer */}
      <div className="flex-shrink-0 p-6 bg-slate-900/95 backdrop-blur-sm border-t border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 disabled:shadow-none"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar receta'}
          </button>
        </div>
      </div>
    </div>
  );
};
