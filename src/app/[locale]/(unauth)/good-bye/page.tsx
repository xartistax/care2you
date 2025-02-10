'use client';

import { useTranslations } from 'next-intl';

import Entrance from '@/components/Entrance';

export default function GoodBye() {
  const t = useTranslations('GoodBye');
  return (
    <Entrance title={t('Titel')} text={t('Text')} linkTitle={t('Button')} linkTo="/sign-in" />
  );
}
