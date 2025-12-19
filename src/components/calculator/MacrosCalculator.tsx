// src/components/calculator/MacrosCalculator.tsx

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useOnboardingStore } from '@/store/onboarding';
import { calculateTDEE } from '@/lib/calculations/tdee';
import { calculateMacros } from '@/lib/calculations/macros';
import type { OnboardingData } from '@/types/onboarding';
import { BiometricsData } from '@/types/onboarding'; // Asumimos que BiometricsData está disponible

// FIX: Tipo local que extiende BiometricsData para incluir la propiedad dateOfBirth requerida.
type BiometricsDataWithDob = BiometricsData & { dateOfBirth: string | Date };

// Mapeo perfecto de tus valores del formulario → valores que espera calculateTDEE
const ACTIVITY_LEVEL_MAP = {
  sedentary: 'SEDENTARY',
  light: 'LIGHTLY_ACTIVE',
  moderate: 'LIGHTLY_ACTIVE', // Corregido el mapeo para evitar ambigüedad si existía
  very_active: 'VERY_ACTIVE',
  extra_active: 'EXTREMELY_ACTIVE',
} as const;

interface MacroItemProps {
  label: string;
  grams: number;
  percentage: number;
}

const MacroItem = ({ label, grams, percentage }: MacroItemProps) => (
  <div className="p-3 rounded-xl bg-slate-800 flex justify-between items-center">
    <div>
      <p className="text-sm font-medium text-white">{label}</p>
      <p className="text-xs text-slate-400">{percentage}% del total</p>
    </div>
    <p className="text-xl font-bold text-blue-300">{Math.round(grams)}g</p>
  </div>
);

export const MacrosCalculator = () => {
  const { data } = useOnboardingStore();
  // El casting es necesario aquí si useOnboardingStore retorna 'any' o un tipo parcial.
  const fullData = data as OnboardingData; 

  // FIX: Usar el nuevo tipo que incluye dateOfBirth.
  const biometrics = fullData.biometrics as BiometricsDataWithDob | undefined;
  const lifestyle = fullData.lifestyle;

  // Validación completa
  if (
    // weeklyTarget existe en lifestyleSchema
    lifestyle?.weeklyTarget === undefined || 
    !biometrics?.height ||
    !biometrics?.weight || 
    !biometrics?.age || 
    !biometrics?.gender || 
    !lifestyle?.activityLevel ||
    !biometrics?.dateOfBirth // La propiedad ahora es conocida por TypeScript
  ) {
    return <p className="text-slate-400">Faltan datos para calcular los macros.</p>;
  }

  // Normalización del activityLevel (El índice es el valor en minúsculas)
  const normalizedActivityLevel = ACTIVITY_LEVEL_MAP[lifestyle.activityLevel as keyof typeof ACTIVITY_LEVEL_MAP];
  
  // Fallback seguro (nunca debería pasar)
  const safeActivityLevel = normalizedActivityLevel || ACTIVITY_LEVEL_MAP.sedentary; 

  // Normalización del goal
  const goalMap: Record<string, 'LOSE_WEIGHT' | 'MAINTAIN' | 'GAIN_MUSCLE'> = {
    lose_weight: 'LOSE_WEIGHT',
    maintain: 'MAINTAIN',
    gain_muscle: 'GAIN_MUSCLE',
  };
  const safeGoal = goalMap[lifestyle.goal] || 'MAINTAIN';

  // Cálculo del TDEE con datos normalizados
  // dateOfBirth ahora es una propiedad conocida y tipada.
  const tdee = calculateTDEE({
    ...biometrics,
    activityLevel: safeActivityLevel,
    dateOfBirth: biometrics.dateOfBirth, // Ya no hay error de propiedad faltante
  });

  // Macros
  const macros = calculateMacros(tdee, safeGoal, lifestyle.weeklyTarget);
  const targetCalories = macros.protein * 4 + macros.carbs * 4 + macros.fat * 9;

  const goalText =
    safeGoal === 'LOSE_WEIGHT' ? 'pérdida de grasa' :
    safeGoal === 'GAIN_MUSCLE' ? 'ganancia muscular' :
    'mantenimiento';

  return (
    <Card className="shadow-lg border-green-600/50">
      <CardHeader>
        <CardTitle className="text-xl">Objetivo de Macronutrientes</CardTitle>
        <CardDescription>
          Distribución óptima para {goalText} • {Math.abs(lifestyle.weeklyTarget)} kg/semana
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center gap-4 p-4 bg-slate-800 rounded-xl">
          <span className="text-lg font-semibold text-slate-300">Meta calórica diaria:</span>
          <span className="text-4xl font-extrabold text-green-400">
            {Math.round(targetCalories)}
          </span>
          <span className="text-lg text-slate-300">kcal</span>
        </div>

        <div className="space-y-3">
          <MacroItem
            label="Proteínas"
            grams={macros.protein}
            percentage={Math.round((macros.protein * 4 / targetCalories) * 100)}
          />
          <MacroItem
            label="Carbohidratos"
            grams={macros.carbs}
            percentage={Math.round((macros.carbs * 4 / targetCalories) * 100)}
          />
          <MacroItem
            label="Grasas"
            grams={macros.fat}
            percentage={Math.round((macros.fat * 9 / targetCalories) * 100)}
          />
        </div>
      </CardContent>
    </Card>
  );
};