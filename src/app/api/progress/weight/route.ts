// src/app/api/progress/weight/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { addWeightSchema } from '@/lib/validations/progress';
import prisma from '@/lib/prisma'; // Tu instancia de Prisma

/**
 * POST /api/progress/weight
 * Registra una nueva entrada de peso.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Validar el cuerpo de la petición con Zod
    const validation = addWeightSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: "Datos de peso inválidos.", errors: validation.error.format() }, { status: 400 });
    }

    const { date, weight, bodyFat } = validation.data;

    // Obtener userId (MOCKEO, reemplazar por lógica de autenticación)
    const userId = 'mock-user-uuid-123';
    const targetDate = new Date(date + 'T00:00:00Z'); // Usar T00:00:00Z para consistencia de fecha

    // 2. Insertar en la base de datos (MOCKEO DE PRISMA)
    /*
    const newEntry = await prisma.weightEntry.upsert({
      where: { userId_date: { userId, date: targetDate } },
      update: { weight, bodyFat },
      create: { 
        userId, 
        date: targetDate, 
        weight, 
        bodyFat 
      },
    });
    */
    
    const mockResponse = { id: "new-weight-uuid", date, weight, bodyFat: bodyFat ?? null };

    return NextResponse.json({ 
      message: "Peso registrado exitosamente.", 
      data: mockResponse 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error al registrar peso:', error);
    // Manejar errores específicos de la DB (ej. clave única duplicada si se usa create en lugar de upsert)
    return NextResponse.json({ message: "Error interno del servidor al registrar peso." }, { status: 500 });
  }
}