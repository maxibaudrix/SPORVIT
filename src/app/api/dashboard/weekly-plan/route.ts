import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/dashboard/weekly-plan
 * Obtiene el plan semanal (workouts + meals) para una fecha específica
 * Query params: startDate (YYYY-MM-DD format)
 */
export async function GET(request: Request) {
  try {
    // Verificar autenticación
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');

    if (!startDateParam) {
      return NextResponse.json(
        { error: 'Parámetro startDate requerido' },
        { status: 400 }
      );
    }

    // Parse start date and calculate end date (7 days)
    const startDate = new Date(startDateParam);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);
    endDate.setHours(23, 59, 59, 999);

    // Fetch workouts for the week
    const workouts = await prisma.workout.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Fetch meals for the week
    const meals = await prisma.meal.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Group by date
    const daysByDate: Record<string, { workouts: any[]; meals: any[] }> = {};
    
    // Initialize all days of the week
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      daysByDate[dateKey] = { workouts: [], meals: [] };
    }

    // Add workouts to corresponding days
    workouts.forEach(workout => {
      const dateKey = new Date(workout.date).toISOString().split('T')[0];
      if (daysByDate[dateKey]) {
        daysByDate[dateKey].workouts.push({
          id: workout.id,
          userId: workout.userId,
          date: workout.date,
          workoutType: workout.workoutType,
          title: workout.title,
          description: workout.description,
          durationMinutes: workout.durationMinutes,
          estimatedCalories: workout.estimatedCalories,
          completed: workout.completed,
          completedAt: workout.completedAt,
          actualDurationMin: workout.actualDurationMin,
          actualCalories: workout.actualCalories,
          createdAt: workout.createdAt,
          // Note: series and repetitions would need to be added to schema
          // or extracted from description/notes
        });
      }
    });

    // Add meals to corresponding days
    meals.forEach(meal => {
      const dateKey = new Date(meal.date).toISOString().split('T')[0];
      if (daysByDate[dateKey]) {
        daysByDate[dateKey].meals.push({
          id: meal.id,
          userId: meal.userId,
          date: meal.date,
          mealType: meal.mealType,
          totalCalories: meal.totalCalories,
          totalProteinG: meal.totalProteinG,
          totalCarbsG: meal.totalCarbsG,
          totalFatG: meal.totalFatG,
          notes: meal.notes,
          createdAt: meal.createdAt,
        });
      }
    });

    // Calculate week number (simple calculation, can be improved)
    const weekNumber = Math.ceil(
      (startDate.getTime() - new Date(startDate.getFullYear(), 0, 1).getTime()) / 
      (7 * 24 * 60 * 60 * 1000)
    );

    return NextResponse.json({
      success: true,
      weekNumber,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      days: daysByDate,
    });
  } catch (error) {
    console.error('Error fetching weekly plan:', error);
    return NextResponse.json(
      { error: 'Error al obtener el plan semanal' },
      { status: 500 }
    );
  }
}
