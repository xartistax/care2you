'use client';

import { Box, HStack } from '@chakra-ui/react';
import * as EmailValidator from 'email-validator';
import { HiXCircle } from 'react-icons/hi';

import { Alert } from '@/components/ui/alert';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { AppConfig } from '@/utils/AppConfig';

import { OnBoardingFormDefault } from '../../../Forms/Default';

const Step1 = () => {
  const { formState, setFormState, nextStep, showAlert, alertMessage, setShowAlert, setAlertMessage } = useOnboarding();

  const handleNext = () => {
    if (
      !formState.data.email
      || !formState.data.firstName
      || !formState.data.privateMetadata.gender
      || !formState.data.privateMetadata.phone
      || !formState.data.privateMetadata.role
      || !formState.data.privateMetadata.plz
      || !formState.data.privateMetadata.street
      || !formState.data.privateMetadata.location
      || !formState.data.privateMetadata.streetnumber

    ) {
      setShowAlert(true);
      setAlertMessage('Bitte alles ausfüllen');
      return;
    }

    if (!EmailValidator.validate(formState.data.email)) {
      setAlertMessage('Invalid email address.');
      setShowAlert(true);
      return;
    }

    // if (!phone(String(formState.data.privateMetadata.phone), { country: 'CH' }).isValid) {
    //   setAlertMessage('Invalid phone number.');
    //   setShowAlert(true);
    //   return;
    // }

    // const phoneNumber = phone(String(formState.data.privateMetadata.phone), { country: 'CH' });

    const phoneNumber = String(formState.data.privateMetadata.phone);

    formState.data.privateMetadata.phone = phoneNumber;
    formState.data.privateMetadata.status = 'active';

    setAlertMessage('');
    setShowAlert(false);
    nextStep(); // Go to the next step
  };

  const handleSelectChange = (selected?: { value: string; label: string }) => {
    if (selected && (selected.value === '0' || selected.value === '1')) {
      setFormState(prev => ({
        ...prev,
        data: {
          ...prev.data,
          privateMetadata: {
            ...prev.data.privateMetadata,
            gender: selected.value as '0' | '1', // Gender wird korrekt gesetzt
          },
        },
      }));
    } else {
      console.error('Invalid selection:', selected);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Validate phone field specifically
    if (name === 'phone') {
      if (/[a-z]/i.test(value)) {
        setAlertMessage('Telefonnummer darf keine Buchstaben enthalten.');
        setShowAlert(true);
        return;
      } else {
        setAlertMessage('');
        setShowAlert(false);
      }

      const numericValue = value.replace(/\D/g, '');

      setFormState(prev => ({
        ...prev,
        data: {
          ...prev.data,
          privateMetadata: {
            ...prev.data.privateMetadata,
            [name]: numericValue,
          },
        },
      }));
    } else if (
      ['street', 'streetnumber', 'plz', 'location'].includes(name) // Check if the field belongs to `privateMetadata`
    ) {
      setFormState(prev => ({
        ...prev,
        data: {
          ...prev.data,
          privateMetadata: {
            ...prev.data.privateMetadata,
            [name]: value,
          },
        },
      }));
    } else {
      // Update top-level fields
      setFormState(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRoleSelect = (role: string) => {
    setFormState((prev) => {
      const updatedState = {
        ...prev,
        data: {
          ...prev.data,
          privateMetadata: {
            ...prev.data.privateMetadata,
            role,
          },
        },
      };

      return updatedState;
    });
  };

  return (

    <Box
      p={8}
      bg="white"
      borderRadius="lg"
      maxWidth="800px"
      width="100%"
      margin="0 auto"
    >

      {showAlert && (
        <HStack alignItems="center" marginBottom="4">
          <Alert status="error" icon={<HiXCircle />}>
            {alertMessage}
          </Alert>
        </HStack>
      )}

      <OnBoardingFormDefault
        formState={formState}
        handleNext={handleNext}
        handleSelectChange={handleSelectChange}
        handleInputChange={handleInputChange}
        handleRoleSelect={handleRoleSelect}
        roles={AppConfig.userRoles}
      />

    </Box>

  );
};

export default Step1;
