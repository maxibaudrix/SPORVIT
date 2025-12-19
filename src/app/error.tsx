'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">
          Algo salió mal
        </h1>
        
        <p className="text-slate-400 mb-6">
          {error.message || 'Ha ocurrido un error inesperado'}
        </p>
        
        <div className="flex gap-3 justify-center">
          <Button onClick={() => reset()} variant="default">
            Intentar de nuevo
          </Button>
          <Button onClick={() => window.location.href = '/'} variant="secondary">
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
}
