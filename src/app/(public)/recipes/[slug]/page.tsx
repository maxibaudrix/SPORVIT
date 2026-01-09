// app/(public)/recipes/[slug]/page.tsx
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { 
  Clock, 
  Users, 
  ChefHat, 
  ArrowLeft, 
  CheckCircle2,
  Flame,
  Droplet,
  Zap
} from 'lucide-react';
import { 
  getRecipeBySlug, 
  getAllRecipes,
  getRelatedRecipes,
  parseISODuration,
  mapCategoryToUI 
} from '@/lib/recipeUtils';
import ShareButtons from '@/components/ShareButtons';

// Generar metadata dinámica para SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const recipe = await getRecipeBySlug(params.slug);
  
  if (!recipe) {
    return {
      title: 'Receta no encontrada | Sporvit Kitchen',
    };
  }

  return {
    title: `${recipe.name} | Sporvit Kitchen`,
    description: recipe.summary || recipe.description,
    openGraph: {
      title: recipe.name,
      description: recipe.summary || recipe.description,
      images: [recipe.image],
    },
  };
}

// Generar todas las rutas estáticas en build time (ISR)
export async function generateStaticParams() {
  const recipes = await getAllRecipes();
  
  // Generar solo las primeras 100 recetas en build time
  // El resto se generará on-demand
  return recipes.slice(0, 100).map((recipe) => ({
    slug: recipe.slug,
  }));
}

// Función para obtener color según score
function getScoreColor(score: number): string {
  if (score >= 70) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
  if (score >= 40) return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
  return 'text-slate-400 border-slate-700 bg-slate-800/30';
}

// Función para obtener icono según tipo de score
function getScoreIcon(type: string) {
  switch(type) {
    case 'cut': return '🔥';
    case 'bulk': return '💪';
    case 'endurance': return '⚡';
    default: return '⭐';
  }
}

