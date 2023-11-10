import { z } from "zod"

// period in which we display the amount of tasks
export type Period = 'day' | 'week' | 'month' | 'year'

// this is the formschema that will define the rules and fields of the form
export const taskFormSchema = z.object({
  title: z.string()
    .min(5,
      { message: 'The title must be at least 5 chars.' })
    .max(40,
      { message: 'The title must be at most 20 chars.' }),
  memo: z.string()
    .min(3,
      { message: 'The memo must be at least 3 chars.' })
    .max(60,
      { message: 'The memo must be at most 40 chars.' }),
  deadline: z.date(
    {
      required_error: 'A deadline is required.',
      invalid_type_error: "That's not a valid date."
    }
  )
})
