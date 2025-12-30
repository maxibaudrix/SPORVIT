import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/user/load-plan
 * Guarda un plan predefinido (desde /planes) en el perfil del usuario
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { userId, programSlug, programData } = body;

    // Validar que el userId coincida con la sesión
    if (userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Usuario no coincide con la sesión' },
        { status: 403 }
      );
    }

    // Validar datos requeridos
    if (!programSlug || !programData) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      );
    }

    console.log('📦 Guardando plan predefinido:', {
      userId,
      programSlug,
      programTitle: programData.meta?.title,
      weeks: programData.metadata?.duracion_total_semanas,
    });

    // TODO: Implementar la lógica de guardado en base de datos
    // Opciones:
    // 1. Crear entradas en Workout y Meal para cada día del programa
    // 2. Guardar como GeneratedPlan en formato JSON
    // 3. Guardar referencia al programa + sobrescribir plan existente

    // Por ahora, registramos el plan como GeneratedPlan
    const generatedPlan = await prisma.generatedPlan.create({
      data: {
        userId: userId,
        planType: 'training',
        startDate: new Date(), // TODO: Obtener del onboarding o usar fecha actual
        endDate: new Date(Date.now() + programData.metadata.duracion_total_semanas * 7 * 24 * 60 * 60 * 1000),
        planData: JSON.stringify(programData),
        status: 'active',
      },
    });

    console.log('✅ Plan guardado con ID:', generatedPlan.id);

    return NextResponse.json({
      success: true,
      planId: generatedPlan.id,
      message: 'Plan cargado exitosamente',
    });

  } catch (error) {
    console.error('❌ Error guardando plan:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}