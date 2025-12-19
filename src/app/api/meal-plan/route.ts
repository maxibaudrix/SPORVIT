// src/app/api/meal-plan/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromSession, handleUnauthorized } from '@/lib/auth-helper';
import { generateWeeklyPlan, WeeklyPlan, PlanPreferences, MealPlanEntry, RecipeSummary } from '@/lib/mealPlanEngine/generator';
import { PrismaClient } from '@prisma/client';

// ----------------------------------------------------
// PRISMA CLIENT INITIALIZATION (Singleton Pattern for Next.js)
// ----------------------------------------------------
// @ts-ignore
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Inicializa el cliente Prisma, reutilizando una instancia global en desarrollo
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// ----------------------------------------------------
// GET /api/meal-plan
// Carga el plan de comidas guardado para una semana específica.
// ----------------------------------------------------
export async function GET(req: NextRequest) {
    const userId = await getUserIdFromSession(req);
    if (!userId) return handleUnauthorized();

    const searchParams = req.nextUrl.searchParams;
    const week = searchParams.get('week');

    if (!week) {
        return NextResponse.json({ error: "Missing 'week' parameter" }, { status: 400 });
    }

    try {
        // Buscar el plan semanal guardado en la DB por userId y week.
        const storedPlannedMeal = await prisma.plannedMeal.findUnique({
            where: {
                // Asume un índice único compuesto en PlannedMeal: @@unique([userId, week])
                userId_week: { userId, week },
            },
            select: {
                week: true,
                planJson: true, // El array de comidas (MealPlanEntry[])
                statsJson: true, // Las estadísticas semanales
            }
        }) as { week: string, planJson: any, statsJson: any } | null; // Tipado forzado debido a campos Json

        // Si no hay plan, devolver una estructura de plan vacía.
        if (!storedPlannedMeal) {
            const emptyPlan: WeeklyPlan = {
                week,
                plan: [],
                weeklyStats: { avgCalories: 0, avgMacros: { protein: 0, carbs: 0, fats: 0 } }
            };
            return NextResponse.json(emptyPlan);
        }

        // Deserializar los campos JSON a los tipos TypeScript
        const weeklyPlan: WeeklyPlan = {
            week: storedPlannedMeal.week,
            plan: storedPlannedMeal.planJson as MealPlanEntry[],
            weeklyStats: storedPlannedMeal.statsJson as any,
        };

        return NextResponse.json(weeklyPlan);

    } catch (error) {
        console.error("Error fetching meal plan:", error);
        return NextResponse.json({ error: "Failed to fetch meal plan" }, { status: 500 });
    }
}


// ----------------------------------------------------
// POST /api/meal-plan/generate
// Genera y guarda un nuevo plan de comidas automático (UPSERT).
// ----------------------------------------------------
export async function POST(req: NextRequest) {
    const userId = await getUserIdFromSession(req);
    if (!userId) return handleUnauthorized();

    try {
        const body = await req.json();
        const { week, preferences } = body as { week: string, preferences: PlanPreferences };

        if (!week || !preferences) {
            return NextResponse.json({ error: "Missing required fields (week, preferences)" }, { status: 400 });
        }

        // 1. GENERAR PLAN: Llama al motor de planificación
        const newPlan = await generateWeeklyPlan(userId, week, preferences);

        // 2. GUARDAR EN LA DB: Usa upsert para actualizar (si existe) o crear el plan.
        const savedPlan = await prisma.plannedMeal.upsert({
            where: {
                userId_week: { userId, week }
            },
            update: {
                planJson: JSON.stringify(newPlan.plan),
                statsJson: JSON.stringify(newPlan.weeklyStats),
            },
            create: {
                userId,
                week,
                planJson: JSON.stringify(newPlan.plan),
                statsJson: JSON.stringify(newPlan.weeklyStats),
            },
            select: {
                week: true,
                planJson: true,
                statsJson: true,
            }
        }) as { week: string, planJson: any, statsJson: any };
        
        // Reconstruir el objeto WeeklyPlan a partir de la DB para la respuesta
        const responsePlan: WeeklyPlan = {
            week: savedPlan.week,
            plan: savedPlan.planJson as MealPlanEntry[],
            weeklyStats: savedPlan.statsJson as any,
        };

        return NextResponse.json(responsePlan, { status: 200 });

    } catch (error: any) {
        console.error("Error generating/saving meal plan:", error);
        return NextResponse.json({ error: error.message || "Failed to generate plan" }, { status: 500 });
    }
}


