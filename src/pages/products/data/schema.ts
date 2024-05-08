import { z } from 'zod'

// Define the schemas as you have, but ensure they are exported

export const imageSchema = z.object({
  urls: z.array(z.string()),
  _id: z.string(),
})

export type Image = z.infer<typeof imageSchema>

export const sizeSchema = z.object({
  size: z.number().nullable(),
  inStock: z.boolean(),
})

export type Size = z.infer<typeof sizeSchema>

export const colorSchema = z.object({
  hex: z.string(),
  images: imageSchema.optional(),
  sizes: z.array(sizeSchema),
})

export type Color = z.infer<typeof colorSchema>

export const categorySchema = z.object({
  _id: z.string(),
  engName: z.string(),
  arName: z.string(),
  frName: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type Category = z.infer<typeof categorySchema>

export const productSchema = z.object({
  _id: z.string(),
  arName: z.string(),
  frName: z.string(),
  engName: z.string(),
  isFeatured: z.boolean(),
  category: categorySchema,
  colors: z.array(colorSchema),
  arDescription: z.string(),
  frDescription: z.string(),
  engDescription: z.string(),
  price: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isDrafted: z.boolean(),
})

export const productApiResponseSchema = z.object({
  docs: z.array(productSchema),
  totalDocs: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  page: z.number(),
  pagingCounter: z.number(),
  hasPrevPage: z.boolean(),
  hasNextPage: z.boolean(),
  prevPage: z.number().nullable(), // Accepts number or null
  nextPage: z.number().nullable(), // Accepts number or null
})

export type ProductMetadata = {
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null // Can be a number or null
  nextPage: number | null // Can be a number or null
}

export type ProductApiResponse = z.infer<typeof productApiResponseSchema>
export type Product = z.infer<typeof productSchema>
