import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import Entrance from '@/components/Entrance';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Index',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

const Index = () => {
  const t = useTranslations('Entry');

  return (
    <Entrance
      title={t('Titel')}
      text={t('Text')}
      linkTo="/sign-up"
      linkTitle={t('Button')}
    />
  );
};

export default Index;
