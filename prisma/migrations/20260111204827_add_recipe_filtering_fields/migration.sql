-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserGoals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "goalType" TEXT NOT NULL,
    "goalSpeed" TEXT,
    "targetWeight" REAL NOT NULL,
    "dietType" TEXT,
    "allergies" TEXT,
    "intolerances" TEXT,
    "medicalConditions" TEXT,
    "dietaryRestrictions" TEXT,
    "excludedIngredients" TEXT,
    "preferredIngredients" TEXT,
    "targetDate" DATETIME,
    "targetCalories" INTEGER NOT NULL,
    "targetProteinG" INTEGER NOT NULL,
    "targetCarbsG" INTEGER NOT NULL,
    "targetFatG" INTEGER NOT NULL,
    "targetFiberG" INTEGER NOT NULL,
    "bmr" INTEGER NOT NULL,
    "tdee" INTEGER NOT NULL,
    "userLevel" TEXT NOT NULL DEFAULT 'basic',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserGoals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserGoals" ("allergies", "bmr", "createdAt", "dietType", "excludedIngredients", "goalSpeed", "goalType", "id", "targetCalories", "targetCarbsG", "targetDate", "targetFatG", "targetFiberG", "targetProteinG", "targetWeight", "tdee", "updatedAt", "userId") SELECT "allergies", "bmr", "createdAt", "dietType", "excludedIngredients", "goalSpeed", "goalType", "id", "targetCalories", "targetCarbsG", "targetDate", "targetFatG", "targetFiberG", "targetProteinG", "targetWeight", "tdee", "updatedAt", "userId" FROM "UserGoals";
DROP TABLE "UserGoals";
ALTER TABLE "new_UserGoals" RENAME TO "UserGoals";
CREATE UNIQUE INDEX "UserGoals_userId_key" ON "UserGoals"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
