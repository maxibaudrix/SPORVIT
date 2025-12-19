// src/components/dashboard/MacrosChart.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatMacros } from '@/lib/utils/formatMacros';

interface MacroData {
  current: number;
  target: number;
  unit: string;
}

interface MacrosChartProps {
  protein: MacroData;
  carbs: MacroData;
  fat: MacroData;
}

const MacroBar = ({ label, data, colorClass }: { label: string, data: MacroData, colorClass: string }) => {
    const percentage = Math.min(100, (data.current / data.target) * 100);
    return (
        <div className="mb-4 last:mb-0">
            <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{label}</span>
                <span className="text-gray-500">{formatMacros(data.current)} / {formatMacros(data.target)}</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-500 ${colorClass}`} 
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export const MacrosChart: React.FC<MacrosChartProps> = ({ protein, carbs, fat }) => {
  return (
    <Card className="shadow-md h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-gray-800">Macronutrientes</CardTitle>
      </CardHeader>
      <CardContent>
        <MacroBar label="Proteínas" data={protein} colorClass="bg-blue-500" />
        <MacroBar label="Carbohidratos" data={carbs} colorClass="bg-green-500" />
        <MacroBar label="Grasas" data={fat} colorClass="bg-yellow-500" />
      </CardContent>
    </Card>
  );
};