// src/lib/validations/diary.ts
import { z } from 'zod';

// Patrón para validar la fecha en formato YYYY-MM-DD
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

// Tipos de comida permitidos
export const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'] as const;

/**
 * Esquema para añadir una comida al diario (POST /api/diary/meal)
 */
export const addMealSchema = z.object({
  date: z.string().regex(dateRegex, "Formato de fecha inválido. Debe ser YYYY-MM-DD."),
  mealType: z.enum(mealTypes, { 
    errorMap: () => ({ message: "Tipo de comida inválido. Debe ser 'breakfast', 'lunch', 'dinner' o 'snacks'." })
  }),
  productId: z.string().uuid("El ID del producto debe ser un UUID válido."),
  servingSize: z.number().min(1, "El tamaño de la porción debe ser al menos 1g.").max(1000, "El tamaño máximo de la porción es 1000g."),
});

/**
 * Esquema para actualizar un ejercicio (PATCH /api/diary/exercise/:id)
 * NOTA: exerciseId se asume que viene de los parámetros de la URL, pero se incluye aquí para validación del body si fuera necesario.
 */
export const updateExerciseSchema = z.object({
  completed: z.boolean().optional(),
  notes: z.string().max(255, "Las notas no pueden exceder los 255 caracteres.").optional(),
});

/**
 * Esquema para incrementar la ingesta de agua (POST /api/diary/water)
 */
export const addWaterSchema = z.object({
  date: z.string().regex(dateRegex, "Formato de fecha inválido. Debe ser YYYY-MM-DD."),
  glasses: z.number().min(1, "Debe ser al menos 1 vaso."),
});

// Nota: El esquema para el GET (obtener) solo necesita validar el query parameter 'date',
// lo cual se puede hacer directamente en la ruta.