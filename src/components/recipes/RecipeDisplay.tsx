'use client';

import React from 'react';
import { Clock, Users, ChefHat, Flame, Download, Share2, Copy, Check } from 'lucide-react';
import type { FitnessRecipe } from '@/types/fitness-recipe';
import { useState } from 'react';

interface RecipeDisplayProps {
  recipe: FitnessRecipe;
}

function parseDuration(duration: string): string {
  // Convierte PT5M a "5 min", PT1H30M a "1h 30min", etc.
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return duration;

  const hours = match[1] ? `${match[1]}h` : '';
  const minutes = match[2] ? `${match[2]}min` : '';

  return `${hours}${hours && minutes ? ' ' : ''}${minutes}`.trim();
}

export function RecipeDisplay({ recipe }: RecipeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyJSON = () => {
    const json = JSON.stringify(recipe, null, 2);
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const json = JSON.stringify(recipe, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recipe.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const categoryMap: Record<string, string> = {
    'desayuno': 'Desayuno',
    'almuerzo': 'Almuerzo',
    'cena': 'Cena',
    'snack': 'Snack',
    'pre-entreno': 'Pre-entreno',
    'post-entreno': 'Post-entreno',
  };

  return (
    <div className="space-y-6">
      {/* Header con imagen y título */}
      <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800">
        <div className="h-72 md:h-96 overflow-hidden relative">
          <div className="absolute top-6 left-6 z-10 px-4 py-2 bg-slate-950/80 backdrop-blur text-white text-sm font-bold rounded-full border border-slate-800">
            {categoryMap[recipe.category] || recipe.category}
          </div>
          <div className="absolute bottom-6 right-6 z-10 px-4 py-2 bg-emerald-500 text-slate-950 text-sm font-bold rounded-lg shadow-lg">
            {recipe.nutrition.proteinContent} Proteína
          </div>
          <img
            src={recipe.image.url}
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-8">
          <div className="flex items-center gap-3 mb-4">
            {recipe.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full border border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {recipe.name}
          </h1>

          <p className="text-slate-400 text-lg mb-6">
            {recipe.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <span>Prep: {parseDuration(recipe.prepTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <span>Cocción: {parseDuration(recipe.cookTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <span>{recipe.recipeYield}</span>
            </div>
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-emerald-400" />
              <span className="capitalize">{recipe.difficulty}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Información Nutricional */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Flame className="w-6 h-6 text-orange-400" />
          Información Nutricional
          <span className="text-sm text-slate-400 font-normal ml-2">
            (por porción)
          </span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-xs uppercase tracking-wide mb-1">
              Calorías
            </div>
            <div className="text-white text-2xl font-bold">
              {recipe.nutrition.calories}
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-xs uppercase tracking-wide mb-1">
              Proteína
            </div>
            <div className="text-emerald-400 text-2xl font-bold">
              {recipe.nutrition.proteinContent}
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-xs uppercase tracking-wide mb-1">
              Carbohidratos
            </div>
            <div className="text-blue-400 text-2xl font-bold">
              {recipe.nutrition.carbohydrateContent}
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-xs uppercase tracking-wide mb-1">
              Grasas
            </div>
            <div className="text-yellow-400 text-2xl font-bold">
              {recipe.nutrition.fatContent}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className="text-slate-500 text-xs">Fibra</div>
            <div className="text-slate-300 text-sm font-medium">
              {recipe.nutrition.fiberContent}
            </div>
          </div>
          <div className="text-center">
            <div className="text-slate-500 text-xs">Azúcar</div>
            <div className="text-slate-300 text-sm font-medium">
              {recipe.nutrition.sugarContent}
            </div>
          </div>
          <div className="text-center">
            <div className="text-slate-500 text-xs">Grasa Saturada</div>
            <div className="text-slate-300 text-sm font-medium">
              {recipe.nutrition.saturatedFatContent}
            </div>
          </div>
          <div className="text-center">
            <div className="text-slate-500 text-xs">Sodio</div>
            <div className="text-slate-300 text-sm font-medium">
              {recipe.nutrition.sodiumContent}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Ingredientes */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Ingredientes</h2>
          <ul className="space-y-3">
            {recipe.recipeIngredient.map((ingredient, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-slate-300"
              >
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instrucciones */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Preparación</h2>
          <ol className="space-y-4">
            {recipe.recipeInstructions.map((step) => (
              <li key={step.position} className="flex gap-4">
                <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-500 text-white text-sm font-bold flex-shrink-0">
                  {step.position}
                </span>
                <p className="text-slate-300 pt-1">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Acciones */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium"
          >
            <Download className="w-4 h-4" />
            Descargar JSON
          </button>
          <button
            onClick={handleCopyJSON}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium border border-slate-700"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                ¡Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copiar JSON
              </>
            )}
          </button>
          <button
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium border border-slate-700"
          >
            <Share2 className="w-4 h-4" />
            Compartir
          </button>
        </div>
      </div>

      {/* Información SEO */}
      <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Información SEO</h3>
        <div className="space-y-3">
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
              Título SEO
            </div>
            <div className="text-slate-300 text-sm">{recipe.seo.title}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
              Meta Descripción
            </div>
            <div className="text-slate-300 text-sm">
              {recipe.seo.metaDescription}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
              Palabra Clave
            </div>
            <div className="text-slate-300 text-sm">
              {recipe.seo.focusKeyword}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
