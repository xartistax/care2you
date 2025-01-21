// Validation/serviceValidation.ts
import { z } from 'zod';

import { workingHoursSchema } from './onBoardingValidation';

// Define the validation schema for services
export const serviceSchema = z.object({
  id: z.any().optional(),
  title: z.string(), // Ensure the field name matches the DB schema
  description: z.string(),
  price: z.number(),
  priceType: z.enum(['fix', 'hourly']),
  userId: z.string(),
  image: z.string().optional(),
  calendly: z.string(),
  workingHours: z.object({
    Monday: workingHoursSchema,
    Tuesday: workingHoursSchema,
    Wednesday: workingHoursSchema,
    Thursday: workingHoursSchema,
    Friday: workingHoursSchema,
    Saturday: workingHoursSchema,
    Sunday: workingHoursSchema,
  }),

  location: z.object({
    street: z.string(),
    number: z.string(),
    city: z.string(),
    postalCode: z.string(),
  }),
  fileToUpload: z.any().optional(),
  formattedPrice: z.string().optional(),
});
