'use client';

import React, { useState } from 'react';
import { ChefHat, Sparkles, ArrowLeft } from 'lucide-react';
import { RecipeGeneratorForm } from '@/components/recipes/RecipeGeneratorForm';
import { RecipeDisplay } from '@/components/recipes/RecipeDisplay';
import type { FitnessRecipe } from '@/types/fitness-recipe';
import Link from 'next/link';

export default function FitnessRecipeGeneratorPage() {
  const [recipe, setRecipe] = useState<FitnessRecipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (data: any) => {
    setIsGenerating(true);
    setError(null);
    setRecipe(null);

    try {
      const response = await fetch('/api/recipes/fitness/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al generar la receta');
      }

      if (!result.success || !result.recipe) {
        throw new Error('Error al generar la receta');
      }

      setRecipe(result.recipe);

      // Scroll suave hacia la receta
      setTimeout(() => {
        const recipeElement = document.getElementById('generated-recipe');
        if (recipeElement) {
          recipeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);

    } catch (err: any) {
      console.error('Error generating recipe:', err);
      setError(err.message || 'Error al generar la receta. Por favor intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setRecipe(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="pt-32 pb-12 container mx-auto px-6 text-center max-w-4xl">
        <Link
          href="/recipes"
          className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Recetas
        </Link>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          Generador Inteligente de Recetas
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
          Crea Recetas Fitness Personalizadas
        </h1>

        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Ingresa tus ingredientes disponibles y objetivos fitness. Nuestra IA creará recetas
          perfectamente balanceadas con información nutricional completa.
        </p>
      </header>

      <main className="container mx-auto px-6 max-w-7xl pb-24">
        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-900/30 border border-red-800 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <div>
                <h3 className="text-red-300 font-bold mb-1">Error al Generar Receta</h3>
                <p className="text-red-200/80">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Section */}
        <div className="mb-12">
          <RecipeGeneratorForm
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </div>

        {/* Generated Recipe Section */}
        {recipe && (
          <div id="generated-recipe" className="scroll-mt-24">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400">
                  <ChefHat className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Tu Receta Generada</h2>
                  <p className="text-slate-400 text-sm">
                    Receta creada con IA basada en tus ingredientes y objetivos
                  </p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium border border-slate-700"
              >
                Nueva Receta
              </button>
            </div>

            <RecipeDisplay recipe={recipe} />
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="text-center py-20">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 rounded-2xl border border-slate-800">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-left">
                <div className="text-white font-bold">Generando tu receta fitness...</div>
                <div className="text-slate-400 text-sm">Esto puede tardar unos segundos</div>
              </div>
            </div>
          </div>
        )}

        {/* Info Cards */}
        {!recipe && !isGenerating && (
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-4">
                <ChefHat className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Ingredientes Flexibles
              </h3>
              <p className="text-slate-400 text-sm">
                Usa los ingredientes que tengas disponibles. La IA creará recetas deliciosas y balanceadas.
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Macros Precisos
              </h3>
              <p className="text-slate-400 text-sm">
                Obtén información nutricional detallada con calorías, proteínas, carbohidratos y grasas.
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 mb-4">
                <ChefHat className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Objetivos Personalizados
              </h3>
              <p className="text-slate-400 text-sm">
                Recetas adaptadas a tus metas: perder grasa, ganar músculo o mejorar rendimiento.
              </p>
            </div>
          </div>
        )}

        {/* CTA Section */}
        {!recipe && !isGenerating && (
          <div className="mt-16 relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-900 to-slate-900 border border-emerald-500/20">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10 p-12 md:p-16 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                ¿Listo para empezar?
              </h2>
              <p className="text-emerald-100/80 mb-8 text-lg">
                Completa el formulario arriba con tus ingredientes y objetivos fitness
                para obtener tu receta personalizada en segundos.
              </p>
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-white text-emerald-950 font-bold rounded-xl hover:bg-emerald-50 transition-colors shadow-lg hover:shadow-xl"
              >
                Ir al Formulario
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
