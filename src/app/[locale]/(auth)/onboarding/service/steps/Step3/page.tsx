'use client';
import { Box, Heading, HStack, Link, Spinner, Stack, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation'; // Importiere useRouter
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { HiXCircle } from 'react-icons/hi';

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useOnboarding } from '@/hooks/useOnboarding';
import { constructOnboardingUser, getSalutation, updateUserDataCare, updateUserDataService } from '@/utils/Helpers';

const Step3Service = () => {
  const [isComplete, setIsComplete] = useState(false);
  const t = useTranslations();
  const router = useRouter(); // Initialisiere den Router
  const { formState, prevStep, setFormState, showAlert, alertMessage, setAlertMessage, setShowAlert, locale } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);

  const handleFinish = async () => {
    setIsLoading(true);

    if (!formState.data.privateMetadata.compilance) {
      setAlertMessage('Bitte bestätigen Sie die Nutzervereinbarung');
      setShowAlert(true);
      setIsLoading(false);
      return;
    }

    formState.data.privateMetadata.status = 'active';

    const user = constructOnboardingUser(formState);

    try {
      // Warte auf die Fertigstellung der Updates

      if (user.privateMetadata.role === 'service') {
        const updateSuccess = await updateUserDataService(locale, user);

        if (!updateSuccess) {
          throw new Error('Fehler beim Aktualisieren der Benutzerdaten');
        }
      } else if (user.privateMetadata.role === 'care') {
        const updateSuccess = await updateUserDataCare(locale, user);
        if (!updateSuccess) {
          throw new Error('Fehler beim Aktualisieren der Benutzerdaten');
        }
      }

      setAlertMessage('');
      setShowAlert(false);
      setIsComplete(true);

      router.push(`/${locale}/welcome`);

      // console.log(user);
    } catch (error) {
      console.error('Fehler während der Anmeldung:', error);
      setAlertMessage('Bei der Anmeldung ist ein Fehler aufgetreten');
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = () => {
    setFormState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        privateMetadata: {
          ...prev.data.privateMetadata,
          compilance: !prev.data.privateMetadata.compilance,
        },
      },
    }));
  };

  if (isLoading || isComplete) {
    return (
      <HStack justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </HStack>
    );
  } else {
    return (

      <Box p={8} bg="white" borderRadius="lg" maxWidth="800px" width="100%" margin="0 auto">

        {showAlert && (
          <HStack alignItems="center" marginBottom="4">
            <Alert status="error" icon={<HiXCircle />}>
              {alertMessage}
            </Alert>
          </HStack>
        )}

        <VStack alignItems="left" marginBottom={8}>
          <Heading as="h1" size="2xl">
            {t('OnBoarding.client_instructions_title')}
          </Heading>
        </VStack>
        <VStack alignItems="left" marginBottom={8} fontSize="sm">
          <Text marginBottom={4}>
            <Box as="span" display="block" fontWeight="bold">
              {getSalutation(formState.data.privateMetadata.gender as '0' | '1')}
              {' '}
              {formState.data.lastName}
            </Box>
            Care2you bietet Ausbildungsangebote im Gesundheitsbereich und unterstützt häusliche Betreuung mit Beratungs-, Koordinations- und Servicedienstleistungen.
          </Text>
        </VStack>
        <VStack alignItems="left" marginBottom={8}>
          <HStack alignItems="center">
            <Stack align="flex-start" flex="1" key={0}>
              <Checkbox checked={formState.data.privateMetadata.compilance as true | false} onChange={handleCheckboxChange}>
                {t.rich('OnBoarding.checkbox_text', {
                  link: chunks => (
                    <Link href="#" target="_blank" color="blue.500">
                      {chunks}
                    </Link>
                  ),
                })}
              </Checkbox>
            </Stack>
          </HStack>
        </VStack>
        <HStack alignItems="start" justifyContent="flex-end" marginBottom={8}>
          <Button colorScheme="gray" onClick={prevStep} variant="outline">
            Zurück
          </Button>
          <Button colorScheme="blue" onClick={handleFinish}>
            Anmeldung bestätigen
          </Button>
        </HStack>
      </Box>

    );
  }
};

export default Step3Service;
