import { z } from 'zod';

import { workingHoursSchema } from './onBoardingValidation';

export const careSchema = z.object({
  skill: z.array(z.unknown()), // Street name
  expertise: z.unknown(),
  certificates: z.array(z.unknown()),
  workingHours: z.object({
    Montag: workingHoursSchema,
    Dienstag: workingHoursSchema,
    Mittwoch: workingHoursSchema,
    Donnerstag: workingHoursSchema,
    Freitag: workingHoursSchema,
    Samstag: workingHoursSchema,
    Sonntag: workingHoursSchema,
  }),
});
