import type { CompletePlanningOutput } from "@/types/planning";

/**
 * Parsea y valida la respuesta de la AI
 * Convierte el texto JSON en un objeto tipado
 */
export function parsePlanningResponse(text: string): CompletePlanningOutput {
  try {
    // 1. Limpieza de texto
    let cleanText = text.trim();

    // Remover bloques de código markdown si existen
    cleanText = cleanText.replace(/```json\n?/g, "");
    cleanText = cleanText.replace(/```\n?/g, "");

    // Remover texto antes y después del JSON
    const jsonStart = cleanText.indexOf("{");
    const jsonEnd = cleanText.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No valid JSON found in response");
    }

    cleanText = cleanText.substring(jsonStart, jsonEnd + 1);

    // 2. Parse JSON
    const parsed: CompletePlanningOutput = JSON.parse(cleanText);

    // 3. Validación estructura básica
    validatePlanStructure(parsed);

    // 4. Validación lógica
    validatePlanLogic(parsed);

    console.log("[parsePlanningResponse] Plan parsed and validated successfully");
    return parsed;

  } catch (error: any) {
    console.error("[parsePlanningResponse] Parse error:", error);
    
    if (error instanceof SyntaxError) {
      throw new Error("Invalid JSON format from AI");
    }
    
    throw new Error(`Failed to parse AI response: ${error.message}`);
  }
}

/**
 * Valida que la estructura del plan sea correcta
 */
function validatePlanStructure(plan: any): void {
  // Campos obligatorios raíz
  const requiredFields = ["totalWeeks", "startDate", "endDate", "weeks", "overallStats"];
  for (const field of requiredFields) {
    if (!(field in plan)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Validar que weeks es un array
  if (!Array.isArray(plan.weeks)) {
    throw new Error("weeks must be an array");
  }

  // Validar que hay al menos 1 semana
  if (plan.weeks.length === 0) {
    throw new Error("Plan must have at least 1 week");
  }

  // Validar cada semana
  for (let i = 0; i < plan.weeks.length; i++) {
    const week = plan.weeks[i];
    
    if (!week.weekNumber || !week.days || !Array.isArray(week.days)) {
      throw new Error(`Invalid structure in week ${i + 1}`);
    }

    // Validar que la semana tiene 7 días
    if (week.days.length !== 7) {
      throw new Error(`Week ${week.weekNumber} must have exactly 7 days (has ${week.days.length})`);
    }

    // Validar cada día
    for (let j = 0; j < week.days.length; j++) {
      const day = week.days[j];
      
      if (!day.date || !day.dayOfWeek || !day.nutrition) {
        throw new Error(`Invalid structure in week ${week.weekNumber}, day ${j + 1}`);
      }

      // Validar nutrition
      if (!day.nutrition.meals || !Array.isArray(day.nutrition.meals)) {
        throw new Error(`Week ${week.weekNumber}, day ${j + 1}: meals must be an array`);
      }

      // Validar workout si es día de entrenamiento
      if (day.isTrainingDay && !day.workout) {
        throw new Error(`Week ${week.weekNumber}, day ${j + 1}: marked as training day but no workout`);
      }

      // Validar que cada meal tenga ingredientes
      for (const meal of day.nutrition.meals) {
        if (!meal.ingredients || !Array.isArray(meal.ingredients) || meal.ingredients.length === 0) {
          throw new Error(`Week ${week.weekNumber}, day ${j + 1}: meal "${meal.name}" has no ingredients`);
        }
      }
    }
  }
}

/**
 * Valida la lógica del plan (fechas, macros, etc.)
 */
function validatePlanLogic(plan: CompletePlanningOutput): void {
  // 1. Validar que totalWeeks coincide con el array
  if (plan.totalWeeks !== plan.weeks.length) {
    console.warn(`totalWeeks (${plan.totalWeeks}) doesn't match weeks array length (${plan.weeks.length})`);
  }

  // 2. Validar que las fechas son secuenciales
  let previousEndDate: Date | null = null;

  for (const week of plan.weeks) {
    const weekStart = new Date(week.startDate);
    const weekEnd = new Date(week.endDate);

    // Validar que startDate < endDate
    if (weekStart >= weekEnd) {
      throw new Error(`Week ${week.weekNumber}: startDate must be before endDate`);
    }

    // Validar que no hay gaps entre semanas
    if (previousEndDate) {
      const dayAfterPrevious = new Date(previousEndDate);
      dayAfterPrevious.setDate(dayAfterPrevious.getDate() + 1);

      if (weekStart.getTime() !== dayAfterPrevious.getTime()) {
        console.warn(`Gap detected between week ${week.weekNumber - 1} and ${week.weekNumber}`);
      }
    }

    previousEndDate = weekEnd;

    // 3. Validar que las fechas de los días son secuenciales
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

      // 4. Validar que los macros de las meals suman correctamente
      if (day.nutrition && day.nutrition.meals) {
        const totalCalories = day.nutrition.meals.reduce((sum, meal) => sum + meal.calories, 0);
        const targetCalories = day.nutrition.targetCalories;

        const diff = Math.abs(totalCalories - targetCalories);
        const diffPercent = (diff / targetCalories) * 100;

        if (diffPercent > 10) {
          console.warn(`Week ${week.weekNumber}, ${day.dayOfWeek}: meal calories (${totalCalories}) differ from target (${targetCalories}) by ${diffPercent.toFixed(1)}%`);
        }
      }
    }
  }

  console.log("[validatePlanLogic] Plan logic validated successfully");
}