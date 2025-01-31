import { z } from 'zod';

export const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'), // Street name
  streetnumber: z.string().min(1, 'Street number is required'), // Street number
  plz: z.string().min(1, 'Postal code (PLZ) is required').length(5, 'Postal code must be 5 characters'), // Postal code (PLZ)
  location: z.string().min(1, 'Location is required'), // Location (City, Town, etc.)
  phone: z.string().min(1, 'Phone is required'),
});
