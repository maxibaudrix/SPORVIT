import { GoogleGenerativeAI } from "@google/generative-ai";
import type { UserPlanningContext, WeekPlan, PartialWeekResponse } from "@/types/planning";
import { determinePhaseForWeek } from "@/lib/planning/determinePhase";
import { getSystemPrompt, buildUserPromptForWeek } from "@/lib/ai/planningPrompts";
import { parseWeekResponse } from "@/lib/ai/parsePlanningResponse";

/**
 * Genera una semana del plan usando Google AI (Gemini)
 */
export async function generateWeekPlan(
  context: UserPlanningContext,
  weekNumber: number
): Promise<WeekPlan | PartialWeekResponse> {
  // 1. Validar API key
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_AI_API_KEY is not configured");
  }

  // 2. Inicializar cliente de Google AI
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // 3. Configurar modelo
  const model = genAI.getGenerativeModel({  
    model: "gemini-2.5-flash",
  });

  const generationConfig = {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 8000,
  };

  // 4. Determinar fase de esta semana
  const phase = determinePhaseForWeek(weekNumber, context.planning.phases);
  console.log(`[generateWeekPlan] Generating week ${weekNumber}, phase: ${phase}`);

  let text = ''; // Declarar fuera del try para uso en catch

  try {
    console.log("[generateWeekPlan] Starting AI generation...");
    
    // 5. Construir prompts
    const systemPrompt = getSystemPrompt();
    const userPrompt = buildUserPromptForWeek(context, weekNumber, phase);
    
    // Combinar prompts
    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    // 6. Llamar a la API
    const startTime = Date.now();
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      generationConfig: generationConfig,
    });
    
    const response = result.response;
    text = response.text(); // Asignar sin declarar (ya está declarado arriba)
    
    const duration = Date.now() - startTime;
    console.log(`[generateWeekPlan] AI responded in ${duration}ms`);
    console.log(`[generateWeekPlan] Response length: ${text.length} characters`);

    // 7. Parsear y validar respuesta
    const planOutput = parseWeekResponse(text, weekNumber);

    console.log("[generateWeekPlan] Week generated successfully");
    if ('days' in planOutput) {
      console.log(`- Week ${weekNumber} generated with ${planOutput.days.length} days`);
    } else {
      console.log(`- Week ${weekNumber} partially generated`);
    }

    return planOutput;

  } catch (error: any) {
    console.error("[generateWeekPlan] Error:", error);
    
    // Intentar parsear respuesta parcial si existe texto
    if (error.message?.includes('JSON') && text) {
      console.log('[generateWeekPlan] Attempting to salvage partial response...');
      try {
        // Intentar cerrar JSON incompleto
        const fixedText = text.trim() + '}]}';
        const salvaged = parseWeekResponse(fixedText, weekNumber);
        console.warn('[generateWeekPlan] Partial response salvaged');
        return salvaged;
      } catch (salvageError) {
        console.error('[generateWeekPlan] Could not salvage response');
      }
    }
    
    // Manejo de errores específicos de Google AI
    if (error.message?.includes('API_KEY') || error.message?.includes('API key')) {
      throw new Error("Invalid Google AI API key. Check your .env file.");
    }
    if (error.message?.includes('quota')) {
      throw new Error("Google AI API quota exceeded. Consider using a pay-as-you-go tier.");
    }
    if (error.message?.includes('model') || error.message?.includes('not found')) {
      throw new Error("Model not available. Try 'gemini-1.5-flash-latest' or 'gemini-pro'.");
    }
    
    throw new Error(`Failed to generate plan: ${error.message}`);
  }
}