// src/app/api/recipes/fitness/generate/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { RecipeGenerationRequest, FitnessRecipe } from '@/types/fitness-recipe';

const MODELS_TO_TRY = [
  "gemini-2.5-flash",
  "gemini-flash-latest",
  "gemini-2.0-flash",
];

const generationConfig = {
  temperature: 0.8,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 8000,
};

function buildRecipePrompt(request: RecipeGenerationRequest): string {
  const { ingredientes, categoria, objetivos, porciones = 1 } = request;

  const objetivoDescripcion = {
    perder_grasa: 'perder grasa corporal manteniendo masa muscular (déficit calórico)',
    ganar_musculo: 'ganar masa muscular (superávit calórico con alto contenido proteico)',
    mantener: 'mantener peso y composición corporal actual',
    rendimiento: 'maximizar el rendimiento deportivo y la energía'
  }[objetivos.objetivo];

  const restricciones = objetivos.restricciones_dieteticas?.length
    ? `\nRestricciones dietéticas: ${objetivos.restricciones_dieteticas.join(', ')}`
    : '';

  const alergias = objetivos.alergias?.length
    ? `\nAlergias: ${objetivos.alergias.join(', ')}`
    : '';

  const targetCalorias = objetivos.calorias_objetivo
    ? `\nCalorías objetivo por porción: ${objetivos.calorias_objetivo} kcal`
    : '';

  const targetProteina = objetivos.proteina_objetivo
    ? `\nProteína objetivo por porción: ${objetivos.proteina_objetivo}g`
    : '';

  return `Eres un chef especializado en nutrición deportiva y recetas fitness.

Tu tarea es crear UNA ÚNICA receta fitness en formato JSON siguiendo el estándar Schema.org Recipe.

INGREDIENTES DISPONIBLES:
${ingredientes.map(ing => `- ${ing}`).join('\n')}

REQUISITOS DE LA RECETA:
- Tipo de comida: ${categoria}
- Objetivo fitness: ${objetivoDescripcion}
- Número de porciones: ${porciones}${restricciones}${alergias}${targetCalorias}${targetProteina}

INSTRUCCIONES IMPORTANTES:
1. Usa ÚNICAMENTE los ingredientes proporcionados en la lista
2. Si es necesario, puedes agregar ingredientes básicos de despensa (sal, pimienta, aceite de oliva, especias comunes)
3. Calcula macronutrientes precisos (proteína, carbohidratos, grasa, calorías)
4. Ajusta las porciones según el objetivo fitness del usuario
5. Incluye tiempos de preparación y cocción realistas
6. Proporciona instrucciones claras paso a paso
7. Los tiempos deben estar en formato ISO 8601 (ejemplo: "PT5M" para 5 minutos, "PT1H30M" para 1 hora 30 minutos)

FORMATO DE RESPUESTA REQUERIDO (JSON):
{
  "@context": "https://schema.org",
  "@type": "Recipe",
  "id": "recipe-[genera un id único]",
  "name": "[nombre atractivo de la receta]",
  "category": "${categoria}",
  "difficulty": "[fácil|media|difícil]",
  "prepTime": "[tiempo ISO 8601, ej: PT10M]",
  "cookTime": "[tiempo ISO 8601, ej: PT15M]",
  "totalTime": "[tiempo ISO 8601, ej: PT25M]",
  "recipeYield": "${porciones} porción${porciones > 1 ? 'es' : ''}",
  "description": "[descripción detallada de la receta y sus beneficios fitness]",
  "keywords": "[palabras clave separadas por comas]",
  "author": {
    "@type": "Organization",
    "name": "SPORVIT"
  },
  "image": {
    "@type": "ImageObject",
    "url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&h=800&fit=crop",
    "width": 1200,
    "height": 800
  },
  "nutrition": {
    "@type": "NutritionInformation",
    "calories": "[número] kcal",
    "proteinContent": "[número]g",
    "carbohydrateContent": "[número]g",
    "fiberContent": "[número]g",
    "sugarContent": "[número]g",
    "fatContent": "[número]g",
    "saturatedFatContent": "[número]g",
    "sodiumContent": "[número]mg"
  },
  "recipeIngredient": [
    "[cantidad y unidad] de [ingrediente]",
    "..."
  ],
  "recipeInstructions": [
    {
      "@type": "HowToStep",
      "position": 1,
      "text": "[instrucción paso 1]"
    }
  ],
  "suitableForDiet": ["https://schema.org/HighProteinDiet"],
  "recipeCuisine": "[cocina, ej: Mediterránea, Internacional]",
  "recipeCategory": "[Desayuno|Almuerzo|Cena|Snack|Pre-entreno|Post-entreno]",
  "tags": ["fitness", "proteico", ...],
  "seo": {
    "title": "[título SEO optimizado]",
    "metaDescription": "[descripción meta de 150-160 caracteres]",
    "focusKeyword": "[palabra clave principal]"
  }
}

RESPONDE ÚNICAMENTE CON EL JSON, SIN TEXTO ADICIONAL ANTES O DESPUÉS.`;
}

