import type { UserPlanningContext, WeekPlan, DayPlan } from "@/types/planning";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { determinePhaseForWeek } from "@/lib/planning/determinePhase";
import { getSystemPrompt, buildUserPromptForWeek } from "@/lib/ai/planningPrompts";
import { parseWeekResponse } from "@/lib/ai/parsePlanningResponse";

const MODELS_TO_TRY = [
  "gemini-flash-latest", // Este logró generar 5 días
  "gemini-2.5-flash",
];

interface ChunkConfig {
  start: number; // Día inicio (1-7)
  end: number;   // Día fin (1-7)
}

const CHUNKS: ChunkConfig[] = [
  { start: 1, end: 2 },   // Lunes-Martes
  { start: 3, end: 4 },   // Miércoles-Jueves
  { start: 5, end: 6 },   // Viernes-Sábado
  { start: 7, end: 7 },   // Domingo (1 día)
];

/**
 * Genera un chunk de días
 */
async function generateChunk(
  context: UserPlanningContext,
  weekNumber: number,
  phase: string,
  chunk: ChunkConfig
): Promise<DayPlan[]> {
  
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_AI_API_KEY is not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  const systemPrompt = getSystemPrompt();
  const userPrompt = buildUserPromptForWeek(context, weekNumber, phase, chunk);
  const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

  const generationConfig = {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 4000,
  };

  console.log(`[generateChunk] Generating days ${chunk.start}-${chunk.end}...`);

  let lastError: any;
  
  for (const modelName of MODELS_TO_TRY) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      
      let retries = 3;
      while (retries > 0) {
        try {
          const startTime = Date.now();
          
          const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
            generationConfig,
          });
          
          const response = result.response;
          const text = response.text();
          
          const duration = Date.now() - startTime;
          console.log(`[generateChunk] ✅ Days ${chunk.start}-${chunk.end} generated in ${duration}ms (${text.length} chars)`);

          // Guardar chunk
          if (typeof window === 'undefined') {
            try {
              const fs = require('fs');
              const path = require('path');
              const logsDir = path.join(process.cwd(), 'logs');
              if (!fs.existsSync(logsDir)) {
                fs.mkdirSync(logsDir, { recursive: true });
              }
              
              const filename = path.join(logsDir, `chunk-w${weekNumber}-d${chunk.start}-${chunk.end}-${Date.now()}.txt`);
              fs.writeFileSync(filename, text, 'utf8');
              console.log(`[generateChunk] 💾 Chunk saved to: ${filename}`);
            } catch (err) {
              console.error('[generateChunk] Failed to save chunk:', err);
            }
          }

          // Parsear
          const parsed = parseWeekResponse(text, weekNumber, true);
          
          if ('days' in parsed) {
            console.log(`[generateChunk] ✅ Parsed ${parsed.days.length} days for chunk ${chunk.start}-${chunk.end}`);
            return parsed.days;
          } else {
            throw new Error('Partial response from AI');
          }

        } catch (retryError: any) {
          lastError = retryError;
          
          if (retryError.message?.includes('503') || 
              retryError.message?.includes('overloaded')) {
            retries--;
            if (retries > 0) {
              const waitTime = (4 - retries) * 2000;
              console.log(`[generateChunk] ⏳ Waiting ${waitTime}ms before retry...`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
              continue;
            }
          }
          
          console.warn(`[generateChunk] ❌ Error with ${modelName}:`, retryError.message);
          break;
        }
      }
      
    } catch (modelError: any) {
      console.warn(`[generateChunk] ❌ Model ${modelName} failed:`, modelError.message);
      lastError = modelError;
      continue;
    }
  }

  throw new Error(`Failed to generate chunk ${chunk.start}-${chunk.end}: ${lastError?.message}`);
}

/**
 * Genera una semana completa en chunks
 */
export async function generateWeekInChunks(
  context: UserPlanningContext,
  weekNumber: number
): Promise<WeekPlan> {
  
  const phase = determinePhaseForWeek(weekNumber, context.planning.phases);
  console.log(`[generateWeekInChunks] Starting week ${weekNumber} generation in ${CHUNKS.length} chunks...`);
  
  try {
    // Generar todos los chunks for loop
    const chunkResults: DayPlan[] = [];

    for (const chunk of CHUNKS) {
    console.log(`[generateWeekInChunks] Generating chunk ${chunk.start}-${chunk.end}...`);
    
    const days = await generateChunk(context, weekNumber, phase, chunk);
    chunkResults.push(...days);
    
    // Pequeña pausa entre chunks para evitar rate limit
    if (chunk !== CHUNKS[CHUNKS.length - 1]) { // No pausar en el último
        console.log('[generateWeekInChunks] ⏳ Waiting 2s before next chunk...');
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    }
    
    // Combinar todos los días
    const allDays: DayPlan[] = chunkResults.flat();
    
    console.log(`[generateWeekInChunks] ✅ Combined ${allDays.length} days from ${CHUNKS.length} chunks`);
    
    // Validar que tenemos 7 días
    if (allDays.length !== 7) {
      console.warn(`[generateWeekInChunks] ⚠️ Expected 7 days, got ${allDays.length}`);
      // Intentar corregir si faltan días
      if (allDays.length < 7) {
        throw new Error(`Incomplete week: only ${allDays.length}/7 days generated`);
      }
    }
    
    // Calcular fechas de inicio y fin
    const startDate = allDays[0].date;
    const endDate = allDays[allDays.length - 1].date;
    
    // Construir semana completa
    const week: WeekPlan = {
    weekNumber,
    startDate,
    endDate,
    phase,
    days: allDays,
    weeklyStats: {
        totalCalories: 0,
        avgDailyCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        trainingDays: allDays.filter(d => d.isTrainingDay).length,
        restDays: allDays.filter(d => !d.isTrainingDay).length,
        totalTrainingMinutes: 0,
        avgIntensity: 'moderate'
    }
    };
    
    console.log(`[generateWeekInChunks] ✅ Week ${weekNumber} completed successfully`);
    
    return week;
    
  } catch (error: any) {
    console.error(`[generateWeekInChunks] ❌ Failed to generate week ${weekNumber}:`, error);
    throw error;
  }
}