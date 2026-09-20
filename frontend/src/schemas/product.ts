import { z } from 'zod'

export const productFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be zero or greater.'),
  stockQuantity: z
    .number()
    .int('Stock quantity must be a whole number.')
    .min(0, 'Stock quantity must be zero or greater.'),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
