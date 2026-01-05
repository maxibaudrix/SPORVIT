// src/app/api/meal-plan/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateWeeklyPlan } from '@/lib/mealPlanEngine/generator';
import { getUserIdFromSession, handleUnauthorized } from '@/lib/auth-helper';
import { withAIRateLimit } from '@/lib/lib_rate-limiter';

/**
 * POST /api/meal-plan/generate
 * Genera un plan de comidas automático basado en preferencias.
 */
async function handlePOST(request: NextRequest) {
  try {
    // Authenticate user
    const userId = await getUserIdFromSession(request);
    if (!userId) return handleUnauthorized();
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

  } catch (error: any) {
    if (error?.message === "Unauthorized") {
      return handleUnauthorized();
    }
    console.error('Error generating meal plan:', error);
    return NextResponse.json({ message: "Error interno al generar el plan automático." }, { status: 500 });
  }
}

// Apply AI rate limiting: 10 requests per hour
export const POST = withAIRateLimit(handlePOST);