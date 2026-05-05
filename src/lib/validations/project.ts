import { z } from 'zod';

export const projectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, { message: "Le titre doit contenir au moins 5 caractères" })
    .max(200, { message: "Le titre ne peut pas dépasser 200 caractères" }),
  description: z
    .string()
    .trim()
    .min(50, { message: "La description doit contenir au moins 50 caractères" })
    .max(5000, { message: "La description ne peut pas dépasser 5000 caractères" }),
  sector: z
    .string()
    .trim()
    .min(1, { message: "Le secteur est requis" })
    .max(100, { message: "Le secteur ne peut pas dépasser 100 caractères" }),
  objectives: z
    .string()
    .trim()
    .max(2000, { message: "Les objectifs ne peuvent pas dépasser 2000 caractères" })
    .optional()
    .or(z.literal('')),
  budget: z
    .number()
    .positive({ message: "Le budget doit être positif" })
    .max(1000000000, { message: "Le budget ne peut pas dépasser 1 milliard" })
    .optional()
    .nullable(),
  challenge_id: z.string().uuid({ message: "ID de challenge invalide" }).optional().nullable(),
  media: z
    .array(
      z.object({
        type: z.enum(['image', 'video']),
        url: z
          .string()
          .trim()
          .url({ message: "URL invalide (doit commencer par http(s)://)" })
          .max(2000, { message: "URL trop longue" }),
        caption: z
          .string()
          .trim()
          .max(200, { message: "La légende ne peut pas dépasser 200 caractères" })
          .optional()
          .or(z.literal('')),
      })
    )
    .max(10, { message: "Maximum 10 médias" })
    .optional()
    .default([]),
});

export const evaluationSchema = z.object({
  impact_score: z
    .number()
    .int()
    .min(1, { message: "Le score doit être entre 1 et 5" })
    .max(5, { message: "Le score doit être entre 1 et 5" }),
  innovation_score: z
    .number()
    .int()
    .min(1, { message: "Le score doit être entre 1 et 5" })
    .max(5, { message: "Le score doit être entre 1 et 5" }),
  viability_score: z
    .number()
    .int()
    .min(1, { message: "Le score doit être entre 1 et 5" })
    .max(5, { message: "Le score doit être entre 1 et 5" }),
  sustainability_score: z
    .number()
    .int()
    .min(1, { message: "Le score doit être entre 1 et 5" })
    .max(5, { message: "Le score doit être entre 1 et 5" }),
  feedback: z
    .string()
    .trim()
    .min(20, { message: "Le feedback doit contenir au moins 20 caractères" })
    .max(2000, { message: "Le feedback ne peut pas dépasser 2000 caractères" }),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
export type EvaluationFormData = z.infer<typeof evaluationSchema>;
