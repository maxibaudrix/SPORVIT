'use client';

import { Recipe } from '@/lib/recipeTypes';
import { parseISODuration } from '@/lib/recipeFormatters';
import { Clock, Flame, TrendingUp } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
}

export const RecipeCard = ({ recipe, onClick }: RecipeCardProps) => {
  // Obtener macros de la receta
  const calories = recipe.nutrition?.calories || 0;
  const protein = recipe.nutrition?.protein_g || 0;
  const carbs = recipe.nutrition?.carbs_g || 0;
  const fat = recipe.nutrition?.fat_g || 0;

  // Parsear tiempo total
  const totalTime = parseISODuration(recipe.totalTime);

  // Traducir alertas nutricionales al español
  const translateAlert = (alert: string): string => {
    const translations: { [key: string]: string } = {
      'High in sodium': 'Alto en sodio',
      'High in saturated fat': 'Alto en grasas saturadas',
      'High in sugar': 'Alto en azúcar',
      'High in calories': 'Alto en calorías',
      'Low in protein': 'Bajo en proteína',
      'High in cholesterol': 'Alto en colesterol',
      'High in fat': 'Alto en grasas',
      'Low in fiber': 'Bajo en fibra',
      'Very high in sodium': 'Muy alto en sodio',
      'Very high in sugar': 'Muy alto en azúcar',
      'Very high in saturated fat': 'Muy alto en grasas saturadas',
      'Moderate sodium': 'Sodio moderado',
      'Low in calories': 'Bajo en calorías',
      'High in carbs': 'Alto en carbohidratos',
    };
    return translations[alert] || alert;
  };

  // Determinar color según nutrition_score (si existe)
  const getScoreColor = () => {
    if (!recipe.nutrition_score) return 'text-slate-400';
    const avgScore = (recipe.nutrition_score.general + recipe.nutrition_score.cut + recipe.nutrition_score.bulk + recipe.nutrition_score.endurance) / 4;
    if (avgScore >= 7) return 'text-emerald-400';
    if (avgScore >= 5) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <button
      onClick={onClick}
      className="group w-full bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 rounded-xl overflow-hidden transition-all hover:shadow-lg hover:shadow-emerald-500/10 text-left"
    >
      {/* Imagen */}
      <div className="relative h-64 bg-slate-800 overflow-hidden">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Flame className="w-16 h-16 text-slate-700" />
          </div>
        )}

        {/* Badge de categoría */}
        <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-white/10">
          <span className="text-xs font-medium text-white">
            {recipe.recipeCategory}
          </span>
        </div>

        {/* Nutrition Score Badge (si existe) */}
        {recipe.nutrition_score && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-white/10 flex items-center gap-1">
            <TrendingUp className={`w-3 h-3 ${getScoreColor()}`} />
            <span className={`text-xs font-bold ${getScoreColor()}`}>
              {Math.round((recipe.nutrition_score.general + recipe.nutrition_score.cut + recipe.nutrition_score.bulk + recipe.nutrition_score.endurance) / 4)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Título */}
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors">
          {recipe.name}
        </h3>

        {/* Descripción */}
        {recipe.description && (
          <p className="text-sm text-slate-400 mb-3 line-clamp-2">
            {recipe.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 mb-3 pb-3 border-b border-slate-800">
          {/* Calorías */}
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-semibold text-white">{calories}</span>
            <span className="text-xs text-slate-500">kcal</span>
          </div>

          {/* Tiempo */}
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-slate-300">{totalTime}</span>
          </div>
        </div>

        {/* Macros Grid */}
        <div className="grid grid-cols-3 gap-2">
          {/* Proteína */}
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-1">Proteína</div>
            <div className="text-sm font-bold text-red-400">{protein}g</div>
          </div>

          {/* Carbohidratos */}
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-1">Carbos</div>
            <div className="text-sm font-bold text-blue-400">{carbs}g</div>
          </div>

          {/* Grasas */}
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-1">Grasas</div>
            <div className="text-sm font-bold text-yellow-400">{fat}g</div>
          </div>
        </div>

        {/* Alertas nutricionales (si existen) */}
        {recipe.nutrition_alerts && recipe.nutrition_alerts.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-800">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0" />
              <p className="text-xs text-yellow-400 line-clamp-1">
                {translateAlert(recipe.nutrition_alerts[0])}
              </p>
            </div>
          </div>
        )}
      </div>
    </button>
  );
};
