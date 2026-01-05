// components/ui/layout/dashboard/TrackingWidget.tsx
'use client';

import { useState } from 'react';
import { Flame, Activity, TrendingUp, Scale, Footprints, Edit2, Check, X } from 'lucide-react';
import { useUserMetrics } from '@/hooks/useUserMetrics';

export default function TrackingWidget() {
  const { metrics, isLoading, updateMetric } = useUserMetrics();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');

  const handleEdit = (field: string, currentValue: number) => {
    setEditingField(field);
    setTempValue(currentValue.toString());
  };

  const handleSave = async (field: string) => {
    const numValue = parseFloat(tempValue);
    if (!isNaN(numValue)) {
      await updateMetric(field, numValue);
    }
    setEditingField(null);
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue('');
  };

  if (isLoading) {
    return (
      <div className="w-full h-full p-4">
        <div className="flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-800/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const MetricCard = ({
    icon: Icon,
    label,
    value,
    unit,
    subValue,
    progress,
    editable = false,
    field
  }: {
    icon: any;
    label: string;
    value: number | string;
    unit?: string;
    subValue?: string;
    progress?: number;
    editable?: boolean;
    field?: string;
  }) => {
    const isEditing = editingField === field;

    return (
      <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50 hover:border-slate-600/50 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-emerald-400" />
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              {label}
            </span>
          </div>
          {editable && !isEditing && (
            <button
              onClick={() => handleEdit(field!, value as number)}
              className="p-1 hover:bg-slate-700 rounded transition-colors"
              aria-label="Editar"
            >
              <Edit2 className="w-3.5 h-3.5 text-slate-500" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="min-h-[60px]">
          {isEditing ? (
            // Edit Mode
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-950 border border-emerald-500 rounded text-base text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave(field!);
                  if (e.key === 'Escape') handleCancel();
                }}
              />
              <button
                onClick={() => handleSave(field!)}
                className="p-2 bg-emerald-500 hover:bg-emerald-600 rounded transition-colors"
                aria-label="Guardar"
                title="Guardar (Enter)"
              >
                <Check className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
                aria-label="Cancelar"
                title="Cancelar (Esc)"
              >
                <X className="w-4 h-4 text-slate-300" />
              </button>
            </div>
          ) : (
            // View Mode
            <div className="flex flex-col">
              {/* Main Value */}
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold text-white">
                  {value}
                </span>
                {unit && (
                  <span className="text-sm text-slate-400">
                    {unit}
                  </span>
                )}
              </div>

              {/* Sub Value */}
              {subValue && !progress && (
                <p className="text-xs text-slate-500">
                  {subValue}
                </p>
              )}

              {/* Progress Bar */}
              {progress !== undefined && (
                <div className="mt-2">
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden mb-1">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  {subValue && (
                    <p className="text-xs text-slate-500">
                      {subValue}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full overflow-y-auto p-4">
      <div className="space-y-3">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white mb-1">Seguimiento</h2>
          <p className="text-xs text-slate-400">Métricas y progreso del día</p>
        </div>

        {/* Calorías Hoy */}
        <MetricCard
          icon={Flame}
          label="Calorías"
          value={metrics.caloriesConsumed}
          unit={`/ ${metrics.caloriesTarget}`}
          progress={(metrics.caloriesConsumed / metrics.caloriesTarget) * 100}
        />

        {/* Macros */}
        <MetricCard
          icon={Activity}
          label="Macros"
          value={`${metrics.protein}g`}
          subValue={`C: ${metrics.carbs}g · G: ${metrics.fats}g`}
        />

        {/* TDEE */}
        <MetricCard
          icon={TrendingUp}
          label="TDEE"
          value={metrics.tdee}
          unit="kcal"
        />

        {/* Peso - EDITABLE */}
        <MetricCard
          icon={Scale}
          label="Peso"
          value={metrics.weight}
          unit="kg"
          editable
          field="weight"
        />

        {/* Pasos - EDITABLE */}
        <MetricCard
          icon={Footprints}
          label="Pasos"
          value={metrics.steps.toLocaleString()}
          subValue={`Meta: ${metrics.stepsTarget.toLocaleString()}`}
          progress={(metrics.steps / metrics.stepsTarget) * 100}
          editable
          field="steps"
        />
      </div>
    </div>
  );
}
