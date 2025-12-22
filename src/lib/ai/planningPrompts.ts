import type { UserPlanningContext } from "@/types/planning";

/**
 * System prompt ultra-compacto
 */
export function getSystemPrompt(): string {
  return `Genera 7 días de entrenamiento y nutrición en JSON puro.

REGLAS:
1. EXACTAMENTE 7 días (lunes a domingo)
2. 2 ejercicios por entrenamiento
3. 3 comidas por día
3. 3 ingredientes por comida
4. NO incluyas: notes, tempo, category, description, instructions?, tags, difficulty, prepTime, cookTime
5. NO uses markdown

FORMATO:
{
  "weekNumber": 1,
  "startDate": "2025-12-29",
  "endDate": "2026-01-04",
  "phase": "base",
  "days": [
    {
      "date": "2025-12-29",
      "dayOfWeek": "lunes",
      "dayNumber": 1,
      "isTrainingDay": true,
      "workout": {
        "type": "strength",
        "phase": "base",
        "focus": "full_body",
        "duration": 50,
        "intensity": "moderate",
        "exercises": [
          {
            "name": "Sentadilla",
            "muscleGroup": "piernas",
            "sets": 3,
            "reps": 12,
            "rest": 60
          }
        ],
        "warmup": {"duration": 5},
        "cooldown": {"duration": 5}
      },
      "nutrition": {
        "targetCalories": 2706,
        "targetProtein": 164,
        "targetCarbs": 308,
        "targetFat": 68,
        "targetFiber": 30,
        "meals": [
          {
            "mealType": "breakfast",
            "timing": "07:30",
            "name": "Avena proteica",
            "calories": 650,
            "protein": 40,
            "carbs": 75,
            "fat": 15,
            "fiber": 8,
            "ingredients": [
              {"name": "Avena", "amount": 70, "unit": "g"}
            ]
          }
        ]
      }
    }
  ]
}

Si llegas al límite, detén y retorna: {"partial": true}`;
}

/**
 * User prompt ultra-compacto
 */
export function buildUserPromptForWeek(
  context: UserPlanningContext,
  weekNumber: number,
  phase: string
): string {
  return `SEM${weekNumber}|${phase.toUpperCase()}

${context.biometrics.age}a|${context.biometrics.gender}|${context.biometrics.weight}kg
${context.training.experienceLevel}|${context.objective.primaryGoal}

ENTRENO: ${context.training.daysPerWeek}d×${context.training.sessionDuration}min
CAL: E${context.targets?.calories?.trainingDay} D${context.targets?.calories?.restDay}
MACROS: ${context.targets?.macros?.protein}P/${context.targets?.macros?.carbs}C/${context.targets?.macros?.fat}F

DIETA: ${context.nutrition.dietType}
${context.nutrition.excludedFoods?.length ? `NO: ${context.nutrition.excludedFoods.slice(0, 2).join(',')}` : ''}

START: ${context.startPreferences?.startDate}

JSON. 2 ejercicios, 3 comidas, 3 ingredientes. Sin notes/tempo/instructions.`;
}