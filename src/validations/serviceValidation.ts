// Validation/serviceValidation.ts
import { z } from 'zod';

// Define the validation schema for services
export const serviceSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  priceType: z.enum(['fix', 'hourly']),
  userId: z.string(),
  image: z.string().optional(),
  calendly: z.string(),
  workingHours: z.record(
    z.string(),
    z.object({ enabled: z.boolean(), hours: z.tuple([z.string(), z.string()]) }),
  ),
  location: z.object({
    street: z.string(),
    number: z.string(),
    city: z.string(),
    postalCode: z.string(),
  }),
});
