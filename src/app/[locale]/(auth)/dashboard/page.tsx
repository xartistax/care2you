import { currentUser } from '@clerk/nextjs/server';
import { getTranslations } from 'next-intl/server';

import Dashboard from './Dashboard';

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
  if (!user) {
    throw new Error('User not found');
  }

  return <Dashboard />;
}
