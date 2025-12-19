// src/app/blog/page.tsx
import React from 'react';
import Link from 'next/link';
import { Search, Clock, ChevronRight, BookOpen, Mail } from 'lucide-react';
import { getBlogPosts, getFeaturedPost } from '@/lib/cms';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sporvit Academy - Blog de Nutrición y Fitness',
  description: 'Artículos basados en ciencia sobre nutrición, entrenamiento y rendimiento deportivo.',
};

// Definir categorías estáticas para los filtros
const CATEGORIES = ["Todos", "Nutrición", "Entrenamiento", "Ciencia", "Recetas"];

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const category = searchParams.category || 'Todos';
  const searchQuery = searchParams.q || '';
  
  // Fetch data en paralelo
  const [featuredPost, allPosts] = await Promise.all([
    getFeaturedPost(),
    getBlogPosts(category === 'Todos' ? undefined : category)
  ]);

  // Filtrado adicional por búsqueda (si hay query)
  const displayPosts = searchQuery 
    ? allPosts.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : allPosts.filter(p => p.slug !== featuredPost?.slug); // Excluir destacado de la grid

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans pb-24">
      
      {/* --- HEADER --- */}
      <header className="pt-32 pb-12 container mx-auto px-6 text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6 animate-in fade-in slide-in-from-bottom-4">
          <BookOpen className="w-3 h-3" />
          Sporvit Academy
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
          Ciencia, Nutrición y Rendimiento
        </h1>
        
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mt-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500" />
          </div>
          <form action="/blog" method="GET">
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              className="block w-full pl-10 pr-3 py-3 border border-slate-800 rounded-xl leading-5 bg-slate-900/50 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-900 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
              placeholder="Buscar artículos..."
            />
             {/* Mantener categoría al buscar */}
            {category !== 'Todos' && <input type="hidden" name="category" value={category} />}
          </form>
        </div>
      </header>

      <main className="container mx-auto px-6 max-w-7xl">
        
        {/* --- FEATURED POST --- */}
        {!searchQuery && featuredPost && (
          <section className="mb-20">
            <Link href={`/blog/${featuredPost.slug}`} className="group relative block bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 hover:border-emerald-500/30 transition-all duration-500">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="h-64 md:h-96 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10 md:hidden opacity-80"></div>
                  <img 
                    src={featuredPost.coverImage} 
                    alt={featuredPost.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center relative z-20">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-emerald-500 text-slate-950 text-xs font-bold rounded-full">
                      Destacado
                    </span>
                    <span className="text-slate-400 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {featuredPost.readTime}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white group-hover:text-emerald-400 transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-slate-400 mb-8 line-clamp-3 text-lg">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-3">
                    <img src={featuredPost.author.image} alt={featuredPost.author.name} className="w-10 h-10 rounded-full border-2 border-slate-800" />
                    <div>
                      <p className="text-sm font-bold text-white">{featuredPost.author.name}</p>
                      <p className="text-xs text-slate-500">{featuredPost.date}</p>
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
              href={`/blog?category=${cat}`}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                category === cat
                  ? 'bg-white text-slate-950 shadow-lg shadow-white/10'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {cat}
            </Link>
          ))}
        </nav>

        {/* --- POSTS GRID --- */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {displayPosts.length > 0 ? (
            displayPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-300">
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-slate-950/80 backdrop-blur text-white text-xs font-bold rounded-full border border-slate-800">
                    {post.category}
                  </div>
                  <img 
                    src={post.coverImage} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-6 line-clamp-2 flex-grow">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-auto">
                    <div className="flex items-center gap-2">
                      <img src={post.author.image} alt={post.author.name} className="w-6 h-6 rounded-full" />
                      <span className="text-xs font-medium text-slate-300">{post.author.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-slate-500">
              <p>No se encontraron artículos en esta categoría.</p>
              <Link href="/blog" className="text-emerald-400 hover:underline mt-2 inline-block">Ver todos</Link>
            </div>
          )}
        </div>

        {/* --- NEWSLETTER SIGNUP --- */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-900 to-slate-900 border border-emerald-500/20">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 p-12 md:p-20 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-400">
              <Mail className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Únete al Club Sporvit</h2>
            <p className="text-emerald-100/80 mb-8 text-lg">
              Recibe las mejores recetas, análisis científicos y tips de entrenamiento directamente en tu bandeja de entrada.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="tu@email.com" 
                className="flex-grow px-5 py-3 rounded-xl bg-slate-950/50 border border-emerald-500/30 text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-all"
              />
              <button className="px-8 py-3 bg-white text-emerald-950 font-bold rounded-xl hover:bg-emerald-50 transition-colors shadow-lg hover:shadow-xl">
                Suscribirme
              </button>
            </form>
            <p className="text-xs text-emerald-200/40 mt-4">Sin spam. Date de baja cuando quieras.</p>
          </div>
        </section>

      </main>
    </div>
  );
}