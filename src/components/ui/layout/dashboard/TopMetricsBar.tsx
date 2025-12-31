// components/ui/layout/dashboard/TopMetricsBar.tsx
'use client';

import { useState } from 'react';
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
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-1 h-[68px] bg-slate-900 rounded-lg animate-pulse" />
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
      <div className="flex-1 bg-slate-900/50 rounded-lg p-2 border border-slate-800/50 hover:border-slate-700/50 transition-colors h-[68px] flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <Icon className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider truncate">
              {label}
            </span>
          </div>
          {editable && !isEditing && (
            <button
              onClick={() => handleEdit(field!, value as number)}
              className="p-0.5 hover:bg-slate-800 rounded transition-colors flex-shrink-0"
            >
              <Edit2 className="w-2.5 h-2.5 text-slate-500" />
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="flex items-center gap-1.5 mt-auto">
            <input
              type="number"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="flex-1 px-1.5 py-0.5 bg-slate-950 border border-emerald-500 rounded text-xs text-white focus:outline-none"
              autoFocus
            />
            <button
              onClick={() => handleSave(field!)}
              className="p-0.5 bg-emerald-500 hover:bg-emerald-600 rounded transition-colors flex-shrink-0"
            >
              <Check className="w-2.5 h-2.5 text-white" />
            </button>
            <button
              onClick={handleCancel}
              className="p-0.5 bg-slate-800 hover:bg-slate-700 rounded transition-colors flex-shrink-0"
            >
              <X className="w-2.5 h-2.5 text-slate-400" />
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between min-h-0">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-white leading-none truncate">{value}</span>
              {unit && <span className="text-[10px] text-slate-400 flex-shrink-0">{unit}</span>}
            </div>
            {subValue && (
              <p className="text-[9px] text-slate-500 leading-tight truncate">{subValue}</p>
            )}
            {progress !== undefined && (
              <div className="mt-auto pt-1.5">
                <div className="h-0.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-stretch gap-3">
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
            subValue={`${metrics.stepsTarget.toLocaleString()}`}
            progress={(metrics.steps / metrics.stepsTarget) * 100}
            editable
            field="steps"
          />
        </div>
      </div>
    </div>
  );
}