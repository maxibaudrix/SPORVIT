// src/lib/validations/user.ts
import { z } from 'zod';

export const UserProfileSchema = z.object({
    firstName: z.string().min(1, 'El nombre es requerido.').max(50),
    lastName: z.string().min(1, 'El apellido es requerido.').max(50),
    email: z.string().email('Email inválido.').optional(),
    
    // Campos biométricos (nullables ya que pueden ser opcionales en el form de settings)
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).nullable(),
    heightCm: z.number().int().min(50).max(250).nullable(),
    weightKg: z.number().min(30).max(300).nullable(),

    // Campos de objetivo
    activityLevel: z.string().nullable(),
    goal: z.string().nullable(),
    targetWeightKg: z.number().min(30).max(300).nullable(),
    weeklyGoalKg: z.number().min(-1.5).max(1).nullable(),

    // Dietéticos (los arrays son opcionales)
    dietType: z.string().nullable(),
    allergies: z.array(z.string()).optional(),
    excludedIngredients: z.array(z.string()).optional(),
});

export type UserProfileFormSchema = z.infer<typeof UserProfileSchema>;