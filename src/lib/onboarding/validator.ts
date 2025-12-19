// src/lib/onboarding/validator.ts

import { z } from 'zod';

// Esquemas de cada paso (basados en step3.tsx, step4.tsx, step5.tsx y mockOnboardingData de step6.tsx)

// --- ESQUEMA DE BIOMETRÍA Y OBJETIVO (Pasos 1 y 2) ---
export const BiometricsSchema = z.object({
    age: z.number().int().min(18).max(100),
    gender: z.enum(['male', 'female', 'other']),
    weight: z.number().positive(), // en kg
    height: z.number().positive(), // en cm
    bodyFatPercentage: z.number().min(5).max(50).optional(), // 5-50%
});

export const ObjectiveSchema = z.object({
    primaryGoal: z.enum(['performance', 'weightloss', 'maintenance']),
    targetTimeline: z.number().int().min(4).max(52), // Semanas
    targetDate: z.string().optional(), // ISO date string
    hasCompetition: z.boolean().optional(),
    motivation: z.string().max(500).optional(),
});

// --- ESQUEMA DE ACTIVIDAD (Paso 3) ---
export const ActivitySchema = z.object({
    country: z.string().min(2).max(2), // ej. 'ES'
    dailyActivityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
    dailySteps: z.enum(['<5k', '6k-10k', '>10k']).optional(),
    sittingHours: z.enum(['<4h', '4h-8h', '>8h']).optional(),
    workType: z.enum(['sedentary', 'active', 'hybrid']).optional(),
    availableDays: z.array(z.string()), // ['monday', 'tuesday', ...]
    preferredTimes: z.array(z.string()), // ['morning', 'afternoon', 'evening']
});

// --- ESQUEMA DE ENTRENAMIENTO (Paso 4) ---
export const TrainingSchema = z.object({
    experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
    sportType: z.enum(['strength', 'running', 'cycling', 'triathlon', 'swimming']),
    sportSubtype: z.string().optional(), // ej. 'Marathon', 'Olympic'
    daysPerWeek: z.number().int().min(1).max(7),
    sessionDuration: z.number().int().min(30).max(240), // Minutos
    trainingLocation: z.array(z.string()).min(1), // ['gym', 'outdoor', ...]
    availableEquipment: z.array(z.string()).optional(), // ['dumbbells', 'road_bike', ...]
    hasInjuries: z.boolean(),
    injuryDetails: z.string().max(500).optional(),
    
    // Campos de rendimiento opcionales
    runPaceZ2: z.string().optional(), // '5:30'
    ftpWatts: z.number().int().optional(),
    swim100mPace: z.string().optional(), // '1:45'
});

// --- ESQUEMA DE NUTRICIÓN (Paso 5) ---
export const NutritionSchema = z.object({
    dietType: z.enum(['omnivore', 'vegetarian', 'vegan', 'keto', 'paleo']),
    mealsPerDay: z.enum(['3', '4', '5+']),
    allergies: z.array(z.string()).optional(), // Lista de alérgenos
    intolerances: z.array(z.string()).optional(),
    excludedFoods: z.array(z.string()).optional(),
    cookingFrequency: z.enum(['daily', 'few_times_week', 'rarely']),
    mealComplexity: z.enum(['simple', 'moderate', 'complex']),
    alcoholConsumption: z.enum(['none', 'social', 'daily']),
});


// --- ESQUEMA COMPLETO PARA EL ENDPOINT submit/route.ts ---
export const OnboardingSubmitSchema = z.object({
    biometrics: BiometricsSchema,
    objective: ObjectiveSchema,
    activity: ActivitySchema,
    training: TrainingSchema,
    nutrition: NutritionSchema,
});

// --- ESQUEMA PARA EL ENDPOINT calculate/route.ts ---
export const OnboardingCalculatorInputSchema = z.object({
    // Biometrics y Objective deben ir completos para el cálculo.
    biometrics: BiometricsSchema,
    objective: ObjectiveSchema,
    
    // Corregido: Creamos un objeto que solo contenga los campos necesarios
    activity: z.object({
        dailyActivityLevel: ActivitySchema.shape.dailyActivityLevel,
    }),
    training: z.object({
        daysPerWeek: TrainingSchema.shape.daysPerWeek,
    }),
});

export type OnboardingCalculatorInput = z.infer<typeof OnboardingCalculatorInputSchema>;
export type OnboardingSubmitInput = z.infer<typeof OnboardingSubmitSchema>;