// pages/profile/[locale]/index.tsx (or wherever the path is)

import { getTranslations } from 'next-intl/server';

import RequestPage from './RequestPage';

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
export default async function RequestPageServer() {
  return <RequestPage />;
}
