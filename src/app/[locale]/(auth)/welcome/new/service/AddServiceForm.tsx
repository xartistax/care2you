'use client';
import '@wojtekmaj/react-timerange-picker/dist/TimeRangePicker.css';

import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Divider } from '@chakra-ui/layout';
import { Box, Button, Flex, HStack, Image, Input, Link, SelectContent, SelectItem, SelectTrigger, SelectValueText, Spinner, Stack, Text, Textarea } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import type { z } from 'zod';

import ServiceSuccess from '@/components/ServiceSuccess';
import TopUpCredits from '@/components/TopUpCredits';
import { Alert } from '@/components/ui/alert';
import { SelectRoot } from '@/components/ui/select';
import { Tag } from '@/components/ui/tag';
import { Toaster, toaster } from '@/components/ui/toaster';
import WorkingHoursForm from '@/components/WorkingHoursForm';
import { categoryTypeRetriever, decreaseCreditByOne, saveNewService, uploadImageToBunny } from '@/utils/Helpers';
import { logError } from '@/utils/sentryLogger';
import { categoriesList } from '@/utils/Types';
import type { onboardingClientUserSchema } from '@/validations/onBoardingValidation';
import type { serviceSchema } from '@/validations/serviceValidation';

type ServiceFormData = z.infer<typeof serviceSchema>;
type OnBoardingClientUser = z.infer<typeof onboardingClientUserSchema>;

