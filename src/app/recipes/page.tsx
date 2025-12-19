// src/app/recetas/page.tsx
import React from 'react';
import Link from 'next/link';
import { Search, Clock, ChevronRight, ChefHat, Flame, Utensils, Filter } from 'lucide-react';
import { Metadata } from 'next';

// NOTA: Asumo que tendrás una función similar a getBlogPosts pero para recetas.
// Si no la tienes aún, he creado una data "mock" (ficticia) abajo para que la página funcione visualmente ya mismo.
// import { getRecipes, getFeaturedRecipe } from '@/lib/cms'; 

export const metadata: Metadata = {
  title: 'Sporvit Kitchen - Recetas Saludables',
  description: 'Recetas fit, altas en proteína y equilibradas para potenciar tu rendimiento.',
};

// Categorías culinarias
const CATEGORIES = ["Todas", "Desayunos", "Comidas", "Cenas", "Snacks", "Postres", "Batidos"];

// --- MOCK DATA (Eliminar esto cuando conectes tu backend/CMS real) ---
const MOCK_RECIPES = [
  {
    slug: 'bowl-pollo-quinoa',
    title: 'Power Bowl de Pollo y Quinoa al Limón',
    excerpt: 'Un almuerzo completo cargado de proteína magra, carbohidratos complejos y grasas saludables. Perfecto para post-entreno.',
    coverImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
    category: 'Comidas',
    prepTime: '25 min',
    calories: '450 kcal',
    difficulty: 'Fácil',
    protein: '35g',
    tags: ['Alta Proteína', 'Sin Gluten']
  },
  {
    slug: 'pancakes-avena',
    title: 'Pancakes de Avena y Plátano Fluffy',
    excerpt: 'Empieza el día con energía. Sin harinas refinadas y con todo el sabor para un desayuno de campeones.',
    coverImage: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&q=80&w=800',
    category: 'Desayunos',
    prepTime: '15 min',
    calories: '320 kcal',
    difficulty: 'Fácil',
    protein: '18g',
    tags: ['Vegetariano']
  },
  {
    slug: 'salmon-horno',
    title: 'Salmón al Horno con Espárragos',
    excerpt: 'Omega-3 de calidad y fibra en una cena ligera que se prepara sola en el horno mientras te duchas.',
    coverImage: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&q=80&w=800',
    category: 'Cenas',
    prepTime: '30 min',
    calories: '380 kcal',
    difficulty: 'Media',
    protein: '28g',
    tags: ['Keto', 'Low Carb']
  },
  {
    slug: 'batido-verde',
    title: 'Batido Detox de Espinacas y Piña',
    excerpt: 'Recuperación rápida e hidratación. Lleno de micronutrientes esenciales para reducir la inflamación.',
    coverImage: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&q=80&w=800',
    category: 'Batidos',
    prepTime: '5 min',
    calories: '180 kcal',
    difficulty: 'Muy Fácil',
    protein: '12g',
    tags: ['Vegano', 'Detox']
  }
];

