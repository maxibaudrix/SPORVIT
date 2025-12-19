// src/hooks/useOnboardingForm.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// ============================================
// SCHEMAS CON MENSAJES EN ESPAÑOL
// ============================================

// STEP 1 — BIOMÉTRICOS
export const biometricsSchema = z.object({
  age: z
    .number({
      required_error: 'La edad es obligatoria',
      invalid_type_error: 'Ingresa un número válido',
    })
    .min(18, 'Debes ser mayor de 18 años')
    .max(100, 'Edad máxima: 100 años'),

  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    required_error: 'Selecciona tu género',
    invalid_type_error: 'Selecciona una opción válida',
  }),

  height: z
    .number({
      required_error: 'La altura es obligatoria',
      invalid_type_error: 'Ingresa un número válido',
    })
    .min(140, 'Altura mínima: 140 cm')
    .max(220, 'Altura máxima: 220 cm'),

  weight: z
    .number({
      required_error: 'El peso es obligatorio',
      invalid_type_error: 'Ingresa un número válido',
    })
    .min(40, 'Peso mínimo: 40 kg')
    .max(200, 'Peso máximo: 200 kg'),

  bodyFatPercentage: z
    .union([
      z.number().min(5, 'Porcentaje mínimo: 5%').max(50, 'Porcentaje máximo: 50%'),
      z.literal(undefined),
      z.literal(null),
    ])
    .optional(),
});

// STEP 2 — OBJETIVO
export const goalSchema = z.object({
  goalType: z.enum(['LOSE', 'GAIN', 'MAINTAIN', 'RECOMP'], {
    required_error: 'Selecciona tu objetivo',
    invalid_type_error: 'Selecciona una opción válida',
  }),

  targetWeight: z
    .number({
      invalid_type_error: 'Ingresa un número válido',
    })
    .min(40, 'Peso mínimo: 40 kg')
    .max(200, 'Peso máximo: 200 kg')
    .optional(),

  goalSpeed: z
    .enum(['SLOW', 'MODERATE', 'AGGRESSIVE'], {
      invalid_type_error: 'Selecciona una opción válida',
    })
    .optional(),
});

// STEP 3 — ACTIVIDAD DIARIA (NEAT)
export const activitySchema = z.object({
  activityLevel: z.enum(
    [
      'SEDENTARY',
      'LIGHTLY_ACTIVE',
      'MODERATELY_ACTIVE',
      'VERY_ACTIVE',
      'SUPER_ACTIVE',
    ],
    {
      required_error: 'Selecciona tu nivel de actividad diaria',
      invalid_type_error: 'Selecciona una opción válida',
    }
  ),

  dailySteps: z
    .enum(['UNDER_3000', '3K_6K', '6K_10K', 'OVER_10K'])
    .optional()
    .or(z.literal("")),

  sittingHours: z
    .enum(['LESS_THAN_4H', '4H_6H', '6H_8H', 'MORE_THAN_8H'])
    .optional(),

  workType: z
    .enum(['DESK', 'MIXED', 'ACTIVE', 'PHYSICAL'])
    .optional(),
});

// STEP 4 — NIVEL DE ENTRENAMIENTO
export const trainingSchema = z.object({
  trainingLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], {
    required_error: 'Selecciona tu nivel de entrenamiento',
  }),

  trainingFrequency: z.enum(['1_2', '3_4', '5_6', 'DOUBLE'], {
    required_error: 'Selecciona cuántos días entrenas a la semana',
  }),

  trainingTypes: z.array(z.string()).min(1, 'Selecciona al menos un tipo de entrenamiento'),

  sessionDuration: z.enum(['UNDER_30', '30_60', '60_90', 'OVER_90'], {
    required_error: 'Selecciona la duración media de tus sesiones',
  }),

  intensity: z.enum(['LOW', 'MODERATE', 'HIGH'], {
    required_error: 'Selecciona tu intensidad habitual',
  }),
});

// STEP 5 — DIETA (ACTUALIZADO)
export const dietSchema = z.object({
  dietType: z.enum(
    [
      'NONE',
      'OMNIVORE',
      'VEGETARIAN',
      'VEGAN',
      'PESCETARIAN',
      'KETO',
      'PALEO',
      'MEDITERRANEAN',
      'LOW_CARB',
      'CARNIVORE',
      'OTHER',
    ],
    {
      required_error: 'Selecciona tu tipo de dieta',
      invalid_type_error: 'Selecciona una opción válida',
    }
  ),

  allergies: z.array(z.string()).optional(),
  excludedIngredients: z.array(z.string()).optional(),
});

// ============================================
// HOOK GENÉRICO
// ============================================

export function useOnboardingForm<T extends z.ZodType>(
  step: number,
  schema: T,
  onSuccess: (data: z.infer<T>) => void
) {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  const handleSubmitStore = form.handleSubmit(
    (data) => {
      onSuccess(data);
    },
    (errors) => {
      console.error('Errores de validación:', errors);
    }
  );

  return {
    ...form,
    handleSubmitStore,
  };
}
