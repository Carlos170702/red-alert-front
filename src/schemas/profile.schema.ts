import { z } from 'zod'

export const profileFormSchema = z.object({
  nombre: z.string().optional(),
  apellido_paterno: z.string().optional(),
  apellido_materno: z.string().optional(),
  telefono: z.string().optional(),
  username: z.string().optional(),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, 'Mínimo 6 caracteres'),
  calle: z.string().optional(),
  colonia: z.string().optional(),
  codigo_postal: z.string().optional(),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>
