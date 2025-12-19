
// src/components/calculator/IMCCalculator.tsx
// Componente de demostración o visualización de cálculo de IMC

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useOnboardingStore } from '@/store/onboarding';
import { calculateIMC } from '@/lib/calculations'; // Asumimos esta función existe en Fase 5

const IMCCalculator = () => {
    const { data } = useOnboardingStore();
    
    if (!data.heightCm || !data.weightKg) {
        return null; // No mostrar si faltan datos
    }

    const imc = calculateIMC(data.heightCm, data.weightKg);

    const getStatus = (imc: number) => {
        if (imc < 18.5) return { label: "Bajo Peso", color: "text-yellow-400" };
        if (imc < 25) return { label: "Peso Normal", color: "text-green-400" };
        if (imc < 30) return { label: "Sobrepeso", color: "text-orange-400" };
        return { label: "Obesidad", color: "text-red-400" };
    };

    const status = getStatus(imc);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Índice de Masa Corporal (IMC)</CardTitle>
                <CardDescription>Medición de tu peso en relación a tu altura.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="text-5xl font-extrabold text-white">
                        {imc.toFixed(1)}
                    </p>
                    <p className={`text-lg font-bold ${status.color}`}>{status.label}</p>
                </div>
            </CardContent>
        </Card>
    );
};
export default IMCCalculator;
