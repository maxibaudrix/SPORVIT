// ============================================
// 7. app/api/user/account/route.ts
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { auth } from '@/auth';
import prisma  from '@/lib/prisma';

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

    await prisma.user.delete({
      where: { id: user.id }
    });

    console.log(`Usuario eliminado: ${user.email} (${user.id}) en ${new Date().toISOString()}`);

    return NextResponse.json({ 
      success: true,
      message: 'Cuenta eliminada correctamente'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { error: 'Error al eliminar cuenta' },
      { status: 500 }
    );
  }
}