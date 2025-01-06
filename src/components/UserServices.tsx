'use server';

import { Box, Text, VStack } from '@chakra-ui/react';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/libs/DB';
import { servicesSchema } from '@/models/Schema';
import { serviceSchema } from '@/validations/serviceValidation';

const ServiceArraySchema = z.array(serviceSchema);

type UserServicesProps = {
  user: { id: string };
};

export default async function UserServices({ user }: UserServicesProps) {
  try {
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
      .where(eq(servicesSchema.userId, user.id));

    // ✅ Validate services using Zod
    const validatedServices = ServiceArraySchema.parse(fetchedServices);

    if (validatedServices.length === 0) {
      return (
        <Box textAlign="center" py={10}>
          <Text fontSize="lg" color="gray.500">Keine Services gefunden.</Text>
        </Box>
      );
    }

    return (
      <VStack spaceY={4} align="stretch">
        {validatedServices.map(service => (
          <Box key={service.id} p={4} borderWidth="1px" borderRadius="md">
            <Text fontSize="lg" fontWeight="bold">{service.title}</Text>
            <Text fontSize="sm" color="gray.600">{service.description}</Text>
          </Box>
        ))}
      </VStack>
    );
  } catch (error) {
    console.error('❌ Error fetching services:', error);
    return (
      <Box textAlign="center" py={10}>
        <Text fontSize="lg" color="red.500">Fehler beim Laden der Services.</Text>
      </Box>
    );
  }
}
