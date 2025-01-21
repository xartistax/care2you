'use client';
import '@wojtekmaj/react-timerange-picker/dist/TimeRangePicker.css';

import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Divider } from '@chakra-ui/layout';
import { Box, Button, Flex, HStack, Image, Input, Link, Spinner, Stack, Text, Textarea } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { z } from 'zod';

import TopUpCredits from '@/components/TopUpCredits';
import { Alert } from '@/components/ui/alert';
import { Tag } from '@/components/ui/tag';
import { Toaster, toaster } from '@/components/ui/toaster';
import WorkingHoursForm from '@/components/WorkingHoursForm';
import { decreaseCreditByOne, saveNewService, uploadImageToBunny } from '@/utils/Helpers';
import type { onboardingClientUserSchema } from '@/validations/onBoardingValidation';
import type { serviceSchema } from '@/validations/serviceValidation';

type ServiceFormData = z.infer<typeof serviceSchema>;
type OnBoardingClientUser = z.infer<typeof onboardingClientUserSchema>;

export default function AddServiceForm({ user }: { user: OnBoardingClientUser }) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [step, setStep] = useState(1);
  const credits = Number(user.privateMetadata.credits) || 0;

  const t = useTranslations();

  // Initialize form data with translations
  const [formData, setFormData] = useState<ServiceFormData>({
    id: '',
    image: '/service_placeholder.jpg',
    fileToUpload: null as File | null,
    workingHours: {
      Monday: { enabled: false, hours: ['08:00', '16:00'] },
      Tuesday: { enabled: false, hours: ['08:00', '16:00'] },
      Wednesday: { enabled: false, hours: ['08:00', '16:00'] },
      Thursday: { enabled: false, hours: ['08:00', '16:00'] },
      Friday: { enabled: false, hours: ['08:00', '16:00'] },
      Saturday: { enabled: false, hours: ['08:00', '16:00'] },
      Sunday: { enabled: false, hours: ['08:00', '16:00'] },
    },
    title: '',
    description: '',
    price: 0.00,
    priceType: 'fix',
    formattedPrice: '',
    calendly: '',
    location: {
      street: '',
      number: '',
      city: '',
      postalCode: '',
    },
    userId: '',
  });

  // Preserve state on re-render
  useEffect(() => {
    setFormData(prev => ({ ...prev }));
  }, [step]);

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
          title: t('Forms.AddServiceForm.Errors.workinghours'),
        });
        return;
      } else if (formData.image === '/service_placeholder.jpg') {
        toaster.create({
          type: 'error',
          title: t('Forms.AddServiceForm.Errors.noImage'),
        });
        return;
      } else if (!formData.calendly) {
        toaster.create({
          type: 'error',
          title: t('Forms.AddServiceForm.Errors.calLink'),
        });
        return;
      }
    } else if (step === 2) {
      if (!formData.title || !formData.description || !formData.priceType) {
        toaster.create({
          type: 'error',
          title: t('Forms.AddServiceForm.Errors.general'),
        });
        return;
      } else if (Number.parseFloat(String(formData.price)) < 10.00) {
        toaster.create({
          type: 'error',
          title: t('Forms.AddServiceForm.Errors.price'),
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
      await uploadImageToBunny(formData.fileToUpload);

      // Step 2: Merge the updated `userId` into the formData
      setFormData({ ...formData, userId: user.id, id: uuidv4() });

      // Step 3: Use the updated data for further operations
      await saveNewService(formData);

      // Step 5: Other operations
      await decreaseCreditByOne(user.id);
      setSuccess(true);
    } catch (error) {
      console.error('Failed to save service:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.,]/g, ''); // Remove invalid characters

    let parsedValue = Number.parseFloat(value.replace(',', '.')); // Convert decimals properly

    if (Number.isNaN(parsedValue)) {
      parsedValue = 0;
    }

    setFormData(prev => ({
      ...prev,
      price: parsedValue, // Ensure `price` is a number
      formattedPrice: parsedValue.toFixed(2), // Format correctly
    }));
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
        {/* <ServiceSuccess formData={formData} /> */}
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
                marginBottom={8}
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
              label="Erreichbarkeit"
            />

            <FormControl paddingBottom={8}>
              <FormLabel fontSize="small" fontWeight="bold">{t('Forms.AddServiceForm.Labels.calLink')}</FormLabel>
              <Input
                type="text"
                placeholder={t('Forms.AddServiceForm.Labels.calLink')}
                value={formData.calendly}
                onChange={e => setFormData(prev => ({ ...prev, calendly: e.target.value }))}
              />
            </FormControl>

            <Flex justify="flex-end">
              <Button colorScheme="blue" onClick={handleNextStep}>
                {t('Forms.AddServiceForm.Buttons.next')}
              </Button>
            </Flex>
          </>
        )}

        {step === 2 && (
          <>
            {/* Step 2: Service Details */}
            <FormControl paddingBottom={8}>
              <FormLabel fontSize="small" fontWeight="bold">{t('Forms.AddServiceForm.Labels.service')}</FormLabel>
              <Input
                type="text"
                placeholder={t('Forms.AddServiceForm.Labels.service')}
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </FormControl>

            <FormControl paddingBottom={8}>
              <FormLabel fontSize="small" fontWeight="bold">
                {' '}
                {t('Forms.AddServiceForm.Labels.description')}
                {' '}
              </FormLabel>
              <Textarea
                rows={10}
                placeholder={t('Forms.AddServiceForm.Labels.description')}
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </FormControl>

            <Divider marginY={4} />

            {/* Price Selection (Fix Price or Hourly Price) */}
            <FormControl as="fieldset" paddingBottom={4}>
              <FormLabel as="legend" fontSize="small" fontWeight="bold">
                {' '}
                {t('Forms.AddServiceForm.Labels.priceType')}
                {' '}
              </FormLabel>

              {/* <RadioGroup
                value={formData.priceType}
                onChange={event =>
                  setFormData(prev => ({
                    ...prev,
                    priceType: (event as unknown as { target: { value: string } }).target.value, // ✅ Now correctly extracts the string value
                  }))}
              >
                <HStack gap="6">
                  <Radio value="Fixpreis">
                    {' '}
                    {t('Forms.AddServiceForm.Labels.fixprice')}
                    {' '}
                  </Radio>
                  <Radio value="Stundensatz">
                    {t('Forms.AddServiceForm.Labels.hourlyprice')}
                    {' '}
                  </Radio>
                </HStack>
              </RadioGroup> */}

            </FormControl>

            <Divider marginY={4} />

            {/* Price Input (Changes Label Based on Selection) */}
            <FormControl paddingBottom={8}>
              <FormLabel fontSize="small" fontWeight="bold">
                {formData.priceType === 'fix' ? t('Forms.AddServiceForm.Labels.fixprice') : t('Forms.AddServiceForm.Labels.hourlyprice')}
              </FormLabel>
              <Input
                type="text"
                placeholder={formData.priceType === 'fix' ? t('Forms.AddServiceForm.Labels.fixprice') : t('Forms.AddServiceForm.Labels.hourlyprice')}
                value={formData.formattedPrice}
                onChange={handlePriceChange}
              />
            </FormControl>

            <Flex justify="flex-end" gap={2}>
              <Button onClick={handlePreviousStep} colorScheme="gray">
                {t('Forms.AddServiceForm.Buttons.back')}
              </Button>
              <Button onClick={handleNextStep} colorScheme="green">
                {t('Forms.AddServiceForm.Buttons.next')}
              </Button>
            </Flex>
          </>
        )}

        {step === 3 && (
          <>
            {/* Street Address & Street Number in One Row */}
            <HStack spaceY={4} w="100%" alignItems="center">
              <FormControl flex={3} marginTop={0}>
                <FormLabel fontSize="small" fontWeight="bold">Street Address</FormLabel>
                <Input
                  type="text"
                  h="40px" // ✅ Ensures same height
                  value={formData.location.street}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, street: e.target.value },
                  }))}
                />
              </FormControl>

              <FormControl flex={1} marginTop={0}>
                <FormLabel fontSize="small" fontWeight="bold">Street Number</FormLabel>
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
            </HStack>

            {/* Zip Code & City in One Row */}
            <HStack spaceY={4} w="100%" alignItems="center">
              <FormControl flex={2} marginTop={0}>
                <FormLabel fontSize="small" fontWeight="bold">Zip Code</FormLabel>
                <Input
                  type="text"
                  h="40px" // ✅ Ensures same height
                  value={formData.location.postalCode}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, postalCode: e.target.value },
                  }))}
                />
              </FormControl>

              <FormControl flex={2} marginTop={0}>
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
            </HStack>

            {/* Navigation Buttons */}
            <Flex justify="flex-end" gap={2} marginTop={6}>
              <Button onClick={handlePreviousStep} colorScheme="gray">
                {t('Forms.AddServiceForm.Buttons.back')}
              </Button>
              <Button onClick={handleNextStep} colorScheme="green">
                {t('Forms.AddServiceForm.Buttons.next')}
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

            <Divider marginY={4} />

            <Text fontWeight="bold" fontSize="lg">
              {formData.title}
            </Text>
            <Text fontSize="sm" marginBottom={4}>
              {formData.description}
            </Text>
            <Text fontWeight="bold" fontSize="sm">
              {' CHF '}
              {formData.price}
              {' '}
              <Tag fontWeight="initial">
                {
                  (formData.priceType === 'fix') ? (t('Forms.AddServiceForm.Labels.fixprice')) : (t('Forms.AddServiceForm.Labels.hourlyprice'))
                }

              </Tag>

            </Text>

            <Divider marginY={1} />

            {/* Chosen Working Hours */}

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
                    {t('Forms.AddServiceForm.Info.cost')}
                    <Box as="span" fontWeight={100} display="block">
                      {t('Forms.AddServiceForm.Info.recharge_info')}
                    </Box>
                  </Text>
                </Alert>
              </HStack>

              {/* Right-aligned buttons (stacks below warning on mobile) */}
              <HStack gap={2} w="100%" justify={{ base: 'center', md: 'flex-end' }}>
                <Button onClick={handlePreviousStep} colorScheme="gray">
                  {t('Forms.AddServiceForm.Buttons.back')}
                </Button>
                <Button onClick={handleSubmit} colorScheme="green">
                  {t('Forms.AddServiceForm.Buttons.submit')}
                </Button>
              </HStack>
            </Flex>

          </>
        )}

        <Toaster />
      </Stack>
    </Box>
  );
}
