// src/app/api/meal-plan/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateWeeklyPlan } from '@/lib/mealPlanEngine/generator';

/**
 * POST /api/meal-plan/generate
 * Genera un plan de comidas automático basado en preferencias.
 */
export async function POST(request: NextRequest) {
  // Simulación de autenticación
  const userId = 'mock-user-uuid-123'; 
  if (!userId) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { week, preferences } = body;
    
    if (!week || !preferences) {
        return NextResponse.json({ message: "Datos incompletos para la generación." }, { status: 400 });
    }

    // 1. Llamada a la lógica central de generación
    const newPlan = await generateWeeklyPlan(userId, week, preferences); 

    // 2. Lógica de Base de Datos: Guardar el nuevo plan
    // await prisma.mealPlan.upsert({ ... guardar newPlan ... });

    return NextResponse.json(newPlan, { status: 200 });

  } catch (error) {
    console.error('Error generating meal plan:', error);
    return NextResponse.json({ message: "Error interno al generar el plan automático." }, { status: 500 });
  }
}