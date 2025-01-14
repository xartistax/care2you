import { currentUser } from '@clerk/nextjs/server';
import { getTranslations } from 'next-intl/server';
import type { z } from 'zod';

import type { onboardingClientUserSchema } from '@/validations/onBoardingValidation';

import Welcome_Care from './care/Welcome';
import Welcome_Client from './client/Welcome';
import Welcome_Service from './service/Welcome';

export async function generateMetadata(props: { params: { locale: string } }) {
  const user = await currentUser();

  if (!user) {
    console.error('User not found while generating metadata!');
    return {
      title: 'Error: User Not Found',
    };
  }

  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Welcome',
  });

  const username = user.firstName || 'Guest';

  return {
    title: t('meta_title', { username }),
  };
}

export default async function WelcomeServer() {
  const user = await currentUser();

  if (!user) {
    console.error('User not found!');
    throw new Error('Fatal Error!');
  }

  // Safely extract and handle private metadata
  const privateMetadata = (user.privateMetadata || {}) as Partial<UserPrivateMetadata>;
  type OnBoardingClientUser = z.infer<typeof onboardingClientUserSchema>;

  const fullUser: OnBoardingClientUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.emailAddresses[0]!.emailAddress,
    imageUrl: user.imageUrl || '',
    privateMetadata: {
      phone: privateMetadata.phone!,
      gender: privateMetadata.gender!,
      role: privateMetadata.role!,
      compilance: privateMetadata.compilance!,
      companyTitle: privateMetadata.companyTitle || undefined,
      companyDescription: privateMetadata.companyDescription || undefined,
      companyCategory: privateMetadata.companyCategory || undefined,
      serviceCategory: privateMetadata.serviceCategory || undefined,
      uidst: privateMetadata.uidst || undefined,
      credits: privateMetadata.credits || undefined,
      workingHours: {
        Monday: { enabled: false, hours: ['09:00', '17:00'] },
        Tuesday: { enabled: false, hours: ['09:00', '17:00'] },
        Wednesday: { enabled: false, hours: ['09:00', '17:00'] },
        Thursday: { enabled: false, hours: ['09:00', '17:00'] },
        Friday: { enabled: false, hours: ['09:00', '17:00'] },
        Saturday: { enabled: false, hours: ['09:00', '17:00'] },
        Sunday: { enabled: false, hours: ['09:00', '17:00'] },
      },

      skill: [],
      languages: [],
      certificates: [],
    },
  };

  const role = fullUser.privateMetadata.role;

  // Handle rendering based on user role
  switch (role) {
    case 'service':
      return (
        <Welcome_Service user={fullUser} />
      );
    case 'client':
      return <Welcome_Client user={fullUser} />;
    case 'care':
      return <Welcome_Care user={fullUser} />;
    default:
      console.error('No user role defined!');
      return <div>Error: No valid role found for the user.</div>;
  }
}
