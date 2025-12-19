// src/lib/calculations/macros.ts

interface MacroResult { 
    protein: number; 
    fat: number; 
    carbs: number; 
}

/**
 * Calcula la distribución de macronutrientes (en gramos) basada en el TDEE y los objetivos.
 * @param tdee - Gasto Energético Diario Total.
 * @param goal - Objetivo: 'LOSE_WEIGHT', 'MAINTAIN', 'GAIN_MUSCLE'.
 * @param weeklyGoalKg - Objetivo de peso semanal en kg (ej: -0.5 para perder, 0.25 para ganar).
 * @returns { protein, fat, carbs } en gramos.
 */
export const calculateMacros = (
    tdee: number, 
    goal: 'LOSE_WEIGHT' | 'MAINTAIN' | 'GAIN_MUSCLE', 
    weeklyGoalKg: number // ⬅️ AÑADIDO: Usa el objetivo semanal
): MacroResult => {
    
    // --- 1. CÁLCULO DE CALORÍAS OBJETIVO ---
    
    let caloriesTarget = tdee;
    
    // Solo se aplica ajuste si el objetivo no es MANTENIMIENTO
    if (goal !== 'MAINTAIN') {
        // Cálculo del ajuste diario de calorías: (Objetivo semanal en kg * 7700 kcal/kg) / 7 días
        const dailyAdjustment = (weeklyGoalKg * 7700) / 7;
        caloriesTarget += dailyAdjustment;
    }
    
    // Asegurar que las calorías objetivo no caigan por debajo de un mínimo seguro (ej. 1200 kcal)
    caloriesTarget = Math.max(1200, caloriesTarget);

    // --- 2. ASIGNACIÓN DE RATIOS DE MACROS ---
    
    // Ratios por defecto (Mantenimiento/Pérdida de peso): P:25%, C:45%, F:30%
    let proteinRatio = 0.25; 
    let fatRatio = 0.30;
    let carbsRatio = 0.45;

    if (goal === 'GAIN_MUSCLE') {
        // Aumentar Proteína y Carbohidratos para la ganancia muscular
        proteinRatio = 0.35; 
        carbsRatio = 0.35; // 0.35 + 0.30 (grasa) + 0.35 = 1.00
    }

    // --- 3. CONVERSIÓN A GRAMOS ---
    
    const proteinCal = caloriesTarget * proteinRatio;
    const fatCal = caloriesTarget * fatRatio;
    const carbsCal = caloriesTarget * carbsRatio;

    // Conversión a gramos (P/C: 4 kcal/g, F: 9 kcal/g)
    return {
        protein: Math.round(proteinCal / 4),
        fat: Math.round(fatCal / 9),
        carbs: Math.round(carbsCal / 4),
    };
};