export default function AddServiceForm({ user }: { user: OnBoardingClientUser }) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [step, setStep] = useState(1);
  const credits = Number(user.privateMetadata.credits) || 0;

  const t = useTranslations('Service');

  // Initialize form data with translations
  const [formData, setFormData] = useState<ServiceFormData>({
    id: '',
    status: 'active',
    internalId: '',
    image: '/service_placeholder.jpg',
    fileToUpload: null as File | null,
    workingHours: {
      Montag: { enabled: false, hours: ['08:00', '16:00'] },
      Dienstag: { enabled: false, hours: ['08:00', '16:00'] },
      Mittwoch: { enabled: false, hours: ['08:00', '16:00'] },
      Donnerstag: { enabled: false, hours: ['08:00', '16:00'] },
      Freitag: { enabled: false, hours: ['08:00', '16:00'] },
      Samstag: { enabled: false, hours: ['08:00', '16:00'] },
      Sonntag: { enabled: false, hours: ['08:00', '16:00'] },
    },
    title: '',
    description: '',
    price: 0.00,
    priceType: 'hourly',
    formattedPrice: '',
    calendly: '',
    location: {
      street: '',
      number: '',
      city: '',
      postalCode: '',
    },
    userId: '',
    category: '',
  });

  // Preserve state on re-render
  // useEffect(() => {
  //   setFormData(prev => ({ ...prev }));
  // }, [step]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);

      setFormData(prev => ({
        ...prev,
        image: imageUrl, // Store preview
        fileToUpload: file, // Store actual file
      }));
    }
  };

  const handleToggle = (day: keyof ServiceFormData['workingHours']) => {
    setFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          enabled: !prev.workingHours[day]?.enabled, // Use optional chaining here
          hours: prev.workingHours[day]?.hours || ['08:00', '16:00'], // Ensure fallback if `hours` is undefined
        },
      },
    }));
  };

  // const handleTimeChange = (day: keyof ServiceFormData['workingHours'], value: [string, string]) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     workingHours: {
  //       ...prev.workingHours,
  //       [day]: {
  //         ...prev.workingHours[day],
  //         hours: value,
  //       },
  //     },
  //   }));
  // };

  const handleTimeChange = (
    day: keyof ServiceFormData['workingHours'], // Restrict `day` to keys of `workingHours`
    value: [string, string],
  ) => {
    setFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day], // Ensure we preserve other fields like `enabled`
          hours: value, // Update only the `hours` field
        },
      },
    }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      const hasActiveHours = Object.values(formData.workingHours).some(day => day.enabled);
      if (!hasActiveHours) {
        toaster.create({
          type: 'error',
          title: t('Errors.Verfügbarkeiten'),
        });
        return;
      } else if (formData.image === '/service_placeholder.jpg') {
        toaster.create({
          type: 'error',
          title: t('Errors.Kein Bild'),
        });
        return;
      } else if (!formData.calendly) {
        toaster.create({
          type: 'error',
          title: t('Errors.Webseite'),
        });
        return;
      }
    } else if (step === 2) {
      if (!formData.title || !formData.description || !formData.priceType) {
        toaster.create({
          type: 'error',
          title: t('Errors.Allgemein'),
        });
        return;
      } else if (Number.parseFloat(String(formData.price)) < 10.00) {
        toaster.create({
          type: 'error',
          title: t('Errors.Preis'),
        });
        return;
      }
    }

    setStep(prevStep => prevStep + 1);
  };

  const handlePreviousStep = () => setStep(prevStep => prevStep - 1);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Step 1: Upload the image to Bunny (assuming the function works as expected)
      const response = await uploadImageToBunny(formData.fileToUpload);
      // Step 2: Merge the updated `userId` into the formData
      if (response.success) {
        formData.image = response.url;
      }

      // Step 3: Use the updated data for further operations
      await saveNewService(formData, user.id);

      // Step 5: Other operations
      await decreaseCreditByOne(user.id);
    } catch (error) {
      logError('AddServiceForm: Failed to save service:', { reason: (error as Error)?.message });
    } finally {
      setSuccess(true);
      setIsLoading(false);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cursorPosition = e.target.selectionStart; // Save cursor position
    const value = e.target.value.replace(/[^0-9.,]/g, ''); // Remove invalid characters
    let parsedValue = Number.parseFloat(value.replace(',', '.')); // Convert to float

    if (Number.isNaN(parsedValue)) {
      parsedValue = 0;
    }

    setFormData(prev => ({
      ...prev,
      price: parsedValue, // Store numeric value
      formattedPrice: parsedValue.toFixed(2), // Keep formatted
    }));

    // Restore cursor position
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 0);
  };

  const handleCategorySelectChange = (selected?: { value: string; label: string }) => {
    if (selected) {
      setFormData(prev => ({
        ...prev,
        category: selected.value, // ✅ Store only the value, not the full object
      }));
    } else {
      logError('AddServiceForm: Invalid category selection');
    }
  };

  if (credits === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
        <TopUpCredits userId={user.id} />
      </Box>
    );
  }

  if (isLoading) {
    return (
      <HStack justifyContent="center" alignItems="center" height="70vh">
        <Spinner size="xl" />
      </HStack>
    );
  }

  if (success) {
    return (
      <HStack justifyContent="center" alignItems="center" height="70vh">
        <ServiceSuccess formData={formData} />
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

      <Stack spaceY={4} w="100%">
        {step === 1 && (
          <>
            {/* Step 1: Image Upload */}
            <FormControl>

              <Box
                position="relative"
                w={{ base: '100%', md: '70%' }}
                mx="auto"
                aspectRatio="16 / 9"
                borderRadius="md"
                overflow="hidden"
                border="2px dashed gray"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="gray.100"
                cursor="pointer"
                mb={8}
              >
                <Image
                  src={formData.image}
                  alt="Uploaded"
                  objectFit="cover"
                  width="100%"
                  height="100%"
                />

                <Input
                  type="file"
                  accept="image/*"
                  position="absolute"
                  top={0}
                  left={0}
                  width="100%"
                  height="100%"
                  opacity={0}
                  cursor="pointer"
                  onChange={handleImageChange}
                />
              </Box>
            </FormControl>

            <WorkingHoursForm
              workingHours={formData.workingHours}
              onToggle={handleToggle}
              onTimeChange={handleTimeChange}
              label={t('Verfügbarkeiten.Platzhalter')}
            />

            <FormControl pb={8}>
              <FormLabel fontSize="small" fontWeight="bold">{t('Webseite.Feld')}</FormLabel>
              <Input
                type="text"
                placeholder={t('Webseite.Platzhalter')}
                value={formData.calendly}
                onChange={e => setFormData(prev => ({ ...prev, calendly: e.target.value }))}
              />
            </FormControl>

            <Flex justify="flex-end">
              <Button colorScheme="blue" onClick={handleNextStep} w={{ base: '100%', md: 'auto' }}>
                {t('Buttons.Weiter')}
              </Button>
            </Flex>
          </>
        )}

        {step === 2 && (
          <>
            {/* Step 2: Service Details */}
            <FormControl pb={8}>
              <FormLabel fontSize="small" fontWeight="bold">{t('Service Titel.Feld')}</FormLabel>
              <Input
                type="text"
                placeholder={t('Service Titel.Platzhalter')}
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </FormControl>

            <FormControl pb={8}>
              <FormLabel fontSize="small" fontWeight="bold">
                {' '}
                {t('Service Beschreibung.Feld')}
                {' '}
              </FormLabel>
              <Textarea
                rows={10}
                placeholder={t('Service Beschreibung.Platzhalter')}
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </FormControl>

            <FormControl pb={8}>
              <FormLabel fontSize="small" fontWeight="bold">
                {' '}
                {
                  t('Servicekategorie.Feld')
                }
                {' '}
              </FormLabel>

              <SelectRoot
                collection={categoriesList}
                value={formData.category ? [formData.category] : []} // ✅ Pass an array with the selected value
                onValueChange={(details) => {
                  const selected = details.items[0];
                  if (!selected) {
                    logError('AddServiceForm: Invalid service category selection');
                    return;
                  }
                  handleCategorySelectChange(selected);
                }}
              >
                <SelectTrigger>
                  <SelectValueText placeholder={
                    t('Servicekategorie.Platzhalter')
                  }
                  />
                </SelectTrigger>
                <SelectContent>
                  {categoriesList.items.map(item => (
                    <SelectItem key={item.value} item={item}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>

            </FormControl>

            <Divider my={4} />

            {/* Price Input (Changes Label Based on Selection) */}
            <FormControl pb={8}>
              <FormLabel fontSize="small" fontWeight="bold">
                {formData.priceType === 'fix' ? t('Fixpreis.Feld') : t('Stundensatz.Feld')}
              </FormLabel>
              <Input
                ref={inputRef}
                type="text"
                placeholder={formData.priceType === 'fix' ? t('Fixpreis.Feld') : t('Stundensatz.Feld')}
                value={formData.formattedPrice}
                onChange={handlePriceChange}
              />

            </FormControl>

            <Flex justify="flex-end" gap={2} w="100%" direction={{ base: 'column', md: 'row' }}>
              <Button onClick={handlePreviousStep} colorScheme="gray" w={{ base: '100%', md: 'auto' }}>
                {t('Buttons.Zurück')}
              </Button>
              <Button onClick={handleNextStep} colorScheme="green" w={{ base: '100%', md: 'auto' }}>
                {t('Buttons.Weiter')}
              </Button>
            </Flex>
          </>
        )}

        {step === 3 && (
          <>
            {/* Street Address & Street Number in One Row */}
            <Stack direction={{ base: 'column', md: 'row' }} w="100%" mb={4}>

              <FormControl flex={2} mb={{ base: 4, md: 0 }}>

                <FormLabel fontSize="small" fontWeight="bold">
                  {' '}
                  {t('Adresse.Feld')}
                </FormLabel>
                <Input
                  placeholder={t('Adresse.Platzhalter')}
                  type="text"
                  h="40px" // ✅ Ensures same height
                  value={formData.location.street}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, street: e.target.value },
                  }))}
                />
              </FormControl>

              <FormControl flex={2}>
                <FormLabel fontSize="small" fontWeight="bold">Nummer</FormLabel>
                <Input
                  type="text"
                  h="40px" // ✅ Ensures same height
                  value={formData.location.number}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, number: e.target.value },
                  }))}
                />
              </FormControl>

            </Stack>

            {/* Zip Code & City in One Row */}
            <Stack direction={{ base: 'column', md: 'row' }} w="100%" mb={4}>
              <FormControl flex={2} mb={{ base: 4, md: 0 }}>
                <FormLabel fontSize="small" fontWeight="bold">
                  {' '}
                  {t('Postleitzahl.Feld')}
                </FormLabel>
                <Input
                  placeholder={t('Postleitzahl.Platzhalter')}
                  type="text"
                  h="40px" // ✅ Ensures same height
                  value={formData.location.postalCode}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, postalCode: e.target.value },
                  }))}
                />
              </FormControl>

              <FormControl flex={2}>
                <FormLabel fontSize="small" fontWeight="bold">City</FormLabel>
                <Input
                  type="text"
                  h="40px" // ✅ Ensures same height
                  value={formData.location.city}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, city: e.target.value },
                  }))}
                />
              </FormControl>
            </Stack>

            {/* Navigation Buttons */}
            <Flex justify="flex-end" gap={2} w="100%" direction={{ base: 'column', md: 'row' }}>
              <Button onClick={handlePreviousStep} colorScheme="gray" w={{ base: '100%', md: 'auto' }}>
                {t('Buttons.Zurück')}
              </Button>
              <Button onClick={handleNextStep} colorScheme="green" w={{ base: '100%', md: 'auto' }}>
                {t('Buttons.Weiter')}
              </Button>
            </Flex>
          </>
        )}

        {step === 4 && (
          <>
            {/* Step 3: Review &  {t('Forms.AddServiceForm.Buttons.submit')} */}

            <Box
              position="relative"
              w={{ base: '200px', md: '200px' }}
              aspectRatio="16 / 9"
              borderRadius="md"
              overflow="hidden"
              border="2px dashed gray"
              display="flex"
              alignItems="start"
              justifyContent="start"
              bg="gray.100"
              cursor="pointer"

            >
              <Image
                src={formData.image}
                alt="Uploaded"
                objectFit="cover"
                width="100%"
                height="100%"
              />

              <Input
                type="file"
                accept="image/*"
                position="absolute"
                top={0}
                left={0}
                width="100%"
                height="100%"
                opacity={0}
                cursor="pointer"
                onChange={handleImageChange}
              />
            </Box>

            <Divider my={4} />

            <Text fontWeight="bold" fontSize="lg">
              {formData.title}
            </Text>
            <Text fontSize="sm" marginBottom={4}>
              {formData.description}
            </Text>

            <Text fontSize="sm" marginBottom={4}>
              { categoryTypeRetriever(formData.category as string)}
            </Text>

            <Text fontWeight="bold" fontSize="sm">
              {' CHF '}
              {formData.price}
              {' '}
              <Tag fontWeight="initial">
                {
                  (formData.priceType === 'fix') ? (t('Fixpreis.Feld')) : (t('Stundensatz.Feld'))
                }

              </Tag>

            </Text>

            <Divider marginY={1} />

            {/* Chosen Working Hours */}
            <Box fontSize="sm">
              {Object.entries(formData.workingHours).map(([day, { enabled, hours }]) => (
                <div key={day}>
                  <Box as="span" fontWeight="bold">
                    {day}
                    :
                  </Box>
                  {' '}
                  {enabled ? `${hours[0]} - ${hours[1]}` : 'geschlossen'}
                </div>
              ))}
            </Box>
            <Divider marginY={1} />

            <Stack spaceY={0}>
              <Text fontSize="sm">

                {formData.location.street }
                {' '}
                {formData.location.number }
              </Text>

              <Text fontSize="sm">
                {formData.location.postalCode }
                {' '}
                {formData.location.city }

              </Text>

              <Text fontSize="sm">

                <Link
                  href={`tel: ${user.privateMetadata.phone as string}`}
                  className="text-blue-700 hover:border-b hover:border-blue-700"

                >
                  {user.privateMetadata.phone as string }
                </Link>
              </Text>

              <Text fontSize="sm">

                <Link
                  href={formData.calendly}
                  className="text-blue-700 hover:border-b hover:border-blue-700"
                  target="_blank"
                >
                  { formData.calendly }
                </Link>

              </Text>
            </Stack>

            <Flex
              justify="space-between"
              align="center"
              marginTop={12}
              direction={{ base: 'column', md: 'row' }} // Stacks on mobile, row on larger screens
              gap={{ base: 4, md: 0 }} // Adds spaceY when stacked
              w="100%"
            >
              {/* Left-aligned warning text (stacks above buttons on mobile) */}
              <HStack alignItems="center" marginBottom={{ base: 0, md: '4' }} w="100%">
                <Alert status="warning" w="100%">
                  <Text fontWeight="bold" fontSize="sm">
                    {t('Info.Kosten')}
                    <Box as="span" fontWeight={100} display="block">
                      {t('Info.Notiz')}
                    </Box>
                  </Text>
                </Alert>
              </HStack>

              {/* Right-aligned buttons (stacks below warning on mobile) */}
              <Flex justify="flex-end" gap={2} w="100%" direction={{ base: 'column', md: 'row' }}>
                <Button onClick={handlePreviousStep} colorScheme="gray" w={{ base: '100%', md: 'auto' }}>
                  {t('Buttons.Zurück')}
                </Button>
                <Button onClick={handleSubmit} colorScheme="green" w={{ base: '100%', md: 'auto' }}>
                  {t('Buttons.Bestätigen')}
                </Button>
              </Flex>
            </Flex>

          </>
        )}

        <Toaster />
      </Stack>
    </Box>
  );
}
