'use client'
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-bold text-white mb-2">
          Página no encontrada
        </h2>
        
        <p className="text-slate-400 mb-6">
          La página que buscas no existe o ha sido movida.
        </p>
        
        <div className="flex gap-3 justify-center">
          <Button asChild variant="default">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Ir al inicio
            </Link>
          </Button>
          <Button onClick={() => window.history.back()} variant="secondary">
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
