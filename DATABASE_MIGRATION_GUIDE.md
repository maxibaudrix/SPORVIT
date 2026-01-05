# Database Migration: SQLite → PostgreSQL

## 🚨 Critical Issue: SQLite in Production

Your application currently uses **SQLite** which has severe limitations for production use:

### ❌ Why SQLite is Not Production-Ready

| Issue | Impact | Severity |
|-------|--------|----------|
| **No concurrent writes** | Only ONE write operation at a time across the entire app | 🔴 CRITICAL |
| **File-based storage** | Entire database is a single file - can be corrupted/lost | 🔴 CRITICAL |
| **No horizontal scaling** | Can't scale across multiple servers/instances | 🔴 CRITICAL |
| **Limited connection pooling** | Poor performance under load | 🔴 HIGH |
| **No point-in-time recovery** | Can't restore to specific time after data loss | 🔴 HIGH |
| **Limited data types** | No native JSON, UUID, or advanced types | 🟡 MEDIUM |
| **No user permissions** | Can't restrict access at database level | 🟡 MEDIUM |

### ✅ Why PostgreSQL

| Feature | Benefit |
|---------|---------|
| **ACID compliance** | Reliable transactions, no data corruption |
| **Concurrent writes** | Handle thousands of simultaneous users |
| **Horizontal scaling** | Add read replicas, scale to millions of rows |
| **Advanced types** | Native JSON, UUID, arrays, full-text search |
| **Point-in-time recovery** | Restore to any second in the past 30 days |
| **Robust backups** | Automated daily backups with retention |
| **Connection pooling** | Better performance with tools like PgBouncer |
| **Free hosting** | Neon, Supabase, Railway offer free tiers |

---

## 📊 Current Database Analysis

### Schema Summary
- **20 models** with complex relationships
- **Auth system:** NextAuth with User, Account, Session models
- **User data:** Profile, Goals, Settings, Subscriptions
- **Tracking:** Meals, Workouts, Progress, Photos
- **Planning:** WeeklyPlan, PlannedMeal, OnboardingData
- **AI:** Logs, GeneratedPlan
- **Payments:** Subscription, Payment (Stripe integration)

### SQLite-Specific Features Used

1. **`@default(cuid())`** - Supported in PostgreSQL ✅
2. **`@default(uuid())`** - Needs type change to `@default(dbgenerated("gen_random_uuid()"))` for PostgreSQL
3. **`String` for JSON** - Can use native `Json` type in PostgreSQL
4. **`@unique([userId, date])`** - Fully supported ✅
5. **File path:** `prisma/dev.db` (442KB currently)

---

## 🎯 Migration Strategy

### Option A: Zero-Downtime Migration (Recommended for Production)
- Keep SQLite for dev
- Migrate production to PostgreSQL
- Use environment-based schema

### Option B: Full Migration (Clean Break)
- Migrate both dev and production
- Export SQLite data
- Import into PostgreSQL

---

## 🚀 Step-by-Step Migration Guide

### Phase 1: Setup PostgreSQL Database

#### Option 1: Neon (Recommended - Free Tier)

**Why Neon?**
- ✅ Free tier: 0.5GB storage, 100h compute/month
- ✅ Serverless PostgreSQL (perfect for Next.js)
- ✅ Auto-scaling and auto-sleep
- ✅ Point-in-time recovery (7 days)
- ✅ Branch databases for dev/staging
- ✅ Fast cold starts (<1s)

**Setup:**
1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub
3. Click "Create Project"
4. Select:
   - **Name:** `sporvit-prod`
   - **Region:** Closest to your users
   - **PostgreSQL version:** 16 (latest)
5. Copy connection string:
   ```
   postgresql://user:password@ep-xxx.region.neon.tech/sporvit?sslmode=require
   ```

#### Option 2: Supabase (Great for Real-time Features)

**Why Supabase?**
- ✅ Free tier: 500MB database, 2GB bandwidth
- ✅ Built-in Auth (can replace NextAuth)
- ✅ Real-time subscriptions
- ✅ Storage for progress photos
- ✅ Edge Functions

**Setup:**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings > Database

#### Option 3: Railway (Simple Deployment)

**Why Railway?**
- ✅ $5/month credit (free tier)
- ✅ PostgreSQL + Redis in one place
- ✅ Easy deployment from GitHub
- ✅ Environment variables management

