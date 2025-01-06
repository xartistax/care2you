// MultiStepForm.tsx

import { currentUser } from '@clerk/nextjs/server';
import { getTranslations } from 'next-intl/server';
import React from 'react';

import { OnboardingProvider } from '@/contexts/OnboardingContext';

import MultiStepForm from './Forms/Multistepform';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
  });

  const user = await currentUser();

  return {
    title: `${t('Index.meta_title')} - ${user?.firstName} ${user?.lastName}`,
  };
}

export default async function OnBoardingServer(props: { params: { locale: string } }) {
  const user = await currentUser();

  if (!user) {
    throw new Error('User is not authenticated');
  }

  const initialUserState = {
    step: 1,
    data: {
      id: user.id,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.emailAddresses[0]?.emailAddress || '',
      privateMetadata: {
        ...user.privateMetadata, // Vermeide harte Referenzen
        phone: user.privateMetadata?.phone || '',
        gender: user.privateMetadata?.gender || '',
        role: user.privateMetadata?.role || '', // Falls `role` undefined ist, setze ''
        compilance: user.privateMetadata?.compilance || false,
        companyTitle: user.privateMetadata?.companyTitle || '',
        companyDescription: user.privateMetadata?.companyDescription || '',
        companyCategory: user.privateMetadata?.companyCategory || '',
        serviceCategory: user.privateMetadata?.serviceCategory || '',
        uidst: user.privateMetadata?.uidst || '',
        credits: user.privateMetadata.credits || undefined,
      },
    },
  };

  return (
    <OnboardingProvider initialState={initialUserState} locale={props.params.locale}>
      <MultiStepForm />
    </OnboardingProvider>
  );
}
