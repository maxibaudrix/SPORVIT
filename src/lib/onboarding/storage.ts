// src/lib/onboarding/storage.ts

import { prisma } from '@/lib/db';
import { OnboardingSubmitInput } from '@/lib/onboarding/validator';
import { transformOnboardingData } from './transformer';

/**
 * Guarda todos los datos del onboarding, actualizando los registros de UserProfile,
 * UserGoals y el registro completo de OnboardingData en una transacción.
 * * @param userId El ID del usuario.
 * @param rawData Los datos validados del formulario.
 */
export async function saveOnboardingData(userId: string, rawData: OnboardingSubmitInput): Promise<void> {
    
    // 1. Transformar los datos del formulario a la estructura de la base de datos
    const { userProfileData, userGoalsData, onboardingDataRecord } = transformOnboardingData(userId, rawData);
    
    // 2. Ejecutar la operación de guardado en una transacción atómica
    await prisma.$transaction([
        // Guardar/Actualizar el registro completo (JSON) del onboarding
        prisma.onboardingData.upsert({
            where: { userId: userId },
            update: { data: onboardingDataRecord.data, status: 'completed' },
            create: onboardingDataRecord,
        }),
        
        // Guardar/Actualizar el perfil de usuario (biometría, actividad, entrenamiento)
        prisma.userProfile.upsert({
            where: { userId: userId },
            update: userProfileData,
            create: { ...userProfileData, userId: userId },
        }),
        
        // Guardar/Actualizar los objetivos de usuario (metas, preferencias nutricionales)
        prisma.userGoals.upsert({
            where: { userId: userId },
            update: userGoalsData,
            create: { ...userGoalsData, userId: userId },
        }),
    ]);
}