// ============================================
// lib/rate-limiter.ts
// Simple rate limiting
// ============================================
import { NextResponse } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export function rateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000 // 1 minuto
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // Limpiar entradas expiradas
  if (entry && entry.resetAt < now) {
    rateLimitStore.delete(identifier);
  }

  const current = rateLimitStore.get(identifier);

  if (!current) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + windowMs
    });
    return { success: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (current.count >= limit) {
    return { success: false, remaining: 0, resetAt: current.resetAt };
  }

  current.count++;
  return { 
    success: true, 
    remaining: limit - current.count, 
    resetAt: current.resetAt 
  };
}

// Middleware para aplicar rate limiting
export function withRateLimit(
  handler: Function,
  limit: number = 10,
  windowMs: number = 60000
) {
  return async (request: Request, ...args: any[]) => {
    const identifier = request.headers.get('x-forwarded-for') || 'unknown';
    const result = rateLimit(identifier, limit, windowMs);

    if (!result.success) {
      return NextResponse.json(
        { 
          error: 'Demasiadas solicitudes. Intenta de nuevo más tarde.',
          resetAt: new Date(result.resetAt).toISOString()
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': result.resetAt.toString()
          }
        }
      );
    }

    return handler(request, ...args);
  };
}