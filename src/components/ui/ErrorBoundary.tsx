'use client';

import * as React from 'react';
import { AlertTriangle, Home, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/Button'; 

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Componente de React Boundary para capturar errores de JavaScript en su árbol de componentes hijo.
 * Muestra una UI de fallback y es esencial para la robustez Client-Side.
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { 
      hasError: true, 
      error: error,
      errorInfo: null 
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Aquí puedes registrar el error en un servicio de logging (ej: Sentry)
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }
  
  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  }

  render() {
    if (this.state.hasError) {
      // UI de Fallback
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
          <div className="text-center max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">
              Error en la Aplicación
            </h1>
            
            <p className="text-slate-400 mb-6">
              Ha ocurrido un error inesperado. Intenta recargar o volver al inicio.
            </p>

            <details className="text-left p-3 my-4 bg-slate-800 rounded-lg text-slate-400 text-xs max-h-32 overflow-y-auto">
                <summary className='cursor-pointer text-white'>Detalles del Error (Dev)</summary>
                <p className="mt-2 whitespace-pre-wrap break-words">
                    {this.state.error?.toString() || 'Error desconocido'}
                </p>
            </details>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={this.resetError} variant="default">
                <RotateCw className="w-4 h-4 mr-2" />
                Recargar Componente
              </Button>
              <Button asChild variant="secondary">
                <a href="/">
                    <Home className="w-4 h-4 mr-2" />
                    Ir al Inicio
                </a>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}