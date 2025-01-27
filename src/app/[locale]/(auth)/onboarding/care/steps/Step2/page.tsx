'use client';

import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Wrap } from '@chakra-ui/layout';
import { Box, CheckboxGroup, createListCollection, Fieldset, HStack, Input, Spinner, Stack, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { HiXCircle } from 'react-icons/hi';

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUploadDropzone, FileUploadList, FileUploadRoot } from '@/components/ui/file-upload';
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from '@/components/ui/select';
import WorkingHoursForm from '@/components/WorkingHoursForm';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { constructOnboardingUser, updateUserDataCare } from '@/utils/Helpers';

const expertise_collection = createListCollection({
  items: [
    { value: '0', label: 'weniger als 1-Jahr' },
    { value: '1', label: 'zwischen 1 und 3 Jahre' },
    { value: '2', label: 'über 5 Jahre' },
  ],
});

const language_collection = createListCollection({
  items: [
    { value: 'de', label: 'Deutsch' },
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
    { value: 'es', label: 'Español' },
    { value: 'it', label: 'Italiano' },
    { value: 'pt', label: 'Português' },
    { value: 'other', label: 'Other' }, // You can allow an "Other" option for languages not listed
  ],
});

const skill_collection = createListCollection({
  items: [
    { value: 'Betreuung älterer Menschen', label: 'Betreuung älterer Menschen' },
    { value: 'Unterstützung bei Behinderungen', label: 'Unterstützung bei Behinderungen' },
    { value: 'Medizinische Hilfe', label: 'Medizinische Hilfe' },
    { value: 'Haushalt', label: 'Haushalt' },
  ],
});

