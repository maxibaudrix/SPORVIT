import type { UserPlanningContext } from "@/types/planning";

/**
 * System prompt con detalles completos para entrenamientos y recetas
 */
export function getSystemPrompt(): string {
  return `Genera días de entrenamiento y nutrición en JSON puro. TODO EN ESPAÑOL.

REGLAS GENERALES:
1. Genera SOLO los días solicitados
2. TODO el contenido debe estar en ESPAÑOL (nombres, descripciones, instrucciones)
3. NO uses markdown, solo JSON puro
4. Si llegas al límite, detén y retorna: {"partial": true}

ENTRENAMIENTOS - REGLAS:
1. Indica claramente el TIPO de entrenamiento en español: "Fuerza", "Cardio", "Estiramientos", "Pliométrico", "HIIT", etc.
2. Para cada ejercicio incluye:
   - Nombre del ejercicio en español
   - Grupo muscular trabajado
   - Series y repeticiones (para fuerza)
   - Duración y zona (para cardio, ej: "30 min Zona 2", "Fartlek 20 min")
   - Descripción breve de ejecución
3. Adaptar al objetivo del usuario:
   - Fitness general: variedad balanceada
   - Hipertrofia: enfoque en fuerza con volumen alto
   - Triatlón: combinar fuerza, cardio, pliométricos
   - Pérdida de peso: énfasis en cardio + circuitos
4. Incluir 4-6 ejercicios por sesión (no solo 2)
5. Para días de descanso: usar type "rest" sin ejercicios

RECETAS - REGLAS:
1. Incluir lista completa de ingredientes con cantidades
2. Incluir instrucciones de preparación paso a paso
3. Nombres de recetas en español y descriptivos
4. Adaptar a restricciones dietéticas del usuario
5. Calcular macros correctamente

FORMATO JSON:
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
        "type": "Fuerza",
        "subType": "Hipertrofia tren superior",
        "phase": "base",
        "focus": "pecho_espalda",
        "duration": 60,
        "intensity": "moderada-alta",
        "description": "Sesión de fuerza enfocada en desarrollar masa muscular en tren superior",
        "exercises": [
          {
            "name": "Press de banca con barra",
            "muscleGroup": "pecho",
            "sets": 4,
            "reps": 10,
            "rest": 90,
            "description": "Acostado en banco plano, bajar barra al pecho y empujar explosivamente"
          },
          {
            "name": "Remo con barra",
            "muscleGroup": "espalda",
            "sets": 4,
            "reps": 10,
            "rest": 90,
            "description": "Inclinado hacia adelante, tirar barra hacia abdomen manteniendo espalda recta"
          }
        ],
        "warmup": {
          "duration": 10,
          "description": "Movilidad articular y activación muscular"
        },
        "cooldown": {
          "duration": 5,
          "description": "Estiramientos estáticos de pecho y espalda"
        }
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
            "name": "Tostadas integrales con huevo y aguacate",
            "calories": 550,
            "protein": 30,
            "carbs": 60,
            "fat": 20,
            "fiber": 12,
            "ingredients": [
              {"name": "Pan integral", "amount": 80, "unit": "g"},
              {"name": "Huevos", "amount": 2, "unit": "unidades"},
              {"name": "Aguacate", "amount": 50, "unit": "g"},
              {"name": "Aceite de oliva", "amount": 5, "unit": "ml"},
              {"name": "Tomate cherry", "amount": 50, "unit": "g"}
            ],
            "instructions": [
              "Tostar el pan integral hasta que esté dorado",
              "Cocinar los huevos al gusto (revueltos o fritos con poco aceite)",
              "Machacar el aguacate con un tenedor y agregar sal y pimienta",
              "Montar: pan tostado + aguacate + huevos + tomates cortados",
              "Servir inmediatamente"
            ]
          }
        ]
      }
    },
    {
      "date": "2025-12-30",
      "dayOfWeek": "martes",
      "dayNumber": 2,
      "isTrainingDay": false,
      "workout": {
        "type": "rest",
        "description": "Día de descanso activo - Recuperación"
      },
      "nutrition": {
        "targetCalories": 2200,
        "targetProtein": 140,
        "targetCarbs": 250,
        "targetFat": 60,
        "targetFiber": 28,
        "meals": []
      }
    }
  ]
}`;
}

