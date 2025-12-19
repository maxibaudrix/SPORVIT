// src/lib/recipeEngine/templates.ts

/**
 * Plantillas básicas para generación de recetas heurísticas.
 * Se utilizan cuando la IA no está disponible o para sugerencias rápidas.
 */
export const RECIPE_TEMPLATES = [
  {
    id: 'bowl-base',
    name: 'Bowl Nutritivo de {protein} y {carb}',
    structure: ['base_carb', 'protein_main', 'vegetable_mix', 'dressing_fat'],
    defaultTags: ['Quick', 'Healthy', 'Lunch'],
  },
  {
    id: 'stir-fry',
    name: 'Salteado Rápido de {protein}',
    structure: ['oil_fat', 'protein_main', 'vegetable_crunchy', 'sauce'],
    defaultTags: ['Dinner', 'High Protein', 'Wok'],
  },
  {
    id: 'salad-fresh',
    name: 'Ensalada Fresca con {protein}',
    structure: ['leafy_green', 'protein_cold', 'vegetable_raw', 'dressing_oil'],
    defaultTags: ['Low Calorie', 'Fresh', 'Summer'],
  }
];