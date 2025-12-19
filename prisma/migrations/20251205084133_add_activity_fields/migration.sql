/*
  Warnings:

  - You are about to drop the column `allergies` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `bodyFat` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `dietType` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `excludedIngredients` on the `UserProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "password" TEXT;

-- AlterTable
ALTER TABLE "UserGoals" ADD COLUMN "allergies" TEXT;
ALTER TABLE "UserGoals" ADD COLUMN "dietType" TEXT;
ALTER TABLE "UserGoals" ADD COLUMN "excludedIngredients" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "heightCm" REAL NOT NULL,
    "currentWeight" REAL NOT NULL,
    "bodyFatPercentage" REAL,
    "activityLevel" TEXT NOT NULL,
    "workoutDaysPerWeek" INTEGER NOT NULL DEFAULT 0,
    "dailySteps" TEXT,
    "sittingHours" TEXT,
    "workType" TEXT,
    "trainingLevel" TEXT,
    "trainingTypes" TEXT,
    "sessionDuration" INTEGER,
    "intensity" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserProfile" ("activityLevel", "age", "createdAt", "currentWeight", "gender", "heightCm", "id", "updatedAt", "userId", "workoutDaysPerWeek") SELECT "activityLevel", "age", "createdAt", "currentWeight", "gender", "heightCm", "id", "updatedAt", "userId", "workoutDaysPerWeek" FROM "UserProfile";
DROP TABLE "UserProfile";
ALTER TABLE "new_UserProfile" RENAME TO "UserProfile";
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
