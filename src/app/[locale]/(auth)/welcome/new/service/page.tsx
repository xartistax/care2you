import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { constructUser } from '@/utils/Helpers';

import AddServiceForm from './AddServiceForm';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Welcome',
  });

  return {
    title: t('search_new_service'),
  };
}

export default async function NewServiceServer() {
  const user = await currentUser();
  if (!user) {
    redirect('/good-bye');
  }

  const constructedUser = constructUser(user);

  return <AddServiceForm user={constructedUser} />;

  // return 'addServiceForm';
}
