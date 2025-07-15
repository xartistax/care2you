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
import { logError, logMessage, logWarning } from '@/utils/sentryLogger';

const Step3Service = () => {
  const [isComplete, setIsComplete] = useState(false);
  const t = useTranslations();
  const router = useRouter(); // Initialisiere den Router
  const { formState, prevStep, setFormState, showAlert, alertMessage, setAlertMessage, setShowAlert, locale } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);

  const handleFinish = async () => {
    setIsLoading(true);

    if (!formState.data.privateMetadata.compilance) {
      logWarning('Step3Service: Compliance not confirmed', { file: 'service/steps/Step3/page.tsx', formState });
      setAlertMessage('Bitte bestätigen Sie die Nutzervereinbarung');
      setShowAlert(true);
      setIsLoading(false);
      return;
    }

    formState.data.privateMetadata.status = 'active';

    const user = constructOnboardingUser(formState);

    try {
      logMessage('Step3Service: Attempting to update user data', { file: 'service/steps/Step3/page.tsx', user });
      // Warte auf die Fertigstellung der Updates

      if (user.privateMetadata.role === 'service') {
        const updateSuccess = await updateUserDataService(locale, user);

        if (!updateSuccess) {
          logError('Step3Service: Error when updating the user data', { file: 'service/steps/Step3/page.tsx', user });
          throw new Error('Fehler beim Aktualisieren der Benutzerdaten');
        }
      } else if (user.privateMetadata.role === 'care') {
        const updateSuccess = await updateUserDataCare(locale, user);
        if (!updateSuccess) {
          logError('Step3Service: Error when updating the user data', { file: 'service/steps/Step3/page.tsx', user });
          throw new Error('Fehler beim Aktualisieren der Benutzerdaten');
        }
      }

      setAlertMessage('');
      setShowAlert(false);
      setIsComplete(true);

      logMessage('Step3Service: User onboarding complete, navigating to welcome', { file: 'service/steps/Step3/page.tsx', locale });
      router.push(`/${locale}/welcome`);

      // console.log(user);
    } catch (error) {
      logError(error, { file: 'service/steps/Step3/page.tsx', location: 'handleFinish' });
      setAlertMessage('Bei der Anmeldung ist ein Fehler aufgetreten');
      setShowAlert(true);
    } finally {
      setIsLoading(false);

      const response = await fetch('/api/send-email-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'demian@bexolutions.ch',
          subject: `Neue Anmledung bei care2you`,
          user_name: user.firstName,
          user_vorname: user.lastName,
          user_email: user.email,
          user_phone: user.phone,
          user_role: user.privateMetadata.role,
        }),
      });

      if (!response.ok) {
        logWarning('Step3Service:  Error when sending the message', { file: 'service/steps/Step3/page.tsx', responseStatus: response.status });
      }
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
    const salutation = getSalutation(formState.data.privateMetadata.gender as '0' | '1');
    const lastName = formState.data.lastName;
    return (

      <Box p={{ base: 4, md: 8 }} bg="white" borderRadius="lg" maxW={{ base: '100%', md: '800px' }} w="100%" mx="auto">

        {showAlert && (
          <HStack alignItems="center" marginBottom={{ base: 2, md: 4 }}>
            <Alert status="error" icon={<HiXCircle />}>
              {alertMessage}
            </Alert>
          </HStack>
        )}

        <VStack alignItems="left" marginBottom={{ base: 4, md: 8 }}>
          <Heading as="h1" fontSize={{ base: 'lg', md: '2xl' }}>
            {t('OnBoarding.Care und Service Compilance.Titel')}

          </Heading>
        </VStack>
        <VStack alignItems="left" marginBottom={{ base: 4, md: 8 }} fontSize={{ base: 'sm', md: 'md' }}>
          <Text marginBottom={4}>
            <Box as="span" display="block" fontWeight="bold">

              {t('OnBoarding.Care und Service Compilance.Untertitel', { salutation, lastName })}

            </Box>
            <br />
            {
              formState.data.privateMetadata.role !== 'care'
                ? <> Bei Nutzung der Plattform hat der Serviceanbieter die Möglichkeit, seine Dienstleistung anzubieten und von interessierten Kunden gefunden zu werden. Kunden können Sie direkt über unsere Plattform per Telefon oder E-Mail kontaktieren. Um einen reibungslosen Ablauf zu gewährleisten, bitten wir Sie, sich innerhalb von 24 Stunden beim Kunden zu melden, um einen Termin zu vereinbaren. Ein Credit kostet CHF 5.00. Zur Begrüssung schenken wir Ihnen 10 Credits, damit Sie unsere Plattform unverbindlich ausprobieren können. Jedes Inserat entspricht einem Credit. </>
                : t('OnBoarding.Care und Service Compilance.Text')

            }

            <br />
            <br />
            Wir danken Ihnen herzlich für Ihre Unterstützung und freuen uns, Sie auf unserer Plattform willkommen zu heissen!

          </Text>
        </VStack>
        <VStack alignItems="left" marginBottom={0}>
          <HStack alignItems="center">
            <Stack align="flex-start" flex="1" key={0}>
              <Checkbox checked={formState.data.privateMetadata.compilance as true | false} onChange={handleCheckboxChange}>
                {t.rich('OnBoarding.Checkbox', {
                  link: chunks => (
                    <Link href="/nutzerbedingungen" target="_blank" color="blue.500">
                      {chunks}
                    </Link>
                  ),
                })}
              </Checkbox>
            </Stack>
          </HStack>
        </VStack>
        <HStack alignItems="start" justifyContent="flex-end" marginTop="8" marginBottom={{ base: 4, md: 8 }} flexDirection={{ base: 'column', md: 'row' }}>
          <Button colorScheme="gray" onClick={prevStep} variant="outline" w={{ base: '100%', md: 'auto' }}>
            Zurück
          </Button>
          <Button colorScheme="blue" onClick={handleFinish} w={{ base: '100%', md: 'auto' }}>
            Anmeldung bestätigen
          </Button>
        </HStack>
      </Box>

    );
  }
};

export default Step3Service;
