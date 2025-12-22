import type { UserPlanningContext } from "@/types/planning";

/**
 * System prompt que define el rol y reglas para la AI
 */
export function getSystemPrompt(): string {
  return `Eres un entrenador deportivo y nutricionista certificado especializado en crear planes de entrenamiento y nutrición personalizados.

REGLAS ESTRICTAS:
1. Genera EXACTAMENTE 1 semana (7 días consecutivos)
2. Cada semana tiene EXACTAMENTE 7 días (lunes a domingo)
3. Cada día debe tener:
   - Entrenamiento (si aplica) con ejercicios específicos
   - Plan nutricional con 3-5 comidas detalladas
4. Respeta TODAS las restricciones alimentarias del usuario
5. Ajusta calorías según sea día de entreno o descanso
6. IMPORTANTE: Responde SOLO con JSON válido, sin explicaciones adicionales
7. NO uses bloques de código markdown (sin \`\`\`json)
8. Asegúrate de que el JSON esté completo y bien formado

FORMATO DE SALIDA (JSON puro):
{
  "totalWeeks": 1,
  "startDate": "2025-01-20",
  "endDate": "2025-04-14",
  "weeks": [
    {
      "weekNumber": 1,
      "startDate": "2025-01-20",
      "endDate": "2025-01-26",
      "phase": "base",
      "days": [
        {
          "date": "2025-01-20",
          "dayOfWeek": "lunes",
          "dayNumber": 1,
          "isTrainingDay": true,
          "workout": {
            "type": "strength",
            "phase": "base",
            "focus": "full_body",
            "duration": 60,
            "intensity": "moderate",
            "description": "Entrenamiento de cuerpo completo enfocado en técnica",
            "exercises": [
              {
                "name": "Sentadillas",
                "category": "compound",
                "muscleGroup": "piernas",
                "sets": 4,
                "reps": 12,
                "rest": 90,
                "tempo": "2-0-2-0",
                "notes": "Mantén la espalda recta"
              }
            ],
            "warmup": {
              "description": "5 min cardio ligero + movilidad articular",
              "duration": 10
            },
            "cooldown": {
              "description": "Estiramientos estáticos",
              "duration": 10
            }
          },
          "nutrition": {
            "targetCalories": 2400,
            "targetProtein": 180,
            "targetCarbs": 280,
            "targetFat": 60,
            "targetFiber": 35,
            "meals": [
              {
                "mealType": "breakfast",
                "timing": "07:00",
                "name": "Avena con proteína y plátano",
                "description": "Desayuno energético alto en carbohidratos",
                "calories": 450,
                "protein": 35,
                "carbs": 60,
                "fat": 8,
                "fiber": 8,
                "ingredients": [
                  { "name": "Avena integral", "amount": 60, "unit": "g" },
                  { "name": "Proteína whey", "amount": 30, "unit": "g" },
                  { "name": "Plátano", "amount": 1, "unit": "unidad" }
                ],
                "instructions": [
                  "Cocinar la avena con agua durante 5 minutos",
                  "Mezclar la proteína cuando esté lista",
                  "Añadir el plátano en rodajas por encima"
                ],
                "prepTime": 5,
                "cookTime": 5,
                "difficulty": "easy",
                "tags": ["high_protein", "quick"]
              }
            ]
          }
        }
      ],
      "weeklyStats": {
        "totalCalories": 16800,
        "avgDailyCalories": 2400,
        "totalProtein": 1260,
        "totalCarbs": 1960,
        "totalFat": 420,
        "trainingDays": 4,
        "restDays": 3,
        "totalTrainingMinutes": 240,
        "avgIntensity": "moderate"
      }
    }
  ],
  "overallStats": {
    "totalTrainingDays": 48,
    "totalRestDays": 36,
    "totalTrainingHours": 48,
    "avgWeeklyCalories": 16800,
    "phaseDistribution": {
      "base": 4, "build": 5, "peak": 2, "taper": 1, "recovery": 0
    }
  }
  CRITICAL: 
- Start your response with { and end with }
- Use ONLY double quotes for strings
- If you cannot complete due to token limits, return: {"partial": true, "reason": "token_limit"}`;
}

