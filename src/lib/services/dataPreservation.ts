// lib/services/dataPreservation.ts
import { prisma } from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';

interface PreservedWorkout {
  id: string;
  workoutType: string;
  title: string;
  description?: string;
  durationMinutes: number;
  estimatedCalories: number;
  adaptedFromCalories?: number;
  adaptationReason?: string;
  createdAt: string;
  // Datos anonimizados
  originalUserId: string; // Hash del userId original
  preservedAt: string;
}

interface PreservedRecipe {
  id: string;
  title: string;
  description?: string;
  servings: number;
  caloriesPerServing: number;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  rating?: number;
  createdAt: string;
  // Datos anonimizados
  originalUserId: string; // Hash del userId original
  preservedAt: string;
}

/**
 * Crea un hash simple del userId para anonimizar pero mantener trazabilidad
 */
function hashUserId(userId: string): string {
  // Convertir a base64 para ofuscación básica
  return Buffer.from(userId).toString('base64').substring(0, 16);
}

/**
 * Obtiene la ruta del directorio de datos preservados
 */
function getDataDirectory(type: 'workouts' | 'recipes'): string {
  const baseDir = path.join(process.cwd(), 'data', 'preserved');
  return path.join(baseDir, type);
}

/**
 * Asegura que el directorio de datos existe
 */
async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

/**
 * Lee datos existentes de un archivo JSON
 */
async function readExistingData<T>(filePath: string): Promise<T[]> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    // Si el archivo no existe, retornar array vacío
    return [];
  }
}

/**
 * Guarda entrenamientos generados por AI de un usuario antes de eliminarlo
 */
export async function preserveUserWorkouts(userId: string): Promise<number> {
  try {
    // Obtener todos los workouts del usuario
    const workouts = await prisma.workout.findMany({
      where: { userId },
      select: {
        id: true,
        workoutType: true,
        title: true,
        description: true,
        durationMinutes: true,
        estimatedCalories: true,
        adaptedFromCalories: true,
        adaptationReason: true,
        createdAt: true,
      },
    });

    if (workouts.length === 0) {
      console.log(`No hay entrenamientos para preservar del usuario ${userId}`);
      return 0;
    }

    // Convertir a formato preservado con anonimización
    const hashedUserId = hashUserId(userId);
    const preservedWorkouts: PreservedWorkout[] = workouts.map((workout) => ({
      ...workout,
      createdAt: workout.createdAt.toISOString(),
      originalUserId: hashedUserId,
      preservedAt: new Date().toISOString(),
    }));

    // Preparar directorio
    const workoutsDir = getDataDirectory('workouts');
    await ensureDirectoryExists(workoutsDir);

    // Leer datos existentes del archivo principal
    const mainFilePath = path.join(workoutsDir, 'workouts_database.json');
    const existingWorkouts = await readExistingData<PreservedWorkout>(mainFilePath);

    // Combinar datos existentes con nuevos
    const allWorkouts = [...existingWorkouts, ...preservedWorkouts];

    // Guardar archivo principal actualizado
    await fs.writeFile(
      mainFilePath,
      JSON.stringify(allWorkouts, null, 2),
      'utf-8'
    );

    // También guardar un archivo individual por usuario (backup)
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const userBackupPath = path.join(
      workoutsDir,
      `user_${hashedUserId}_${timestamp}.json`
    );
    await fs.writeFile(
      userBackupPath,
      JSON.stringify(preservedWorkouts, null, 2),
      'utf-8'
    );

    console.log(`✅ ${preservedWorkouts.length} entrenamientos preservados para usuario ${hashedUserId}`);
    return preservedWorkouts.length;
  } catch (error) {
    console.error('❌ Error preservando entrenamientos:', error);
    throw error;
  }
}

/**
 * Guarda recetas generadas por AI de un usuario antes de eliminarlo
 */
