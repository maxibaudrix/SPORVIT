// src/components/dashboard/CaloriesSummary.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/Progress';
import { Flame, Utensils, Target } from 'lucide-react';
import { calculateBalance } from '@/lib/utils/calculateBalance';

interface CaloriesSummaryProps {
  consumed: number;
  burned: number; // Ejercicio
  target: number; // TDEE + Goal
}

export const CaloriesSummary: React.FC<CaloriesSummaryProps> = ({ consumed, burned, target }) => {
  const { net, remaining, progress } = calculateBalance(consumed, burned, target);

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-gray-800 flex justify-between">
            <span>Resumen Calórico</span>
            <span className="text-sm font-normal text-gray-500">Meta: {target}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-2 text-sm">
            <span className="text-gray-600">Neto: <span className="font-bold text-gray-900">{net}</span></span>
            <span className="text-blue-600 font-medium">{remaining > 0 ? `Faltan ${remaining}` : `Exceso ${Math.abs(remaining)}`}</span>
        </div>
        
        <Progress value={progress} className="h-3 mb-6" />

        <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                <div className="bg-orange-200 p-2 rounded-full text-orange-700">
                    <Utensils size={18} />
                </div>
                <div>
                    <p className="text-xs text-gray-500">Consumidas</p>
                    <p className="font-bold text-gray-800">{consumed}</p>
                </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                <div className="bg-red-200 p-2 rounded-full text-red-700">
                    <Flame size={18} />
                </div>
                <div>
                    <p className="text-xs text-gray-500">Quemadas</p>
                    <p className="font-bold text-gray-800">{burned}</p>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};