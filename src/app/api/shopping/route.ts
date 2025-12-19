// src/app/api/shopping/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromSession, handleUnauthorized } from '@/lib/auth-helper';
import { ShoppingItem, Category } from '@/store/shopping';
import { PrismaClient, Prisma } from '@prisma/client';

// ----------------------------------------------------
// PRISMA CLIENT INITIALIZATION (Singleton)
// ----------------------------------------------------
// @ts-ignore
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;


// --- MOCK DATA / SIMULACIÓN DE DB ---
// En una app real, usarías un modelo 'ShoppingListItem' en Prisma.
const mockShoppingData = {
    items: [
        { id: '1', name: 'Pechuga de Pollo', quantity: 800, unit: 'g', category: 'Proteínas', isPurchased: false, recipeCount: 4, nutriScore: 'A', estimatedPrice: 6.50 },
        { id: '2', name: 'Brócoli', quantity: 500, unit: 'g', category: 'Vegetales', isPurchased: true, recipeCount: 2, nutriScore: 'A', estimatedPrice: 2.10 },
        { id: '3', name: 'Leche de Almendras', quantity: 1, unit: 'L', category: 'Lácteos', isPurchased: false, recipeCount: 1, nutriScore: 'B', estimatedPrice: 1.80 },
        { id: '4', name: 'Harina de Trigo', quantity: 1000, unit: 'g', category: 'Granos', isPurchased: false, recipeCount: 1, nutriScore: 'D', estimatedPrice: 1.20 },
    ] as ShoppingItem[],
    healthScore: 85,
    totalBudget: 45.00,
};

// ----------------------------------------------------
// GET /api/shopping (Cargar lista)
// ----------------------------------------------------
export async function GET(req: NextRequest) {
    const userId = getUserIdFromSession(req);
    if (!userId) return handleUnauthorized();

    try {
        // LÓGICA PRISMA REAL: Cargar la lista de compras del usuario.
        // Asumimos un modelo PlannedShoppingList con un campo JSON para los ítems.
        
        // Simulación: Retornar mock data
        return NextResponse.json(mockShoppingData);

    } catch (error) {
        console.error("Error fetching shopping list:", error);
        return NextResponse.json({ error: "Failed to fetch shopping list" }, { status: 500 });
    }
}


// ----------------------------------------------------
// POST /api/shopping/generate (Generar desde Meal Plan)
// ----------------------------------------------------
export async function POST(req: NextRequest) {
    const userId = getUserIdFromSession(req);
    if (!userId) return handleUnauthorized();

    try {
        // 1. LÓGICA PRISMA: Obtener el último Meal Plan del usuario
        // const latestPlan = await prisma.plannedMeal.findFirst({ where: { userId }, orderBy: { week: 'desc' } });
        
        // 2. LÓGICA DE CONSOLIDACIÓN:
        //  - Iterar sobre todas las recetas del plan.
        //  - Consolidar ingredientes duplicados (e.g., 200g Pollo Receta A + 600g Pollo Receta B = 800g Pollo).
        //  - Asignar categoría, nutriScore y precio estimado (datos de ScannedProduct/RecipeIngredient).
        
        // Simulación: Retornar una lista de compra generada
        const generatedList: ShoppingItem[] = [
            ...mockShoppingData.items,
            { id: '5', name: 'Huevos de Corral', quantity: 12, unit: 'unidades', category: 'Proteínas', isPurchased: false, recipeCount: 3, nutriScore: 'A', estimatedPrice: 3.80 },
            { id: '6', name: 'Arroz Integral', quantity: 500, unit: 'g', category: 'Granos', isPurchased: false, recipeCount: 1, nutriScore: 'A', estimatedPrice: 1.50 },
        ];
        
        const newBudget = generatedList.reduce((acc, item) => acc + item.estimatedPrice, 0);
        
        // 3. PRISMA UPSERT: Guardar la nueva lista en la DB (PlannedShoppingList)

        return NextResponse.json({ 
            items: generatedList, 
            healthScore: 90, // Un poco mejor al generar
            totalBudget: parseFloat(newBudget.toFixed(2)) 
        }, { status: 200 });

    } catch (error) {
        console.error("Error generating shopping list:", error);
        return NextResponse.json({ error: "Failed to generate shopping list" }, { status: 500 });
    }
}

// ----------------------------------------------------
// PATCH /api/shopping/item/[id] (Marcar como comprado)
// Se implementa con un solo handler PATCH que delega.
// ----------------------------------------------------
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const userId = getUserIdFromSession(req);
    if (!userId) return handleUnauthorized();
    
    // Aquí podemos asumir que el path es /api/shopping/item/:id
    try {
        const itemId = params.id;
        const body = await req.json();
        const { isPurchased } = body as { isPurchased: boolean };
        
        // 1. PRISMA: Buscar el ShoppingListItem y actualizar su estado.
        // const updatedItem = await prisma.shoppingListItem.update({ where: { id: itemId }, data: { isPurchased } });

        // Simulación:
        console.log(`[DB Mock] Item ${itemId} updated to purchased: ${isPurchased}`);

        return NextResponse.json({ message: "Item status updated" });
    } catch (error) {
        console.error("Error updating item status:", error);
        return NextResponse.json({ error: "Failed to update item status" }, { status: 500 });
    }
}
