'use client';

import { useState, useEffect } from 'react';
import { Recipe } from '@/lib/recipeTypes';
import { parseISODuration } from '@/lib/recipeFormatters';
import { X, Clock, Users, Flame, TrendingUp, ChevronDown, ChevronUp, Plus, Minus } from 'lucide-react';

interface RecipeDetailModalProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
  onAddToMeal: (recipe: Recipe, portions: number) => void;
}

export const RecipeDetailModal = ({
  recipe,
  isOpen,
  onClose,
  onAddToMeal,
}: RecipeDetailModalProps) => {
  const [portions, setPortions] = useState(1);
  const [showIngredients, setShowIngredients] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showNutrition, setShowNutrition] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Reset portions cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setPortions(1);
    }
  }, [isOpen]);

  // Lock scroll cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // ESC para cerrar
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalTime = parseISODuration(recipe.totalTime);
  const servings = recipe.recipeYield || '1 porción';

  // Macros ajustados por porciones
  const calories = recipe.nutrition ? Math.round(recipe.nutrition.calories * portions) : 0;
  const protein = recipe.nutrition ? Math.round(recipe.nutrition.protein_g * portions) : 0;
  const carbs = recipe.nutrition ? Math.round(recipe.nutrition.carbs_g * portions) : 0;
  const fat = recipe.nutrition ? Math.round(recipe.nutrition.fat_g * portions) : 0;
  const fiber = recipe.nutrition ? Math.round(recipe.nutrition.fiber_g * portions) : 0;

  // Nutrition score
  const nutritionScore = recipe.nutrition_score
    ? Math.round(
        (recipe.nutrition_score.general +
          recipe.nutrition_score.cut +
          recipe.nutrition_score.bulk +
          recipe.nutrition_score.endurance) /
          4
      )
    : null;

  const handleAdd = async () => {
    setIsAdding(true);
    try {
      await onAddToMeal(recipe, portions);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header con imagen */}
          <div className="relative h-64 rounded-t-2xl overflow-hidden flex-shrink-0">
            {recipe.image ? (
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                <Flame className="w-24 h-24 text-slate-700" />
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

            {/* Botón cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg bg-black/60 backdrop-blur-sm hover:bg-black/80 transition-colors text-white"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Info sobre la imagen */}
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-2xl font-bold text-white mb-2">{recipe.name}</h2>
              <div className="flex flex-wrap items-center gap-3">
                {/* Categoría */}
                <span className="px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs font-medium text-white border border-white/10">
                  {recipe.recipeCategory}
                </span>

                {/* Tiempo */}
                <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-white/10">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-white">{totalTime}</span>
                </div>

                {/* Porciones */}
                <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-white/10">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-white">{servings}</span>
                </div>

                {/* Nutrition Score */}
                {nutritionScore && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-white/10">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-bold text-emerald-400">{nutritionScore}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Body scrollable */}
          <div className="overflow-y-auto flex-1 p-6">
            {/* Descripción */}
            {recipe.description && (
              <p className="text-slate-300 mb-6 leading-relaxed">{recipe.description}</p>
            )}

            {/* Selector de porciones y Macros */}
            <div className="mb-6 p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-400">Número de porciones</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPortions(Math.max(1, portions - 1))}
                    disabled={portions <= 1}
                    className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:hover:bg-slate-700 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-white" />
                  </button>
                  <span className="text-2xl font-bold text-white w-12 text-center">{portions}</span>
                  <button
                    onClick={() => setPortions(portions + 1)}
                    className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Macros grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {/* Calorías */}
                <div className="text-center p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                  <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-white">{calories}</div>
                  <div className="text-xs text-slate-400">kcal</div>
                </div>

                {/* Proteína */}
                <div className="text-center p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                  <div className="text-lg font-bold text-red-400">{protein}g</div>
                  <div className="text-xs text-slate-400">Proteína</div>
                </div>

                {/* Carbos */}
                <div className="text-center p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                  <div className="text-lg font-bold text-blue-400">{carbs}g</div>
                  <div className="text-xs text-slate-400">Carbos</div>
                </div>

                {/* Grasas */}
                <div className="text-center p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                  <div className="text-lg font-bold text-yellow-400">{fat}g</div>
                  <div className="text-xs text-slate-400">Grasas</div>
                </div>

                {/* Fibra */}
                {fiber > 0 && (
                  <div className="text-center p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                    <div className="text-lg font-bold text-green-400">{fiber}g</div>
                    <div className="text-xs text-slate-400">Fibra</div>
                  </div>
                )}
              </div>
            </div>

            {/* Alertas nutricionales */}
            {recipe.nutrition_alerts && recipe.nutrition_alerts.length > 0 && (
              <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <h4 className="text-sm font-bold text-yellow-400 mb-2">Alertas Nutricionales</h4>
                <ul className="space-y-1">
                  {recipe.nutrition_alerts.map((alert, index) => (
                    <li key={index} className="text-sm text-yellow-300 flex items-start gap-2">
                      <span className="text-yellow-500">•</span>
                      {alert}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ingredientes */}
            <div className="mb-6">
              <button
                onClick={() => setShowIngredients(!showIngredients)}
                className="w-full flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <h3 className="text-lg font-bold text-white">Ingredientes</h3>
                {showIngredients ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>
              {showIngredients && recipe.recipeIngredient && recipe.recipeIngredient.length > 0 && (
                <div className="mt-3 space-y-2">
                  {recipe.recipeIngredient.map((ingredient, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                      <span className="text-slate-300">{ingredient}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Instrucciones */}
            <div className="mb-6">
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="w-full flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <h3 className="text-lg font-bold text-white">Instrucciones</h3>
                {showInstructions ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>
              {showInstructions && recipe.recipeInstructions && recipe.recipeInstructions.length > 0 && (
                <div className="mt-3 space-y-3">
                  {recipe.recipeInstructions.map((instruction, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                        <span className="text-sm font-bold text-emerald-400">{index + 1}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{instruction}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Información nutricional detallada */}
            {recipe.nutrition && (
              <div className="mb-6">
                <button
                  onClick={() => setShowNutrition(!showNutrition)}
                  className="w-full flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <h3 className="text-lg font-bold text-white">Información Nutricional</h3>
                  {showNutrition ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                {showNutrition && (
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-900/50 rounded-lg">
                      <div className="text-sm text-slate-400 mb-1">Azúcar</div>
                      <div className="text-lg font-bold text-white">{recipe.nutrition.sugar_g}g</div>
                    </div>
                    <div className="p-3 bg-slate-900/50 rounded-lg">
                      <div className="text-sm text-slate-400 mb-1">Sodio</div>
                      <div className="text-lg font-bold text-white">{recipe.nutrition.sodium_mg}mg</div>
                    </div>
                    <div className="p-3 bg-slate-900/50 rounded-lg">
                      <div className="text-sm text-slate-400 mb-1">Grasa saturada</div>
                      <div className="text-lg font-bold text-white">{recipe.nutrition.sat_fat_g}g</div>
                    </div>
                    <div className="p-3 bg-slate-900/50 rounded-lg">
                      <div className="text-sm text-slate-400 mb-1">Colesterol</div>
                      <div className="text-lg font-bold text-white">{recipe.nutrition.cholesterol_mg}mg</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer sticky con botón agregar */}
          <div className="sticky bottom-0 p-6 bg-slate-900/95 backdrop-blur-sm border-t border-slate-800 rounded-b-2xl">
            <button
              onClick={handleAdd}
              disabled={isAdding}
              className="w-full px-6 py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 disabled:shadow-none"
            >
              {isAdding ? 'Agregando...' : `Agregar ${portions} ${portions === 1 ? 'porción' : 'porciones'} al plan`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
