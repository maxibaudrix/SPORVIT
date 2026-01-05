#!/bin/bash

# Sporvit Database Migration Script
# SQLite → PostgreSQL

set -e  # Exit on error

echo "🚀 Sporvit Database Migration: SQLite → PostgreSQL"
echo "=================================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if PostgreSQL URL is set
if [ -z "$POSTGRES_URL" ]; then
    echo -e "${RED}❌ Error: POSTGRES_URL environment variable not set${NC}"
    echo ""
    echo "Please set it with:"
    echo "  export POSTGRES_URL='postgresql://user:pass@host:5432/database'"
    exit 1
fi

echo -e "${GREEN}✓${NC} PostgreSQL URL configured"
echo ""

# Step 1: Backup SQLite
echo "📦 Step 1: Backing up SQLite database..."
BACKUP_FILE="prisma/dev.db.backup.$(date +%Y%m%d_%H%M%S)"
cp prisma/dev.db "$BACKUP_FILE"
echo -e "${GREEN}✓${NC} Backup created: $BACKUP_FILE"
echo ""

# Step 2: Generate PostgreSQL schema
echo "📋 Step 2: Generating PostgreSQL Prisma client..."
npx prisma generate --schema=prisma/schema.postgres.prisma
echo -e "${GREEN}✓${NC} Client generated"
echo ""

# Step 3: Create PostgreSQL database schema
echo "🗄️  Step 3: Creating PostgreSQL database schema..."
npx prisma db push --schema=prisma/schema.postgres.prisma --accept-data-loss
echo -e "${GREEN}✓${NC} Schema created"
echo ""

# Step 4: Migrate data
echo "📤 Step 4: Migrating data..."
echo "This step requires a custom migration script."
echo ""
echo "Create a file: scripts/migrate-data.ts with:"
echo "  - Export data from SQLite"
echo "  - Transform JSON strings to JSON objects"
echo "  - Import into PostgreSQL"
echo ""
echo -e "${YELLOW}⚠️  Manual step required - see DATABASE_MIGRATION_GUIDE.md${NC}"
echo ""

# Step 5: Verify
echo "✅ Step 5: Verification"
echo "Open Prisma Studio to verify data:"
echo "  npx prisma studio --schema=prisma/schema.postgres.prisma"
echo ""

# Step 6: Update production
echo "🚀 Step 6: Deploy to production"
echo "Update your environment variables:"
echo "  DATABASE_URL='$POSTGRES_URL'"
echo ""
echo "Then deploy:"
echo "  git add ."
echo "  git commit -m 'Migrate to PostgreSQL'"
echo "  git push"
echo ""

echo -e "${GREEN}✓ Migration script completed!${NC}"
echo ""
echo "Next steps:"
echo "1. Verify data in PostgreSQL: npx prisma studio --schema=prisma/schema.postgres.prisma"
echo "2. Test your application locally with PostgreSQL"
echo "3. Deploy to production when ready"
