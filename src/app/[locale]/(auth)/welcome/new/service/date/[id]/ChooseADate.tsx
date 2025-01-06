'use client';
import 'react-calendar/dist/Calendar.css';

import { Divider } from '@chakra-ui/layout';
import { Box, Heading, HStack, Link, Stack, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import type { ListElementProps } from '@/components/ListElement';
import { Button } from '@/components/ui/button';

export default function ChooseADate({ service }: { service: ListElementProps }) {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations();
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!service.formData.image) {
    service.formData.image = 'placeholder.jpeg';
  }

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
      {/* Title Section */}
      <VStack align="stretch" textAlign="left" mb={6}>
        <Heading as="h1" size="2xl">{service.formData.title}</Heading>
        <Text fontSize="md" color="gray.600">
          {service.formData.description}
        </Text>
        <Divider />

        <Text fontSize="md" color="gray.600">
          Days
          {Object.entries(service.formData.workingHours)
            .filter(([, details]) => details.enabled) // ✅ Only show enabled days
            .map(([day, details]) => `${day}: ${details.hours[0]} - ${details.hours[1]}`)
            .join(', ')}
        </Text>
        <Divider />
      </VStack>

      {/* Calendar */}
      <Box textAlign="center" mb={6}>
        {isVisible && (
          <Box mx="auto" maxW="320px">

          </Box>
        )}
      </Box>

      {/* Price and Action */}
      <VStack align="stretch">
        <HStack justifyContent="space-between" px={4}>
          <Text fontSize="xl" fontWeight="semibold" color="gray.700">
            Total:
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color="blue.600">
            {t('RootLayout.currency')}
            {' '}
            {service.formData.price}
          </Text>
        </HStack>

        <Stack direction="row" pt="4" width="100%">
          {/* Confirm Button (2/3 width) */}
          <Link href={`/welcome/new/service/date/${service.formData.id}`} style={{ flex: 2 }}>
            <Button
              colorScheme="blue"
              size="md"
              width="100%" // Ensures the button stretches to its proportion
            >
              {t('Buttons.confirm')}
            </Button>
          </Link>

          {/* Go Back Button (1/3 width) */}
          <Button
            variant="outline"
            colorScheme="blue"
            size="md"
            flex="1"
            width="100%" // Ensures the button stretches to its proportion
            onClick={() => router.back()}
          >
            {t('Buttons.go_back')}
          </Button>
        </Stack>

      </VStack>
    </Box>
  );
}
