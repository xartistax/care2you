import { z } from 'zod';

// Define the WorkingHours schema
export const workingHoursSchema = z.object({
  enabled: z.boolean(),
  hours: z.tuple([z.string(), z.string()]), // Start and end times as strings
});

// Define the privateMetadata schema
const privateMetadataSchema = z.object({
  streetnumber: z.unknown(),
  street: z.unknown(),
  plz: z.unknown(),
  location: z.unknown(),
  phone: z.unknown(),
  gender: z.unknown(),
  role: z.unknown(),
  compilance: z.unknown(),
  companyTitle: z.unknown(),
  companyDescription: z.unknown(),
  companyCategory: z.unknown(),
  serviceCategory: z.unknown(),
  uidst: z.unknown(),
  credits: z.unknown(),
  expertise: z.unknown(),
  skill: z.array(z.unknown()), // Array of unknown items
  languages: z.array(z.unknown()), // Array of unknown items
  certificates: z.array(z.unknown()), // Array of unknown items
  workingHours: z.object({
    Monday: workingHoursSchema,
    Tuesday: workingHoursSchema,
    Wednesday: workingHoursSchema,
    Thursday: workingHoursSchema,
    Friday: workingHoursSchema,
    Saturday: workingHoursSchema,
    Sunday: workingHoursSchema,
  }),
});

// Define the main OnBoardingClientUser schema
export const onboardingClientUserSchema = z.object({
  id: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  email: z.string().optional(),
  imageUrl: z.string().nullable().optional(),
  privateMetadata: privateMetadataSchema,
});

// Infer the TypeScript type from the schema
export type OnBoardingClientUser = z.infer<typeof onboardingClientUserSchema>;
