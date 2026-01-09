/**
 * Script para eliminar comidas duplicadas
 * Mantiene solo 1 de cada tipo por día según las reglas:
 * - 1 Desayuno (breakfast)
 * - 1 Almuerzo (lunch)
 * - 1 Cena (dinner)
 * - 2 Snacks (snack, snack_1, snack_2)
 * - 1 Pre-Entreno (pre_workout)
 * - 1 Post-Entreno (post_workout)
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDuplicateMeals() {
  try {
    console.log('🔍 Buscando comidas duplicadas...\n');

    // Obtener todos los usuarios
    const users = await prisma.user.findMany({
      select: { id: true, email: true }
    });

    for (const user of users) {
      console.log(`\n📧 Usuario: ${user.email}`);

      // Agrupar comidas por fecha
      const meals = await prisma.meal.findMany({
        where: { userId: user.id },
        orderBy: [{ date: 'asc' }, { createdAt: 'asc' }]
      });

      // Agrupar por fecha
      const mealsByDate = meals.reduce((acc, meal) => {
        const dateKey = meal.date.toISOString().split('T')[0];
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(meal);
        return acc;
      }, {} as Record<string, typeof meals>);

      let totalDeleted = 0;

      // Procesar cada día
      for (const [dateKey, dayMeals] of Object.entries(mealsByDate)) {
        const counts: Record<string, number> = {};
        const toDelete: string[] = [];

        // Agrupar por tipo
        const byType = dayMeals.reduce((acc, meal) => {
          if (!acc[meal.mealType]) acc[meal.mealType] = [];
          acc[meal.mealType].push(meal);
          return acc;
        }, {} as Record<string, typeof meals>);

        // Aplicar reglas de límites
        for (const [type, typeMeals] of Object.entries(byType)) {
          let maxAllowed = 1;

          // Los snacks pueden ser 2
          if (type === 'snack' || type === 'snack_1' || type === 'snack_2') {
            maxAllowed = 2;
          }

          if (typeMeals.length > maxAllowed) {
            console.log(`  ⚠️  ${dateKey} - ${type}: ${typeMeals.length} encontradas, límite: ${maxAllowed}`);

            // Mantener las primeras, eliminar el resto
            const toKeep = typeMeals.slice(0, maxAllowed);
            const duplicates = typeMeals.slice(maxAllowed);

            duplicates.forEach(meal => {
              toDelete.push(meal.id);
              console.log(`    ❌ Eliminando: ${meal.id} - ${meal.notes?.substring(0, 30)}...`);
            });
          }
        }

        // Eliminar duplicados
        if (toDelete.length > 0) {
          await prisma.meal.deleteMany({
            where: { id: { in: toDelete } }
          });
          totalDeleted += toDelete.length;
        }
      }

      console.log(`  ✅ Total eliminado: ${totalDeleted} comidas`);
    }

    console.log('\n✨ Limpieza completada!\n');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDuplicateMeals();
