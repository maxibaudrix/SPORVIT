//src/lib/validations/contact.ts
import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  email: z.string().email("Por favor, introduce un email válido."),
  subject: z.enum(["Soporte Técnico", "Duda Nutrición", "Facturación", "Otros"], {
    errorMap: () => ({ message: "Selecciona un asunto válido." })
  }),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres.").max(1000, "El mensaje no puede exceder los 1000 caracteres.")
});

export type ContactFormData = z.infer<typeof contactFormSchema>;