/**
 * Construye el prompt específico del usuario
 */
export function buildUserPromptForWeek(
  context: UserPlanningContext,
  weekNumber: number,
  phase: string
): string {
  const phases = context.planning?.phases || { base: 0, build: 0, peak: 0, taper: 0, recovery: 0 };

  const totalWeeks = (phases.base || 0) + 
                     (phases.build || 0) + 
                     (phases.peak || 0) + 
                     (phases.taper || 0) + 
                     (phases.recovery || 0);

  const finalWeeks = totalWeeks > 0 ? totalWeeks : 12; 

  // TODO EL TEXTO DEBE ESTAR DENTRO DE ESTAS COMILLAS INCLINADAS
  return `Genera la SEMANA ${weekNumber} de un plan de ${totalWeeks} semanas.
  FASE ACTUAL: ${phase.toUpperCase()}

  IMPORTANTE: Solo genera 7 días consecutivos para esta semana.

DATOS DEL USUARIO:
- Edad: ${context.biometrics.age} años
- Peso: ${context.biometrics.weight} kg
- Altura: ${context.biometrics.height} cm
- Sexo: ${context.biometrics.gender}
- Nivel: ${context.training.experienceLevel}
- Objetivo: ${context.objective.primaryGoal}

ENTRENAMIENTO:
- Días disponibles: ${context.training.daysPerWeek} días/semana
- Duración por sesión: ${context.training.sessionDuration} minutos
- Tipo de deporte: ${context.training.sportType}
${context.training.sportSubtype ? `- Subtipo: ${context.training.sportSubtype}` : ""}
- Ubicación: ${context.training.trainingLocation?.join(", ") || "No especificada"}
- Equipamiento: ${context.training.availableEquipment?.join(", ") || "Ninguno"}
${context.training.hasInjuries ? `- LESIONES: ${context.training.injuryDetails}` : ""}

NUTRICIÓN:
- Dieta: ${context.nutrition.dietType}
- Comidas/día: ${context.nutrition.mealsPerDay}
- Alergias: ${context.nutrition.allergies?.length > 0 ? context.nutrition.allergies.join(", ") : "ninguna"}
- Intolerancias: ${context.nutrition.intolerances?.length > 0 ? context.nutrition.intolerances.join(", ") : "ninguna"}
- Alimentos excluidos: ${context.nutrition.excludedFoods?.length > 0 ? context.nutrition.excludedFoods.join(", ") : "ninguno"}

OBJETIVOS CALÓRICOS Y MACROS:
- Día de entrenamiento: ${context.targets?.calories?.trainingDay || 2000} kcal
  → Proteína: ${context.targets?.macros?.protein || 150}g
  → Carbohidratos: ${context.targets?.macros?.carbs || 200}g
  → Grasas: ${context.targets?.macros?.fat || 70}g
  → Fibra: ${context.targets?.macros?.fiber || 30}g
  
- Día de descanso: ${context.targets?.calories?.restDay || 1800} kcal
  → Proteína: ${Math.round((context.targets?.macros?.protein || 150) * 0.95)}g
  → Carbohidratos: ${Math.round((context.targets?.macros?.carbs || 200) * 0.8)}g
  → Grasas: ${context.targets?.macros?.fat || 70}g
  → Fibra: ${context.targets?.macros?.fiber || 30}g

DISTRIBUCIÓN DE FASES:
Esta semana corresponde a la fase: ${phase}

INICIO DEL PLAN: ${context.startPreferences?.startDate || "Hoy"}

Genera el plan completo en JSON puro (sin markdown) siguiendo EXACTAMENTE el formato especificado en el system prompt.`;
}