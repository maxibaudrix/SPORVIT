import type { UserPlanningContext } from "@/types/planning";

/**
 * System prompt ultra-compacto
 */
export function getSystemPrompt(): string {
  return `Eres un entrenador y nutricionista. Genera planes en JSON puro.

REGLAS:
1. Genera EXACTAMENTE 7 días (lunes a domingo)
2. SOLO 3 ejercicios por entrenamiento
3. SOLO 3 comidas por día (desayuno, almuerzo, cena)
4. Máximo 4 ingredientes por comida
5. Instrucciones: MÁXIMO 3 pasos cortos
6. Descripciones de ejercicios: MÁXIMO 1 línea corta
7. NO uses markdown (\`\`\`json)
8. Responde SOLO JSON válido

FORMATO (ejemplo con 1 día):
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
        "duration": 60,
        "intensity": "moderate",
        "description": "Fuerza full body",
        "exercises": [
          {
            "name": "Sentadilla",
            "category": "compound",
            "muscleGroup": "piernas",
            "sets": 4,
            "reps": 12,
            "rest": 90,
            "tempo": "2-0-2-0",
            "notes": "Espalda recta"
          }
        ],
        "warmup": {"description": "5min cardio", "duration": 5},
        "cooldown": {"description": "Estiramientos", "duration": 5}
      },
      "nutrition": {
        "targetCalories": 2400,
        "targetProtein": 180,
        "targetCarbs": 280,
        "targetFat": 60,
        "targetFiber": 30,
        "meals": [
          {
            "mealType": "breakfast",
            "timing": "07:00",
            "name": "Avena proteica",
            "description": "Alto en proteína",
            "calories": 450,
            "protein": 35,
            "carbs": 60,
            "fat": 8,
            "fiber": 8,
            "ingredients": [
              {"name": "Avena", "amount": 60, "unit": "g"},
              {"name": "Proteína", "amount": 30, "unit": "g"},
              {"name": "Plátano", "amount": 1, "unit": "unidad"}
            ],
            "instructions": ["Cocinar avena 5min", "Mezclar proteína", "Añadir plátano"],
            "prepTime": 5,
            "cookTime": 5,
            "difficulty": "easy",
            "tags": ["high_protein"]
          }
        ]
      }
    }
  ]
}

CRÍTICO: Si llegas al límite de tokens, detén y retorna: {"partial": true, "reason": "token_limit"}`;
}

/**
 * User prompt ultra-compacto
 */
export function buildUserPromptForWeek(
  context: UserPlanningContext,
  weekNumber: number,
  phase: string
): string {
  return `SEMANA ${weekNumber} | FASE: ${phase.toUpperCase()}

USER: ${context.biometrics.age}a, ${context.biometrics.gender}, ${context.biometrics.weight}kg, ${context.biometrics.height}cm
NIVEL: ${context.training.experienceLevel}
OBJETIVO: ${context.objective.primaryGoal}

ENTRENO: ${context.training.daysPerWeek}d/sem × ${context.training.sessionDuration}min
DEPORTE: ${context.training.sportType}${context.training.sportSubtype ? ` (${context.training.sportSubtype})` : ''}
${context.training.hasInjuries ? `⚠️ LESIÓN: ${context.training.injuryDetails}` : ''}

CALORÍAS:
- Entreno: ${context.targets?.calories?.trainingDay || 2000}kcal → ${context.targets?.macros?.protein}P/${context.targets?.macros?.carbs}C/${context.targets?.macros?.fat}F
- Descanso: ${context.targets?.calories?.restDay || 1800}kcal → ${Math.round((context.targets?.macros?.protein || 150)*0.9)}P/${Math.round((context.targets?.macros?.carbs || 200)*0.8)}C/${context.targets?.macros?.fat}F

DIETA: ${context.nutrition.dietType} | Comidas: ${context.nutrition.mealsPerDay}
${context.nutrition.excludedFoods?.length ? `EXCLUIR: ${context.nutrition.excludedFoods.slice(0, 3).join(', ')}` : ''}
${context.nutrition.allergies?.length ? `ALERGIAS: ${context.nutrition.allergies.join(', ')}` : ''}

INICIO: ${context.startPreferences?.startDate}

Genera JSON válido. RECUERDA: 3 ejercicios máx, 3 comidas máx, 4 ingredientes máx, instrucciones cortas.`;
}