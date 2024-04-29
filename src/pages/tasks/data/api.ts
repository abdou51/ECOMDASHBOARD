import { userSchema, User } from './schema' // Adjust the import path as necessary

export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await fetch('https://fakestoreapi.com/users')
    if (!response.ok) {
      throw new Error('Failed to fetch users')
    }
    const usersData = await response.json()
    console.log(usersData)

    // Validate each user data with Zod
    return usersData.map((user) => userSchema.parse(user))
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error // Re-throw to handle errors in the consuming code
  }
}
