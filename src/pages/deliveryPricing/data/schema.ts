import { z } from 'zod'

export const wilayaSchema = z.object({
  _id: z.string(),
  name: z.string(),
  deskPrice: z.number(),
  homePrice: z.number(),
})

export type Wilaya = z.infer<typeof wilayaSchema>
