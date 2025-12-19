// src/app/api/auth/reset-password/route.ts
import { NextResponse } from 'next/server'
import prisma  from '@/lib/prisma'
import {
  verifyPasswordResetToken,
  deletePasswordResetToken,
} from '@/lib/auth/tokens'
import { hashPassword, validatePasswordStrength } from '@/lib/auth/password'

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    // Validación de datos requeridos
    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token y contraseña requeridos' },
        { status: 400 }
      )
    }

    // Validar fuerza de contraseña
    const passwordValidation = validatePasswordStrength(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { 
          error: 'La contraseña no cumple los requisitos de seguridad', 
          details: passwordValidation.errors 
        },
        { status: 400 }
      )
    }

    // Verificar que el token sea válido y no haya expirado
    const verification = await verifyPasswordResetToken(token)
    if (!verification.valid || !verification.email) {
      return NextResponse.json(
        { error: 'El enlace de recuperación es inválido o ha expirado. Solicita uno nuevo.' },
        { status: 400 }
      )
    }

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { email: verification.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Hashear la nueva contraseña
    const hashedPassword = await hashPassword(password)

    // Actualizar contraseña del usuario
    await prisma.user.update({
      where: { email: verification.email },
      data: { 
        password: hashedPassword,
        updatedAt: new Date(),
      },
    })

    // Eliminar el token usado (invalidarlo)
    await deletePasswordResetToken(token)

    // Opcional: Invalidar todas las sesiones activas del usuario por seguridad
    await prisma.session.deleteMany({
      where: { userId: user.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada correctamente. Ya puedes iniciar sesión con tu nueva contraseña.',
    })

  } catch (error) {
    console.error('Error en reset-password:', error)
    
    // No exponer detalles del error en producción
    return NextResponse.json(
      { 
        error: 'Error al restablecer la contraseña. Por favor, intenta de nuevo o contacta soporte.',
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
      },
      { status: 500 }
    )
  }
}

// Endpoint GET para validar token sin cambiar contraseña (útil para UI)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token requerido' },
        { status: 400 }
      )
    }

    // Verificar token
    const verification = await verifyPasswordResetToken(token)

    if (!verification.valid) {
      return NextResponse.json(
        { 
          valid: false, 
          error: 'Token inválido o expirado' 
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      valid: true,
      email: verification.email, // Útil para mostrar en la UI
    })

  } catch (error) {
    console.error('Error validando token:', error)
    return NextResponse.json(
      { error: 'Error al validar el token' },
      { status: 500 }
    )
  }
}