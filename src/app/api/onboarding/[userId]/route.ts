// src/app/api/onboarding/[userId]/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@/auth'; // Reemplazar con la ruta correcta a tu configuración
import { prisma } from '@/lib/db'; // Asumiendo que /lib/db.ts contiene la instancia de prisma

/**
 * Define la estructura de los parámetros de la solicitud, donde 'userId' es el nombre
 * de la carpeta dinámica en la URL (e.g., /api/onboarding/clj0o28qj0000...)
 */
interface OnboardingParams {
  params: {
    userId: string;
  };
}

/**
 * Maneja la solicitud GET para obtener los datos completos del onboarding de un usuario.
 * @param request La solicitud HTTP entrante.
 * @param params El objeto que contiene el userId de la URL.
 * @returns Un objeto JSON con los datos del onboarding o un error.
 */
export async function GET(request: Request, { params }: OnboardingParams) {
  // 1. AUTENTICACIÓN Y AUTORIZACIÓN
  const session = await auth();
  
  // Asegurar que haya sesión y que el usuario esté autorizado a ver los datos
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const requestedUserId = params.userId;
  const currentUserId = session.user.id;

  // Política de acceso: Solo el usuario puede ver sus propios datos de onboarding
  if (requestedUserId !== currentUserId) {
    return NextResponse.json({ error: "Acceso denegado. No puede ver datos de otros usuarios." }, { status: 403 });
  }

  // 2. BÚSQUEDA EN BASE DE DATOS
  try {
    // Buscar los registros de OnboardingData, UserProfile y UserGoals
    const [onboardingDataRecord, userProfile, userGoals] = await Promise.all([
      prisma.onboardingData.findUnique({
        where: { userId: requestedUserId },
        select: { data: true, status: true } // Solo necesitamos el campo 'data' (JSON completo) y 'status'
      }),
      prisma.userProfile.findUnique({
        where: { userId: requestedUserId },
      }),
      prisma.userGoals.findUnique({
        where: { userId: requestedUserId },
      }),
    ]);
    
    if (!onboardingDataRecord) {
      return NextResponse.json({ error: "Datos de onboarding no encontrados para este usuario." }, { status: 404 });
    }

    // 3. RESPUESTA DE ÉXITO
    return NextResponse.json({
      success: true,
      data: {
        // Devolvemos el JSON completo del formulario original
        fullFormData: onboardingDataRecord.data, 
        // También devolvemos los datos estructurados guardados en los modelos
        profile: userProfile,
        goals: userGoals,
        status: onboardingDataRecord.status
      }
    }, { status: 200 });

  } catch (error) {
    console.error(`Error al obtener datos de onboarding para ${requestedUserId}:`, error);
    return NextResponse.json({ 
      success: false, 
      error: "Error interno del servidor al consultar la base de datos." 
    }, { status: 500 });
  }
}