// src/lib/productProcessor.ts
import { OffProduct, SporvitProduct } from '@/types/product';

/**
 * Convierte un objeto de producto de OpenFoodFacts (OFF) a la estructura interna de Sporvit.
 */
export const processOffProduct = (offProduct: OffProduct): SporvitProduct | null => {
  const { nutriments } = offProduct;

  const calories = nutriments['energy-kcal_100g'] || 0;
  
  if (!offProduct.product_name_es || calories === 0) {
    return null;
  }

  const result: SporvitProduct = {
    id: offProduct.code,
    name: offProduct.product_name_es || 'Producto sin nombre',
    brand: offProduct.brands || 'Desconocida',
    imageUrl: offProduct.image_front_url || '/assets/placeholder-product.png',
    
    calories: calories,
    proteins: nutriments.proteins_100g || 0,
    carbs: nutriments.carbohydrates_100g || 0,
    fats: nutriments.fat_100g || 0,
    
    nutriScore: (offProduct.nutriscore_grade?.toUpperCase() || 'NA') as SporvitProduct['nutriScore'],
    novaGroup: offProduct.nova_group || null,
  };

  return result;
};