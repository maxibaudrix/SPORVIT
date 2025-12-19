// src/lib/calculations/imc.ts

/**
 * Calcula el Índice de Masa Corporal (IMC).
 * @param weightKg - Peso en kilogramos.
 * @param heightCm - Altura en centímetros.
 */
export const calculateIMC = (weightKg: number, heightCm: number): number => {
    if (weightKg <= 0 || heightCm <= 0) return 0;
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
};

export const classifyIMC = (imc: number): string => {
    if (imc < 18.5) return 'Bajo peso';
    if (imc < 25) return 'Peso normal';
    if (imc < 30) return 'Sobrepeso';
    if (imc < 35) return 'Obesidad I';
    if (imc < 40) return 'Obesidad II';
    return 'Obesidad III (Mórbida)';
};