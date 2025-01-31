import { clerkClient } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { getTranslations } from 'next-intl/server';
import type { z } from 'zod';

import { db } from '@/libs/DB';
import { servicesSchema } from '@/models/Schema';
import { constructUser } from '@/utils/Helpers';
import type { serviceSchema } from '@/validations/serviceValidation';

import SingleListing from './SingleListing';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'Welcome',
  });

  return {
    title: t('single_view'),
  };
}

export default async function NewServiceServer({ params }: { params: { id: string } }) {
  const serviceId = params.id;

  // Ensure `id` is parsed correctly and valid

  const allServices = await db.select().from(servicesSchema).limit(10);

  if (allServices.length === 0) {
    throw new Error('No services found in the database. Check if your database is seeded correctly.');
  }

  // Fetch the service from DB
  const services = await db
    .select()
    .from(servicesSchema)
    .where(eq(servicesSchema.internalId, serviceId))
    .limit(1);

  // Get the first service object
  const serviceData = services[0];

  if (!serviceData) {
    throw new Error('Service not found'); // ✅ Throw an error instead of returning JSX
  }

  // ✅ Construct full `ServiceFormData` object
  type ServiceFormData = z.infer<typeof serviceSchema>;

  // const user = await currentUser();

  const formattedService: ServiceFormData = {
    id: Number(serviceData.id),
    userId: serviceData.userId,
    category: serviceData.category,
    title: serviceData.title ?? '',
    description: serviceData.description ?? '',
    price: serviceData.price ?? 0,
    priceType: serviceData.priceType ?? 'fix',
    image: serviceData.image || '/placeholder.jpeg',
    fileToUpload: null, // ✅ Ensure this is provided
    workingHours: serviceData.workingHours && typeof serviceData.workingHours === 'string'
      ? JSON.parse(serviceData.workingHours || '{}') // ✅ Prevent `null` parsing errors
      : serviceData.workingHours ?? {}, // ✅ Ensure it's always an object
    location: serviceData.location && typeof serviceData.location === 'string'
      ? JSON.parse(serviceData.location || '{}') // ✅ Prevent `null` parsing errors
      : serviceData.location ?? { street: '', number: '', city: '', postalCode: '' },
    formattedPrice: `${serviceData.price ?? 0} CHF`, // ✅ Ensure it's always a string
    calendly: serviceData.calendly ?? '',
    internalId: serviceData.internalId,
  };

  // Fetch user details from Clerk

  try {
    const user = await clerkClient.users.getUser(formattedService.userId);
    const constructedUsers = constructUser(user);

    return <SingleListing service={formattedService} user={constructedUsers} />;
  } catch (error) {
    throw new Error(`Failed to fetch user ${error}`); // ✅ Handle Clerk API errors properly
  }
}