const MOCK_FEATURED = {
  slug: 'lasana-calabacin',
  title: 'Lasaña Low-Carb de Calabacín y Pavo',
  excerpt: 'Disfruta de tu plato italiano favorito sin la pesadez de la pasta. Capas de sabor intenso, queso fundido y proteína de alta calidad para una cena reconfortante.',
  coverImage: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=1200',
  prepTime: '55 min',
  calories: '410 kcal',
  difficulty: 'Media',
  protein: '42g',
  chef: 'Chef Sporvit',
  chefImage: 'https://i.pravatar.cc/150?u=chef'
};
// ---------------------------------------------------------------------

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const category = searchParams.category || 'Todas';
  const searchQuery = searchParams.q || '';

  // AQUÍ CONECTARÍAS TU CMS REAL:
  // const [featuredRecipe, allRecipes] = await Promise.all([ ... ]);
  
  // Usando Mock Data por ahora:
  const featuredRecipe = MOCK_FEATURED;
  let allRecipes = MOCK_RECIPES;

  // Lógica de filtrado (Simulada)
  if (category !== 'Todas') {
    allRecipes = allRecipes.filter(r => r.category === category);
  }
  if (searchQuery) {
    allRecipes = allRecipes.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans pb-24">
      
      {/* --- HEADER --- */}
      <header className="pt-32 pb-12 container mx-auto px-6 text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6 animate-in fade-in slide-in-from-bottom-4">
          <ChefHat className="w-3 h-3" />
          Sporvit Kitchen
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
          Come Mejor, Entrena Mejor
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
          Recetas diseñadas por nutricionistas para optimizar tu composición corporal sin sacrificar el sabor.
        </p>
        
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500" />
          </div>
          <form action="/recetas" method="GET">
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
            <Link href={`/recetas/${featuredRecipe.slug}`} className="group relative block bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 hover:border-emerald-500/30 transition-all duration-500">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="h-72 md:h-[500px] overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10 md:hidden opacity-80"></div>
                  {/* Badge en imagen */}
                  <div className="absolute top-6 left-6 z-20 px-3 py-1 bg-slate-950/80 backdrop-blur text-white text-xs font-bold rounded-full border border-slate-800 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-400" /> Receta de la Semana
                  </div>
                  <img 
                    src={featuredRecipe.coverImage} 
                    alt={featuredRecipe.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center relative z-20">
                  
                  {/* Stats Row */}
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className="flex items-center gap-1.5 text-slate-400 text-xs font-medium bg-slate-800/50 px-3 py-1.5 rounded-lg">
                      <Clock className="w-3.5 h-3.5" /> {featuredRecipe.prepTime}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400 text-xs font-medium bg-slate-800/50 px-3 py-1.5 rounded-lg">
                      <Flame className="w-3.5 h-3.5 text-orange-400" /> {featuredRecipe.calories}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400 text-xs font-medium bg-slate-800/50 px-3 py-1.5 rounded-lg">
                      <Utensils className="w-3.5 h-3.5" /> {featuredRecipe.difficulty}
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white group-hover:text-emerald-400 transition-colors leading-tight">
                    {featuredRecipe.title}
                  </h2>
                  <p className="text-slate-400 mb-8 line-clamp-3 text-lg">
                    {featuredRecipe.excerpt}
                  </p>

                  <div className="mt-auto flex items-center gap-4">
                     <div className="flex flex-col">
                        <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Proteína</span>
                        <span className="text-xl font-bold text-emerald-400">{featuredRecipe.protein}</span>
                     </div>
                     <div className="h-8 w-px bg-slate-800"></div>
                     <div className="flex items-center gap-3">
                        <img src={featuredRecipe.chefImage} alt={featuredRecipe.chef} className="w-8 h-8 rounded-full border border-slate-700" />
                        <span className="text-sm text-slate-300">Por <span className="text-white font-medium">{featuredRecipe.chef}</span></span>
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
              href={`/recetas?category=${cat}`}
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {allRecipes.length > 0 ? (
            allRecipes.map((recipe) => (
              <Link key={recipe.slug} href={`/recetas/${recipe.slug}`} className="group flex flex-col bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-300">
                
                {/* Image Area */}
                <div className="h-56 overflow-hidden relative">
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-slate-950/80 backdrop-blur text-white text-[10px] uppercase tracking-wide font-bold rounded-full border border-slate-800">
                    {recipe.category}
                  </div>
                  {/* Protein Badge (Corner) */}
                  <div className="absolute bottom-4 right-4 z-10 px-2 py-1 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg shadow-lg">
                    {recipe.protein} Prot.
                  </div>
                  <img 
                    src={recipe.coverImage} 
                    alt={recipe.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  
                  {/* Tags Row */}
                  <div className="flex gap-2 mb-3 overflow-hidden">
                    {recipe.tags.slice(0, 2).map(tag => (
                       <span key={tag} className="text-[10px] px-2 py-0.5 rounded border border-slate-700 text-slate-400 bg-slate-800/30">
                          {tag}
                       </span>
                    ))}
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {recipe.title}
                  </h3>
                  
                  {/* Info Icons */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                     <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {recipe.prepTime}
                     </span>
                     <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5" /> {recipe.calories}
                     </span>
                     <span className="flex items-center gap-1">
                        <Filter className="w-3.5 h-3.5" /> {recipe.difficulty}
                     </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-auto">
                    <span className="text-xs font-medium text-emerald-400 group-hover:underline">Ver preparación</span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-slate-500">
              <ChefHat className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No se encontraron recetas en esta categoría.</p>
              <Link href="/recetas" className="text-emerald-400 hover:underline mt-2 inline-block">Ver todas</Link>
            </div>
          )}
        </div>

        {/* --- MEAL PLAN CTA (Reemplazo del Newsletter simple) --- */}
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