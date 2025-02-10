import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { constructUser } from '@/utils/Helpers';

import UserProfile from './UserProfile';

// Metadata generation
export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Index',
  });

  return {
    title: t('meta_title'),
  };
}

// Server-side page
export default async function DashboardServer() {
  const user = await currentUser();

  if (!user) {
    redirect('/'); // Redirect to login if user is not found
  }

  const constructedUser = constructUser(user);

  return <UserProfile user={constructedUser} />;
}
