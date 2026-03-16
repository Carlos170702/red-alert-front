import { z } from 'zod'

export const userFormSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  apellido_paterno: z.string().min(1, 'El apellido paterno es obligatorio'),
  apellido_materno: z.string().min(1, 'El apellido materno es obligatorio'),
  telefono: z.string().optional(),
  role_id: z.coerce.number().int().min(1, 'Selecciona un rol'),
  username: z.string().min(1, 'El usuario es obligatorio'),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, 'Mínimo 6 caracteres'),
})

export type UserFormValues = z.infer<typeof userFormSchema>
