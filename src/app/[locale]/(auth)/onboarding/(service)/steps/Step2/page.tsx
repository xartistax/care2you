'use client';

import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Box, createListCollection, HStack, Input, SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText, Spinner, Stack, Textarea, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { HiXCircle } from 'react-icons/hi';

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/contexts/OnboardingContext';

const company_collection = createListCollection({
  items: [
    { value: '0', label: 'AG' },
    { value: '1', label: 'GmbH' },
    { value: '2', label: 'Einzelfirma' },
  ],
});

const service_collection = createListCollection({
  items: [
    { value: '0', label: 'Kategorie 1' },
    { value: '1', label: 'Kategorie 2' },
    { value: '2', label: 'Kategorie 3' },
  ],
});

const Step2Service = () => {
  // const t = useTranslations();

  const { formState, setFormState, setAlertMessage, setShowAlert, showAlert, alertMessage, prevStep, nextStep } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    if (!formState.data.privateMetadata.companyTitle || !formState.data.privateMetadata.companyCategory || !formState.data.privateMetadata.companyDescription || !formState.data.privateMetadata.serviceCategory) {
      setShowAlert(true);
      setAlertMessage('Bitte alles ausfüllen');
      return;
    }

    try {
      setShowAlert(false);
      setIsLoading(false);
      nextStep();
    } catch (error) {
      console.error('Fehler während der Anmeldung:', error);
      setAlertMessage('Bei der Anmeldung ist ein Fehler aufgetreten');
      setShowAlert(true);
      setIsLoading(false);
    }
  };

  const handleCompanySelectChange = (selected?: { value: string; label: string }) => {
    if (selected && (selected.value === '0' || selected.value === '1' || selected.value === '2')) {
      setFormState(prev => ({
        ...prev,
        data: {
          ...prev.data,
          privateMetadata: {
            ...prev.data.privateMetadata,
            companyCategory: selected.value as '0' | '1' | '2', // Gender wird korrekt gesetzt
          },
        },
      }));
    } else {
      console.error('Invalid selection:', selected);
    }
  };

  const handleServiceSelectChange = (selected?: { value: string; label: string }) => {
    if (selected && (selected.value === '0' || selected.value === '1' || selected.value === '2')) {
      setFormState(prev => ({
        ...prev,
        data: {
          ...prev.data,
          privateMetadata: {
            ...prev.data.privateMetadata,
            serviceCategory: selected.value as '0' | '1' | '2', // Gender wird korrekt gesetzt
          },
        },
      }));
    } else {
      console.error('Invalid selection:', selected);
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

      <Stack w="100%">
        {/* First Row */}
        <VStack w="100%" h={85}>

          <FormControl flex="0.2" w="100%" h={85}>
            <FormLabel fontSize="small" fontWeight="bold">
              Unternehmensform
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
                  console.error('Invalid selection:', selected);
                  return;
                }
                handleCompanySelectChange(selected);
              }}
            >
              <SelectTrigger>
                <SelectValueText placeholder="Bitte wählen..." />
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
              Firmenname
            </FormLabel>
            <Input
              type="text"
              name="companyTitle"
              defaultValue={formState.data.privateMetadata.companyTitle as string}
              onChange={handleInputChange}
            />
          </FormControl>
        </VStack>

        <VStack w="100%" h={85}>
          <FormControl flex="1" w="100%" h={85}>
            <FormLabel fontSize="small" fontWeight="bold">
              UID Steuernummer
            </FormLabel>
            <Input
              type="text"
              name="uidst"
              defaultValue={formState.data.privateMetadata.uidst as string}
              onChange={handleInputChange}
            />
          </FormControl>
        </VStack>

        {/* Description Field */}
        <VStack w="100%" h={100}>
          <FormControl w="100%" h={100}>
            <FormLabel fontSize="small" fontWeight="bold">
              Tätigkeitsbeschreib
            </FormLabel>
            <Textarea
              placeholder="..."
              defaultValue={formState.data.privateMetadata.companyDescription as string}
              name="companyDescription"
              w="100%"
              onChange={handleInputChange}
            />
          </FormControl>
        </VStack>
        {/* Category Field */}
        <VStack w="100%" h={85}>
          <FormControl w="100%" h={85}>
            <FormLabel fontSize="small" fontWeight="bold">
              Servicekategorie
            </FormLabel>
            <SelectRoot
              collection={service_collection}
              value={
                String(formState.data.privateMetadata.serviceCategory)
                  ? [String(formState.data.privateMetadata.serviceCategory)]
                  : []
              }
              onValueChange={(details) => {
                const selected = details.items[0];
                if (!selected) {
                  console.error('Invalid selection:', selected);
                  return;
                }
                handleServiceSelectChange(selected);
              }}
            >
              <SelectTrigger>
                <SelectValueText placeholder="Kategorie" />
              </SelectTrigger>
              <SelectContent>
                {service_collection.items.map(item => (
                  <SelectItem key={item.value} item={item}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>
          </FormControl>
        </VStack>
        {/* Submit Button */}

        <HStack alignItems="start" justifyContent="flex-end" marginBottom={8}>
          <Button colorScheme="gray" onClick={prevStep} variant="outline">
            Zurück
          </Button>
          <Button colorScheme="blue" onClick={handleNext}>
            Anmeldung bestätigen
          </Button>
        </HStack>

      </Stack>

    </Box>

  );
};

export default Step2Service;
