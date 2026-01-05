// src/app/api/recipes/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateRecipesFromPantry } from '@/lib/recipeEngine/generateRecipe';
import { withAIRateLimit } from '@/lib/lib_rate-limiter';

// Endpoint para generar recetas (útil para mover la lógica pesada o llamadas a OpenAI al servidor)
async function handlePOST(request: NextRequest) {
  try {
    const { pantryItems } = await request.json();
    
    if (!pantryItems || !Array.isArray(pantryItems)) {
        return NextResponse.json({ error: 'Invalid pantry items' }, { status: 400 });
    }

    const recipes = await generateRecipesFromPantry(pantryItems);
    
    return NextResponse.json({ recipes });
  } catch (error) {
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}

// Apply AI rate limiting: 10 requests per hour
export const POST = withAIRateLimit(handlePOST);