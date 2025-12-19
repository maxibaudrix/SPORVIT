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
        <span className="text-xs text-red-300 ml-2" title={error}>
          ⚠️
        </span>
      )}
    </div>
  );
}