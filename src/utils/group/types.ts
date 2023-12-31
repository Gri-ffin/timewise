import { z } from 'zod'

export const ICONSTYPES = ['Star', 'Folder', 'File', 'Flag', 'Power'] as const

export const groupTaskSchema = z.object({
  name: z.string()
    .min(3,
      { message: 'The title must be at least 3 chars.' })
    .max(20,
      { message: 'The title must be at most 20 chars.' }),
  icon: z.enum(ICONSTYPES)
})

export default z.enum(ICONSTYPES)