**Setup:**
1. Go to [railway.app](https://railway.app)
2. New Project > PostgreSQL
3. Copy DATABASE_URL from variables

#### Option 4: Vercel Postgres (If using Vercel)

**Why Vercel Postgres?**
- ✅ Integrated with Vercel deployments
- ✅ Powered by Neon
- ✅ Same dashboard as your app

**Setup:**
1. Vercel Dashboard > Storage > Create Database > Postgres
2. Connect to your project
3. Variables are auto-added

---

### Phase 2: Update Prisma Schema

Create a new schema file for PostgreSQL:

**File: `prisma/schema-postgres.prisma`** (or modify existing)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"  // CHANGED FROM sqlite
  url      = env("DATABASE_URL")
}

// ============================================
// AUTH & USERS
// ============================================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  name          String?
  image         String?
  password      String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  accounts        Account[]
  sessions        Session[]
  profile         UserProfile?
  goals           UserGoals?
  onboardingData  OnboardingData?
  generatedPlans  GeneratedPlan[]
  aiLogs          AIGenerationLog[]
  scannedProducts ScannedProduct[]
  meals           Meal[]
  workouts        Workout[]
  progress        ProgressTracking[]
  recipes         Recipe[]
  weightEntries   WeightEntry[]
  measurements    BodyMeasurement[]
  progressPhotos  ProgressPhoto[]
  diaryMeals      DiaryMeal[]
  plannedMeals    PlannedMeal[]
  dailyWater      DailyWater[]
  dailySteps      DailySteps[]
  weeklyPlans     WeeklyPlan[]
  notifications   Notification[]
  settings        UserSettings?
  subscription    Subscription?
  payments        Payment[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?  @db.Text  // ADDED: Text for long tokens
  access_token      String?  @db.Text  // ADDED: Text for long tokens
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?  @db.Text  // ADDED: Text for long tokens
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])  // ADDED: Index for performance
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])  // ADDED: Index for performance
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@index([token])  // ADDED: Index for lookups
}

// ============================================
// ONBOARDING DATA STORAGE
// ============================================

model OnboardingData {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Use native JSON type in PostgreSQL
  data      Json     // CHANGED: From String to Json

  status    String   @default("completed")
  version   String   @default("1.0.0")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId, status])
}

// ============================================
// GENERATED PLANS
// ============================================

model GeneratedPlan {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  planType  String
  startDate DateTime
  endDate   DateTime

  planData  Json     // CHANGED: From String to Json

  status    String   @default("active")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId, status])
  @@index([userId, startDate])
}

// ============================================
// AI GENERATION LOGS
// ============================================

model AIGenerationLog {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  requestType  String
  promptTokens Int

  responseData Json    // CHANGED: From String to Json
  completionTokens Int

  durationMs Int

  success   Boolean
  error     String?  @db.Text  // ADDED: Text for long errors
  createdAt DateTime @default(now())

  @@index([userId, createdAt])
  @@index([requestType])  // ADDED: For analytics
}

// ============================================
// Keep all other models with these changes:
// 1. @default(uuid()) → @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
// 2. String fields for JSON → Json type
// 3. Add @db.Text for long text fields
// 4. Add performance indexes
// ============================================

// Continue with remaining models...
// (UserProfile, UserGoals, DailySteps, etc.)
```

**Key Changes Summary:**

1. **`provider = "postgresql"`** instead of `"sqlite"`
2. **JSON fields:** `String` → `Json` (native type)
3. **UUID fields:** `@default(uuid())` → `@default(dbgenerated("gen_random_uuid()")) @db.Uuid`
4. **Long text:** Add `@db.Text` for refresh_token, access_token, id_token, error fields
5. **Indexes:** Add missing indexes for performance
6. **Connection string:** Use PostgreSQL URL with SSL

---

### Phase 3: Environment Variables

Update your environment files:

**`.env.local` (Development - Keep SQLite)**
```env
# SQLite for local development (fast, no setup needed)
DATABASE_URL="file:./prisma/dev.db"
```

**`.env.production` (Production - PostgreSQL)**
```env
# PostgreSQL for production (Neon example)
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/sporvit?sslmode=require"

# Connection pooling (recommended for serverless)
DATABASE_URL_POOLER="postgresql://user:password@ep-xxx.neon.tech/sporvit?sslmode=require&pgbouncer=true"

# Use pooler for Prisma in production
POSTGRES_PRISMA_URL="${DATABASE_URL_POOLER}"
POSTGRES_URL_NON_POOLING="${DATABASE_URL}"
```

---

### Phase 4: Data Migration

#### 4A: Export SQLite Data

```bash
# Install migration tool
npm install -g prisma-db-pull

