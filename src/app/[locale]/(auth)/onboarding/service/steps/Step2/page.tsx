'use client';

import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Box, createListCollection, HStack, Input, SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText, Spinner, Stack, Textarea, VStack } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { HiXCircle } from 'react-icons/hi';

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { logMessage, logWarning } from '@/utils/sentryLogger';

const Step2Service = () => {
  const t = useTranslations('OnBoarding');

  const { formState, setFormState, setAlertMessage, setShowAlert, showAlert, alertMessage, prevStep, nextStep } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);

  const company_collection = createListCollection({
    items: [
      { value: '0', label: t('Service.Unternehmensform.AG') },
      { value: '1', label: t('Service.Unternehmensform.GMBH') },
      { value: '2', label: t('Service.Unternehmensform.Einzelfirma') },
      { value: '3', label: t('Service.Unternehmensform.Verein') },
      { value: '4', label: t('Service.Unternehmensform.Andere') },
    ],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Update top-level fields like firmenname usw.`
    setFormState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        privateMetadata: {
          ...prev.data.privateMetadata,
          [name]: value, // Dynamically set the field
        },
      },
    }));
  };

  const handleNext = async () => {
    if (!formState.data.privateMetadata.companyTitle || !formState.data.privateMetadata.companyCategory || !formState.data.privateMetadata.companyDescription) {
      logWarning('Step2Service: Missing required fields', { file: 'service/steps/Step2/page.tsx', formState });
      setShowAlert(true);
      setAlertMessage('Bitte alles ausfüllen');
      return;
    }

    setIsLoading(true);

    try {
      setShowAlert(false);
      setIsLoading(false);
      logMessage('Step2Service: Proceeding to next step', { file: 'service/steps/Step2/page.tsx', formState });
      nextStep();
    } catch (error) {
      logWarning('Step2Service: Error during registration', { file: 'service/steps/Step2/page.tsx', error });
      setAlertMessage('Bei der Anmeldung ist ein Fehler aufgetreten');
      setShowAlert(true);
      setIsLoading(false);
    }
  };

  const handleCompanySelectChange = (selected?: { value: string; label: string }) => {
    if (selected && (selected.value === '0' || selected.value === '1' || selected.value === '2' || selected.value === '3')) {
      setFormState(prev => ({
        ...prev,
        data: {
          ...prev.data,
          privateMetadata: {
            ...prev.data.privateMetadata,
            companyCategory: selected.value as '0' | '1' | '2' | '3',
          },
        },
      }));
    } else {
      logWarning('Step2Service: Invalid company selection', { file: 'service/steps/Step2/page.tsx', selected });
    }
  };

  if (isLoading) {
    return (
      <HStack justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </HStack>
    );
  }

  return (

    <Box
      p={{ base: 4, md: 8 }}
      bg="white"
      borderRadius="lg"
      maxW={{ base: '100%', md: '800px' }}
      w="100%"
      mx="auto"
    >
      {showAlert && (
        <HStack alignItems="center" marginBottom={{ base: 2, md: 4 }}>
          <Alert status="error" icon={<HiXCircle />}>
            {alertMessage}
          </Alert>
        </HStack>
      )}

      <Stack w="100%">
        {/* First Row */}
        <VStack w="100%" h={85}>

          <FormControl flex="0.2" w="100%" h={85}>
            <FormLabel fontSize="small" fontWeight="bold">
              {
                t('Service.Unternehmensform.Feld')
              }
              {' '}
              *
            </FormLabel>
            <SelectRoot
              collection={company_collection}
              value={
                String(formState.data.privateMetadata.companyCategory)
                  ? [String(formState.data.privateMetadata.companyCategory)]
                  : []
              }
              onValueChange={(details) => {
                const selected = details.items[0];
                if (!selected) {
                  logWarning('Step2Service: Invalid company selection', { file: 'service/steps/Step2/page.tsx', selected });
                  return;
                }
                handleCompanySelectChange(selected);
              }}
            >
              <SelectTrigger>
                <SelectValueText placeholder={
                  t('Service.Unternehmensform.Platzhalter')
                }
                />
              </SelectTrigger>
              <SelectContent>
                {company_collection.items.map(item => (
                  <SelectItem key={item.value} item={item}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>
          </FormControl>

        </VStack>

        <VStack w="100%" h={85}>
          <FormControl flex="1" w="100%" h={85}>
            <FormLabel fontSize="small" fontWeight="bold">
              { t('Service.Firmenname.Feld') }
              {' '}
              *
            </FormLabel>
            <Input
              type="text"
              name="companyTitle"
              defaultValue={formState.data.privateMetadata.companyTitle as string}
              onChange={handleInputChange}
              placeholder={t('Service.Firmenname.Platzhalter')}
              w={{ base: '100%', md: 'auto' }}
            />
          </FormControl>
        </VStack>
        <VStack w="100%" h={85}>
          <FormControl flex="1" w="100%" h={85}>
            <FormLabel fontSize="small" fontWeight="bold">
              {t('Service.UID Steuernummer.Feld')}
            </FormLabel>
            <Input
              type="text"
              name="uidst"
              defaultValue={formState.data.privateMetadata.uidst as string}
              onChange={handleInputChange}
              placeholder={t('Service.UID Steuernummer.Platzhalter')}
              w={{ base: '100%', md: 'auto' }}
            />
          </FormControl>
        </VStack>

        {/* Description Field */}
        <VStack w="100%" h={100}>
          <FormControl w="100%" h={100}>
            <FormLabel fontSize="small" fontWeight="bold">
              { t('Service.Tätigkeitsbeschreib.Feld') }
              {' '}
              *
            </FormLabel>
            <Textarea
              placeholder={t('Service.Tätigkeitsbeschreib.Platzhalter')}
              defaultValue={formState.data.privateMetadata.companyDescription as string}
              name="companyDescription"
              w="100%"
              onChange={handleInputChange}
            />
          </FormControl>
        </VStack>

        {/* Submit Button */}
        <HStack alignItems="start" justifyContent="flex-end" marginBottom={{ base: 4, md: 8 }} flexDirection={{ base: 'column', md: 'row' }}>
          <Button colorScheme="gray" onClick={prevStep} variant="outline" w={{ base: '100%', md: 'auto' }}>
            {t('Zurück')}
          </Button>
          <Button colorScheme="blue" onClick={handleNext} w={{ base: '100%', md: 'auto' }}>
            {t('Bestätigen')}
          </Button>
        </HStack>
      </Stack>
    </Box>

  );
};

export default Step2Service;
