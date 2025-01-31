import { Box } from '@chakra-ui/react';
import { clerkClient } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { getTranslations } from 'next-intl/server';
import { z } from 'zod';

import ServiceList from '@/components/ServiceList';
import { db } from '@/libs/DB';
import { servicesSchema } from '@/models/Schema';
import { serviceSchema } from '@/validations/serviceValidation';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Welcome',
  });

  return {
    title: t('search_new_care'),
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
    const servicesWithCompanyTitle = await Promise.all(
      validatedServices.map(async (service) => {
        let companyTitle: string | undefined; // Ensure companyTitle is either a string or undefined
        if (service.userId) {
          const user = await clerkClient.users.getUser(service.userId);
          companyTitle = user.privateMetadata?.companyTitle as string; // Explicitly set to undefined if not available
        }
        return {
          ...service,
          companyTitle, // Ensure companyTitle is a string or undefined
        };
      }),
    );

    return (
      <Box
        bg="white"
        borderRadius="lg"
        maxWidth="800px"
        margin="0 auto"
        spaceY={8}
        p={8}
      >
        <ServiceList services={servicesWithCompanyTitle} />
      </Box>
    );
  } catch (error) {
    console.error('❌ Validation Error:', error);
    return <Box>Fehler beim Laden der Services</Box>;
  }
}
