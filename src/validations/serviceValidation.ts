// Validation/serviceValidation.ts
import { z } from 'zod';

import { workingHoursSchema } from './onBoardingValidation';

// Define the validation schema for services
export const serviceSchema = z.object({
  id: z.any().optional(),
  internalId: z.string(),
  status: z.string().optional(),
  title: z.string(), // Ensure the field name matches the DB schema
  description: z.string(),
  price: z.number(),
  priceType: z.string(),
  userId: z.string(),
  image: z.string().optional(),
  calendly: z.string(),
  workingHours: z.object({
    Montag: workingHoursSchema,
    Dienstag: workingHoursSchema,
    Mittwoch: workingHoursSchema,
    Donnerstag: workingHoursSchema,
    Freitag: workingHoursSchema,
    Samstag: workingHoursSchema,
    Sonntag: workingHoursSchema,
  }),

  location: z.object({
    street: z.string(),
    number: z.string(),
    city: z.string(),
    postalCode: z.string(),
  }),
  fileToUpload: z.any().optional(),
  formattedPrice: z.string().optional(),
  companyTitle: z.string().optional(),
  category: z.string(),
});
