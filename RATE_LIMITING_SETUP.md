# Rate Limiting Implementation - SPORVIT

## Current Implementation Status

✅ **COMPLETED: In-Memory Rate Limiting**

Rate limiting has been successfully implemented across all critical endpoints using an in-memory solution suitable for development and small-scale production.

### Protected Endpoints

#### 🔐 Authentication Endpoints (VERY STRICT)
**Limit:** 5 requests per 15 minutes
- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot-password` - Password reset requests (3 requests per hour)
- `POST /api/auth/reset-password` - Password reset confirmation (3 requests per hour)
- `GET /api/auth/reset-password` - Token validation

#### 🤖 AI Generation Endpoints (MODERATE)
**Limit:** 10 requests per hour
- `POST /api/recipes/generate` - Recipe generation
- `POST /api/training/generate` - Workout generation
- `POST /api/meal-plan/generate` - Meal plan generation
- `POST /api/planning/generate-week` - Weekly plan generation (Google Gemini AI)

#### 📧 Contact & Forms (LENIENT)
**Limit:** 5 requests per hour
- `POST /api/contact/submit` - Contact form submissions

### Rate Limit Headers

All protected endpoints return the following headers:

```
X-RateLimit-Limit: [limit]
X-RateLimit-Remaining: [remaining requests]
X-RateLimit-Reset: [timestamp when limit resets]
Retry-After: [seconds until next request allowed]
```

### Rate Limit Response (429)

When rate limit is exceeded:

```json
{
  "error": "Too many requests. Please try again later.",
  "message": "Demasiadas solicitudes. Intenta de nuevo más tarde.",
  "resetAt": "2024-01-15T10:30:00.000Z",
  "retryAfter": "120 seconds"
}
```

---

## Production Upgrade: Upstash Redis Rate Limiting

### Why Upgrade to Upstash?

The current in-memory solution has limitations:

❌ **Not shared across serverless functions** - Each Lambda/Edge function has its own counter
❌ **Resets on deployment** - Counters are lost when deploying
❌ **Memory overhead** - Stores all rate limit data in RAM

✅ Upstash Redis solves all these issues with:
- **Distributed state** - Shared across all instances
- **Persistent** - Survives deployments and restarts
- **Serverless-first** - Perfect for Vercel/Next.js Edge
- **Low latency** - Global edge network
- **Free tier available** - 10,000 requests/day

---

## Production Setup Guide

### Step 1: Create Upstash Account

1. Go to [upstash.com](https://upstash.com)
2. Sign up with GitHub or email
3. Click "Create Database"
4. Select:
   - **Type:** Regional or Global (Global for multi-region apps)
   - **Region:** Choose closest to your users
   - **Name:** `sporvit-rate-limit` (or your preference)
5. Click "Create"

### Step 2: Get Credentials

After creating the database, copy:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

### Step 3: Install Dependencies

```bash
npm install @upstash/redis
# or
pnpm add @upstash/redis
# or
yarn add @upstash/redis
```

### Step 4: Add Environment Variables

Add to `.env.local` (development):

```env
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

Add to your production environment (Vercel, Railway, etc.):
- Same variables as above
- Use the Vercel dashboard or `vercel env add` command

### Step 5: Create Upstash Rate Limiter

Create a new file: `src/lib/upstash-rate-limiter.ts`