// ----------------------------------------------------
// PATCH /api/meal-plan
// Asigna una receta a un slot específico (actualiza el campo JSON).
// ----------------------------------------------------
export async function PATCH(req: NextRequest) {
    const userId = await getUserIdFromSession(req);
    if (!userId) return handleUnauthorized();

    try {
        const body = await req.json();
        const { week, date, mealType, recipeId } = body as { week: string, date: string, mealType: string, recipeId: string };
        
        if (!week || !date || !mealType || !recipeId) {
            return NextResponse.json({ error: "Missing required fields for assignment" }, { status: 400 });
        }

        // 1. Obtener la receta para sus detalles nutricionales
        const recipeDetails = await prisma.recipe.findUnique({
            where: { id: recipeId },
            select: { 
                id: true, 
                title: true, 
                caloriesPerServing: true, 
                // Selecciona los campos de macros, asumiendo que existen
                protein: true, 
                carbs: true, 
                fats: true 
            }
        });

        if (!recipeDetails) {
            return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
        }
        
        // Mapear al formato RecipeSummary
        const recipeSummary: RecipeSummary = {
            recipeId: recipeDetails.id,
            name: recipeDetails.title,
            calories: recipeDetails.caloriesPerServing,
            macros: { 
                protein: (recipeDetails as any).protein || 0, 
                carbs: (recipeDetails as any).carbs || 0, 
                fats: (recipeDetails as any).fats || 0 
            }, 
        };

        // 2. Obtener y actualizar el plan (Manipulación del JSON)
        const plannedMeal = await prisma.plannedMeal.findUnique({
            where: { userId_week: { userId, week } },
            select: { planJson: true }
        });

        if (!plannedMeal) {
            return NextResponse.json({ error: "Meal plan not found for this week" }, { status: 404 });
        }

        // Deserializar el JSON
        let planArray: MealPlanEntry[] = plannedMeal.planJson as unknown as MealPlanEntry[];
        const dayIndex = planArray.findIndex(entry => entry.date === date);

        if (dayIndex === -1) {
            return NextResponse.json({ error: "Day not found in the plan" }, { status: 404 });
        }

        // Asignar la receta al slot específico (breakfast, lunch, dinner, snacks)
        (planArray[dayIndex].meals as any)[mealType] = {
            recipeId: recipeSummary.recipeId,
            name: recipeSummary.name,
            calories: recipeSummary.calories,
            macros: recipeSummary.macros,
        };

        // 3. Actualizar la base de datos con el plan modificado.
        await prisma.plannedMeal.update({
            where: { userId_week: { userId, week } },
            data: {
                planJson: JSON.stringify(planArray), // Prisma serializa el objeto actualizado
                // Idealmente, aquí también se re-calcularía y actualizaría 'statsJson'.
            }
        });

        return NextResponse.json({ message: "Recipe assigned successfully", recipe: recipeSummary });

    } catch (error: any) {
        console.error("Error assigning recipe:", error);
        return NextResponse.json({ error: error.message || "Failed to assign recipe" }, { status: 500 });
    }
}


// ----------------------------------------------------
// DELETE /api/meal-plan
// Elimina una receta de un slot específico (lo establece a null).
// ----------------------------------------------------
export async function DELETE(req: NextRequest) {
    const userId = await getUserIdFromSession(req);
    if (!userId) return handleUnauthorized();

    try {
        const body = await req.json();
        const { week, date, mealType } = body as { week: string, date: string, mealType: string };
        
        if (!week || !date || !mealType) {
            return NextResponse.json({ error: "Missing required fields for removal" }, { status: 400 });
        }

        // 1. Obtener el plan existente
        const plannedMeal = await prisma.plannedMeal.findUnique({
            where: { userId_week: { userId, week } },
            select: { planJson: true }
        });

        if (!plannedMeal) {
            return NextResponse.json({ message: "Meal removed successfully (plan not found, assumed empty)" });
        }
        
        // Deserializar el JSON
        let planArray: MealPlanEntry[] = plannedMeal.planJson as unknown as MealPlanEntry[];
        const dayIndex = planArray.findIndex(entry => entry.date === date);

        if (dayIndex === -1) {
             return NextResponse.json({ message: "Meal removed successfully (day not found, assumed empty)" });
        }

        // 2. Establecer el slot de la comida a null.
        (planArray[dayIndex].meals as any)[mealType] = null;

        // 3. Actualizar la base de datos con el plan modificado.
        await prisma.plannedMeal.update({
            where: { userId_week: { userId, week } },
            data: {
                planJson: JSON.stringify(planArray),
            }
        });

        return NextResponse.json({ message: "Meal removed successfully" });

    } catch (error: any) {
        console.error("Error removing meal:", error);
        return NextResponse.json({ error: error.message || "Failed to remove meal" }, { status: 500 });
    }
}