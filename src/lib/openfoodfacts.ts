// src/lib/openfoodfacts.ts
import { OffProduct } from '@/types/product';

const OFF_API_BASE_URL = 'https://es.openfoodfacts.org/api/v2';

/**
 * Busca un producto por código de barras (EAN).
 * @param barcode - Código de barras del producto.
 */
export const searchProductByBarcode = async (barcode: string): Promise<OffProduct | null> => {
  try {
    const url = `${OFF_API_BASE_URL}/product/${barcode}`;
    const response = await fetch(url);

    if (!response.ok) {
        console.error(`OFF API error: ${response.status}`);
        return null;
    }

    const data = await response.json();

    if (data.status === 0 || !data.product) {
      return null;
    }

    return data.product as OffProduct;
  } catch (error) {
    console.error('Error fetching product from OpenFoodFacts:', error);
    return null;
  }
};