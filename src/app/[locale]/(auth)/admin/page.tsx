import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { constructUser } from '@/utils/Helpers';

import AdminPanel from './Admin';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Dashboard',
  });

  return {
    title: t('meta_title'),
  };
}

// This is a server-side page, rendering ProfilePage component
export default async function DashboardServer() {
  const user = await currentUser();

  // Correctly filter the users
  const users = await clerkClient.users.getUserList({
    limit: 100, // Set the limit
  });

  const transformedUsers = users.data.map(user => constructUser(user));
  const careUsers = transformedUsers.filter(user => user.privateMetadata.role === 'care');
  const clientUsers = transformedUsers.filter(user => user.privateMetadata.role === 'care');
  const serviceUsers = transformedUsers.filter(user => user.privateMetadata.role === 'care');

  if (!user) {
    redirect('/sign-in');
  }

  return <AdminPanel allUsers={transformedUsers} careUsers={careUsers} clientUsers={clientUsers} serviceUsers={serviceUsers} />;
}
