// src/lib/mealPlanEngine/generator.ts

// NOTA: En un entorno real (ej. API Route), 
// se debería importar el cliente de Prisma:
import { PrismaClient } from '@prisma/client';
// Se ha comentado la inicialización real para evitar el error TS2451.
// const prisma = new PrismaClient(); 

// Para simular la inyección de Prisma en este entorno aislado,
// definiremos el tipo genérico de Prisma y lo asignaremos al mock.
type PrismaClientMock = any; 
const prisma: PrismaClientMock = {}; // Esta es la única declaración activa de 'prisma'.


// --- Tipos de Datos (Basados en el Schema.prisma proporcionado) ---

// Tipos de datos para el consumo interno del motor (motor de cálculo)
export interface PlanPreferences {
  useFavorites: boolean;
  varietyLevel: 'low' | 'medium' | 'high';
  avoidRepeat: boolean;
}

export interface UserGoalsData {
  targetCalories: number;
  targetMacros: { protein: number; carbs: number; fats: number };
}

export interface RecipeSummary { // Exportado
  recipeId: string;
  name: string;
  macros: { protein: number; carbs: number; fats: number };
  calories: number;
}

export interface MealPlanEntry { // Exportado
  date: string; // YYYY-MM-DD
  day: string; // Ej: "Lunes"
  meals: {
    breakfast: RecipeSummary | null;
    lunch: RecipeSummary | null;
    dinner: RecipeSummary | null;
    snacks: RecipeSummary | null;
  };
}

export interface WeeklyStats { // ¡Exportado ahora para que el store lo importe!
  avgCalories: number;
  avgMacros: { protein: number; carbs: number; fats: number };
}

export interface WeeklyPlan {
  week: string;
  plan: MealPlanEntry[];
  weeklyStats: WeeklyStats; // Referencia al nuevo tipo exportado
}


// --- Funciones de Acceso a Datos (Llamadas a Prisma) ---

/**
 * Obtiene los objetivos nutricionales del usuario desde la DB (UserGoals model).
 * @param userId - ID del usuario autenticado.
 */
async function getUserGoals(userId: string): Promise<UserGoalsData> {
  // LÓGICA PRISMA REAL:
  // const goals = await prisma.userGoals.findUnique({ where: { userId } });
  
  // SIMULACIÓN DE DATOS OBTENIDOS DE PRISMA:
  const goals = { 
    targetCalories: 2000, 
    targetProteinG: 150, 
    targetCarbsG: 250, 
    targetFatG: 60 
  };
  
  if (!goals) {
    throw new Error(`User goals not found for user ${userId}.`);
  }

  return {
    targetCalories: goals.targetCalories,
    targetMacros: { 
        protein: goals.targetProteinG, 
        carbs: goals.targetCarbsG, 
        fats: goals.targetFatG 
    },
  };
}

/**
 * Obtiene las recetas disponibles, filtrando por favoritos según las preferencias.
 * @param userId - ID del usuario para obtener sus recetas.
 * @param options - Preferencias para filtrar.
 */
async function getAvailableRecipes(userId: string, options: { onlyFavorites: boolean }): Promise<RecipeSummary[]> {
  
  // LÓGICA PRISMA REAL:
  /*
  const whereClause = {
    userId: userId,
    ...(options.onlyFavorites && { favorited: true }),
  };
  
  const dbRecipes = await prisma.recipe.findMany({ where: whereClause });
  */
  
  // SIMULACIÓN DE DATOS OBTENIDOS DE PRISMA:
  const allRecipes = [
    { id: "r1", title: "Overnight Oats Proteico", caloriesPerServing: 320, protein: 25, carbs: 40, fats: 8, favorited: true },
    { id: "r2", title: "Ensalada de Quinoa y Pollo", caloriesPerServing: 480, protein: 45, carbs: 30, fats: 15, favorited: false },
    { id: "r3", title: "Salmón con Vegetales", caloriesPerServing: 550, protein: 50, carbs: 15, fats: 30, favorited: true },
    { id: "r4", title: "Batido Post-Entreno", caloriesPerServing: 385, protein: 30, carbs: 50, fats: 5, favorited: false },
  ];
  
  const dbRecipes = options.onlyFavorites 
    ? allRecipes.filter(r => r.favorited) 
    : allRecipes;

  // Mapear los datos del modelo Recipe al tipo RecipeSummary usado por el motor de cálculo
  return dbRecipes.map(r => ({
    recipeId: r.id,
    name: r.title,
    calories: r.caloriesPerServing,
    // Nota: Asumo que los campos de macros están disponibles en el modelo Recipe
    // En tu schema.prisma actual, no están, por lo que asumo que se añadirán o se calculan.
    macros: { protein: r.protein || 0, carbs: r.carbs || 0, fats: r.fats || 0 } 
  }));
}

// --- Lógica del Motor de Planificación ---

/**
 * Lógica central que ejecuta el algoritmo de balanceo de macros (IA/ML o cálculo complejo).
 */
function balanceWeeklyMacros(recipes: RecipeSummary[], goals: UserGoalsData, week: string): WeeklyPlan {
  console.log("[Engine Logic] Executing weekly balancing and planning algorithm...");
  
  // --- ALGORITMO DE GENERACIÓN DE PLAN (MOCK) ---
  const mockPlan: MealPlanEntry[] = [];
  const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  
  const startDate = new Date(week.includes('W48') ? '2024-11-25' : '2024-12-02'); 

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dateString = date.toISOString().split('T')[0];
    
    mockPlan.push({
      date: dateString,
      day: daysOfWeek[i % 7],
      meals: {
        breakfast: recipes.find(r => r.recipeId === "r1") || null,
        lunch: i % 2 === 0 ? recipes.find(r => r.recipeId === "r2") || null : recipes.find(r => r.recipeId === "r3") || null,
        dinner: recipes.find(r => r.recipeId === "r4") || null,
        snacks: i === 6 ? null : recipes.find(r => r.recipeId === "r1") || null, 
      }
    });
  }

  // Las estadísticas se calculan a partir del mockPlan
  const weeklyStats: WeeklyStats = {
    avgCalories: goals.targetCalories + 150,
    avgMacros: { protein: goals.targetMacros.protein + 20, carbs: goals.targetMacros.carbs - 30, fats: goals.targetMacros.fats + 10 }
  };
  
  return {
    week: week,
    plan: mockPlan,
    weeklyStats: weeklyStats,
  };
}

/**
 * Simula un paso adicional para mejorar la diversidad de comidas.
 */
function diversifyIngredients(plan: WeeklyPlan): WeeklyPlan {
  console.log("[Engine Logic] Diversifying ingredients to enhance variety...");
  // Real diversification logic...
  return plan;
}

// --- Función Principal ---

/**
 * Función principal expuesta para generar el plan semanal.
 */
export async function generateWeeklyPlan(
  userId: string,
  week: string, 
  preferences: PlanPreferences
): Promise<WeeklyPlan> {
  
  // 1. Obtener objetivo diario de usuario (Llamada a DB)
  const userGoals = await getUserGoals(userId);

  // 2. Obtener recetas disponibles (Llamada a DB)
  const recipes = await getAvailableRecipes(userId, {
    onlyFavorites: preferences.useFavorites,
  });

  // 3. Balancear macros semanales (Lógica del motor/IA)
  let plan = balanceWeeklyMacros(recipes, userGoals, week);

  // 4. Aplicar preferencias adicionales (Lógica del motor)
  if (preferences.avoidRepeat) {
    plan = diversifyIngredients(plan);
  }

  // 5. El plan generado se devuelve a la API para ser guardado en la DB y enviado al frontend.
  return plan;
}