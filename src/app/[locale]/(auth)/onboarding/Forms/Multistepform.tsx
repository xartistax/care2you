'use client';

import { VStack } from '@chakra-ui/react';
import React from 'react';

import { useOnboarding } from '@/contexts/OnboardingContext';

import Step2Care from '../care/steps/Step2/page';
import Step1 from '../client/steps/Step1/page';
import Step2Client from '../client/steps/Step2/page';
import Step2Service from '../service/steps/Step2/page';
import Step3Service from '../service/steps/Step3/page';

export const MultiStepForm = () => {
  const { formState } = useOnboarding();

  const renderStep = () => {
    switch (formState.step) {
      case 1 :
        return <Step1 />;
      case 2:
        if (formState.data.privateMetadata.role === 'service') {
          return <Step2Service />;
        } else if (formState.data.privateMetadata.role === 'client') {
          return <Step2Client />;
        } else if (formState.data.privateMetadata.role === 'care') {
          return <Step2Care />;
        } else {
          return;
        }
      case 3:
        return <Step3Service />;
      default:
        return <Step1 />;
    }
  };

  return (

    <VStack align="stretch" w="100%">{renderStep()}</VStack>

  );
};

export default MultiStepForm;
