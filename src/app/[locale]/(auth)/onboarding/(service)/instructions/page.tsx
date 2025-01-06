'use server';

import { currentUser } from '@clerk/nextjs/server';
import { getTranslations } from 'next-intl/server';

import Instructions from './Instructions';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'OnBoarding',
  });

  return {
    title: t('meta_title'),
  };
}

// This is a server-side page, rendering ProfilePage component

export default async function InstructionServer() {
  const user = await currentUser();

  return <Instructions userId={user!.id} lastName={user!.lastName} gender={user!.privateMetadata.gender} />;
}
