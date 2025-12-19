// src/components/calculator/TDEECalculator.tsx
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useOnboardingStore } from '@/store/onboarding';
import { calculateTDEE } from '@/lib/calculations';

export const TDEECalculator = () => {
    const { data } = useOnboardingStore();
    
    // Comprobar que hay datos necesarios
    if (!data.weightKg || !data.activityLevel) {
        return <p className="text-slate-400">Faltan datos para calcular TDEE.</p>;
    }

    // Llamada a la función de cálculo (asumiendo 2 parámetros: peso y nivel de actividad)
    const tdeeResult = calculateTDEE(data.weightKg, data.activityLevel);

    return (
        <Card className="shadow-lg border-blue-600/50">
            <CardHeader>
                <CardTitle className="text-xl">Gasto Calórico Diario Total (TDEE)</CardTitle>
                <CardDescription>Esta es la energía que quemas diariamente.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="text-5xl font-extrabold text-blue-400">
                        {Math.round(tdeeResult)}
                    </p>
                    <p className="text-lg text-slate-300">Calorías / día</p>
                </div>
            </CardContent>
        </Card>
    );
};
