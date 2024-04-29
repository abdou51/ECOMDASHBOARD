import { z } from 'zod'

export const categorySchema = z.object({
  _id: z.string(),
  arName: z.string(),
  frName: z.string(),
  engName: z.string(),
})

export type Category = z.infer<typeof categorySchema>
