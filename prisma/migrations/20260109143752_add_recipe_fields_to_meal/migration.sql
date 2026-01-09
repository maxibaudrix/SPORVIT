-- AlterTable
ALTER TABLE "Meal" ADD COLUMN "recipeName" TEXT;
ALTER TABLE "Meal" ADD COLUMN "recipeSlug" TEXT;
ALTER TABLE "Meal" ADD COLUMN "timing" TEXT;

-- CreateIndex
CREATE INDEX "Meal_recipeSlug_idx" ON "Meal"("recipeSlug");
