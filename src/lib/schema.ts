import { z } from 'zod'

export const chatWithCatSchema = z
  .object({
    message: z.string().max(1000),
    isRead: z.boolean(),

    to: z.string(),
    from: z.string(),

    createdAt: z.date(),
  })
  .strip()

export type ChatWithCat = z.infer<typeof chatWithCatSchema>

