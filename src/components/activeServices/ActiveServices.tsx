import { Box, Text } from '@chakra-ui/react';
import { z } from 'zod';

import { db } from '@/libs/DB';
import { servicesSchema } from '@/models/Schema';
import { logError } from '@/utils/sentryLogger';
import { serviceSchema } from '@/validations/serviceValidation';

const ServiceArraySchema = z.array(serviceSchema);

export default async function ActiveServices() {
  try {
    // Fetch services from the database
    const fetchedServices = await db
      .select({
        id: servicesSchema.id,
        title: servicesSchema.title,
        description: servicesSchema.description,
        price: servicesSchema.price,
        priceType: servicesSchema.priceType,
        userId: servicesSchema.userId,
        image: servicesSchema.image,
        calendly: servicesSchema.calendly,
        workingHours: servicesSchema.workingHours,
        location: servicesSchema.location,
        createdAt: servicesSchema.createdAt,
        updatedAt: servicesSchema.updatedAt,
      })
      .from(servicesSchema)
      .limit(10); // You can adjust the limit as needed

    // Validate services using Zod
    const validatedServices = ServiceArraySchema.parse(fetchedServices);

    if (validatedServices.length === 0) {
      return (
        <Box textAlign="center" py={10}>
          <Text fontSize="lg" color="gray.500">Keine Services gefunden.</Text>
        </Box>
      );
    }

    // Here you can map through the services if you want to display them later
    return (
      <Box fontSize="sm" color="gray.500">
        here
      </Box>
    );
  } catch (error) {
    logError('ActiveServices: ❌ Error fetching services:', { reason: (error as Error).message });
    return (
      <Box textAlign="center" py={10}>
        <Text fontSize="lg" color="red.500">Fehler beim Laden der Services.</Text>
      </Box>
    );
  }
}
