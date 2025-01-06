import { currentUser } from '@clerk/nextjs/server';
import { getTranslations } from 'next-intl/server';

import type { OnBoardingClientUser } from '@/utils/Types';

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
    default:
      console.error('No user role defined!');
      return <div>Error: No valid role found for the user.</div>;
  }
}
