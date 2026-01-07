-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OnboardingData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "onboardingType" TEXT NOT NULL DEFAULT 'basic',
    "completedModules" TEXT,
    "pendingRegeneration" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OnboardingData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_OnboardingData" ("createdAt", "data", "id", "status", "updatedAt", "userId", "version") SELECT "createdAt", "data", "id", "status", "updatedAt", "userId", "version" FROM "OnboardingData";
DROP TABLE "OnboardingData";
ALTER TABLE "new_OnboardingData" RENAME TO "OnboardingData";
CREATE UNIQUE INDEX "OnboardingData_userId_key" ON "OnboardingData"("userId");
CREATE INDEX "OnboardingData_userId_status_idx" ON "OnboardingData"("userId", "status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
