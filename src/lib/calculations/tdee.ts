// src/lib/calculations/tdee.ts
import { BiometricsData } from '@/types/onboarding';

// Valores RMR (Mifflin-St Jeor, más moderno)
const RMR_MALE_FACTOR = 5;
const RMR_FEMALE_FACTOR = -161;

const ACTIVITY_MULTIPLIERS = {
    SEDENTARY: 1.2,
    LIGHTLY_ACTIVE: 1.375,
    MODERATELY_ACTIVE: 1.55,
    VERY_ACTIVE: 1.725,
    EXTREMELY_ACTIVE: 1.9,
};

/**
 * Calcula el Metabolismo Basal (RMR - Resting Metabolic Rate) usando la fórmula de Mifflin-St Jeor.
 */
const calculateRMR = (data: Omit<BiometricsData, 'dateOfBirth'>, age: number): number => {
    const { weight, height, gender } = data;
    const s = gender === 'MALE' ? RMR_MALE_FACTOR : RMR_FEMALE_FACTOR;

    // RMR = (10 * peso_kg) + (6.25 * altura_cm) - (5 * edad) + S
    return (10 * weight) + (6.25 * height) - (5 * age) + s;
};

/**
 * Calcula el Gasto Energético Diario Total (TDEE).
 */
export const calculateTDEE = (
    data: BiometricsData & { 
        activityLevel: keyof typeof ACTIVITY_MULTIPLIERS; 
        dateOfBirth: string | Date; // Necesario para esta lógica de cálculo de edad
    }
): number => {
    
    // FIX 1: Desestructurar las variables necesarias (dateOfBirth y activityLevel)
    const { dateOfBirth, activityLevel } = data; 

    // FIX 2: Reintroducir la lógica de cálculo de edad para que 'dob' y 'ageInYears' estén en ámbito
    const today = new Date();
    const dob = new Date(dateOfBirth);
    const ageInYears = today.getFullYear() - dob.getFullYear();

    // Si la fecha de nacimiento es inválida o el cálculo de edad es < 0, usar una edad segura (ej. 25)
    const safeAge = (isNaN(dob.getTime()) || ageInYears < 0) ? 25 : ageInYears;

    // FIX 3: La variable 'activityLevel' está ahora definida en el ámbito
    const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || ACTIVITY_MULTIPLIERS.SEDENTARY;
    
    // Se usa el objeto de datos BiometricsData para pasar weight/height/gender
    // NOTA: Se asume que 'calculateRMR' está definido y que el tipo de 'data' es BiometricsData.
    return Math.round(calculateRMR(data, safeAge) * multiplier);
};