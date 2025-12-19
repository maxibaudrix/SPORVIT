// src/lib/openfoodfacts/client.ts
interface OFFProduct {
  code: string
  product: {
    product_name?: string
    brands?: string
    image_url?: string
    nutriscore_grade?: string
    nova_group?: number
    ecoscore_grade?: string
    nutriments?: {
      'energy-kcal_100g'?: number
      'proteins_100g'?: number
      'carbohydrates_100g'?: number
      'fat_100g'?: number
      'fiber_100g'?: number
      'sodium_100g'?: number
      'sugars_100g'?: number
      'saturated-fat_100g'?: number
    }
    ingredients_text?: string
    allergens?: string
    labels?: string
    serving_size?: string
  }
}

export class OpenFoodFactsClient {
  private baseUrl = 'https://world.openfoodfacts.org/api/v2'
  private userAgent = 'Sporvit - Nutrition App - Version 1.0'

  async getProduct(barcode: string): Promise<OFFProduct | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/product/${barcode}.json`,
        {
          headers: {
            'User-Agent': this.userAgent,
          },
        }
      )

      if (!response.ok) return null

      const data = await response.json()
      
      if (data.status === 0) return null // Product not found

      return data
    } catch (error) {
      console.error('Error fetching product from OFF:', error)
      return null
    }
  }

  async searchProducts(query: string, page = 1, pageSize = 24): Promise<{
    products: OFFProduct[]
    count: number
    page: number
  }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/search?search_terms=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}&json=true`,
        {
          headers: {
            'User-Agent': this.userAgent,
          },
        }
      )

      if (!response.ok) {
        return { products: [], count: 0, page }
      }

      const data = await response.json()

      return {
        products: data.products || [],
        count: data.count || 0,
        page: data.page || page,
      }
    } catch (error) {
      console.error('Error searching products:', error)
      return { products: [], count: 0, page }
    }
  }

  async getAlternatives(
    barcode: string,
    category?: string,
    limit = 10
  ): Promise<OFFProduct[]> {
    try {
      // First get the original product
      const original = await this.getProduct(barcode)
      if (!original) return []

      // Extract category or use generic search
      const searchTerm = category || original.product.product_name?.split(' ')[0] || ''

      const response = await fetch(
        `${this.baseUrl}/search?search_terms=${encodeURIComponent(searchTerm)}&page_size=${limit * 3}&json=true`,
        {
          headers: {
            'User-Agent': this.userAgent,
          },
        }
      )

      if (!response.ok) return []

      const data = await response.json()
      const products = data.products || []

      // Filter and sort alternatives
      return products
        .filter((p: any) => 
          p.code !== barcode && // Not the same product
          p.product_name && 
          p.nutriscore_grade &&
          p.nutriments?.['energy-kcal_100g']
        )
        .slice(0, limit)
    } catch (error) {
      console.error('Error getting alternatives:', error)
      return []
    }
  }
}

export const offClient = new OpenFoodFactsClient()