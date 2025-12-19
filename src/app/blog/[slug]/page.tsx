// src/app/blog/[slug]/page.tsx
import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPost, getRelatedPosts } from '@/lib/cms';
import { 
  Clock, Calendar, ChevronLeft, Share2, Bookmark, 
  Twitter, Facebook, Linkedin, Link as LinkIcon 
} from 'lucide-react';

interface PageProps {
  params: { slug: string };
}

// --- Generación Dinámica de Metadatos (SEO) ---
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  
  if (!post) return { title: 'Artículo no encontrado' };

  return {
    title: `${post.title} | Sporvit Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
      type: 'article',
      authors: [post.author.name],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.slug);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans pb-20">
      
      {/* --- PROGRESS BAR (Sticky) --- */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-slate-900">
        <div className="h-full bg-emerald-500 w-full origin-left scale-x-0 animate-progress"></div>
        {/* Nota: La animación de progreso real requiere un hook de cliente 'useScroll', omitido para simplicidad del servidor */}
      </div>

      {/* --- NAV HEADER --- */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 transition-all">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/blog" className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            {/* Breadcrumbs simplificados */}
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <Link href="/blog" className="text-slate-500 hover:text-slate-300">Blog</Link>
              <span className="text-slate-700">/</span>
              <Link href={`/blog?category=${post.category}`} className="text-slate-500 hover:text-emerald-400">{post.category}</Link>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-emerald-400 transition-colors" aria-label="Guardar">
              <Bookmark className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-emerald-400 transition-colors" aria-label="Compartir">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-6xl pt-10">
        
        {/* --- ARTICLE HEADER --- */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6 animate-in fade-in slide-in-from-bottom-2">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-full uppercase tracking-wider">
              {post.category}
            </span>
            <span className="text-slate-500 text-xs font-medium flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {post.date}
            </span>
            <span className="text-slate-500 text-xs font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" /> {post.readTime} lectura
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-white animate-in fade-in slide-in-from-bottom-4 delay-100">
            {post.title}
          </h1>
          
          <p className="text-xl text-slate-400 leading-relaxed animate-in fade-in slide-in-from-bottom-4 delay-200">
            {post.excerpt}
          </p>
        </div>

        {/* --- HERO IMAGE --- */}
        <div className="mb-16 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/20 border border-slate-800 aspect-video relative animate-in zoom-in-95 duration-700">
          <img 
            src={post.coverImage} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* --- SIDEBAR IZQUIERDA (Social Share - Desktop) --- */}
          <div className="hidden lg:block col-span-2">
            <div className="sticky top-24 space-y-8 flex flex-col items-center">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest writing-vertical-lr transform rotate-180">Compartir</p>
              <div className="flex flex-col gap-3">
                <button className="p-3 bg-slate-900/50 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-all"><Twitter className="w-5 h-5" /></button>
                <button className="p-3 bg-slate-900/50 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-all"><Facebook className="w-5 h-5" /></button>
                <button className="p-3 bg-slate-900/50 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-all"><Linkedin className="w-5 h-5" /></button>
                <button className="p-3 bg-slate-900/50 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-all"><LinkIcon className="w-5 h-5" /></button>
              </div>
            </div>
          </div>

          {/* --- CONTENIDO PRINCIPAL --- */}
          <div className="col-span-12 lg:col-span-7">
            {/* Renderizado de MDX/HTML simulado */}
            {/* En producción usarías <MDXRemote source={post.content} /> */}
            <article className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-emerald-400 hover:prose-a:text-emerald-300 prose-strong:text-white prose-blockquote:border-l-emerald-500 prose-blockquote:bg-slate-900/50 prose-blockquote:py-2 prose-blockquote:px-6 prose-img:rounded-2xl">
               {/* Renderizar saltos de línea como párrafos para la demo básica */}
               {post.content.split('\n').map((paragraph, i) => {
                 if (paragraph.trim().startsWith('##')) return <h2 key={i} id={`heading-${i}`}>{paragraph.replace('##', '')}</h2>;
                 if (paragraph.trim()) return <p key={i}>{paragraph}</p>;
                 return null;
               })}
            </article>

            {/* Author Box */}
            <div className="mt-16 p-8 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="relative">
                <img src={post.author.image} alt={post.author.name} className="w-20 h-20 rounded-full border-2 border-emerald-500 object-cover" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{post.author.name}</h3>
                <p className="text-emerald-400 text-sm font-medium mb-3">{post.author.role}</p>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {post.author.bio}
                </p>
                {post.author.social.twitter && (
                  <a href={`https://twitter.com/${post.author.social.twitter}`} className="text-xs text-slate-500 hover:text-white transition-colors">
                    Seguir en Twitter
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* --- SIDEBAR DERECHA (TOC & CTA) --- */}
          <div className="hidden lg:block col-span-3">
            <div className="sticky top-24 space-y-8">
              {/* Table of Contents (Simulado) */}
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">En este artículo</h4>
                <nav className="space-y-1 border-l border-slate-800">
                  {/* En producción, esto se genera dinámicamente del MDX */}
                  <a href="#" className="block pl-4 py-2 text-sm text-emerald-400 border-l-2 border-emerald-500 bg-emerald-500/5">Introducción</a>
                  <a href="#" className="block pl-4 py-2 text-sm text-slate-400 hover:text-white hover:border-l-2 hover:border-slate-600 transition-all">Puntos Clave</a>
                  <a href="#" className="block pl-4 py-2 text-sm text-slate-400 hover:text-white hover:border-l-2 hover:border-slate-600 transition-all">Conclusión</a>
                </nav>
              </div>

              {/* CTA Widget */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-900/40 to-slate-900 border border-emerald-500/20 text-center shadow-lg">
                <p className="text-sm font-bold text-white mb-2">¿Te ha gustado?</p>
                <p className="text-xs text-slate-400 mb-4">Lleva tu nutrición al siguiente nivel con la IA de Sporvit.</p>
                <Link href="/onboarding" className="block w-full py-2.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-emerald-400 transition-colors">
                  Empezar Gratis
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* --- RELATED POSTS --- */}
        <section className="mt-24 pt-12 border-t border-slate-900">
          <h3 className="text-2xl font-bold mb-8 text-white">También te puede interesar</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((rel) => (
              <Link key={rel.slug} href={`/blog/${rel.slug}`} className="group bg-slate-900/30 rounded-xl border border-slate-800 hover:border-slate-700 overflow-hidden transition-all">
                <div className="h-32 overflow-hidden">
                  <img src={rel.coverImage} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-4">
                  <p className="text-xs text-emerald-400 font-bold mb-2">{rel.category}</p>
                  <h4 className="font-bold text-white group-hover:text-emerald-400 transition-colors text-sm line-clamp-2">
                    {rel.title}
                  </h4>
                </div>
              </Link>
            ))}
            {relatedPosts.length === 0 && (
              <p className="text-slate-500 text-sm col-span-3 text-center">No hay artículos relacionados por el momento.</p>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}