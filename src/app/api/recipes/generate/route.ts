// src/app/api/recipes/generate/route.ts
import { NextResponse } from 'next/server';
import { generateRecipesFromPantry } from '@/lib/recipeEngine/generateRecipe';

// Endpoint para generar recetas (útil para mover la lógica pesada o llamadas a OpenAI al servidor)
export async function POST(request: Request) {
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