export async function preserveUserRecipes(userId: string): Promise<number> {
  try {
    // Obtener todas las recetas del usuario
    const recipes = await prisma.recipe.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        description: true,
        servings: true,
        caloriesPerServing: true,
        prepTimeMinutes: true,
        cookTimeMinutes: true,
        protein: true,
        carbs: true,
        fats: true,
        fiber: true,
        rating: true,
        createdAt: true,
      },
    });

    if (recipes.length === 0) {
      console.log(`No hay recetas para preservar del usuario ${userId}`);
      return 0;
    }

    // Convertir a formato preservado con anonimización
    const hashedUserId = hashUserId(userId);
    const preservedRecipes: PreservedRecipe[] = recipes.map((recipe) => ({
      ...recipe,
      createdAt: recipe.createdAt.toISOString(),
      originalUserId: hashedUserId,
      preservedAt: new Date().toISOString(),
    }));

    // Preparar directorio
    const recipesDir = getDataDirectory('recipes');
    await ensureDirectoryExists(recipesDir);

    // Leer datos existentes del archivo principal
    const mainFilePath = path.join(recipesDir, 'recipes_database.json');
    const existingRecipes = await readExistingData<PreservedRecipe>(mainFilePath);

    // Combinar datos existentes con nuevos
    const allRecipes = [...existingRecipes, ...preservedRecipes];

    // Guardar archivo principal actualizado
    await fs.writeFile(
      mainFilePath,
      JSON.stringify(allRecipes, null, 2),
      'utf-8'
    );

    // También guardar un archivo individual por usuario (backup)
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const userBackupPath = path.join(
      recipesDir,
      `user_${hashedUserId}_${timestamp}.json`
    );
    await fs.writeFile(
      userBackupPath,
      JSON.stringify(preservedRecipes, null, 2),
      'utf-8'
    );

    console.log(`✅ ${preservedRecipes.length} recetas preservadas para usuario ${hashedUserId}`);
    return preservedRecipes.length;
  } catch (error) {
    console.error('❌ Error preservando recetas:', error);
    throw error;
  }
}

/**
 * Preserva todos los datos de un usuario antes de eliminarlo
 */
export async function preserveUserData(userId: string): Promise<{
  workoutsPreserved: number;
  recipesPreserved: number;
}> {
  console.log(`📦 Iniciando preservación de datos para usuario ${userId}`);

  const [workoutsPreserved, recipesPreserved] = await Promise.all([
    preserveUserWorkouts(userId),
    preserveUserRecipes(userId),
  ]);

  console.log(`📦 Preservación completada: ${workoutsPreserved} entrenamientos, ${recipesPreserved} recetas`);

  return {
    workoutsPreserved,
    recipesPreserved,
  };
}

/**
 * Obtiene estadísticas de la base de datos de entrenamientos
 */
export async function getWorkoutsStats(): Promise<{
  total: number;
  byType: Record<string, number>;
}> {
  try {
    const workoutsDir = getDataDirectory('workouts');
    const mainFilePath = path.join(workoutsDir, 'workouts_database.json');
    const workouts = await readExistingData<PreservedWorkout>(mainFilePath);

    const byType = workouts.reduce((acc, workout) => {
      acc[workout.workoutType] = (acc[workout.workoutType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: workouts.length,
      byType,
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas de entrenamientos:', error);
    return { total: 0, byType: {} };
  }
}

/**
 * Obtiene estadísticas de la base de datos de recetas
 */
export async function getRecipesStats(): Promise<{
  total: number;
  avgRating: number;
  avgCalories: number;
}> {
  try {
    const recipesDir = getDataDirectory('recipes');
    const mainFilePath = path.join(recipesDir, 'recipes_database.json');
    const recipes = await readExistingData<PreservedRecipe>(mainFilePath);

    const validRatings = recipes.filter(r => r.rating).map(r => r.rating!);
    const avgRating = validRatings.length > 0
      ? validRatings.reduce((sum, r) => sum + r, 0) / validRatings.length
      : 0;

    const avgCalories = recipes.length > 0
      ? recipes.reduce((sum, r) => sum + r.caloriesPerServing, 0) / recipes.length
      : 0;

    return {
      total: recipes.length,
      avgRating: Math.round(avgRating * 10) / 10,
      avgCalories: Math.round(avgCalories),
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas de recetas:', error);
    return { total: 0, avgRating: 0, avgCalories: 0 };
  }
}
