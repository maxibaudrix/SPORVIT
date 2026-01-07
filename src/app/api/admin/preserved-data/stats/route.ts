// app/api/admin/preserved-data/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getWorkoutsStats, getRecipesStats } from '@/lib/services/dataPreservation';

/**
 * GET /api/admin/preserved-data/stats
 * Obtiene estadísticas de los datos preservados (entrenamientos y recetas)
 * Solo accesible para administradores
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    // Verificar autenticación
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // TODO: Verificar que el usuario es admin
    // Por ahora permitimos a cualquier usuario autenticado
    // if (session.user.role !== 'admin') {
    //   return NextResponse.json(
    //     { error: 'Acceso denegado - Solo administradores' },
    //     { status: 403 }
    //   );
    // }

    // Obtener estadísticas en paralelo
    const [workoutsStats, recipesStats] = await Promise.all([
      getWorkoutsStats(),
      getRecipesStats(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        workouts: workoutsStats,
        recipes: recipesStats,
        totalItems: workoutsStats.total + recipesStats.total,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas de datos preservados:', error);
    return NextResponse.json(
      {
        error: 'Error al obtener estadísticas',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