```typescript
// src/lib/upstash-rate-limiter.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// ============================================
// Rate Limit Configurations
// ============================================

/**
 * VERY STRICT: For authentication endpoints
 * 5 requests per 15 minutes
 */
export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  analytics: true,
  prefix: "ratelimit:auth",
});

/**
 * STRICT: For password reset operations
 * 3 requests per hour
 */
export const passwordResetRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  analytics: true,
  prefix: "ratelimit:pwd-reset",
});

/**
 * MODERATE: For AI/expensive operations
 * 10 requests per hour
 */
export const aiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 h"),
  analytics: true,
  prefix: "ratelimit:ai",
});

/**
 * LENIENT: For contact forms
 * 5 requests per hour
 */
export const contactFormRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  analytics: true,
  prefix: "ratelimit:contact",
});

/**
 * GENERAL: For general API endpoints
 * 100 requests per 15 minutes
 */
export const generalRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "15 m"),
  analytics: true,
  prefix: "ratelimit:api",
});

// ============================================
// Helper Functions
// ============================================

/**
 * Get client identifier from request
 */
export function getIdentifier(request: Request, userId?: string): string {
  if (userId) return userId;

  // Try to get IP from headers
  const headers = request.headers;
  const forwardedFor = headers.get("x-forwarded-for");
  const realIp = headers.get("x-real-ip");
  const cfConnectingIp = headers.get("cf-connecting-ip");

  const ip = forwardedFor?.split(",")[0] || realIp || cfConnectingIp || "unknown";
  return ip;
}

/**
 * Reusable rate limit check wrapper
 */
export async function checkRateLimit(
  ratelimit: Ratelimit,
  identifier: string
) {
  const { success, limit, remaining, reset } = await ratelimit.limit(identifier);

  return {
    success,
    limit,
    remaining,
    reset,
    headers: {
      "X-RateLimit-Limit": limit.toString(),
      "X-RateLimit-Remaining": remaining.toString(),
      "X-RateLimit-Reset": reset.toString(),
    },
  };
}
```

### Step 6: Update API Routes

Replace the in-memory rate limiter imports with Upstash:

**Before (In-Memory):**
```typescript
import { withAuthRateLimit } from '@/lib/lib_rate-limiter';

async function handlePOST(request: NextRequest) {
  // ... handler logic
}

export const POST = withAuthRateLimit(handlePOST);
```

**After (Upstash):**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { authRateLimit, getIdentifier, checkRateLimit } from '@/lib/upstash-rate-limiter';

export async function POST(request: NextRequest) {
  // Check rate limit
  const identifier = getIdentifier(request);
  const rateLimitResult = await checkRateLimit(authRateLimit, identifier);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: 'Too many requests. Please try again later.',
        resetAt: new Date(rateLimitResult.reset).toISOString(),
      },
      {
        status: 429,
        headers: rateLimitResult.headers,
      }
    );
  }

  // Your handler logic here
  try {
    // ... existing code
  } catch (error) {
    // ... error handling
  }
}
```

### Step 7: Update All Protected Routes

Apply the same pattern to all routes currently using the in-memory limiter:

1. **Authentication routes:**
   - `/api/auth/register` → Use `authRateLimit`
   - `/api/auth/forgot-password` → Use `passwordResetRateLimit`
   - `/api/auth/reset-password` → Use `passwordResetRateLimit`

2. **AI generation routes:**
   - `/api/recipes/generate` → Use `aiRateLimit`
   - `/api/training/generate` → Use `aiRateLimit`
   - `/api/meal-plan/generate` → Use `aiRateLimit`
   - `/api/planning/generate-week` → Use `aiRateLimit`

3. **Contact form:**
   - `/api/contact/submit` → Use `contactFormRateLimit`

### Step 8: Test in Development

1. Start your dev server: `npm run dev`
2. Test rate limits by making repeated requests:

```bash
# Test auth rate limit (should block after 5 requests in 15 min)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test1234","name":"Test"}'

