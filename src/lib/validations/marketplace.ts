import { z } from 'zod';

export const marketplaceProductSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: "Le titre doit contenir au moins 3 caractères" })
    .max(200, { message: "Le titre ne peut pas dépasser 200 caractères" }),
  description: z
    .string()
    .trim()
    .min(10, { message: "La description doit contenir au moins 10 caractères" })
    .max(2000, { message: "La description ne peut pas dépasser 2000 caractères" }),
  category: z
    .string()
    .trim()
    .min(1, { message: "La catégorie est requise" })
    .max(100, { message: "La catégorie ne peut pas dépasser 100 caractères" }),
  price_tnd: z
    .number()
    .positive({ message: "Le prix TND doit être positif" })
    .max(1000000, { message: "Le prix TND ne peut pas dépasser 1,000,000" })
    .optional()
    .nullable(),
  price_tokens: z
    .number()
    .int()
    .positive({ message: "Le prix en tokens doit être positif" })
    .max(100000, { message: "Le prix en tokens ne peut pas dépasser 100,000" })
    .optional()
    .nullable(),
  stock_quantity: z
    .number()
    .int()
    .min(0, { message: "La quantité en stock ne peut pas être négative" })
    .max(10000, { message: "La quantité en stock ne peut pas dépasser 10,000" }),
  image_url: z
    .string()
    .trim()
    .url({ message: "L'URL de l'image n'est pas valide" })
    .optional()
    .or(z.literal('')),
})
.refine(
  (data) => {
    return data.price_tnd !== null || data.price_tokens !== null;
  },
  {
    message: "Au moins un prix (TND ou tokens) doit être défini",
    path: ["price_tnd"],
  }
);

export const challengeSchema = z.object({
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
  prize_amount: z
    .number()
    .positive({ message: "Le montant du prix doit être positif" })
    .max(10000000, { message: "Le montant du prix ne peut pas dépasser 10,000,000" }),
  participation_fee: z
    .number()
    .min(0, { message: "Les frais de participation ne peuvent pas être négatifs" })
    .max(100000, { message: "Les frais de participation ne peuvent pas dépasser 100,000" })
    .optional()
    .nullable(),
  max_participants: z
    .number()
    .int()
    .positive({ message: "Le nombre maximum de participants doit être positif" })
    .max(10000, { message: "Le nombre maximum de participants ne peut pas dépasser 10,000" })
    .optional()
    .nullable(),
  start_date: z.date({ required_error: "La date de début est requise" }),
  end_date: z.date({ required_error: "La date de fin est requise" }),
  criteria_impact: z
    .number()
    .int()
    .min(0, { message: "Le critère doit être entre 0 et 100" })
    .max(100, { message: "Le critère doit être entre 0 et 100" })
    .optional(),
  criteria_innovation: z
    .number()
    .int()
    .min(0, { message: "Le critère doit être entre 0 et 100" })
    .max(100, { message: "Le critère doit être entre 0 et 100" })
    .optional(),
  criteria_viability: z
    .number()
    .int()
    .min(0, { message: "Le critère doit être entre 0 et 100" })
    .max(100, { message: "Le critère doit être entre 0 et 100" })
    .optional(),
  criteria_sustainability: z
    .number()
    .int()
    .min(0, { message: "Le critère doit être entre 0 et 100" })
    .max(100, { message: "Le critère doit être entre 0 et 100" })
    .optional(),
})
.refine(
  (data) => {
    return data.end_date > data.start_date;
  },
  {
    message: "La date de fin doit être après la date de début",
    path: ["end_date"],
  }
);

export type MarketplaceProductFormData = z.infer<typeof marketplaceProductSchema>;
export type ChallengeFormData = z.infer<typeof challengeSchema>;
