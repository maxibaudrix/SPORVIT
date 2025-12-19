// src/lib/auth/tokens.ts
import { randomBytes } from 'crypto'
import prisma  from '@/lib/prisma'

const TOKEN_EXPIRY_HOURS = 1 // 1 hora para reset de contraseña

export async function generatePasswordResetToken(email: string): Promise<string> {
  // Eliminar tokens anteriores del mismo email
  await prisma.passwordResetToken.deleteMany({
    where: { email },
  })

  // Generar token único
  const token = randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000)

  // Guardar en BD
  await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  })

  return token
}

export async function verifyPasswordResetToken(token: string): Promise<{
  valid: boolean
  email?: string
}> {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  })

  if (!resetToken) {
    return { valid: false }
  }

  // Verificar expiración
  if (resetToken.expires < new Date()) {
    await prisma.passwordResetToken.delete({
      where: { token },
    })
    return { valid: false }
  }

  return {
    valid: true,
    email: resetToken.email,
  }
}

export async function deletePasswordResetToken(token: string): Promise<void> {
  await prisma.passwordResetToken.delete({
    where: { token },
  }).catch(() => {
    // Token ya eliminado, ignorar error
  })
}