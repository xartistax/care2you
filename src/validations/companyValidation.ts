import { z } from 'zod';

export const companySchema = z.object({
  companyTitle: z.string().min(1, 'Street is required'), // Street name
  companyCategory: z.string().min(1, 'Street number is required'), // Street number
  uidst: z.string().min(1, 'Postal code (PLZ) is required').length(5, 'Postal code must be 5 characters'), // Postal code (PLZ)
  companyDescription: z.string().min(1, 'Location is required'), // Location (City, Town, etc.)

});