# Check headers for rate limit info
curl -I http://localhost:3000/api/auth/register
```

3. Verify in Upstash Console:
   - Go to your database
   - Click "Data Browser"
   - You should see keys like `ratelimit:auth:ip:127.0.0.1`

### Step 9: Deploy to Production

1. Add environment variables to your production platform:
   ```bash
   # Vercel
   vercel env add UPSTASH_REDIS_REST_URL
   vercel env add UPSTASH_REDIS_REST_TOKEN

   # Railway
   railway variables set UPSTASH_REDIS_REST_URL=...
   railway variables set UPSTASH_REDIS_REST_TOKEN=...
   ```

2. Deploy:
   ```bash
   git add .
   git commit -m "Add Upstash Redis rate limiting"
   git push
   ```

3. Verify in production:
   ```bash
   curl -I https://your-domain.com/api/auth/register
   ```

---

## Monitoring & Analytics

### View Rate Limit Analytics in Upstash

1. Go to your Upstash dashboard
2. Click on your database
3. Navigate to "Analytics" tab
4. View:
   - Request count per endpoint
   - Blocked requests
   - Peak usage times
   - Geographic distribution (if using Global database)

### Custom Logging (Optional)

Add logging to track rate limit hits:

```typescript
export async function checkRateLimit(
  ratelimit: Ratelimit,
  identifier: string
) {
  const result = await ratelimit.limit(identifier);

  // Log rate limit hits
  if (!result.success) {
    console.warn(`[Rate Limit] Blocked request from ${identifier}`, {
      limit: result.limit,
      reset: new Date(result.reset).toISOString(),
    });
  }

  return result;
}
```

---

## Cost Estimation

### Upstash Pricing (as of 2024)

**Free Tier:**
- 10,000 commands/day
- 256 MB storage
- Perfect for development and small apps

**Pay-As-You-Go:**
- $0.20 per 100K requests
- Typical SPORVIT usage: ~$2-5/month for small-medium traffic

**Pro Plan ($10/month):**
- 1M commands/day included
- Best for production apps

### Expected Usage for SPORVIT

Assuming:
- 1,000 daily active users
- 50 API requests per user per day
- = 50,000 requests/day = 1.5M requests/month

**Cost:** ~$3/month on Pay-As-You-Go or Free on Pro plan

---

## Fallback Strategy

If Upstash is unavailable, implement fallback to in-memory:

```typescript
// src/lib/upstash-rate-limiter.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { rateLimit as inMemoryRateLimit } from "./lib_rate-limiter";

let redis: Redis | null = null;

try {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
} catch (error) {
  console.warn("[Rate Limit] Upstash unavailable, falling back to in-memory");
}

export async function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
) {
  if (!redis) {
    // Fallback to in-memory
    return inMemoryRateLimit(identifier, limit, windowMs);
  }

  // Use Upstash
  // ... Upstash logic
}
```

---

## Security Best Practices

1. **Never expose rate limit credentials** - Keep `.env.local` in `.gitignore`
2. **Use different limits for authenticated vs anonymous users**
3. **Monitor for abuse patterns** - Set up alerts in Upstash
4. **Combine with other security measures:**
   - Input validation (already implemented with Zod)
   - CSRF protection
   - CORS configuration
   - Content Security Policy

5. **Consider user tiers:**
   ```typescript
   const limit = user.plan === 'premium' ? 100 : 10;
   const ratelimit = new Ratelimit({
     redis,
     limiter: Ratelimit.slidingWindow(limit, "1 h"),
   });
   ```

---

## Troubleshooting

### Issue: Rate limit not working

**Check:**
1. Environment variables are set: `echo $UPSTASH_REDIS_REST_URL`
2. Redis connection: Test in Upstash console
3. Identifier is consistent: Log `getIdentifier(request)`

### Issue: Too many false positives

**Solution:** Adjust limits or use authenticated rate limiting:
```typescript
const identifier = session?.user?.id || getIdentifier(request);
```

### Issue: Rate limit persists after testing

**Solution:** Clear keys in Upstash Data Browser or set shorter TTL:
```typescript
limiter: Ratelimit.slidingWindow(5, "1 m"), // 1 minute for testing
```

---

## Next Steps

1. ✅ Test current in-memory implementation
2. ⏳ Set up Upstash account
3. ⏳ Install `@upstash/redis`
4. ⏳ Create `upstash-rate-limiter.ts`
5. ⏳ Update API routes one by one
6. ⏳ Test in development
7. ⏳ Deploy to production
8. ⏳ Monitor analytics

---

## References

- [Upstash Documentation](https://docs.upstash.com/redis)
- [Upstash Rate Limit SDK](https://github.com/upstash/ratelimit)
- [Next.js Rate Limiting Guide](https://nextjs.org/docs/app/building-your-application/routing/middleware#rate-limiting)
- [OWASP Rate Limiting Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html#rate-limiting)

---

**Questions?** Open an issue or contact the development team.
