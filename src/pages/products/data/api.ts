import { Product, productApiResponseSchema, ProductMetadata } from './schema' // Adjust the import path as necessary

// Define types for the function parameters
interface FetchProductsParams {
  page?: number
  limit?: number
  category?: string
  name?: string
}

export async function fetchProducts(params: FetchProductsParams = {}): Promise<{
  products: Product[]
  metadata: ProductMetadata
}> {
  try {
    // Build the query parameters string
    const queryParams = new URLSearchParams()

    if (params.page) {
      queryParams.append('page', params.page.toString())
    }
    if (params.limit) {
      queryParams.append('limit', params.limit.toString())
    }
    if (params.category) {
      queryParams.append('category', params.category.toString())
    }
    if (params.name) {
      queryParams.append('name', params.name.toString())
    }
    const response = await fetch(
      `http://localhost:3000/products?${queryParams.toString()}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }

    const result = await response.json()
    const validatedApiResponse = productApiResponseSchema.parse(result)
    const { docs: products, ...metadata } = validatedApiResponse

    return { products, metadata }
  } catch (error) {
    console.error('Error fetching products', error)
    throw error
  }
}
