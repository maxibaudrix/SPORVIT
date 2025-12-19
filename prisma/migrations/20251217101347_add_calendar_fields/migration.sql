-- CreateTable
CREATE TABLE "DailySteps" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "steps" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DailySteps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "DailySteps_userId_date_idx" ON "DailySteps"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DailySteps_userId_date_key" ON "DailySteps"("userId", "date");
