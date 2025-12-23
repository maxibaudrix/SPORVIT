/*
  Warnings:

  - Added the required column `totalFiberG` to the `Meal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fiber` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetFiberG` to the `UserGoals` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "WeeklyPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "planJson" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "generationStatus" TEXT NOT NULL DEFAULT 'pending',
    "generatedAt" DATETIME,
    "generationError" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WeeklyPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Meal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "mealType" TEXT NOT NULL,
    "totalCalories" INTEGER NOT NULL,
    "totalProteinG" REAL NOT NULL,
    "totalCarbsG" REAL NOT NULL,
    "totalFatG" REAL NOT NULL,
    "totalFiberG" REAL NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Meal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Meal" ("createdAt", "date", "id", "mealType", "notes", "totalCalories", "totalCarbsG", "totalFatG", "totalProteinG", "userId") SELECT "createdAt", "date", "id", "mealType", "notes", "totalCalories", "totalCarbsG", "totalFatG", "totalProteinG", "userId" FROM "Meal";
DROP TABLE "Meal";
ALTER TABLE "new_Meal" RENAME TO "Meal";
CREATE INDEX "Meal_userId_date_idx" ON "Meal"("userId", "date");
CREATE TABLE "new_Recipe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "servings" INTEGER NOT NULL,
    "caloriesPerServing" INTEGER NOT NULL,
    "prepTimeMinutes" INTEGER,
    "cookTimeMinutes" INTEGER,
    "protein" REAL NOT NULL,
    "carbs" REAL NOT NULL,
    "fats" REAL NOT NULL,
    "fiber" REAL NOT NULL,
    "favorited" BOOLEAN NOT NULL DEFAULT false,
    "rating" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Recipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Recipe" ("caloriesPerServing", "carbs", "cookTimeMinutes", "createdAt", "description", "fats", "favorited", "id", "prepTimeMinutes", "protein", "rating", "servings", "title", "userId") SELECT "caloriesPerServing", "carbs", "cookTimeMinutes", "createdAt", "description", "fats", "favorited", "id", "prepTimeMinutes", "protein", "rating", "servings", "title", "userId" FROM "Recipe";
DROP TABLE "Recipe";
ALTER TABLE "new_Recipe" RENAME TO "Recipe";
CREATE INDEX "Recipe_userId_createdAt_idx" ON "Recipe"("userId", "createdAt");
CREATE TABLE "new_UserGoals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "goalType" TEXT NOT NULL,
    "goalSpeed" TEXT,
    "targetWeight" REAL NOT NULL,
    "dietType" TEXT,
    "allergies" TEXT,
    "excludedIngredients" TEXT,
    "targetDate" DATETIME,
    "targetCalories" INTEGER NOT NULL,
    "targetProteinG" INTEGER NOT NULL,
    "targetCarbsG" INTEGER NOT NULL,
    "targetFatG" INTEGER NOT NULL,
    "targetFiberG" INTEGER NOT NULL,
    "bmr" INTEGER NOT NULL,
    "tdee" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserGoals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserGoals" ("allergies", "bmr", "createdAt", "dietType", "excludedIngredients", "goalSpeed", "goalType", "id", "targetCalories", "targetCarbsG", "targetDate", "targetFatG", "targetProteinG", "targetWeight", "tdee", "updatedAt", "userId") SELECT "allergies", "bmr", "createdAt", "dietType", "excludedIngredients", "goalSpeed", "goalType", "id", "targetCalories", "targetCarbsG", "targetDate", "targetFatG", "targetProteinG", "targetWeight", "tdee", "updatedAt", "userId" FROM "UserGoals";
DROP TABLE "UserGoals";
ALTER TABLE "new_UserGoals" RENAME TO "UserGoals";
CREATE UNIQUE INDEX "UserGoals_userId_key" ON "UserGoals"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "WeeklyPlan_userId_startDate_idx" ON "WeeklyPlan"("userId", "startDate");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyPlan_userId_weekNumber_key" ON "WeeklyPlan"("userId", "weekNumber");
