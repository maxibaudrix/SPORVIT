// Esquemas de validación Zod para el proceso de Onboarding
import { z } from 'zod';

// Importamos las constantes definidas por el usuario
import { ACTIVITY_LEVELS, GOALS } from '../constants/onboarding';

// Definición de tipos helper (necesarias para la aserción de z.enum)
type ActivityLevelForm = keyof typeof ACTIVITY_LEVELS;
type GoalForm = keyof typeof GOALS;

// Extraemos los valores de las constantes para usarlos directamente en Zod.enum
// Usamos Object.values() para obtener un array de los literales de string en minúsculas.
const ActivityLevelLiterals = Object.values(ACTIVITY_LEVELS);
const FitnessGoalLiterals = Object.values(GOALS);

// --- Esquemas de Pasos ---

export const BiometricsSchema = z.object({
    // Mantenemos la convención de minúsculas para consistencia con el formulario,
    // asumiendo que el componente Biometrics (Step 1) usa 'male', 'female', etc.
    gender: z.enum(['male', 'female', 'other'], { 
        required_error: 'El género es requerido.',
    }),
    dateOfBirth: z.string().refine(date => {
        const d = new Date(date);
        // Validar que sea una fecha válida y que no sea futura
        return !isNaN(d.getTime()) && d < new Date();
    }, {
        message: 'Fecha de nacimiento inválida o futura.',
    }),
    heightCm: z.number().int().min(50, 'Altura mínima: 50 cm.').max(250, 'Altura máxima: 250 cm.'),
    weightKg: z.number().min(30, 'Peso mínimo: 30 kg.').max(300, 'Peso máximo: 300 kg.'),
});

export const GoalSchema = z.object({
    // Usamos los literales importados que están en minúsculas
    activityLevel: z.enum(ActivityLevelLiterals as [ActivityLevelForm, ...ActivityLevelForm[]], {
        required_error: 'El nivel de actividad es requerido.',
    }),
    // Usamos los literales importados que están en minúsculas
    goal: z.enum(FitnessGoalLiterals as [GoalForm, ...GoalForm[]], {
        required_error: 'El objetivo es requerido.',
    }),
    targetWeightKg: z.number().min(30, 'Peso objetivo mínimo: 30 kg.').max(300, 'Peso objetivo máximo: 300 kg.'),
    weeklyGoalKg: z.number().min(-1.5, 'Meta semanal mínima: -1.5 kg.').max(1, 'Meta semanal máxima: 1 kg.'),
});

export const DietSchema = z.object({
    // dietType puede ser un enum o string, dependiendo de tu implementación del componente Select
    dietType: z.enum(['NONE', 'VEGETARIAN', 'VEGAN', 'PALEO', 'KETO'], {
        required_error: 'El tipo de dieta es requerido.',
    }),
    // ¡CORRECCIÓN! Usamos 'allergens' y 'restrictions' para coincidir con el formulario
    // Y validamos como 'string' ya que el input devuelve una cadena, no un array.
    allergens: z.string().optional(),
    restrictions: z.string().optional(),
});

/**
 * Esquema completo del flujo de Onboarding.
 */
export const OnboardingSchema = BiometricsSchema.and(GoalSchema).and(DietSchema);

export type OnboardingFormSchema = z.infer<typeof OnboardingSchema>;