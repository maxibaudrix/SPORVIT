import React from 'react';
import { CheckCircle2, Clock, XCircle, Loader2 } from 'lucide-react';
import type { WeekGenerationStatus } from '@/types/planning';

type StatusConfig = {
  icon: any;
  color: string;
  bg: string;
  label: string;
  animate?: boolean;
};

interface Props {
  weekNumber: number;
  status: WeekGenerationStatus;
  error?: string;
}

export function WeekStatusIndicator({ weekNumber, status, error }: Props) {
  const statusConfig: Record<WeekGenerationStatus, StatusConfig> = {
    generated: {
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      label: 'Lista',
    },
    generating: {
      icon: Loader2,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      label: 'Generando...',
      animate: true,
    },
    pending: {
      icon: Clock,
      color: 'text-slate-400',
      bg: 'bg-slate-500/10',
      label: 'Pendiente',
    },
    error: {
      icon: XCircle,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      label: 'Error',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${config.bg}`}>
      <Icon 
        className={`w-4 h-4 ${config.color} ${'animate' in config && config.animate ? 'animate-spin' : ''}`}
      />
      <span className={`text-sm font-medium ${config.color}`}>
        Semana {weekNumber}: {config.label}
      </span>
      {error && (
        <>
          <span className="text-xs text-red-300 ml-2" title={error}>
            ⚠️
          </span>
          <button
            onClick={() => handleRetry(weekNumber)}
            className="ml-auto text-xs px-2 py-1 bg-red-500/20 hover:bg-red-500/30 rounded text-red-300 transition-colors"
            title="Reintentar generación"
          >
            Reintentar
          </button>
        </>
      )}
    </div>
  );
}

// Función helper para reintentar generación
async function handleRetry(weekNumber: number) {
  try {
    const response = await fetch('/api/planning/retry-week', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weekNumber }),
    });

    if (response.ok) {
      alert(`Reintentando generación de semana ${weekNumber}...`);
      window.location.reload();
    } else {
      const data = await response.json();
      alert(`Error: ${data.error || 'No se pudo reintentar'}`);
    }
  } catch (error) {
    console.error('Retry error:', error);
    alert('Error de conexión. Intenta de nuevo.');
  }
}