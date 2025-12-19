// src/app/api/progress/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { progressQuerySchema } from '@/lib/validations/progress';
import prisma from '@/lib/prisma';
import { calculateIMC } from '@/lib/calculations/imc'; // Tu función de cálculo de IMC

// Función de MOCK para obtener la fecha de inicio del período
const getStartDate = (period: string): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  switch (period) {
    case '7': return new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '30': return new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    case '90': return new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
    default: return new Date(0); // 'all'
  }
};

/**
 * GET /api/progress?period=30
 * Obtiene histórico de peso, medidas, fotos y estadísticas de un período.
 */
export async function GET(request: NextRequest) {
  // 1. Obtener y validar el query parameter
  const searchParams = request.nextUrl.searchParams;
  const period = searchParams.get('period') || '30'; // Default a 30 días
  const validation = progressQuerySchema.safeParse({ period });

  if (!validation.success) {
    return NextResponse.json({ message: "Parámetro 'period' inválido." }, { status: 400 });
  }

  // Obtener userId (MOCKEO, reemplazar por autenticación real)
  const userId = 'mock-user-uuid-123'; 
  const startDate = getStartDate(period);
  
  try {
    // 2. Consulta de históricos (MOCKEO DE PRISMA)
    /*
    const weightHistory = await prisma.weightEntry.findMany({ 
        where: { userId, date: { gte: startDate } }, 
        orderBy: { date: 'asc' } 
    });
    const measurements = await prisma.bodyMeasurement.findMany({ 
        where: { userId, date: { gte: startDate } }, 
        orderBy: { date: 'asc' } 
    });
    const photos = await prisma.progressPhoto.findMany({ 
        where: { userId, date: { gte: startDate } }, 
        orderBy: { date: 'asc' } 
    });
    // Simular obtención de datos de perfil para el peso inicial y altura para el IMC
    const userProfile = { initialWeight: 85.0, heightCm: 180 };
    */

    // MOCK DATA (reemplazar por las consultas reales de arriba)
    const mockWeightHistory = [
      { date: "2024-11-01", weight: 85.0, bodyFat: 20.0 },
      { date: "2024-11-15", weight: 83.2, bodyFat: 19.5 },
      { date: "2024-11-30", weight: 82.5, bodyFat: 18.5 },
    ].map(entry => ({ 
      date: entry.date, 
      weight: entry.weight, 
      bmi: 24.8 // Simular IMC calculado con calculateIMC(entry.weight, userProfile.heightCm)
    }));
    
    const mockMeasurements = [
      { date: "2024-11-01", waist: 92, chest: 98, hips: 100 },
      { date: "2024-11-30", waist: 88, chest: 98, hips: 99 },
    ];
    
    const mockPhotos = [
      { date: "2024-11-01", frontUrl: "https://placehold.co/150x200/1e293b/475569?text=Front", sideUrl: "https://placehold.co/150x200/1e293b/475569?text=Side" },
    ];

    // 3. Cálculo de Estadísticas (MOCKEO)
    const initialWeight = 85.0; // Obtener de userProfile
    const latestWeight = 82.5; // Obtener del último registro
    
    const stats = {
      totalLost: initialWeight - latestWeight, // kg
      avgLossPerWeek: 0.6, // kg/semana
      daysToGoal: 56,
      adherence: 85, // % días con objetivo cumplido
    };
    
    const response = {
      weightHistory: mockWeightHistory,
      measurements: mockMeasurements,
      photos: mockPhotos,
      stats: stats,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching progress data:', error);
    return NextResponse.json({ message: "Error interno al obtener los datos de progreso." }, { status: 500 });
  }
}