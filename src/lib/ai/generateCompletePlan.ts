import { GoogleGenerativeAI } from "@google/generative-ai";
import type { UserPlanningContext, CompletePlanningOutput } from "@/types/planning";
import { getSystemPrompt, buildUserPrompt } from "@/lib/ai/planningPrompts";
import { parsePlanningResponse } from "@/lib/ai/parsePlanningResponse";

/**
 * Genera un plan completo usando Google AI (Gemini)
 */
export async function generateCompletePlan(
  context: UserPlanningContext
): Promise<CompletePlanningOutput> {
  // 1. Validar API key
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_AI_API_KEY is not configured");
  }

  // 2. Inicializar cliente de Google AI
  const genAI = new GoogleGenerativeAI(apiKey);
  
  /**
   * CONFIGURACIÓN DEL MODELO
   * - Usamos 'gemini-1.5-pro' para planes complejos (mejor razonamiento).
   * - 'systemInstruction' separa las reglas del negocio del input del usuario.
   * - 'responseMimeType' obliga al modelo a devolver JSON puro.
   */
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-pro", 
    systemInstruction: getSystemPrompt(), 
    generationConfig: {
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 8000,
      responseMimeType: "application/json", 
    },
  });

  try {
    console.log("[generateCompletePlan] Starting AI generation...");
    
    // 3. Construir solo el prompt del usuario (el sistema ya está configurado arriba)
    const userPrompt = buildUserPrompt(context);

    // 4. Llamar a la API
    const startTime = Date.now();
    
    // Enviamos el contenido. Gemini ya conoce las instrucciones de sistema previas.
    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    const text = response.text();
    
    const duration = Date.now() - startTime;
    console.log(`[generateCompletePlan] AI responded in ${duration}ms`);

    // 5. Parsear y validar respuesta
    // Gracias a 'responseMimeType', el texto debería ser un JSON limpio.
    const planOutput = parsePlanningResponse(text);

    console.log("[generateCompletePlan] Plan generated successfully");
    console.log(`- Total weeks: ${planOutput.totalWeeks}`);
    console.log(`- Total training days: ${planOutput.overallStats.totalTrainingDays}`);

    return planOutput;

  } catch (error: any) {
    console.error("[generateCompletePlan] Error:", error);
    
    // Manejo de errores específicos de Google AI
    if (error.message?.includes("API_KEY")) {
      throw new Error("Invalid Google AI API key. Check your .env file.");
    }
    if (error.message?.includes("quota")) {
      throw new Error("Google AI API quota exceeded. Consider using a pay-as-you-go tier.");
    }
    if (error.message?.includes("model")) {
      throw new Error("Model name not found. Ensure you are using 'gemini-1.5-pro' or 'gemini-1.5-flash'.");
    }
    
    throw new Error(`Failed to generate plan: ${error.message}`);
  }
}