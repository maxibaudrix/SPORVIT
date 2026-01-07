// ============================================
// 7. app/api/user/account/route.ts
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { auth } from '@/auth';
import prisma  from '@/lib/prisma';
import { preserveUserData } from '@/lib/services/dataPreservation';

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // ✅ PASO 1: Preservar entrenamientos y recetas ANTES de eliminar
    console.log(`📦 Preservando datos del usuario antes de eliminar: ${user.email} (${user.id})`);

    let preservationStats = { workoutsPreserved: 0, recipesPreserved: 0 };
    try {
      preservationStats = await preserveUserData(user.id);
      console.log(`✅ Datos preservados: ${preservationStats.workoutsPreserved} entrenamientos, ${preservationStats.recipesPreserved} recetas`);
    } catch (preservationError) {
      // Continuar con la eliminación incluso si falla la preservación
      console.error('⚠️ Error preservando datos (continuando con eliminación):', preservationError);
    }

    // ✅ PASO 2: Eliminar usuario (cascade eliminará todos los datos relacionados)
    await prisma.user.delete({
      where: { id: user.id }
    });

    console.log(`✅ Usuario eliminado: ${user.email} (${user.id}) en ${new Date().toISOString()}`);
    console.log(`📊 Datos preservados: ${preservationStats.workoutsPreserved} entrenamientos, ${preservationStats.recipesPreserved} recetas`);

    return NextResponse.json({
      success: true,
      message: 'Cuenta eliminada correctamente',
      preserved: preservationStats
    });

  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { error: 'Error al eliminar cuenta' },
      { status: 500 }
    );
  }
}