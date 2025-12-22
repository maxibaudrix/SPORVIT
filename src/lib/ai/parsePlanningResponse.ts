import type { WeekPlan, PartialWeekResponse } from "@/types/planning";

/**
 * Parsea y valida la respuesta de la AI
 * Convierte el texto JSON en un objeto tipado
 */
export function parseWeekResponse(
  text: string, 
  weekNumber: number,
  isChunk: boolean = false // ✅ NUEVO PARÁMETRO
): WeekPlan | PartialWeekResponse {
  
  console.log(`[parseWeekResponse] Parsing response for week ${weekNumber}${isChunk ? ' (chunk)' : ''}...`);
  
  try {
    // Limpiar respuesta
    let cleanText = text.trim();
    cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    cleanText = cleanText.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
    
    const parsed = JSON.parse(cleanText);
    
    // ✅ SI ES CHUNK, NO VALIDAR weeklyStats
    if (!isChunk) {
      validateWeekStructure(parsed, weekNumber);
    } else {
      // Solo validar que tenga días
      if (!parsed.days || !Array.isArray(parsed.days)) {
        throw new Error('Missing required field: days');
      }
    }
    
    console.log(`[parseWeekResponse] ✅ Parsed successfully`);
    return parsed as WeekPlan;
    
  } catch (error: any) {
    console.error('[parseWeekResponse] Parse error:', error);
    throw new Error(`Failed to parse AI response: ${error.message}`);
  }
}

/**
 * Valida que la estructura de la semana sea correcta
 */
function validateWeekStructure(week: any, expectedWeekNumber: number): void {
  // Campos obligatorios raíz
  const requiredFields = ["weekNumber", "startDate", "endDate", "days", "weeklyStats"];
  for (const field of requiredFields) {
    if (!(field in week)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Validar weekNumber
  if (!week.weekNumber || week.weekNumber !== expectedWeekNumber) {
    throw new Error(`Expected week ${expectedWeekNumber}, got ${week.weekNumber}`);
  }

  // Validar que days es un array
  if (!Array.isArray(week.days)) {
    throw new Error("days must be an array");
  }

  // Validar que la semana tiene exactamente 7 días
  if (week.days.length !== 7) {
    throw new Error(`Week must have exactly 7 days (has ${week.days.length})`);
  }

  // Validar cada día
  for (let j = 0; j < week.days.length; j++) {
    const day = week.days[j];
    
    if (!day.date || !day.dayOfWeek || !day.nutrition) {
      throw new Error(`Invalid structure in day ${j + 1}`);
    }

    // Validar nutrition
    if (!day.nutrition.meals || !Array.isArray(day.nutrition.meals)) {
      throw new Error(`Day ${j + 1}: meals must be an array`);
    }

    // Validar workout si es día de entrenamiento
    if (day.isTrainingDay && !day.workout) {
      throw new Error(`Day ${j + 1}: marked as training day but no workout`);
    }

    // Validar que cada meal tenga ingredientes
    for (const meal of day.nutrition.meals) {
      if (!meal.ingredients || !Array.isArray(meal.ingredients) || meal.ingredients.length === 0) {
        throw new Error(`Day ${j + 1}: meal "${meal.name}" has no ingredients`);
      }
    }
  }
}

/**
 * Valida la lógica de la semana (fechas, macros, etc.)
 */
function validateWeekLogic(week: WeekPlan): void {
  const weekStart = new Date(week.startDate);
  const weekEnd = new Date(week.endDate);

  // Validar que startDate < endDate
  if (weekStart >= weekEnd) {
    throw new Error(`Week ${week.weekNumber}: startDate must be before endDate`);
  }

  // Validar que las fechas de los días son secuenciales
  let previousDayDate: Date | null = null;

  for (const day of week.days) {
    const dayDate = new Date(day.date);

    if (previousDayDate) {
      const expectedDate = new Date(previousDayDate);
      expectedDate.setDate(expectedDate.getDate() + 1);

      if (dayDate.getTime() !== expectedDate.getTime()) {
        throw new Error(`Week ${week.weekNumber}: days are not sequential`);
      }
    }

    previousDayDate = dayDate;

    // Validar que los macros de las meals suman correctamente
    if (day.nutrition && day.nutrition.meals) {
      const totalCalories = day.nutrition.meals.reduce((sum, meal) => sum + meal.calories, 0);
      const targetCalories = day.nutrition.targetCalories;

      const diff = Math.abs(totalCalories - targetCalories);
      const diffPercent = (diff / targetCalories) * 100;

      if (diffPercent > 10) {
        console.warn(
          `Week ${week.weekNumber}, ${day.dayOfWeek}: meal calories (${totalCalories}) ` +
          `differ from target (${targetCalories}) by ${diffPercent.toFixed(1)}%`
        );
      }
    }
  }

  console.log("[validateWeekLogic] Week logic validated successfully");
}