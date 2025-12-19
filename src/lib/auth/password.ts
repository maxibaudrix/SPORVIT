// src/lib/auth/password.ts
import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 12

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function validatePasswordStrength(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Debe incluir al menos una letra minúscula')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Debe incluir al menos una letra mayúscula')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Debe incluir al menos un número')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}