# Export schema
npx prisma db pull --schema=prisma/schema.prisma

# Export data as SQL
sqlite3 prisma/dev.db .dump > prisma/backup.sql

# Or use Prisma Studio to export as JSON
npx prisma studio
# Then manually export each table
```

#### 4B: Manual Data Migration Script

Create `scripts/migrate-data.ts`:

```typescript
import { PrismaClient as SQLiteClient } from '@prisma/client'
import { PrismaClient as PostgresClient } from '@prisma/client'

const sqlite = new SQLiteClient({
  datasources: { db: { url: 'file:./prisma/dev.db' } }
})

const postgres = new PostgresClient({
  datasources: { db: { url: process.env.POSTGRES_URL } }
})

async function migrateData() {
  console.log('Starting migration...')

  // Migrate users first (no dependencies)
  const users = await sqlite.user.findMany()
  console.log(`Migrating ${users.length} users...`)

  for (const user of users) {
    await postgres.user.create({
      data: {
        ...user,
        // Parse JSON strings if needed
        // onboardingData: user.onboardingData ? JSON.parse(user.onboardingData) : null
      }
    })
  }

  // Migrate related data
  console.log('Migrating accounts...')
  const accounts = await sqlite.account.findMany()
  await postgres.account.createMany({ data: accounts })

  console.log('Migrating sessions...')
  const sessions = await sqlite.session.findMany()
  await postgres.session.createMany({ data: sessions })

  // Continue for all tables...
  // Order matters: migrate parent tables before children

  console.log('Migration complete!')
}

migrateData()
  .catch(console.error)
  .finally(() => {
    sqlite.$disconnect()
    postgres.$disconnect()
  })
```

Run:
```bash
# Set environment variable
export POSTGRES_URL="postgresql://..."

# Run migration
npx tsx scripts/migrate-data.ts
```

---

### Phase 5: Update Prisma Configuration

#### 5A: Production Schema Only

**Option 1: Single schema with environment variable**

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then use different DATABASE_URL in dev (.env.local) vs production (.env.production).

**NOTE:** This won't work because Prisma doesn't support different providers via env var.

#### 5B: Separate Schemas (RECOMMENDED)

**Keep:** `prisma/schema.prisma` (SQLite for dev)
**Add:** `prisma/schema-postgres.prisma` (PostgreSQL for prod)

In `package.json`:
```json
{
  "scripts": {
    "db:migrate:dev": "prisma migrate dev --schema=prisma/schema.prisma",
    "db:migrate:prod": "prisma migrate deploy --schema=prisma/schema-postgres.prisma",
    "db:generate:dev": "prisma generate --schema=prisma/schema.prisma",
    "db:generate:prod": "prisma generate --schema=prisma/schema-postgres.prisma",
    "db:studio:dev": "prisma studio --schema=prisma/schema.prisma",
    "db:studio:prod": "prisma studio --schema=prisma/schema-postgres.prisma"
  }
}
```

#### 5C: Unified Approach (Convert Dev to PostgreSQL)

**Best for consistency:** Use PostgreSQL everywhere

1. Run PostgreSQL locally with Docker:
   ```bash
   docker run -d \
     --name sporvit-postgres \
     -e POSTGRES_PASSWORD=dev123 \
     -e POSTGRES_DB=sporvit \
     -p 5432:5432 \
     postgres:16
   ```

2. Update `.env.local`:
   ```env
   DATABASE_URL="postgresql://postgres:dev123@localhost:5432/sporvit"
   ```

3. Migrate:
   ```bash
   npx prisma migrate dev
   ```

---

### Phase 6: Deploy to Production

#### 6A: Vercel Deployment

1. **Add PostgreSQL to Vercel:**
   - Go to Storage tab
   - Create Postgres database
   - Connect to your project

2. **Update build command:**
   ```json
   {
     "build": "prisma generate && prisma migrate deploy && next build"
   }
   ```

3. **Environment variables automatically added**

#### 6B: Railway/Other Platforms

1. Add DATABASE_URL environment variable
2. Add build command:
   ```bash
   npx prisma migrate deploy && npm run build
   ```

3. Deploy:
   ```bash
   git push origin main
   ```

---

## 🔍 Validation & Testing

### After Migration Checklist

- [ ] All tables created: `npx prisma studio`
- [ ] Indexes created: Check with `\d+ table_name` in psql
- [ ] Data migrated correctly: Compare counts
- [ ] Authentication works: Test login/register
- [ ] API endpoints work: Test all CRUD operations
- [ ] Foreign keys enforced: Test cascade deletes
- [ ] Performance acceptable: Check slow queries

### Test Queries

```sql
-- Check table counts
SELECT
  schemaname,
  tablename,
  pg_total_relation_size(schemaname||'.'||tablename) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY size DESC;

