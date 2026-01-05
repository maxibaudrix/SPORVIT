// ============================================
// lib/rate-limiter.ts
// Simple rate limiting with multiple tiers
// NOTE: This is an in-memory solution. For production, consider using
// Upstash Redis for distributed rate limiting across serverless functions.
// ============================================
import { NextRequest, NextResponse } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Get client identifier from request
 * Priority: userId (authenticated) > IP address > unknown
 */
export function getClientIdentifier(request: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`;

  // Try multiple headers for IP address
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  const ip = forwardedFor?.split(',')[0].trim() || realIp || cfConnectingIp || 'unknown';
  return `ip:${ip}`;
}

export function rateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000 // 1 minute
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // Clean expired entries
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

// Middleware to apply rate limiting
export function withRateLimit(
  handler: Function,
  limit: number = 10,
  windowMs: number = 60000,
  options?: {
    userId?: string;
    keyPrefix?: string;
  }
) {
  return async (request: NextRequest, ...args: any[]) => {
    const baseIdentifier = getClientIdentifier(request, options?.userId);
    const identifier = options?.keyPrefix
      ? `${options.keyPrefix}:${baseIdentifier}`
      : baseIdentifier;

    const result = rateLimit(identifier, limit, windowMs);

    if (!result.success) {
      const resetDate = new Date(result.resetAt);
      const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);

      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          message: 'Demasiadas solicitudes. Intenta de nuevo más tarde.',
          resetAt: resetDate.toISOString(),
          retryAfter: `${retryAfter} seconds`
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': result.resetAt.toString(),
            'Retry-After': retryAfter.toString()
          }
        }
      );
    }

    // Add rate limit info to successful responses (can be used by client)
    const response = await handler(request, ...args);

    // Only add headers if response is a NextResponse
    if (response instanceof NextResponse) {
      response.headers.set('X-RateLimit-Limit', limit.toString());
      response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
      response.headers.set('X-RateLimit-Reset', result.resetAt.toString());
    }

    return response;
  };
}

// ============================================
// Predefined Rate Limit Tiers
// ============================================

/**
 * VERY STRICT: For authentication endpoints (login, register, password reset)
 * 5 requests per 15 minutes
 */
export function withAuthRateLimit(handler: Function) {
  return withRateLimit(handler, 5, 15 * 60 * 1000, { keyPrefix: 'auth' });
}

/**
 * STRICT: For password reset and sensitive operations
 * 3 requests per hour
 */
export function withPasswordResetRateLimit(handler: Function) {
  return withRateLimit(handler, 3, 60 * 60 * 1000, { keyPrefix: 'pwd-reset' });
}

/**
 * MODERATE: For AI/expensive operations (recipe gen, workout gen, etc)
 * 10 requests per hour
 */
export function withAIRateLimit(handler: Function) {
  return withRateLimit(handler, 10, 60 * 60 * 1000, { keyPrefix: 'ai-gen' });
}

/**
 * LENIENT: For contact forms and general submissions
 * 5 requests per hour
 */
export function withContactFormRateLimit(handler: Function) {
  return withRateLimit(handler, 5, 60 * 60 * 1000, { keyPrefix: 'contact' });
}

/**
 * GENERAL: For general API endpoints
 * 100 requests per 15 minutes
 */
export function withGeneralRateLimit(handler: Function) {
  return withRateLimit(handler, 100, 15 * 60 * 1000, { keyPrefix: 'api' });
}