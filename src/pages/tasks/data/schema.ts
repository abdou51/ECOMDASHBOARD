// File: schema.ts
import { z } from 'zod'

const addressSchema = z.object({
  geolocation: z.object({
    lat: z.string(),
    long: z.string(),
  }),
  city: z.string(),
  street: z.string(),
  number: z.number(),
  zipcode: z.string(),
})

const nameSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
})

export const userSchema = z.object({
  address: addressSchema,
  id: z.number(),
  email: z.string(),
  username: z.string(),
  password: z.string(),
  name: nameSchema,
  phone: z.string(),
  __v: z.number(),
})

export type User = z.infer<typeof userSchema>