const Step2Care = () => {
  // const t = useTranslations();

  const { formState, setFormState, setAlertMessage, setShowAlert, showAlert, alertMessage, prevStep, nextStep, locale } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);
  // const [files, setFiles] = useState([]);

  const handleToggle = (day: keyof typeof formState.data.privateMetadata.workingHours) => {
    setFormState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        privateMetadata: {
          ...prev.data.privateMetadata,
          workingHours: {
            ...prev.data.privateMetadata.workingHours,
            [day]: {
              ...prev.data.privateMetadata.workingHours[day],
              enabled: !prev.data.privateMetadata.workingHours[day].enabled,
            },
          },
        },
      },
    }));
  };

  // const handleFileDrop = (newFiles) => {
  //   const filteredFiles = newFiles.filter(
  //     file => file.size <= 5 * 1024 * 1024 && file.type === 'application/pdf',
  //   );

  //   const currentCertificates = formState.data.privateMetadata.certificates || [];

  //   if (filteredFiles.length + currentCertificates.length > 10) {
  //     setAlertMessage('You can only upload up to 10 files.');
  //     setShowAlert(true);
  //     return;
  //   }

  //   setFormState((prev) => {
  //     const updatedState = {
  //       ...prev,
  //       data: {
  //         ...prev.data,
  //         privateMetadata: {
  //           ...prev.data.privateMetadata,
  //           certificates: [...currentCertificates, ...filteredFiles],
  //         },
  //       },
  //     };

  //     return updatedState;
  //   });
  // };

  const handleTimeChange = (
    day: keyof typeof formState.data.privateMetadata.workingHours,
    value: [string, string],
  ) => {
    setFormState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        privateMetadata: {
          ...prev.data.privateMetadata,
          workingHours: {
            ...prev.data.privateMetadata.workingHours,
            [day]: {
              ...prev.data.privateMetadata.workingHours[day],
              hours: value,
            },
          },
        },
      },
    }));
  };

  const handleNext = async () => {
    setIsLoading(true);
    if (
      !formState.data.privateMetadata.expertise
      || !formState.data.privateMetadata.skill
      || !formState.data.privateMetadata.languages
      || !formState.data.privateMetadata.workingHours
      || !formState.data.privateMetadata.certificates) {
      setShowAlert(true);
      setAlertMessage('Bitte alles ausfüllen');
      return;
    }

    const user = constructOnboardingUser(formState);

    try {
      const updateSuccess = await updateUserDataCare(locale, user);

      if (!updateSuccess) {
        throw new Error('Fehler beim Aktualisieren der Benutzerdaten');
      }

      setAlertMessage('Fehler beim Aktualisieren der Benutzerdaten');
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

  const handleSkillSelectChange = (selectedItems: string[]) => {
    setFormState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        privateMetadata: {
          ...prev.data.privateMetadata,
          skill: selectedItems, // Update `skill` with the selected items
        },
      },
    }));
  };

  const handleExpertiseSelectChange = (selected?: { value: string; label: string }) => {
    if (selected) {
      setFormState(prev => ({
        ...prev,
        data: {
          ...prev.data,
          privateMetadata: {
            ...prev.data.privateMetadata,
            expertise: selected.value as string, // Gender wird korrekt gesetzt
          },
        },
      }));
    } else {
      console.error('Invalid selection:', selected);
    }
  };

  // const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = e.target.files;
  //   if (files) {
  //     // You can implement file handling logic (e.g., upload to server or save locally)
  //     const uploadedFiles = Array.from(files);
  //     setFormState(prev => ({
  //       ...prev,
  //       data: {
  //         ...prev.data,
  //         privateMetadata: {
  //           ...prev.data.privateMetadata,
  //           certifications: uploadedFiles, // Store uploaded files
  //         },
  //       },
  //     }));
  //   }
  // };

  const handleLanguagesChange = (selectedItems: string[]) => {
    setFormState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        privateMetadata: {
          ...prev.data.privateMetadata,
          languages: selectedItems, // Update `languages` with the selected items
        },
      },
    }));
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

        <Stack h={85} align="stretch" w="100%">
          <FormControl flex="1">
            <FormLabel fontSize="small" fontWeight="bold">
              Geburtsdatum
            </FormLabel>

            <Input
              type="text"
              width="100%"
              name="dob"
              value=""
              onChange={() => {
                return 'ok';
              }}
              placeholder="01.01.1986"
            />
          </FormControl>

        </Stack>

        <Stack h={85} align="stretch" w="100%">
          <FormControl flex="1">
            <FormLabel fontSize="small" fontWeight="bold">
              Geburtsdatum
            </FormLabel>

            <Input
              type="text"
              width="100%"
              name="nationality"
              value=""
              onChange={() => {
                return 'ok';
              }}
              placeholder="CH"
            />
          </FormControl>

        </Stack>

        <VStack w="100%" h={85}>

          <FormControl flex="0.2" w="100%" h={85}>
            <FormLabel fontSize="small" fontWeight="bold">
              Erfahrung als Caregiver
            </FormLabel>
            <SelectRoot
              collection={expertise_collection}
              value={
                String(formState.data.privateMetadata.expertise)
                  ? [String(formState.data.privateMetadata.expertise)]
                  : []
              }
              onValueChange={(details) => {
                const selected = details.items[0];
                if (!selected) {
                  console.error('Invalid selection:', selected);
                  return;
                }
                handleExpertiseSelectChange(selected);
              }}
            >
              <SelectTrigger>
                <SelectValueText placeholder="Bitte wählen..." />
              </SelectTrigger>
              <SelectContent>
                {expertise_collection.items.map(item => (
                  <SelectItem key={item.value} item={item}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>
          </FormControl>

        </VStack>

        <VStack w="100%" h={85}>
          <FormControl flex="0.2" w="100%" h={85}>
            <FormLabel fontSize="small" fontWeight="bold">
              Tätigkeitsbereich - Skill
            </FormLabel>
            <SelectRoot
              multiple
              collection={skill_collection}
              value={formState.data.privateMetadata.skill as string[]} // Use the array of selected skills directly
              onValueChange={(details) => {
                if (details?.items && Array.isArray(details.items)) {
                  const selected = details.items
                    .filter(item => item && 'value' in item) // Ensure `item` and `value` exist
                    .map(item => item.value);
                  handleSkillSelectChange(selected);
                } else {
                  handleSkillSelectChange([]); // Fallback for invalid `details`
                }
              }}
            >
              <SelectTrigger>
                <SelectValueText placeholder="Bitte wählen...">
                  {items =>
                    (items?.filter(item => item?.label) || [])
                      .map(item => item.label)
                      .join(', ')}
                </SelectValueText>
              </SelectTrigger>

              <SelectContent>
                {skill_collection.items.map(item => (
                  <SelectItem key={item.value} item={item}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>
          </FormControl>
        </VStack>

        <VStack w="100%" mb={8}>
          <FormControl flex="0.2" w="100%">
            <FormLabel fontSize="small" fontWeight="bold">
              Gesprochene Sprachen
            </FormLabel>

            <Fieldset.Root>
              <CheckboxGroup
                value={formState.data.privateMetadata.languages as string[] || []} // Ensure value is an array of strings
                onValueChange={(selectedItems: string[]) => handleLanguagesChange(selectedItems)} // Handle the selected items directly
              >
                <Fieldset.Content>
                  <Wrap mt={4}>
                    {language_collection.items.map(item => (
                      <Checkbox key={item.value} value={item.value}>
                        {item.label}
                      </Checkbox>
                    ))}
                  </Wrap>
                </Fieldset.Content>
              </CheckboxGroup>

            </Fieldset.Root>

          </FormControl>
        </VStack>

        <VStack w="100%" h="auto" mb={8}>

          <WorkingHoursForm
            workingHours={formState.data.privateMetadata.workingHours}
            onToggle={handleToggle}
            onTimeChange={handleTimeChange}
            label="Set Your Working Hours"
          />

        </VStack>

        <VStack w="100%" mb={8}>
          <FormControl flex="0.2" w="100%">
            <FormLabel fontSize="small" fontWeight="bold">
              Zertifikate und andere Dateien
              {' '}
            </FormLabel>

            <FileUploadRoot maxW="xl" alignItems="stretch" maxFiles={10}>
              <FileUploadDropzone
                label="Datei hier rein ziehen"
                description="PDF Dateien bis zu 5MB"
              />
              <FileUploadList />
            </FileUploadRoot>

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

export default Step2Care;
