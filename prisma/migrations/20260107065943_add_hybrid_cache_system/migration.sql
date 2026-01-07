-- CreateTable
CREATE TABLE "CachedPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "exactHash" TEXT NOT NULL,
    "semanticHash" TEXT NOT NULL,
    "compoundKey" TEXT NOT NULL,
    "featureVector" TEXT NOT NULL,
    "planData" TEXT NOT NULL,
    "contextSnapshot" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "originalPlanId" TEXT,
    "userId" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "accessCount" INTEGER NOT NULL DEFAULT 0,
    "adaptationCount" INTEGER NOT NULL DEFAULT 0,
    "successRate" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastAccessedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PlanGenerationLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "cachedPlanId" TEXT,
    "similarityScore" REAL,
    "decisionReasons" TEXT NOT NULL,
    "estimatedCostUsd" REAL NOT NULL,
    "actualCostUsd" REAL,
    "responseTimeMs" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL,
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "CachedPlan_exactHash_key" ON "CachedPlan"("exactHash");

-- CreateIndex
CREATE INDEX "CachedPlan_exactHash_idx" ON "CachedPlan"("exactHash");

-- CreateIndex
CREATE INDEX "CachedPlan_semanticHash_idx" ON "CachedPlan"("semanticHash");

-- CreateIndex
CREATE INDEX "CachedPlan_compoundKey_idx" ON "CachedPlan"("compoundKey");

-- CreateIndex
CREATE INDEX "CachedPlan_userId_createdAt_idx" ON "CachedPlan"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "CachedPlan_createdAt_idx" ON "CachedPlan"("createdAt");

-- CreateIndex
CREATE INDEX "PlanGenerationLog_userId_createdAt_idx" ON "PlanGenerationLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "PlanGenerationLog_decision_idx" ON "PlanGenerationLog"("decision");

-- CreateIndex
CREATE INDEX "PlanGenerationLog_createdAt_idx" ON "PlanGenerationLog"("createdAt");
