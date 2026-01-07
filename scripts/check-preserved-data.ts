#!/usr/bin/env tsx
/**
 * Script para revisar estadísticas de datos preservados
 * Uso: npx tsx scripts/check-preserved-data.ts
 */

import { getWorkoutsStats, getRecipesStats } from '../src/lib/services/dataPreservation';

async function main() {
  console.log('📊 Obteniendo estadísticas de datos preservados...\n');

  try {
    // Obtener estadísticas
    const [workoutsStats, recipesStats] = await Promise.all([
      getWorkoutsStats(),
      getRecipesStats(),
    ]);

    // Mostrar estadísticas de entrenamientos
    console.log('🏋️  ENTRENAMIENTOS PRESERVADOS');
    console.log('================================');
    console.log(`Total: ${workoutsStats.total}`);
    console.log('\nPor tipo:');
    Object.entries(workoutsStats.byType).forEach(([type, count]) => {
      const emoji = {
        strength: '💪',
        cardio: '🏃',
        hiit: '⚡',
        rest: '😴',
      }[type] || '🔹';
      console.log(`  ${emoji} ${type.padEnd(10)}: ${count}`);
    });

    // Mostrar estadísticas de recetas
    console.log('\n\n🍽️  RECETAS PRESERVADAS');
    console.log('================================');
    console.log(`Total: ${recipesStats.total}`);
    console.log(`Rating promedio: ${recipesStats.avgRating.toFixed(1)} ⭐`);
    console.log(`Calorías promedio: ${recipesStats.avgCalories} kcal`);

    // Resumen total
    console.log('\n\n📦 RESUMEN GENERAL');
    console.log('================================');
    console.log(`Total de items preservados: ${workoutsStats.total + recipesStats.total}`);
    console.log(`Entrenamientos: ${workoutsStats.total}`);
    console.log(`Recetas: ${recipesStats.total}`);

    console.log('\n✅ Estadísticas obtenidas correctamente\n');
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    process.exit(1);
  }
}

main();
