import { z } from 'zod'

// Define a minimal product schema for the order items
export const orderProductSchema = z.object({
  _id: z.string(),
  engName: z.string(),
})

// Define the type for an order item
export const orderItemSchema = z.object({
  product: orderProductSchema.nullable(),
  hex: z.string(),
  size: z.number().default(0),
  quantity: z.number().default(1),
  price: z.number().default(0),
  _id: z.string().nullable(),
})

// Define the type for an order
export const orderSchema = z.object({
  _id: z.string(),
  note: z.string().optional(),
  shippingType: z.string(),
  shippingPrice: z.number().default(0),
  status: z.enum([
    'pending',
    'confirmed',
    'cancelled',
    'delivered',
    'returned',
    'shipped',
  ]),
  fullName: z.string(),
  address: z.string(),
  wilaya: z.string(),
  commune: z.string(),
  phoneNumber1: z.string().default(''),
  phoneNumber2: z.string().default(''),
  total: z.number(),
  orderItems: z.array(orderItemSchema).nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  reference: z.string(),
})

// Define the response schema for multiple orders
export const orderApiResponseSchema = z.object({
  docs: z.array(orderSchema),
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

export type OrderMetaData = {
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

// Define TypeScript types from schemas
export type OrderProduct = z.infer<typeof orderProductSchema>
export type OrderItem = z.infer<typeof orderItemSchema>
export type Order = z.infer<typeof orderSchema>
export type OrderApiResponse = z.infer<typeof orderApiResponseSchema>
