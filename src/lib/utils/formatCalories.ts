// src/utils/formatCalories.ts

/**
 * Formatea un valor numérico de calorías a una cadena legible (ej: 250 kcal).
 */
export const formatCalories = (calories: number, includeUnit: boolean = true): string => {
    // Usar es-ES para formato de miles
    const formatted = Math.round(calories).toLocaleString('es-ES');
    return includeUnit ? `${formatted} kcal` : formatted;
};