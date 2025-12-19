// src/lib/calculations.ts
// Funciones centrales de cálculo para IMC, TDEE (Gasto Energético Total Diario) y macros.

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extra_active';
export type Gender = 'male' | 'female';
export type Formula = 'harris-benedict' | 'mifflin-st-jeor';

/**
 * Calcula el Índice de Masa Corporal (IMC).
 * @param weightKg - Peso en kilogramos.
 * @param heightCm - Altura en centímetros.
 * @returns El valor del IMC.
 */
export function calculateIMC(weightKg: number, heightCm: number): number {
  if (heightCm <= 0 || weightKg <= 0) return 0;
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

/**
 * Calcula el Gasto Energético Basal (GEB) o Metabolismo Basal (MBR).
 * Utiliza la fórmula de Mifflin-St Jeor (la más recomendada actualmente).
 * @param weightKg - Peso en kilogramos.
 * @param heightCm - Altura en centímetros.
 * @param age - Edad en años.
 * @param gender - Género ('male' o 'female').
 * @param formula - Fórmula a utilizar.
 * @returns Las calorías de GEB.
 */
export function calculateBMR(weightKg: number, heightCm: number, age: number, gender: Gender, formula: Formula = 'mifflin-st-jeor'): number {
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) return 0;

  let bmr: number;

  if (formula === 'harris-benedict') {
    // Harris-Benedict (Revisada)
    if (gender === 'male') {
      // Hombres: (13.397 x peso) + (4.799 x altura) - (5.677 x edad) + 88.362
      bmr = (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * age) + 88.362;
    } else {
      // Mujeres: (9.247 x peso) + (3.098 x altura) - (4.330 x edad) + 447.593
      bmr = (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * age) + 447.593;
    }
  } else {
    // Mifflin-St Jeor (Por defecto)
    if (gender === 'male') {
      // Hombres: (10 x peso) + (6.25 x altura) - (5 x edad) + 5
      bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
    } else {
      // Mujeres: (10 x peso) + (6.25 x altura) - (5 x edad) - 161
      bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
    }
  }

  return Math.round(bmr);
}

/**
 * Calcula el Gasto Energético Total Diario (TDEE).
 * @param bmr - Calorías de Metabolismo Basal.
 * @param activityLevel - Nivel de actividad.
 * @returns Las calorías de TDEE.
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const multipliers: { [key in ActivityLevel]: number } = {
    sedentary: 1.2,           // Sedentario (poco o ningún ejercicio)
    light: 1.375,             // Ligero (ejercicio ligero/deporte 1-3 días/semana)
    moderate: 1.55,           // Moderado (ejercicio moderado/deporte 3-5 días/semana)
    very_active: 1.725,       // Muy activo (ejercicio duro/deporte 6-7 días/semana)
    extra_active: 1.9,        // Extremadamente activo (ejercicio duro + trabajo físico o 2x/día)
  };

  const multiplier = multipliers[activityLevel] || 1.2;
  return Math.round(bmr * multiplier);
}

/**
 * Calcula las macros para un objetivo calórico.
 * Los porcentajes son un ejemplo estándar para mantenimiento (40P/30C/30F).
 * @param targetCalories - Calorías objetivo.
 * @returns Un objeto con gramos de Proteínas, Carbohidratos y Grasas.
 */
export function calculateMacros(targetCalories: number, proteinPct: number = 0.40, carbPct: number = 0.30, fatPct: number = 0.30) {
  // Conversión: 1g Proteína = 4 kcal, 1g Carbohidrato = 4 kcal, 1g Grasa = 9 kcal
  
  const proteinCals = targetCalories * proteinPct;
  const carbCals = targetCalories * carbPct;
  const fatCals = targetCalories * fatPct;

  return {
    proteinGrams: Math.round(proteinCals / 4),
    carbGrams: Math.round(carbCals / 4),
    fatGrams: Math.round(fatCals / 9),
  };
}