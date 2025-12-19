// src/app/api/auth/forgot-password/route.ts
import { NextResponse } from 'next/server'
import prisma  from '@/lib/prisma'
import { generatePasswordResetToken } from '@/lib/auth/tokens'
import { sendEmail } from '@/lib/email/send-email'
import ResetPasswordEmail from '@/lib/email/templates/reset-password'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email requerido' },
        { status: 400 }
      )
    }

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Por seguridad, siempre retornar éxito (no revelar si el email existe)
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'Si el email existe, recibirás un enlace de recuperación',
      })
    }

    // Generar token
    const token = await generatePasswordResetToken(email)

    // Construir URL de reset
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`

    // Enviar email
    await sendEmail({
      to: email,
      subject: 'Restablece tu contraseña - Sporvit',
      react: ResetPasswordEmail({
        name: user.name || 'Usuario',
        resetLink,
      }),
    })

    return NextResponse.json({
      success: true,
      message: 'Si el email existe, recibirás un enlace de recuperación',
    })
  } catch (error) {
    console.error('Error en forgot-password:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}