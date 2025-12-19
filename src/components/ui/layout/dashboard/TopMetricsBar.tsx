// components/ui/layout/dashboard/TopMetricsBar.tsx
'use client';

import { useState, useEffect } from 'react';
import { Flame, Activity, TrendingUp, Scale, Footprints, Edit2, Check, X } from 'lucide-react';
import { useUserMetrics } from '@/hooks/useUserMetrics';

export default function TopMetricsBar() {
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
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-1 h-16 bg-slate-900 rounded-xl animate-pulse" />
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
      <div className="flex-1 bg-slate-900 rounded-xl p-3 border border-slate-800 hover:border-slate-700 transition-colors">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
              <Icon className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              {label}
            </span>
          </div>
          {editable && !isEditing && (
            <button
              onClick={() => handleEdit(field!, value as number)}
              className="p-1 hover:bg-slate-800 rounded transition-colors"
            >
              <Edit2 className="w-3 h-3 text-slate-500" />
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="flex-1 px-2 py-1 bg-slate-950 border border-emerald-500 rounded text-sm text-white focus:outline-none"
              autoFocus
            />
            <button
              onClick={() => handleSave(field!)}
              className="p-1 bg-emerald-500 hover:bg-emerald-600 rounded transition-colors"
            >
              <Check className="w-3 h-3 text-white" />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
            >
              <X className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">{value}</span>
              {unit && <span className="text-sm text-slate-400">{unit}</span>}
            </div>
            {subValue && (
              <p className="text-xs text-slate-500 mt-1">{subValue}</p>
            )}
            {progress !== undefined && (
              <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-3">
      <div className="flex items-center gap-4">
        {/* Calorías Hoy */}
        <MetricCard
          icon={Flame}
          label="Calorías Hoy"
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
          subValue="Dinámico"
        />

        {/* Peso */}
        <MetricCard
          icon={Scale}
          label="Peso"
          value={metrics.weight}
          unit="kg"
          editable
          field="weight"
        />

        {/* Pasos */}
        <MetricCard
          icon={Footprints}
          label="Pasos"
          value={metrics.steps.toLocaleString()}
          subValue={`Objetivo: ${metrics.stepsTarget.toLocaleString()}`}
          progress={(metrics.steps / metrics.stepsTarget) * 100}
          editable
          field="steps"
        />
      </div>
    </div>
  );
}