import { clerkClient } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import type { z } from 'zod';

import { db } from '@/libs/DB';
import { servicesSchema } from '@/models/Schema';
import { constructUser } from '@/utils/Helpers';
import type { serviceSchema } from '@/validations/serviceValidation';

import SingleListing from './SingleListing';

export default async function NewServiceServer({ params }: { params: { id: string } }) {
  const serviceId = params.id;

  // Fetch services from DB
  const services = await db
    .select()
    .from(servicesSchema)
    .where(eq(servicesSchema.internalId, serviceId))
    .limit(1);

  const serviceData = services[0];

  if (!serviceData) {
    throw new Error('Service not found');
  }

  // Fetch user details from Clerk
  try {
    const user = await clerkClient.users.getUser(serviceData.userId);
    const constructedUsers = constructUser(user);

    const serviceProvider_email = user.emailAddresses[0]?.emailAddress ?? 'No Email';
    const serviceProvider_lastName = user.lastName ?? 'Unknown';
    const serviceProvider_firstName = user.firstName ?? 'Unknown';

    // Construct full `ServiceFormData` object and include service provider details
    type ServiceFormData = z.infer<typeof serviceSchema>;

    const formattedService: ServiceFormData & {
      serviceProvider_email: string;
      serviceProvider_lastName: string;
      serviceProvider_firstName: string;
    } = {
      id: Number(serviceData.id),
      userId: serviceData.userId,
      category: serviceData.category,
      title: serviceData.title ?? '',
      description: serviceData.description ?? '',
      price: serviceData.price ?? 0,
      priceType: serviceData.priceType ?? 'fix',
      image: serviceData.image || '/placeholder.jpeg',
      fileToUpload: null,
      workingHours:
        serviceData.workingHours && typeof serviceData.workingHours === 'string'
          ? JSON.parse(serviceData.workingHours || '{}')
          : serviceData.workingHours ?? {},
      location:
        serviceData.location && typeof serviceData.location === 'string'
          ? JSON.parse(serviceData.location || '{}')
          : serviceData.location ?? { street: '', number: '', city: '', postalCode: '' },
      formattedPrice: `${serviceData.price ?? 0} CHF`,
      calendly: serviceData.calendly ?? '',
      internalId: serviceData.internalId,

      // ✅ Add service provider details
      serviceProvider_email,
      serviceProvider_lastName,
      serviceProvider_firstName,
    };

    return <SingleListing service={formattedService} user={constructedUsers} />;
  } catch (error) {
    throw new Error(`Failed to fetch user: ${error}`);
  }
}
