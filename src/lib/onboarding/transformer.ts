// src/lib/onboarding/transformer.ts

import { OnboardingSubmitInput } from '@/lib/onboarding/validator';
// Importamos solo el namespace Prisma
import type { Prisma } from '@prisma/client'; 

// Define el tipo de salida para la función de transformación usando el namespace Prisma
interface TransformedData {
    // Usamos Prisma.ModelNameGetPayload para obtener el tipo exacto del modelo
    userProfileData: Omit<Prisma.UserProfileGetPayload<{}>, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
    userGoalsData: Omit<Prisma.UserGoalsGetPayload<{}>, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'targetCalories' | 'targetProteinG' | 'targetCarbsG' | 'targetFatG' | 'bmr' | 'tdee'>;
    onboardingDataRecord: Omit<Prisma.OnboardingDataGetPayload<{}>, 'id' | 'createdAt' | 'updatedAt'>;
}

/**
 * Transforma los datos brutos del formulario de onboarding en la estructura
 * necesaria para ser guardada en los modelos de Prisma.
 * * @param userId El ID del usuario actual.
 * @param data Los datos validados del formulario.
 * @returns Un objeto con los datos listos para los modelos UserProfile, UserGoals y OnboardingData.
 */
export function transformOnboardingData(userId: string, data: OnboardingSubmitInput): TransformedData {
    const { biometrics, objective, activity, training, nutrition } = data;
    
    // --- 1. UserProfile (Biometrics & Training Summary) ---
    const userProfileData: TransformedData['userProfileData'] = {
        age: biometrics.age,
        gender: biometrics.gender,
        heightCm: biometrics.height,
        currentWeight: biometrics.weight,
        bodyFatPercentage: biometrics.bodyFatPercentage,
        
        // Activity & Training Summary
        activityLevel: activity.dailyActivityLevel,
        workoutDaysPerWeek: training.daysPerWeek,
        
        // Activity details (mapeo directo)
        dailySteps: activity.dailySteps || null,
        sittingHours: activity.sittingHours || null,
        workType: activity.workType || null,
        
        // Training Level
        trainingLevel: training.experienceLevel,
        trainingTypes: training.sportType, // Almacenamos el sportType principal
        sessionDuration: training.sessionDuration,
        intensity: training.experienceLevel, // Usamos experienceLevel como proxy de intensidad
    };
    
    // --- 2. UserGoals (Objetivos y Preferencias Nutricionales) ---
    const userGoalsData: TransformedData['userGoalsData'] = {
        // Goal Mapping: Asumimos que 'performance' y 'maintenance' son 'maintain' o 'recomp'
        // y 'weightloss' es 'cut'. Esto debe ser ajustado por la lógica de cálculo.
        goalType: objective.primaryGoal === 'weightloss' ? 'cut' : 'maintain', 
        goalSpeed: objective.primaryGoal === 'weightloss' ? 'moderate' : null, // Se ajusta en el cálculo
        targetWeight: biometrics.weight, // El peso objetivo real se calculará después
        
        // Preferences
        dietType: nutrition.dietType,
        // Combinamos arrays de exclusión y los convertimos a string para SQLite
        allergies: (nutrition.allergies || []).join('; '),
        excludedIngredients: (nutrition.intolerances || []).concat(nutrition.excludedFoods || []).join('; '),
        
        targetDate: objective.targetDate ? new Date(objective.targetDate) : null,
    };
    
    // --- 3. OnboardingData (JSON de la respuesta completa) ---
    // NOTA: Recuerda que `data` en el schema.prisma es ahora String para SQLite.
    const onboardingDataRecord: TransformedData['onboardingDataRecord'] = {
        userId: userId,
        data: JSON.stringify(data), // Serializa el objeto completo a JSON String
        status: "completed",
        version: "1.0.0",
    };

    return {
        userProfileData,
        userGoalsData,
        onboardingDataRecord,
    };
}