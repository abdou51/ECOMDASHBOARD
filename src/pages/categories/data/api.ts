import { Category, categorySchema } from './schema' // Adjust the import path as necessary

export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch('http://localhost:3000/categories')
    if (!response.ok) {
      throw new Error('Failed to fetch users')
    }
    const categoryData = (await response.json()) as Category[] // Assert that the JSON is of type Wilaya[]
    console.log(categoryData)

    // Validate each user data with Zod
    return categoryData.map((category: Category) =>
      categorySchema.parse(category)
    ) // Explicitly declare wilaya as type Wilaya
  } catch (error) {
    console.error('Error fetching Categories', error)
    throw error // Re-throw to handle errors in the consuming code
  }
}
