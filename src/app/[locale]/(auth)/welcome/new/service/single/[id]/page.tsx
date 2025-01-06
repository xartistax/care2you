import { clerkClient } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { getTranslations } from 'next-intl/server';

import { db } from '@/libs/DB';
import { servicesSchema } from '@/models/Schema';
import type { ServiceFormData } from '@/utils/Types';

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
  const serviceId = Number(params.id);

  // Ensure `id` is parsed correctly and valid

  const allServices = await db.select().from(servicesSchema).limit(10);

  if (allServices.length === 0) {
    throw new Error('No services found in the database. Check if your database is seeded correctly.');
  }

  // Fetch the service from DB
  const services = await db
    .select()
    .from(servicesSchema)
    .where(eq(servicesSchema.id, serviceId))

    .limit(1);

  // Get the first service object
  const serviceData = services[0];

  if (!serviceData) {
    throw new Error('Service not found'); // ✅ Throw an error instead of returning JSX
  }

  // ✅ Construct full `ServiceFormData` object
  const formattedService: ServiceFormData = {
    id: String(serviceData.id),
    serviceTitle: serviceData.title ?? '',
    serviceDescription: serviceData.description ?? '',
    price: serviceData.price ?? 0,
    priceType: serviceData.priceType ?? 'fix',
    serviceImage: serviceData.image || '/placeholder.jpeg',
    fileToUpload: null, // ✅ Ensure this is provided
    workingHours:
      serviceData.workingHours && typeof serviceData.workingHours === 'string'
        ? JSON.parse(serviceData.workingHours || '{}') // ✅ Prevent `null` parsing errors
        : serviceData.workingHours ?? {}, // ✅ Ensure it's always an object
    location:
      serviceData.location && typeof serviceData.location === 'string'
        ? JSON.parse(serviceData.location || '{}') // ✅ Prevent `null` parsing errors
        : serviceData.location ?? { street: '', number: '', city: '', postalCode: '' },
    formattedPrice: `${serviceData.price ?? 0} CHF`, // ✅ Ensure it's always a string
    calendly: serviceData.calendly ?? '', // ✅ Ensure it's a string
  };

  // Validate userId before fetching the user
  const userId = 'user_2rFfqj3vhZz9fbTw5OFuYwVhLHv';

  if (!userId) {
    throw new Error('User not found'); // ✅ Ensure we don’t fetch a null user
  }

  // Fetch user details from Clerk
  let userJSON;
  try {
    const user = await clerkClient.users.getUser(userId);
    userJSON = JSON.parse(JSON.stringify(user));
  } catch (error) {
    throw new Error(`Failed to fetch user ${error}`); // ✅ Handle Clerk API errors properly
  }

  return <SingleListing service={formattedService} user={userJSON} />;
}
