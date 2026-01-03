# 🚨 CRITICAL FIXES NEEDED - DO NOT DEPLOY TO PRODUCTION

## ⛔ DEPLOYMENT BLOCKERS

### 1. **HARDCODED MOCK USER IDs (8 files)**
```bash
# Files to fix:
src/app/api/diary/route.ts:32
src/app/api/diary/meal/route.ts:32
src/app/api/diary/water/route.ts:24
src/app/api/diary/excercise/[id]/route.ts:36
src/app/api/progress/route.ts:34
src/app/api/progress/weight/route.ts:24
src/app/api/meal-plan/generate/route.ts:11
src/app/api/meal-plan/assign/route.ts:10,44
```

**Replace:**
```typescript
const userId = 'mock-user-uuid-123'; // ❌ SECURITY VULNERABILITY
```

**With:**
```typescript
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

const session = await auth();
if (!session?.user?.email) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

const user = await prisma.user.findUnique({
  where: { email: session.user.email }
});

if (!user) {
  return NextResponse.json({ error: 'User not found' }, { status: 404 });
}

const userId = user.id; // ✅ Real authenticated user
```

---

### 2. **STRIPE WEBHOOK WILL CRASH**
**File:** `src/app/api/webhooks/stripe/route.ts:36`

**Problem:** Uses `prisma` without importing it

**Fix:**
```typescript
// Add at top of file:
import prisma from '@/lib/prisma';
```

---

### 3. **NO RATE LIMITING ON AUTH ENDPOINTS**

**Add to these files:**
- `src/app/api/auth/register/route.ts`
- `src/app/api/auth/forgot-password/route.ts`
- `src/app/api/contact/submit/route.ts`
- `src/app/api/planning/generate-week/route.ts`

**Add this code:**
```typescript
import { ratelimit } from '@/lib/lib_rate-limiter';

export async function POST(request: NextRequest) {
  const identifier = request.headers.get('x-forwarded-for') || 'anonymous';
  const { success } = await ratelimit.limit(identifier);

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  // ... rest of route
}
```

---

### 4. **MOCK DATA IN PRODUCTION ROUTES**

**Files to fix:**
- `src/app/api/shopping/route.ts` - Returns fake shopping list
- `src/app/api/diary/route.ts` - Returns fake meals/water/workout
- `src/app/api/meal-plan/route.ts` - Returns fake meal plans

**Action:** Replace mock data with real database queries

---

### 5. **SQLITE IN PRODUCTION**
**File:** `prisma/schema.prisma:7`

**Current:**
```prisma
datasource db {
  provider = "sqlite"  // ❌ Not production-ready
}
```

**Change to:**
```prisma
datasource db {
  provider = "postgresql"  // ✅ Production-ready
}
```

---

### 6. **NO INPUT VALIDATION ON PAYMENT ROUTES**
**File:** `src/app/api/payments/create-checkout/route.ts`

**Add:**
```typescript
import { z } from 'zod';

const CheckoutSchema = z.object({
  plan: z.enum(['free', 'premium', 'pro']),
  cycle: z.enum(['monthly', 'annual'])
});

const validation = CheckoutSchema.safeParse(body);
if (!validation.success) {
  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}
```

---

## 📊 CURRENT STATUS

| Issue | Severity | Files Affected | Est. Fix Time |
|-------|----------|----------------|---------------|
| Mock User IDs | CRITICAL | 8 | 4 hours |
| Stripe Webhook | CRITICAL | 1 | 5 minutes |
| Rate Limiting | HIGH | 5+ | 2 hours |
| Mock Data | CRITICAL | 3 | 3 hours |
| SQLite | HIGH | 1 | 1 day |
| Input Validation | HIGH | 10+ | 4 hours |

**Total Estimated Time to Fix Critical Issues:** 2-3 days

---

## ✅ VERIFICATION CHECKLIST

After fixes, verify:

- [ ] Can't access other users' data (test with different accounts)
- [ ] Unauthenticated requests return 401
- [ ] Rate limiting triggers after 5-10 requests
- [ ] Stripe webhook processes test payment successfully
- [ ] No mock data returned in any API response
- [ ] All API routes use real database queries
- [ ] PostgreSQL connection works in staging
- [ ] Input validation rejects malformed requests

---

## 🚀 DEPLOYMENT PROCESS

```bash
# 1. Fix all critical issues above
# 2. Test manually in development
# 3. Run tests (after writing them!)
pnpm test

# 4. Type check
pnpm type-check

# 5. Lint
pnpm lint

# 6. Build for production
pnpm build

# 7. Deploy to staging first
vercel --env=staging

# 8. Test in staging
# 9. Deploy to production only if all tests pass
vercel --prod
```

---

**For full details, see:** [CODE_REVIEW_REPORT.md](./CODE_REVIEW_REPORT.md)
