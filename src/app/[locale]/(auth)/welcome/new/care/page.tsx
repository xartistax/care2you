import { Box } from '@chakra-ui/react';
import { getTranslations } from 'next-intl/server';
import { z } from 'zod';

import ServiceList from '@/components/ServiceList';
import { db } from '@/libs/DB';
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
    // Fetch services from Neon DB
    const services = await db.query.servicesSchema.findMany();

    // Log the raw data from the database

    // Ensure `id` is a string and fix `workingHours`
    const formattedServices = services.map(service => ({
      ...service,
      id: String(service.id),
      name: service.title || 'Default Name', // Ensure name is a valid string
      workingHours:
        typeof service.workingHours === 'string'
          ? JSON.parse(service.workingHours)
          : service.workingHours,
    }));

    // ✅ Validate the entire array
    const validatedServices = z.array(serviceSchema).parse(formattedServices);

    return (
      <Box
        bg="white"
        borderRadius="lg"
        maxWidth="800px"
        margin="0 auto"
        spaceY={8}
        p={8}
      >
        <ServiceList services={validatedServices} />
      </Box>
    );
  } catch (error) {
    console.error('❌ Validation Error:', error);
    return <Box>Fehler beim Laden der Services</Box>;
  }
}
