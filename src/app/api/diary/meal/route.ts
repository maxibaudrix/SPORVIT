// src/app/api/diary/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
// Importa tu instancia de Prisma (asumiendo que está en lib/prisma)
import prisma from '@/lib/prisma'; 

// Esquema de validación para el query parameter 'date'
const dateQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido. Debe ser YYYY-MM-DD."),
});

/**
 * GET /api/diary?date=YYYY-MM-DD
 * Obtiene todas las comidas, entrenamientos, ingesta de agua y totales nutricionales de un día.
 */
export async function GET(request: NextRequest) {
  // 1. Obtener y validar la fecha del query
  const searchParams = request.nextUrl.searchParams;
  const dateParam = searchParams.get('date');

  if (!dateParam) {
    return NextResponse.json({ message: "Parámetro 'date' es requerido." }, { status: 400 });
  }

  const result = dateQuerySchema.safeParse({ date: dateParam });

  if (!result.success) {
    return NextResponse.json({ message: result.error.errors[0].message }, { status: 400 });
  }

  // En un entorno real, obtendrías el userId de la sesión/token de autenticación
  const userId = 'mock-user-uuid-123'; 
  const targetDate = new Date(dateParam);
  
  // 2. Consulta y agregación de datos (MOCKEO)
  try {
    // a) Obtener comidas del día
    // const meals = await prisma.diaryMeal.findMany({ where: { userId, date: targetDate }, include: { product: true } });
    const mockMeals = {
      breakfast: [{ productId: 'p1', name: 'Huevos', calories: 200, macros: { protein: 15, carbs: 2, fats: 15 }, time: '08:00' }],
      lunch: [{ productId: 'p2', name: 'Pollo y arroz', calories: 500, macros: { protein: 45, carbs: 60, fats: 8 }, time: '13:30' }],
      dinner: [],
      snacks: [],
    };
    
    // b) Obtener ingesta de agua
    // const waterIntake = await prisma.dailyWater.findUnique({ where: { date: targetDate, userId } });
    const mockWater = { glasses: 5 };

    // c) Obtener entrenamiento del día (vinculado a /api/training/generate/route.ts)
    // Se asume una función de servicio para esto: fetchDailyWorkout(userId, date);
    const mockWorkout = { completed: true, exercises: [{ name: 'Squats', sets: 4 }] };

    // d) Calcular totales (La lógica de cálculo de macros se haría aquí o en un servicio)
    const mockTotals = {
      calories: 700,
      protein: 60,
      carbs: 62,
      fats: 23,
    };

    const response = {
      date: dateParam,
      meals: mockMeals,
      workout: mockWorkout,
      waterIntake: mockWater.glasses,
      totals: mockTotals,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching diary data:', error);
    return NextResponse.json({ message: "Error interno al obtener los datos del diario." }, { status: 500 });
  }
}