export default async function RecipePage({ params }: { params: { slug: string } }) {
  const recipe = await getRecipeBySlug(params.slug);
  
  if (!recipe) {
    notFound();
  }

  const relatedRecipes = await getRelatedRecipes(params.slug, 3);
  const displayCategory = mapCategoryToUI(recipe.recipeCategory);
  const totalTime = parseISODuration(recipe.totalTime);
  const prepTime = parseISODuration(recipe.prepTime);
  const cookTime = parseISODuration(recipe.cookTime);

  // Limpiar ingredientes mal formateados
  const cleanedIngredients = recipe.recipeIngredient.map((ingredient: string) => {
    // Si el ingrediente contiene "alimento" o "peso:" es un ingrediente mal formateado
    if (ingredient.includes('alimento') || ingredient.includes('peso:')) {
      // Intentar extraer solo la primera parte antes de "alimento" o "peso"
      const match = ingredient.match(/^([^,]*(?:de|taza|cucharada|cucharadita)[^,]*)/i);
      return match ? match[1].trim() : ingredient.split(',')[0].trim();
    }
    return ingredient;
  }).filter((ing: string) => ing.length > 0 && ing.length < 200); // Filtrar vacíos y muy largos

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      
      {/* Back Navigation */}
      <div className="bg-slate-900/50 border-b border-slate-800">
        <div className="container mx-auto px-6 py-4 max-w-6xl">
          <Link 
            href="/recipes" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a recetas
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative">
        <div className="h-[60vh] max-h-[600px] relative overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent z-10"></div>
          
          {/* Image */}
          <img 
            src={recipe.image} 
            alt={recipe.name}
            className="w-full h-full object-cover"
          />

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 z-20 container mx-auto px-6 pb-12 max-w-6xl">
            <div className="max-w-3xl">
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/90 backdrop-blur border border-emerald-500/50 text-emerald-400 text-xs font-medium mb-4">
                <ChefHat className="w-3 h-3" />
                {displayCategory}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
                {recipe.name}
              </h1>

              {/* Quick Stats */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur px-4 py-2 rounded-lg">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm">
                    <span className="text-slate-400">Tiempo total:</span>{' '}
                    <span className="text-white font-semibold">{totalTime}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur px-4 py-2 rounded-lg">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm">
                    <span className="text-slate-400">Porciones:</span>{' '}
                    <span className="text-white font-semibold">{recipe.recipeYield}</span>
                  </span>
                </div>
                {recipe.nutrition && (
                  <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur px-4 py-2 rounded-lg">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="text-sm">
                      <span className="text-white font-semibold">{recipe.nutrition.calories} kcal</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <ShareButtons recipe={recipe} />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Left Column - Details & Instructions */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Description */}
            {recipe.description && (
              <section>
                <h2 className="text-2xl font-bold mb-4 text-white">Descripción</h2>
                <p className="text-slate-300 leading-relaxed">
                  {recipe.description}
                </p>
              </section>
            )}

            {/* Nutrition Scores - Si existen */}
            {recipe.nutrition_score && (
              <section>
                <h2 className="text-2xl font-bold mb-4 text-white">Puntuación Nutricional</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {/* Score General */}
                  <div className={`p-4 rounded-xl border ${getScoreColor(recipe.nutrition_score.general)}`}>
                    <div className="text-2xl mb-1">{getScoreIcon('general')}</div>
                    <div className="text-xs text-slate-400 mb-1">General</div>
                    <div className="text-2xl font-bold">{recipe.nutrition_score.general}</div>
                  </div>

                  {/* Score Cut */}
                  <div className={`p-4 rounded-xl border ${getScoreColor(recipe.nutrition_score.cut)}`}>
                    <div className="text-2xl mb-1">{getScoreIcon('cut')}</div>
                    <div className="text-xs text-slate-400 mb-1">Definición</div>
                    <div className="text-2xl font-bold">{recipe.nutrition_score.cut}</div>
                  </div>

                  {/* Score Bulk */}
                  <div className={`p-4 rounded-xl border ${getScoreColor(recipe.nutrition_score.bulk)}`}>
                    <div className="text-2xl mb-1">{getScoreIcon('bulk')}</div>
                    <div className="text-xs text-slate-400 mb-1">Volumen</div>
                    <div className="text-2xl font-bold">{recipe.nutrition_score.bulk}</div>
                  </div>

                  {/* Score Endurance */}
                  <div className={`p-4 rounded-xl border ${getScoreColor(recipe.nutrition_score.endurance)}`}>
                    <div className="text-2xl mb-1">{getScoreIcon('endurance')}</div>
                    <div className="text-xs text-slate-400 mb-1">Resistencia</div>
                    <div className="text-2xl font-bold">{recipe.nutrition_score.endurance}</div>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  * Puntuaciones de 0-100. Mayor puntuación = más adecuado para el objetivo.
                </p>
              </section>
            )}

            {/* Ingredients */}
            <section className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                <ChefHat className="w-6 h-6 text-emerald-400" />
                Ingredientes
              </h2>
              <ul className="space-y-3">
                {cleanedIngredients.map((ingredient: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{ingredient.trim()}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Instructions */}
            <section>
              <h2 className="text-2xl font-bold mb-6 text-white">Instrucciones</h2>
              <div className="space-y-6">
                {recipe.recipeInstructions.map((instruction: string, index: number) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-slate-300 leading-relaxed pt-1">
                      {instruction}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Keywords/Tags */}
            <section>
              <h3 className="text-lg font-semibold mb-4 text-white">Etiquetas</h3>
              <div className="flex flex-wrap gap-2">
                {recipe.keywords.split(',').map((keyword: string, index: number) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-slate-800/50 border border-slate-700 rounded-full text-xs text-slate-300"
                  >
                    {keyword.trim()}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Recipe Info Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Macros Card - Si existe información nutricional */}
              {recipe.nutrition && recipe.quality.nutrition_ready && (
                <div className="bg-gradient-to-br from-emerald-900/30 to-slate-900/50 rounded-2xl p-6 border border-emerald-500/20">
                  <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                    <Flame className="w-5 h-5 text-emerald-400" />
                    Información Nutricional
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    {recipe.nutrition.per_serving ? 'Por porción' : 'Total'}
                  </p>

                  {/* Macros principales */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800">
                      <div className="text-xs text-slate-400 mb-1">Calorías</div>
                      <div className="text-2xl font-bold text-white">{recipe.nutrition.calories}</div>
                      <div className="text-xs text-slate-500">kcal</div>
                    </div>
                    <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800">
                      <div className="text-xs text-slate-400 mb-1">Proteína</div>
                      <div className="text-2xl font-bold text-emerald-400">{recipe.nutrition.protein_g}</div>
                      <div className="text-xs text-slate-500">gramos</div>
                    </div>
                    <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800">
                      <div className="text-xs text-slate-400 mb-1">Carbos</div>
                      <div className="text-2xl font-bold text-blue-400">{recipe.nutrition.carbs_g}</div>
                      <div className="text-xs text-slate-500">gramos</div>
                    </div>
                    <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800">
                      <div className="text-xs text-slate-400 mb-1">Grasas</div>
                      <div className="text-2xl font-bold text-yellow-400">{recipe.nutrition.fat_g}</div>
                      <div className="text-xs text-slate-500">gramos</div>
                    </div>
                  </div>

                  {/* Detalles nutricionales */}
                  <div className="space-y-2 pt-4 border-t border-slate-800">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Fibra</span>
                      <span className="text-white font-medium">{recipe.nutrition.fiber_g}g</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Azúcar</span>
                      <span className="text-white font-medium">{recipe.nutrition.sugar_g}g</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Sodio</span>
                      <span className="text-white font-medium">{recipe.nutrition.sodium_mg}mg</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Colesterol</span>
                      <span className="text-white font-medium">{recipe.nutrition.cholesterol_mg}mg</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Time Breakdown Card */}
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                <h3 className="text-lg font-bold mb-4 text-white">Tiempos</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                    <span className="text-slate-400 text-sm">Preparación</span>
                    <span className="text-white font-semibold">{prepTime}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                    <span className="text-slate-400 text-sm">Cocción</span>
                    <span className="text-white font-semibold">{cookTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm font-semibold">Total</span>
                    <span className="text-emerald-400 font-bold">{totalTime}</span>
                  </div>
                </div>
              </div>

              {/* Nutrition Note - Solo si NO hay información nutricional */}
              {!recipe.nutrition && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                  <p className="text-yellow-200/80 text-xs">
                    ℹ️ Información nutricional en desarrollo
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Recipes */}
        {relatedRecipes.length > 0 && (
          <section className="mt-20">
            <h2 className="text-3xl font-bold mb-8 text-white">Recetas Similares</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedRecipes.map((relatedRecipe) => (
                <Link
                  key={relatedRecipe.slug}
                  href={`/recipes/${relatedRecipe.slug}`}
                  className="group bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden hover:border-emerald-500/30 transition-all duration-300"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={relatedRecipe.image}
                      alt={relatedRecipe.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 mb-2">
                      {relatedRecipe.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {parseISODuration(relatedRecipe.totalTime)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {relatedRecipe.recipeYield}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}