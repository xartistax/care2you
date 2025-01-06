'use client';

import {
  Box,
  Button,
  Heading,
  HStack,
  Image as ChakraImage,
  Link,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import type { User } from '@clerk/nextjs/server';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Tag } from '@/components/ui/tag';
import { companyTypeRetriever } from '@/utils/Helpers';
import type { ServiceFormData } from '@/utils/Types';

export default function SingleListing({ service, user }: { service: ServiceFormData; user: User }) {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations();
  const router = useRouter();
  let formattedPriceType = '';

  switch (service.priceType) {
    case 'fix':
      formattedPriceType = 'Fixpreis';
      break; // ✅ Stop execution after setting value
    case 'hourly':
      formattedPriceType = 'Stundenpreis';
      break; // ✅ Stop execution after setting value
    default:
      formattedPriceType = 'Stundenpreis';
  }

  if (!user) {
    throw new Error('No user');
  }

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!service.serviceImage) {
    service.serviceImage = '/placeholder.jpeg';
  } else if (!service.serviceImage.startsWith('http')) {
    // Only prepend the base URL if it's not already a full URL
    service.serviceImage = `https://iaha-pull-zone.b-cdn.net/${service.serviceImage}`;
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

      {/* Image */}
      <Box mb="6">
        <ChakraImage
          src={service.serviceImage}
          alt={service.serviceTitle}
          width="100%"
          height="auto"
          borderRadius="md"
          loading="lazy"
        />
      </Box>

      {/* Content */}
      <VStack align="start" spaceY={2}>
        {/* Title */}
        <Heading as="h1" size="lg">
          {service.serviceTitle}
        </Heading>

        {/* Price */}
        <HStack>
          <Text fontSize="sm" fontWeight="bold" color="blue.600">
            {'ab '}
            {t('RootLayout.currency')}
            {' '}
            {service.price}
          </Text>
          <Tag>
            {formattedPriceType}
          </Tag>
        </HStack>

        {/* Description */}
        <Text fontSize="sm" color="gray.600">
          {service.serviceDescription}
        </Text>

        <VStack align="start" spaceY={0}>
          <Heading size="sm">
            Servicezeiten
          </Heading>
          {Object.entries(service.workingHours)
            .filter(([, details]) => details.enabled) // ✅ Only show enabled days
            .map(([day, details]) => (
              <Text key={day} fontSize="sm" color="gray.600">
                {day}

                :
                {' '}
                {' '}
                {details.hours[0]}
                {' '}
                -
                {details.hours[1]}
              </Text>

            ))}

          <Link fontSize="sm" href={service.calendly} target="_blank" color="blue.600">

            Setzen Sie Ihren Termin

          </Link>
        </VStack>

        <VStack align="start" fontSize="sm" width="full">
          <Heading size="sm">
            Adresse
          </Heading>

          <HStack width="full">
            {/* ✅ Ensures proper alignment */}
            <Text>{service.location.street}</Text>
            <Text>{service.location.number}</Text>
          </HStack>

          <HStack width="full">
            <Text>{service.location.postalCode}</Text>
            <Text>{service.location.city}</Text>
          </HStack>
        </VStack>

        <VStack align="start" fontSize="md" width="full">
          <Heading size="sm">
            Anbieter
          </Heading>

          <HStack width="full">
            {/* ✅ Ensures proper alignment */}
            <Text fontSize="sm">
              { user.privateMetadata.companyTitle as string }
              {' '}
              { companyTypeRetriever(user.privateMetadata.companyCategory as string)}
              {' '}

            </Text>

          </HStack>

          <VStack fontSize="sm">
            <Link href={`tel:${user.privateMetadata.phone}`} color="blue.600">
              { user.privateMetadata.phone as string }
            </Link>

          </VStack>

        </VStack>

        {/* Actions */}
        <Stack direction="row" pt="4" width="100%">
          {/* Confirm Button */}
          <Link href={`${service.calendly}`} style={{ flex: 2 }} target="_blank">
            <Button colorScheme="blue" size="md" width="100%">
              Setzen Sie Ihren Termin
            </Button>
          </Link>

          {/* Go Back Button */}
          <Button
            variant="outline"
            colorScheme="blue"
            size="md"
            flex="1"
            width="100%"
            onClick={() => router.back()}
          >
            {t('Buttons.go_back')}
          </Button>
        </Stack>
      </VStack>
    </Box>
  );
}