-- Check indexes
SELECT tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Check constraints
SELECT conname, contype, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE connamespace = 'public'::regnamespace;
```

---

## 📈 Performance Optimization

### Connection Pooling

Add to your Prisma client:

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Add Indexes for Common Queries

```prisma
model User {
  // ...
  @@index([email])
  @@index([createdAt])
}

model DiaryMeal {
  // ...
  @@index([userId, date, mealType])  // Composite index for diary queries
}

model WeightEntry {
  // ...
  @@index([userId, date])  // For progress charts
}
```

---

## 💰 Cost Estimation

### Free Tiers Comparison

| Provider | Storage | Compute | Bandwidth | Connections |
|----------|---------|---------|-----------|-------------|
| **Neon** | 0.5 GB | 100h/month | Unlimited | 100 |
| **Supabase** | 500 MB | Unlimited | 2 GB | 100 |
| **Railway** | $5 credit | Variable | 100 GB | 50 |
| **Vercel Postgres** | 256 MB | 60h/month | Unlimited | 60 |

### Estimated Usage for SPORVIT

**Assumptions:**
- 1,000 active users
- 50 API requests per user per day
- Average 1KB per record

**Storage:** ~100 MB (well within free tier)
**Queries:** ~50,000/day (within free tier)
**Recommendation:** Neon free tier is sufficient for 6-12 months

---

## 🚨 Rollback Plan

If something goes wrong:

### 1. Keep SQLite Backup
```bash
cp prisma/dev.db prisma/dev.db.backup.$(date +%Y%m%d)
```

### 2. Keep PostgreSQL Dump
```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### 3. Quick Rollback Steps
```bash
# Revert to SQLite
git checkout HEAD -- prisma/schema.prisma
npm install
npx prisma generate
npm run build
# Deploy
```

---

## 📝 Summary

### Current State (SQLite)
- ❌ Single file database (442KB)
- ❌ No concurrent writes
- ❌ No horizontal scaling
- ❌ Risk of data loss
- ❌ Not production-ready

### Target State (PostgreSQL)
- ✅ Scalable to millions of rows
- ✅ Concurrent writes
- ✅ Point-in-time recovery
- ✅ Automated backups
- ✅ Production-ready
- ✅ Free tier available

### Migration Effort
- **Time:** 2-4 hours
- **Risk:** Low (with proper backup)
- **Downtime:** Can be zero with proper planning
- **Cost:** $0/month (free tier)

---

## 🎯 Recommended Action Plan

### Phase 1: Immediate (Week 1)
1. ✅ Create Neon account
2. ✅ Update Prisma schema for PostgreSQL
3. ✅ Test migration in development
4. ✅ Create data migration script

### Phase 2: Staging (Week 2)
1. ✅ Deploy to staging with PostgreSQL
2. ✅ Migrate test data
3. ✅ Run integration tests
4. ✅ Performance testing

### Phase 3: Production (Week 3)
1. ✅ Schedule maintenance window
2. ✅ Backup SQLite database
3. ✅ Migrate production data
4. ✅ Update environment variables
5. ✅ Deploy to production
6. ✅ Monitor for 24 hours

### Phase 4: Optimization (Week 4)
1. ✅ Add missing indexes
2. ✅ Set up connection pooling
3. ✅ Configure automated backups
4. ✅ Set up monitoring alerts

---

## 📚 Additional Resources

- [Prisma PostgreSQL Guide](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Neon Documentation](https://neon.tech/docs/introduction)
- [PostgreSQL Performance Tips](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [Database Migration Best Practices](https://www.prisma.io/docs/guides/migrate/production-troubleshooting)

---

## ❓ FAQ

**Q: Can I keep SQLite for development?**
A: Yes, but it's better to use PostgreSQL everywhere for consistency.

**Q: Will this break my existing data?**
A: No, if you follow the migration steps and keep backups.

**Q: How much will PostgreSQL cost?**
A: $0/month on free tier (sufficient for 1K+ users)

**Q: Can I migrate later?**
A: Yes, but the longer you wait, the more data you'll have to migrate.

**Q: What if I exceed the free tier?**
A: Neon paid tier starts at $19/month, Supabase at $25/month.

---

**Need Help?** Open an issue or reach out to the team!
