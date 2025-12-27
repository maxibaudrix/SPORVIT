// src/components/training/TimerErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle, RotateCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class TimerErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log error to monitoring service (Sentry, LogRocket, etc.)
    console.error('Timer Error:', error, errorInfo);
    
    // Optional: Send to analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false,
      });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 rounded-3xl p-8 border border-slate-800 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-3">
              Algo salió mal
            </h2>
            
            <p className="text-slate-400 mb-6">
              El cronómetro encontró un problema. No te preocupes, tus datos están seguros.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-slate-950 rounded-xl text-left">
                <p className="text-xs text-red-400 font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
            >
              <RotateCw className="w-5 h-5" />
              Reiniciar Cronómetro
            </button>

            <a
              href="/dashboard"
              className="block mt-4 text-sm text-slate-400 hover:text-white transition-colors"
            >
              Volver al Dashboard
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}