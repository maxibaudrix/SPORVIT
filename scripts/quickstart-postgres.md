# PostgreSQL Migration - Quick Start

## 🎯 5-Minute Setup Guide

### Option 1: Neon (Recommended - Easiest)

1. **Sign up for Neon:**
   ```bash
   # Go to https://neon.tech and create account
   ```

2. **Create database:**
   - Click "Create Project"
   - Name: `sporvit-prod`
   - Region: Choose closest to you
   - Click "Create"

3. **Copy connection string:**
   ```bash
   # From Neon dashboard, copy the connection string
   postgresql://user:password@ep-xxx.region.neon.tech/sporvit?sslmode=require
   ```

4. **Set environment variable:**
   ```bash
   # Add to .env.production or .env.local for testing
   echo "DATABASE_URL='postgresql://...'" >> .env.production
   ```

5. **Run migration:**
   ```bash
   # Generate PostgreSQL client
   npx prisma generate --schema=prisma/schema.postgres.prisma

   # Push schema to database
   npx prisma db push --schema=prisma/schema.postgres.prisma

   # Open Prisma Studio to verify
   npx prisma studio --schema=prisma/schema.postgres.prisma
   ```

6. **Test locally:**
   ```bash
   # Temporarily use PostgreSQL locally
   export DATABASE_URL='postgresql://...'
   npm run dev
   ```

7. **Deploy:**
   ```bash
   # Add DATABASE_URL to your production environment
   # Then deploy normally
   git push origin main
   ```

---

### Option 2: Local PostgreSQL with Docker

1. **Start PostgreSQL:**
   ```bash
   docker run -d \
     --name sporvit-postgres \
     -e POSTGRES_PASSWORD=dev123 \
     -e POSTGRES_DB=sporvit \
     -p 5432:5432 \
     postgres:16
   ```

2. **Set environment variable:**
   ```bash
   echo "DATABASE_URL='postgresql://postgres:dev123@localhost:5432/sporvit'" >> .env.local
   ```

3. **Run migration:**
   ```bash
   npx prisma generate --schema=prisma/schema.postgres.prisma
   npx prisma db push --schema=prisma/schema.postgres.prisma
   ```

4. **Verify:**
   ```bash
   npx prisma studio --schema=prisma/schema.postgres.prisma
   ```

---

### Option 3: Supabase

1. **Create project:**
   - Go to https://supabase.com
   - New Project
   - Name: `sporvit`
   - Password: (save this)

2. **Get connection string:**
   - Settings > Database
   - Copy "Connection string" (Pooling mode)

3. **Set environment variable:**
   ```bash
   echo "DATABASE_URL='postgresql://...'" >> .env.production
   ```

4. **Run migration:**
   ```bash
   npx prisma generate --schema=prisma/schema.postgres.prisma
   npx prisma db push --schema=prisma/schema.postgres.prisma
   ```

---

## 📝 Complete Checklist

- [ ] Create PostgreSQL database (Neon/Supabase/Railway)
- [ ] Copy connection string
- [ ] Add DATABASE_URL to environment
- [ ] Run `npx prisma generate --schema=prisma/schema.postgres.prisma`
- [ ] Run `npx prisma db push --schema=prisma/schema.postgres.prisma`
- [ ] Verify with `npx prisma studio --schema=prisma/schema.postgres.prisma`
- [ ] Test application locally
- [ ] Add DATABASE_URL to production environment
- [ ] Deploy to production
- [ ] Verify production deployment
- [ ] Remove SQLite files (optional)

---

## 🎉 You're Done!

Your application is now running on PostgreSQL!

**Benefits you now have:**
- ✅ Scalable to millions of rows
- ✅ Concurrent writes
- ✅ Automated backups
- ✅ Production-ready infrastructure

**Next steps:**
- Monitor your database usage in Neon/Supabase dashboard
- Set up connection pooling for better performance
- Configure automated backups and alerts
- Review DATABASE_MIGRATION_GUIDE.md for advanced topics

---

## 🆘 Troubleshooting

**Error: "Can't reach database server"**
- Check your internet connection
- Verify DATABASE_URL is correct
- Check firewall settings

**Error: "SSL connection error"**
- Add `?sslmode=require` to your connection string

**Error: "Database does not exist"**
- Create the database first in your provider's dashboard

**Need help?** Check DATABASE_MIGRATION_GUIDE.md or open an issue!
