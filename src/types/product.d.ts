// src/types/product.d.ts

/**
 * Tipos simplificados para un producto de OpenFoodFacts (OFF)
 */
export interface OffProduct {
  code: string;
  product_name_es: string;
  image_front_url: string;
  brands: string;
  categories: string;

  // Nutriscore/NOVA
  nutriscore_grade: 'a' | 'b' | 'c' | 'd' | 'e' | '';
  nova_group: number;

  // Nutrientes (valores por 100g)
  nutriments: {
    'energy-kcal_100g'?: number;
    'proteins_100g'?: number;
    'carbohydrates_100g'?: number;
    'fat_100g'?: number;
    'fiber_100g'?: number;
    'salt_100g'?: number;
  };
}

/**
 * Estructura de producto utilizada internamente por Sporvit
 */
export interface SporvitProduct {
  id: string; // OFF code
  name: string;
  brand: string;
  imageUrl: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  nutriScore: 'A' | 'B' | 'C' | 'D' | 'E' | 'NA';
  novaGroup: number | null;
}