// app/(public)/recipes/[slug]/not-found.tsx
import Link from 'next/link';
import { ChefHat, Home, Search } from 'lucide-react';

export default function RecipeNotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-800">
          <ChefHat className="w-12 h-12 text-slate-600" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4 text-white">
          Receta no encontrada
        </h1>
        
        <p className="text-slate-400 mb-8">
          Lo sentimos, no pudimos encontrar la receta que buscas. 
          Puede que haya sido eliminada o que la URL sea incorrecta.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link 
            href="/recipes"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
          >
            <Search className="w-4 h-4" />
            Explorar recetas
          </Link>
          
          <Link 
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
          >
            <Home className="w-4 h-4" />
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}