/**
 * User prompt con contexto completo sobre tipo de entrenamiento
 */
export function buildUserPromptForWeek(
  context: UserPlanningContext,
  weekNumber: number,
  phase: string,
  chunk?: { start: number; end: number }
): string {

  const chunkInfo = chunk
    ? `GENERA SOLO DÍAS ${chunk.start}-${chunk.end} (${chunk.end - chunk.start + 1} días)`
    : `GENERA 7 DÍAS COMPLETOS`;

  // Mapear objetivo a tipo de entrenamiento
  const trainingStyle = getTrainingStyleFromGoal(context.objective.primaryGoal);

  return `SEMANA ${weekNumber} | FASE: ${phase.toUpperCase()}
${chunkInfo}

PERFIL USUARIO:
- Edad: ${context.biometrics.age} años
- Género: ${context.biometrics.gender}
- Peso: ${context.biometrics.weight} kg
- Experiencia: ${context.training.experienceLevel}
- Objetivo: ${context.objective.primaryGoal}
- Estilo de entrenamiento: ${trainingStyle}

PLAN DE ENTRENAMIENTO:
- Días por semana: ${context.training.daysPerWeek}
- Duración por sesión: ${context.training.sessionDuration} minutos
- Incluir: ${getTrainingTypes(context.objective.primaryGoal)}

NUTRICIÓN:
- Calorías día entrenamiento: ${context.targets?.calories?.trainingDay} kcal
- Calorías día descanso: ${context.targets?.calories?.restDay} kcal
- Macros: ${context.targets?.macros?.protein}g proteína / ${context.targets?.macros?.carbs}g carbos / ${context.targets?.macros?.fat}g grasa
- Tipo de dieta: ${context.nutrition.dietType}
${context.nutrition.excludedFoods?.length ? `- Excluir: ${context.nutrition.excludedFoods.join(', ')}` : ''}

IMPORTANTE:
1. Para entrenamientos incluir 4-6 ejercicios con descripción completa
2. Para recetas incluir todos los ingredientes con cantidades e instrucciones paso a paso
3. Todo en ESPAÑOL
4. Adaptar intensidad y volumen según semana ${weekNumber} de fase ${phase}

Genera JSON siguiendo el formato exacto del system prompt.`;
}

/**
 * Determinar estilo de entrenamiento según objetivo
 */
function getTrainingStyleFromGoal(goal: string): string {
  const styles: Record<string, string> = {
    'muscle_gain': 'Hipertrofia con énfasis en fuerza',
    'weight_loss': 'Cardio y circuitos metabólicos',
    'endurance': 'Resistencia cardiovascular y muscular',
    'strength': 'Fuerza máxima y potencia',
    'general_fitness': 'Fitness general balanceado',
    'sport_specific': 'Específico para deporte (triatlón, running, etc.)',
  };
  return styles[goal] || 'Fitness general';
}

/**
 * Tipos de entrenamiento a incluir según objetivo
 */
function getTrainingTypes(goal: string): string {
  const types: Record<string, string> = {
    'muscle_gain': 'Fuerza (4-5x/sem), Cardio ligero (1-2x/sem)',
    'weight_loss': 'Cardio (3-4x/sem), Fuerza (2-3x/sem), HIIT (2x/sem)',
    'endurance': 'Cardio Zona 2 (3-4x/sem), Fuerza (2x/sem), Pliométricos (1x/sem)',
    'strength': 'Fuerza pesada (4x/sem), Accesorios (2x/sem)',
    'general_fitness': 'Fuerza (2-3x/sem), Cardio (2x/sem), Flexibilidad (1x/sem)',
    'sport_specific': 'Fuerza (2x/sem), Cardio (2-3x/sem), Pliométricos (1x/sem), Técnica específica',
  };
  return types[goal] || 'Variedad de fuerza, cardio y flexibilidad';
}