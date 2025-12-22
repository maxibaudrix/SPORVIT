import { GoogleGenerativeAI } from "@google/generative-ai";
import type { UserPlanningContext, WeekPlan, PartialWeekResponse } from "@/types/planning";
import { determinePhaseForWeek } from "@/lib/planning/determinePhase";
import { getSystemPrompt, buildUserPromptForWeek } from "@/lib/ai/planningPrompts";
import { parseWeekResponse } from "@/lib/ai/parsePlanningResponse";

// ✅ LISTA DE MODELOS CON FALLBACK
const MODELS_TO_TRY = [
  "gemini-2.5-flash",
  "gemini-flash-latest",
  "gemini-2.0-flash",
];
const generationConfig = {
  temperature: 0.7,
  topP: 0.8,
  topK: 40,
  maxOutputTokens: 4000,
};

/**
 * Genera una semana del plan usando Google AI (Gemini) con fallback
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

  // 2. Inicializar cliente
  const genAI = new GoogleGenerativeAI(apiKey);

  // 3. Determinar fase
  const phase = determinePhaseForWeek(weekNumber, context.planning.phases);
  console.log(`[generateWeekPlan] Generating week ${weekNumber}, phase: ${phase}`);

  // 4. Preparar prompts
  const systemPrompt = getSystemPrompt();
  const userPrompt = buildUserPromptForWeek(
    context, 
    weekNumber, 
    phase,
    undefined // Sin chunk = generar semana completa
  );
  const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

  // ✅ 5. INTENTAR CON MÚLTIPLES MODELOS (FALLBACK)
  let lastError: any;
  
  for (const modelName of MODELS_TO_TRY) {
    console.log(`[generateWeekPlan] Trying model: ${modelName}`);
    
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      
      // ✅ RETRY LOGIC (3 intentos por modelo)
      let retries = 3;
      
      while (retries > 0) {
        try {
          console.log(`[generateWeekPlan] Starting AI generation (attempt ${4 - retries}/3)...`);
          const startTime = Date.now();
          
          const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
            generationConfig,
          });
          
          const response = result.response;
          const text = response.text();

          const duration = Date.now() - startTime;
          console.log(`[generateWeekPlan] ✅ AI responded in ${duration}ms with model ${modelName}`);
          console.log(`[generateWeekPlan] Response length: ${text.length} characters`);

          // ✅ GUARDAR RESPUESTA COMPLETA
          if (typeof window === 'undefined') { // Solo en servidor
            try {
              const fs = require('fs');
              const path = require('path');
              const timestamp = Date.now();
              const filename = path.join(process.cwd(), `logs/gemini-week${weekNumber}-${timestamp}.txt`);
              
              // Crear carpeta logs si no existe
              const logsDir = path.join(process.cwd(), 'logs');
              if (!fs.existsSync(logsDir)) {
                fs.mkdirSync(logsDir, { recursive: true });
              }
              
              // Guardar con metadata
              const content = `=== GEMINI RESPONSE ===
Model: ${modelName}
Week: ${weekNumber}
Phase: ${phase}
Duration: ${duration}ms
Length: ${text.length} chars
Timestamp: ${new Date().toISOString()}

=== JSON START ===
${text}
=== JSON END ===`;
              
              fs.writeFileSync(filename, content, 'utf8');
              console.log(`[generateWeekPlan] 💾 Response saved to: ${filename}`);
            } catch (err) {
              console.error('[generateWeekPlan] Failed to save response:', err);
            }
          }

          console.log(`[generateWeekPlan] First 200 chars:`, text.substring(0, 200));
          console.log(`[generateWeekPlan] Last 200 chars:`, text.substring(text.length - 200));

          // Parsear y validar respuesta
          const planOutput = parseWeekResponse(text, weekNumber);

          console.log(`[generateWeekPlan] Week ${weekNumber} generated successfully with ${modelName}`);
          return planOutput;

        } catch (retryError: any) {
          lastError = retryError;
          
          // Si es error 503 (overloaded), reintentar
          if (retryError.message?.includes('503') || 
              retryError.message?.includes('overloaded') ||
              retryError.message?.includes('Service Unavailable')) {
            retries--;
            if (retries > 0) {
              const waitTime = (4 - retries) * 2000; // 2s, 4s, 6s
              console.log(`[generateWeekPlan] ⏳ Model overloaded, waiting ${waitTime}ms before retry...`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
              continue;
            }
          }
          
          // Si no es 503 o ya no quedan retries, pasar al siguiente modelo
          console.warn(`[generateWeekPlan] ❌ Error with ${modelName}:`, retryError.message);
          break; // Salir del while de retries
        }
      }
      
      // Si llegamos aquí, todos los retries fallaron para este modelo
      console.log(`[generateWeekPlan] All retries failed for ${modelName}, trying next model...`);
      
    } catch (modelError: any) {
      console.warn(`[generateWeekPlan] ❌ Model ${modelName} failed:`, modelError.message);
      lastError = modelError;
      continue; // Intentar con el siguiente modelo
    }
  }

  // Si todos los modelos fallaron
  console.error("[generateWeekPlan] ❌ All models failed");
  
  // Manejo de errores específicos
  if (lastError?.message?.includes('API_KEY') || lastError?.message?.includes('API key')) {
    throw new Error("Invalid Google AI API key. Check your .env file.");
  }
  if (lastError?.message?.includes('quota')) {
    throw new Error("Google AI API quota exceeded. Consider using a pay-as-you-go tier.");
  }
  if (lastError?.message?.includes('503') || lastError?.message?.includes('overloaded')) {
    throw new Error("All AI models are currently overloaded. Please try again in a few minutes.");
  }
  
  throw new Error(`Failed to generate plan after trying all models: ${lastError?.message || 'Unknown error'}`);
}