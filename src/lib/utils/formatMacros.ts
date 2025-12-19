// src/utils/formatMacros.ts

/**
 * Formatea un valor numérico de macronutriente (ej: 50.5g) y añade 'g'.
 * @param value - Valor numérico del macronutriente en gramos.
 * @param decimals - Número de decimales a mostrar.
 * @returns El valor formateado con 'g' al final.
 */
export const formatMacros = (value: number, decimals: number = 0): string => {
    // Usar Intl.NumberFormat para formatear el número con localización y decimales fijos.
    const formatted = new Intl.NumberFormat('es-ES', { 
        minimumFractionDigits: decimals, 
        maximumFractionDigits: decimals 
    }).format(value);

    // FIX: Añadir 'g' para indicar gramos, asumiendo que es una macro.
    return `${formatted}g`;
};