function cleanJsonResponse(text: string): string {
  // Eliminar markdown code blocks
  let cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');

  // Encontrar el primer { y el último }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return cleaned.trim();
}

async function generateRecipe(request: RecipeGenerationRequest): Promise<FitnessRecipe> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_AI_API_KEY is not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const prompt = buildRecipePrompt(request);

  let lastError: any;

  for (const modelName of MODELS_TO_TRY) {
    console.log(`[generateRecipe] Trying model: ${modelName}`);

    try {
      const model = genAI.getGenerativeModel({ model: modelName });

      let retries = 3;

      while (retries > 0) {
        try {
          console.log(`[generateRecipe] Starting AI generation (attempt ${4 - retries}/3)...`);
          const startTime = Date.now();

          const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig,
          });

          const response = result.response;
          const text = response.text();
          const duration = Date.now() - startTime;

          console.log(`[generateRecipe] ✅ AI responded in ${duration}ms with model ${modelName}`);
          console.log(`[generateRecipe] Response length: ${text.length} characters`);

          // Limpiar y parsear respuesta
          const cleanedJson = cleanJsonResponse(text);
          const recipe: FitnessRecipe = JSON.parse(cleanedJson);

          // Validar que tenga los campos requeridos
          if (!recipe.name || !recipe.recipeIngredient || !recipe.recipeInstructions) {
            throw new Error('Invalid recipe structure');
          }

          console.log(`[generateRecipe] Recipe "${recipe.name}" generated successfully`);
          return recipe;

        } catch (retryError: any) {
          lastError = retryError;

          if (retryError.message?.includes('503') ||
              retryError.message?.includes('overloaded') ||
              retryError.message?.includes('Service Unavailable')) {
            retries--;
            if (retries > 0) {
              const waitTime = (4 - retries) * 2000;
              console.log(`[generateRecipe] ⏳ Model overloaded, waiting ${waitTime}ms before retry...`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
              continue;
            }
          }

          console.warn(`[generateRecipe] ❌ Error with ${modelName}:`, retryError.message);
          break;
        }
      }

      console.log(`[generateRecipe] All retries failed for ${modelName}, trying next model...`);

    } catch (modelError: any) {
      console.warn(`[generateRecipe] ❌ Model ${modelName} failed:`, modelError.message);
      lastError = modelError;
      continue;
    }
  }

  console.error("[generateRecipe] ❌ All models failed");
  throw new Error(`Failed to generate recipe after trying all models: ${lastError?.message || 'Unknown error'}`);
}

export async function POST(request: Request) {
  try {
    const body: RecipeGenerationRequest = await request.json();

    // Validar request
    if (!body.ingredientes || !Array.isArray(body.ingredientes) || body.ingredientes.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere al menos un ingrediente' },
        { status: 400 }
      );
    }

    if (!body.categoria) {
      return NextResponse.json(
        { error: 'La categoría de receta es requerida' },
        { status: 400 }
      );
    }

    if (!body.objetivos) {
      return NextResponse.json(
        { error: 'Los objetivos fitness son requeridos' },
        { status: 400 }
      );
    }

    console.log(`[API] Generating recipe with ${body.ingredientes.length} ingredients for ${body.categoria}`);

    const recipe = await generateRecipe(body);

    return NextResponse.json({
      success: true,
      recipe
    });

  } catch (error: any) {
    console.error('[API] Recipe generation failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate recipe'
      },
      { status: 500 }
    );
  }
}
