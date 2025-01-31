// MultiStepForm.tsx

import { currentUser } from '@clerk/nextjs/server';
import { getTranslations } from 'next-intl/server';
import React from 'react';

import { OnboardingProvider, type OnboardingState } from '@/contexts/OnboardingContext';
import { defaultWorkingHours } from '@/utils/Types';

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

  const initialUserState: OnboardingState = {
    step: 1,
    data: {
      id: user.id,
      phone: user.privateMetadata.phone as string || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.emailAddresses[0]?.emailAddress || '',
      privateMetadata: {
        phone: user.privateMetadata?.phone || '',
        gender: user.privateMetadata?.gender || '',
        role: user.privateMetadata?.role || '',
        compilance: user.privateMetadata?.compilance || false,
        companyTitle: user.privateMetadata?.companyTitle || '',
        companyDescription: user.privateMetadata?.companyDescription || '',
        companyCategory: user.privateMetadata?.companyCategory || '',
        serviceCategory: user.privateMetadata?.serviceCategory || '',
        uidst: user.privateMetadata?.uidst || '',
        credits: user.privateMetadata?.credits || 0,
        expertise: user.privateMetadata?.expertise || '',
        skill: Array.isArray(user.privateMetadata?.skill) ? user.privateMetadata.skill : [],
        languages: Array.isArray(user.privateMetadata?.languages) ? user.privateMetadata.languages : [],
        workingHours: (user.privateMetadata?.workingHours as typeof defaultWorkingHours) || defaultWorkingHours, // Explicitly cast
        certificates: Array.isArray(user.privateMetadata?.certificates) ? user.privateMetadata.certificates : [],
      },
    },
  };

  return (
    <OnboardingProvider initialState={initialUserState} locale={props.params.locale}>
      <MultiStepForm />
    </OnboardingProvider>
  );
}
