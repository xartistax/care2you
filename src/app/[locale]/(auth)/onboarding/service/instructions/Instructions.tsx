'use client';

import { Box, Heading, HStack, Stack, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { HiXCircle } from 'react-icons/hi';

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { getSalutation, removeCompilance, updateCompilance } from '@/utils/Helpers';

export default function Instructions({ userId, lastName, gender }: {
  userId: string;
  lastName: string | null;
  gender: unknown;
}) {
  const router = useRouter();
  const [isVisible] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const t = useTranslations();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const setCompilance = async () => {
    try {
      setIsSubmitting(true);

      const isUpdated = await updateCompilance(userId);
      if (!isUpdated) {
        setErrorMessage('Failed to update compliance.');
      }
    } catch (error) {
      console.error('Error during submission:', error);
      setErrorMessage((error as Error).message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const unsetCompilance = async () => {
    try {
      setIsSubmitting(true);

      const isUpdated = await removeCompilance(userId);
      if (!isUpdated) {
        setErrorMessage('Failed to update compliance.');
      }
    } catch (error) {
      console.error('Error during submission:', error);
      setErrorMessage((error as Error).message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCheckboxChange = () => {
    setIsChecked(prev => !prev);
    if (!isChecked) {
      setCompilance();
    } else {
      unsetCompilance();
    }
  };
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      // Simulate compliance update
      const isUpdated = await updateCompilance(userId);
      if (!isUpdated) {
        setErrorMessage('Failed to update compliance.');
        return;
      }
      router.push('/de/welcome');
    } catch (error) {
      setErrorMessage((error as Error).message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      className={`transition-opacity duration-1000 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      p={8}
      bg="white"
      borderRadius="lg"
      maxWidth="800px"
      margin="0 auto"
    >
      {errorMessage && (
        <HStack alignItems="center" marginBottom="4">
          <Alert status="error" icon={<HiXCircle />}>
            {errorMessage}
          </Alert>
        </HStack>
      )}
      <VStack alignItems="left" marginBottom={8}>
        <Heading as="h1" size="2xl">
          {t('OnBoarding.client_instructions_title')}
        </Heading>
      </VStack>
      <VStack>
        <Box textStyle="body">
          <Text>
            <Box as="span" fontWeight="bold" display="block">
              {getSalutation(gender as '0' | '1')}
              {' '}
              {lastName}
            </Box>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi voluptatibus enim beatae nesciunt nostrum reiciendis nisi sit dignissimos quam. Molestias molestiae distinctio quisquam quas animi esse facere praesentium facilis. Ut.
          </Text>
        </Box>
      </VStack>

      {/* Checkbox and Submit Button */}
      <VStack alignItems="left">
        <HStack alignItems="center" marginTop={4}>
          <Stack align="flex-start" flex="1">
            <Checkbox checked={isChecked} onChange={handleCheckboxChange}>
              {t.rich('OnBoarding.checkbox_text', {
                link: chunks => (
                  <Link href="/terms" color="blue.500">
                    {chunks}
                  </Link>
                ),
              })}
            </Checkbox>
          </Stack>

          <Button
            colorScheme="blue"
            disabled={!isChecked || isSubmitting}
            loading={isSubmitting}
            loadingText="übermittelt..."
            onClick={handleSubmit}
          >
            {t('OnBoarding.submit_button')}
          </Button>

        </HStack>
      </VStack>
    </Box>
  );
}
