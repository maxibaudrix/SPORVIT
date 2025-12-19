// src/lib/validations/progress.ts
import { z } from 'zod';

// Patrón para validar la fecha en formato YYYY-MM-DD
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Esquema para registrar una entrada de peso (POST /api/progress/weight)
 */
export const addWeightSchema = z.object({
  date: z.string().regex(dateRegex, "Formato de fecha inválido. Debe ser YYYY-MM-DD."),
  weight: z.number().min(30, "El peso mínimo debe ser 30 kg.").max(300, "El peso máximo es 300 kg."),
  bodyFat: z.number().min(3, "El porcentaje de grasa mínimo debe ser 3%.").max(50, "El porcentaje de grasa máximo es 50%.").optional(),
});

/**
 * Esquema para registrar medidas corporales (POST /api/progress/measurements)
 */
export const addMeasurementsSchema = z.object({
  date: z.string().regex(dateRegex, "Formato de fecha inválido. Debe ser YYYY-MM-DD."),
  waist: z.number().min(40).max(200).optional(),
  chest: z.number().min(50).max(200).optional(),
  hips: z.number().min(50).max(200).optional(),
  arms: z.number().min(20).max(60).optional(),
  // Opcional: validar que al menos un campo de medida esté presente
}).refine(data => data.waist !== undefined || data.chest !== undefined || data.hips !== undefined || data.arms !== undefined, {
  message: "Debe proveer al menos una medida corporal (cintura, pecho, caderas o brazos).",
});

/**
 * Esquema de validación para el query parameter 'period' del GET
 */
export const progressQuerySchema = z.object({
  period: z.string().optional(), // '7', '30', '90' o 'all'
});