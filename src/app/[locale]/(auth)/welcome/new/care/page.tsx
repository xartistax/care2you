import { Box } from '@chakra-ui/react';
import { clerkClient } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { getTranslations } from 'next-intl/server';
import { z } from 'zod';

import ServiceList from '@/components/ServiceList';
import { db } from '@/libs/DB';
import { servicesSchema } from '@/models/Schema';
import { logError, logWarning } from '@/utils/sentryLogger';
import { serviceSchema } from '@/validations/serviceValidation';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Index',
  });

  return {
    title: t('meta_title'),
  };
}

export default async function NewServiceServer() {
  try {
    // Fetch services from Neon DB where status is 'active'
    const services = await db.query.servicesSchema.findMany({
      where: eq(servicesSchema.status, 'active'), // Filter using the field from the database schema
    });

    // Ensure `id` is a string and fix `workingHours`
    const formattedServices = services.map(service => ({
      ...service,
      id: String(service.id), // Make sure id is a string
      name: service.title || 'Default Name', // Ensure name is a valid string
      workingHours:
        typeof service.workingHours === 'string'
          ? JSON.parse(service.workingHours) // Parse workingHours if it's a string
          : service.workingHours,
    }));

    // ✅ Validate the entire array
    const validatedServices = z.array(serviceSchema).parse(formattedServices);

    // Fetch the companyTitle for each service user (optional)
    const enrichedServices = await Promise.all(
      validatedServices.map(async (service) => {
        try {
          const user = await clerkClient.users.getUser(service.userId);
          const companyTitle = user?.privateMetadata?.companyTitle as string | undefined;

          return {
            ...service,
            companyTitle,
          };
        } catch (error) {
          logWarning(`NewServiceServer: Skipping service ${service.id} (user not found)`, { reason: (error as Error)?.message });
          return null; // Skip this service if user not found
        }
      }),
    );

    const availableServices = enrichedServices.filter(service => service !== null);

    return (
      <Box
        bg="white"
        borderRadius="lg"
        maxWidth="800px"
        margin="0 auto"
        spaceY={8}
        p={8}
      >
        <ServiceList services={availableServices} />
      </Box>
    );
  } catch (error) {
    logError('NewServiceServer: ❌ Validation Error:', { reason: (error as Error)?.message });
    return (
      <Box
        spaceY={8}
        p={8}
      >
        Fehler beim Laden der Services
      </Box>
    );
  }
}
