// src/app/api/diary/water/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { addWaterSchema } from '@/lib/validations/diary'; // Importar esquema Zod
import prisma from '@/lib/prisma'; // Importa tu instancia de Prisma

/**
 * POST /api/diary/water
 * Incrementa la ingesta de agua del día actual o de una fecha específica.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Validar el cuerpo de la petición con Zod
    const validation = addWaterSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: "Datos de agua inválidos.", errors: validation.error.format() }, { status: 400 });
    }

    const { date, glasses } = validation.data;

    // Obtener userId (MOCKEO, reemplazar por lógica de autenticación)
    const userId = 'mock-user-uuid-123';
    
    const targetDate = new Date(date + 'T00:00:00Z');

    // 2. Upsert en la base de datos (MOCKEO DE PRISMA)
    /*
    const updatedWater = await prisma.dailyWater.upsert({
      where: { date_userId: { date: targetDate, userId } },
      update: { glasses: { increment: glasses } },
      create: { 
        userId, 
        date: targetDate, 
        glasses: glasses,
      },
    });
    */

    const mockResponse = { date, newGlassesTotal: 6 }; // Simular que el total es 6

    return NextResponse.json({ 
      message: "Ingesta de agua registrada exitosamente.", 
      data: mockResponse 
    }, { status: 200 });

  } catch (error) {
    console.error('Error al registrar agua:', error);
    return NextResponse.json({ message: "Error interno del servidor." }, { status: 500 });
  }
}