import { z } from 'zod';

export const emailSchema = z
  .string()
  .trim()
  .min(1, { message: "L'email est requis" })
  .email({ message: "Format d'email invalide" })
  .max(255, { message: "L'email ne peut pas dépasser 255 caractères" });

export const passwordSchema = z
  .string()
  .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
  .max(72, { message: "Le mot de passe ne peut pas dépasser 72 caractères" })
  .regex(/[a-z]/, { message: "Le mot de passe doit contenir au moins une minuscule" })
  .regex(/[A-Z]/, { message: "Le mot de passe doit contenir au moins une majuscule" })
  .regex(/[0-9]/, { message: "Le mot de passe doit contenir au moins un chiffre" });

export const nameSchema = z
  .string()
  .trim()
  .min(1, { message: "Ce champ est requis" })
  .max(100, { message: "Ce champ ne peut pas dépasser 100 caractères" })
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, { message: "Seules les lettres, espaces, apostrophes et tirets sont autorisés" });

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^(\+216)?[0-9]{8}$/, { message: "Numéro de téléphone invalide (format: +21612345678 ou 12345678)" })
  .optional()
  .or(z.literal(''));

export const companyNameSchema = z
  .string()
  .trim()
  .min(1, { message: "Le nom de l'entreprise est requis" })
  .max(200, { message: "Le nom de l'entreprise ne peut pas dépasser 200 caractères" })
  .optional()
  .or(z.literal(''));

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Le mot de passe est requis" }),
});

export const signUpSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, { message: "Veuillez confirmer le mot de passe" }),
    role: z.enum(['investor', 'projectHolder', 'evaluator'], {
      errorMap: () => ({ message: "Veuillez sélectionner un rôle" }),
    }),
    phone: phoneSchema,
    companyName: companyNameSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.role === 'investor') {
        return data.companyName && data.companyName.length > 0;
      }
      return true;
    },
    {
      message: "Le nom de l'entreprise est requis pour les investisseurs",
      path: ["companyName"],
    }
  );

export const profileUpdateSchema = z.object({
  first_name: nameSchema.optional(),
  last_name: nameSchema.optional(),
  phone: phoneSchema,
  company_name: companyNameSchema,
});

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
