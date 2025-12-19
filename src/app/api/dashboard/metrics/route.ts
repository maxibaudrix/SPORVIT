// ============================================
// 1. app/api/dashboard/metrics/today/route.ts
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';


export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        profile: true,
        goals: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Obtener fecha de hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Obtener comidas del día
    const todayMeals = await prisma.diaryMeal.findMany({
      where: {
        userId: user.id,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      },
      include: {
        product: true
      }
    });

    // Calcular calorías y macros consumidos
    let caloriesConsumed = 0;
    let protein = 0;
    let carbs = 0;
    let fats = 0;

    todayMeals.forEach(meal => {
      const ratio = meal.servingSize / 100; // Asumiendo que los valores del producto son por 100g
      caloriesConsumed += (meal.product.energyKcal || 0) * ratio;
      protein += (meal.product.proteinsG || 0) * ratio;
      carbs += (meal.product.carbohydratesG || 0) * ratio;
      fats += (meal.product.fatG || 0) * ratio;
    });

    // Obtener pasos del día (si existe registro)
    const dailySteps = await prisma.dailySteps.findUnique({
      where: {
        userId_date: {
          userId: user.id,
          date: today
        }
      }
    });

    // Obtener peso más reciente
    const latestWeight = await prisma.weightEntry.findFirst({
      where: { userId: user.id },
      orderBy: { date: 'desc' }
    });

    const metrics = {
      caloriesConsumed: Math.round(caloriesConsumed),
      caloriesTarget: user.goals?.targetCalories || 2400,
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fats: Math.round(fats),
      tdee: user.goals?.tdee || 2400,
      weight: latestWeight?.weight || user.profile?.currentWeight || 0,
      steps: dailySteps?.steps || 0,
      stepsTarget: 10000 // Configurable desde settings
    };

    return NextResponse.json({ metrics });

  } catch (error) {
    console.error('Get metrics error:', error);
    return NextResponse.json(
      { error: 'Error al obtener métricas' },
      { status: 500 }
    );
  }
}