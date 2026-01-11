// app/(public)/recipes/page.tsx
import React from 'react';
import Link from 'next/link';
import { Search, Clock, ChevronRight, ChefHat, Flame, Utensils, Filter } from 'lucide-react';
import { Metadata } from 'next';

// 1. Importar funciones de servidor (Datos)
import { 
  getAllRecipes, 
  getFeaturedRecipes, 
  getRecipesByCategory, 
  searchRecipes,
  getRecipesCount
} from '@/lib/recipeUtils';

// 2. Importar funciones de formato (UI/Cliente)
import { 
  parseISODuration, 
  mapCategoryToUI 
} from '@/lib/recipeFormatters';

// 3. Importar Tipos (si los usas explícitamente)
import type { Recipe } from '@/lib/recipeTypes';

export const metadata: Metadata = {
  title: 'Sporvit Kitchen - Recetas Saludables | +20,000 Recetas Fit',
  description: 'Descubre más de 20,000 recetas fit, altas en proteína y equilibradas para potenciar tu rendimiento. Recetas organizadas por categoría y objetivos nutricionales.',
};

// Categorías culinarias
const CATEGORIES = ["Todas", "Desayunos", "Comidas", "Cenas", "Snacks", "Postres", "Batidos"];

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string; page?: string };
}) {
  const category = searchParams.category || 'Todas';
  const searchQuery = searchParams.q || '';

  // Obtener recetas desde el JSON
  let allRecipes = await getAllRecipes();
  const featuredRecipesArray = await getFeaturedRecipes(1);
  const featuredRecipe = featuredRecipesArray[0] || null;
  const totalRecipes = await getRecipesCount();

  // Aplicar filtros
  if (searchQuery) {
    allRecipes = await searchRecipes(searchQuery);
  } else if (category !== 'Todas') {
    allRecipes = await getRecipesByCategory(category);
  }

  // Paginación
  const currentPage = parseInt(searchParams.page || '1');
  const recipesPerPage = 12;
  const totalPages = Math.ceil(allRecipes.length / recipesPerPage);
  const startIndex = (currentPage - 1) * recipesPerPage;
  const endIndex = startIndex + recipesPerPage;
  const displayRecipes = allRecipes.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans pb-24">
      
      {/* --- HEADER --- */}
      <header className="pt-16 pb-12 container mx-auto px-6 text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6 animate-in fade-in slide-in-from-bottom-4">
          <ChefHat className="w-3 h-3" />
          Sporvit Kitchen
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
          Come Mejor, Entrena Mejor
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-4">
          Recetas diseñadas por nutricionistas para optimizar tu composición corporal sin sacrificar el sabor.
        </p>
        <p className="text-emerald-400 font-semibold text-sm mb-8">
          📚 {totalRecipes.toLocaleString()} recetas disponibles
        </p>
        
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500" />
          </div>
          <form action="/recipes" method="GET">
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              className="block w-full pl-10 pr-3 py-3 border border-slate-800 rounded-xl leading-5 bg-slate-900/50 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-900 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
              placeholder="Buscar receta (ej. Pollo, Keto...)"
            />
            {category !== 'Todas' && <input type="hidden" name="category" value={category} />}
          </form>
        </div>
      </header>

      <main className="container mx-auto px-6 max-w-7xl">
        
        {/* --- FEATURED RECIPE --- */}
        {!searchQuery && featuredRecipe && (
          <section className="mb-20">
            <Link href={`/recipes/${featuredRecipe.slug}`} className="group relative block bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 hover:border-emerald-500/30 transition-all duration-500">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="h-72 md:h-[500px] overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10 md:hidden opacity-80"></div>
                  {/* Badge en imagen */}
                  <div className="absolute top-6 left-6 z-20 px-3 py-1 bg-slate-950/80 backdrop-blur text-white text-xs font-bold rounded-full border border-slate-800 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-400" /> Receta Destacada
                  </div>
                  <img 
                    src={featuredRecipe.image} 
                    alt={featuredRecipe.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center relative z-20">
                  
                  {/* Stats Row */}
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className="flex items-center gap-1.5 text-slate-400 text-xs font-medium bg-slate-800/50 px-3 py-1.5 rounded-lg">
                      <Clock className="w-3.5 h-3.5" /> {parseISODuration(featuredRecipe.totalTime)}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400 text-xs font-medium bg-slate-800/50 px-3 py-1.5 rounded-lg">
                      <Utensils className="w-3.5 h-3.5" /> {featuredRecipe.recipeYield} porciones
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium bg-emerald-500/10 px-3 py-1.5 rounded-lg">
                      {mapCategoryToUI(featuredRecipe.recipeCategory)}
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white group-hover:text-emerald-400 transition-colors leading-tight">
                    {featuredRecipe.name}
                  </h2>
                  <p className="text-slate-400 mb-8 line-clamp-3 text-lg">
                    {featuredRecipe.summary || featuredRecipe.description}
                  </p>

                  <div className="mt-auto flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Ingredientes</span>
                      <span className="text-xl font-bold text-emerald-400">{featuredRecipe.recipeIngredient.length}</span>
                    </div>
                    <div className="h-8 w-px bg-slate-800"></div>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Tiempo</span>
                      <span className="text-xl font-bold text-white">{featuredRecipe.tiempo_clasificado}</span>
                    </div>
                  </div>

                </div>
              </div>
            </Link>
          </section>
        )}

        {/* --- CATEGORY FILTERS --- */}
        <nav className="mb-12 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/recipes?category=${cat}`}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                category === cat
                  ? 'bg-white text-slate-950 shadow-lg shadow-white/10'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {cat}
            </Link>
          ))}
        </nav>

        {/* --- RECIPES GRID --- */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayRecipes.length > 0 ? (
            displayRecipes.map((recipe) => {
              const displayCategory = mapCategoryToUI(recipe.recipeCategory);
              const prepTime = parseISODuration(recipe.totalTime);
              
              return (
                <Link key={recipe.slug} href={`/recipes/${recipe.slug}`} className="group flex flex-col bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-300">
                  
                  {/* Image Area */}
                  <div className="h-56 overflow-hidden relative">
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-slate-950/80 backdrop-blur text-white text-[10px] uppercase tracking-wide font-bold rounded-full border border-slate-800">
                      {displayCategory}
                    </div>
                    {/* Portions Badge (Corner) */}
                    <div className="absolute bottom-4 right-4 z-10 px-2 py-1 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg shadow-lg">
                      {recipe.recipeYield} {parseInt(recipe.recipeYield) > 1 ? 'porciones' : 'porción'}
                    </div>
                    <img 
                      src={recipe.image} 
                      alt={recipe.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    
                    {/* Tags Row - Keywords */}
                    <div className="flex gap-2 mb-3 overflow-hidden">
                      {recipe.keywords.split(',').slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded border border-slate-700 text-slate-400 bg-slate-800/30 truncate">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {recipe.name}
                    </h3>
                    
                    {/* Info Icons */}
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {prepTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Utensils className="w-3.5 h-3.5" /> {recipe.recipeIngredient.length} ingred.
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-auto">
                      <span className="text-xs font-medium text-emerald-400 group-hover:underline">Ver preparación</span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full text-center py-20 text-slate-500">
              <ChefHat className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No se encontraron recetas {searchQuery && `para "${searchQuery}"`}.</p>
              <Link href="/recipes" className="text-emerald-400 hover:underline mt-2 inline-block">Ver todas</Link>
            </div>
          )}
        </div>

        {/* Paginación */}
        {displayRecipes.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mb-12">
            <Link
              href={`/recipes?page=${Math.max(1, currentPage - 1)}${category !== 'Todas' ? `&category=${category}` : ''}${searchQuery ? `&q=${searchQuery}` : ''}`}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                currentPage === 1 
                  ? 'opacity-50 pointer-events-none bg-slate-800 text-slate-600' 
                  : 'bg-slate-900 text-white border border-slate-700 hover:bg-slate-800 hover:border-emerald-500/30'
              }`}
            >
              ← Anterior
            </Link>
            
            <span className="text-slate-300 font-medium px-4">
              Página <span className="text-emerald-400">{currentPage}</span> de {totalPages}
            </span>
            
            <Link
              href={`/recipes?page=${Math.min(totalPages, currentPage + 1)}${category !== 'Todas' ? `&category=${category}` : ''}${searchQuery ? `&q=${searchQuery}` : ''}`}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                currentPage === totalPages 
                  ? 'opacity-50 pointer-events-none bg-slate-800 text-slate-600' 
                  : 'bg-slate-900 text-white border border-slate-700 hover:bg-slate-800 hover:border-emerald-500/30'
              }`}
            >
              Siguiente →
            </Link>
          </div>
        )}

        {/* Indicador de resultados */}
        {displayRecipes.length > 0 && (
          <div className="text-center mb-12 text-slate-400 text-sm">
            Mostrando {startIndex + 1}-{Math.min(endIndex, allRecipes.length)} de {allRecipes.length} recetas
          </div>
        )}

        {/* --- MEAL PLAN CTA --- */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-900 to-slate-900 border border-emerald-500/20">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 p-12 md:p-20 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-400">
              <Utensils className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">¿No sabes qué comer hoy?</h2>
            <p className="text-emerald-100/80 mb-8 text-lg">
              Descarga nuestro planificador semanal gratuito y organiza tus macros sin estrés.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="tu@email.com" 
                className="flex-grow px-5 py-3 rounded-xl bg-slate-950/50 border border-emerald-500/30 text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-all"
              />
              <button className="px-8 py-3 bg-white text-emerald-950 font-bold rounded-xl hover:bg-emerald-50 transition-colors shadow-lg hover:shadow-xl whitespace-nowrap">
                Obtener Menú
              </button>
            </form>
          </div>
        </section>

      </main>
    </div>
  );
}