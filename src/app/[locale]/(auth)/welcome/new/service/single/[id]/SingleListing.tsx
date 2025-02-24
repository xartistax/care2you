'use client';

import {
  Box,
  Heading,
  HStack,
  Image as ChakraImage,
  Link,
  Stack,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import type { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from '@/components/ui/popover'; // Assuming you have a Popover component
import { Tag } from '@/components/ui/tag';
import { Toaster, toaster } from '@/components/ui/toaster';
import { categoryTypeRetriever, companyTypeRetriever } from '@/utils/Helpers';
import type { onboardingClientUserSchema } from '@/validations/onBoardingValidation';
import type { serviceSchema } from '@/validations/serviceValidation';

type ServiceFormData = z.infer<typeof serviceSchema> & {
  serviceProvider_email: string;
  serviceProvider_lastName: string;
  serviceProvider_firstName: string;
};

type User = z.infer<typeof onboardingClientUserSchema>;

export default function SingleListing({ service, user }: { service: ServiceFormData; user: User }) {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState(false);
  const t = useTranslations('Service');
  const router = useRouter();

  useEffect(() => {
    setClient(true);
  }, []);

  // Make sure the image URL is correct
  if (!service.image) {
    service.image = '/placeholder.jpeg';
  } else if (!service.image.startsWith('http')) {
    service.image = `https://iaha-pull-zone.b-cdn.net/${service.image}`;
  }

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toaster.create({
        title: 'Nachricht erforderlich',
        description: 'Bitte geben Sie eine Nachricht ein.',
        type: 'error',
        meta: { closable: true },
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/send-email-service-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'demian2009@icloud.com',
          subject: `Terminanfrage über Care2you`,
          message,
          service_email: service.serviceProvider_email,
          service_lastName: service.serviceProvider_lastName,
          service_firstName: service.serviceProvider_firstName,
          service_title: service.title,
          client_name: user.firstName,
          client_vorname: user.lastName,
          client_email: user.email,
          client_phone: user.phone,

        }),
      });

      if (response.ok) {
        toaster.create({
          title: 'Nachricht gesendet',
          description: 'Ihre Nachricht wurde erfolgreich gesendet.',
          type: 'success',
          meta: { closable: true },
        });
        setMessage('');
      } else {
        throw new Error('Fehler beim Senden der Nachricht');
      }
    } catch (error) {
      toaster.create({
        title: 'Fehler',
        description: `Ihre Nachricht konnte nicht gesendet werden: ${error}`,
        type: 'error',
        meta: { closable: true },
      });
    } finally {
      setLoading(false);
    }
  };

  if (!client) {
    return null;
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
          src={service.image}
          alt={service.title}
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
          {service.title}
        </Heading>

        {/* Price */}
        <HStack>
          <Text fontSize="sm" fontWeight="bold" color="blue.600">
            {'ab '}
            CHF
            {' '}
            {service.price}
          </Text>
        </HStack>

        {/* Description */}
        <Text fontSize="sm" color="gray.600">
          {service.description}
        </Text>

        {/* Description */}
        <Text fontSize="sm" fontWeight="bold" color="gray.600">
          {
            categoryTypeRetriever(service.category as string)
          }

        </Text>

        {/* Service Hours */}
        <VStack align="start" spaceY={0}>
          <Heading size="sm">
            Verfügbarkeiten
          </Heading>
          {Object.entries(service.workingHours)
            .filter(([, details]) => details.enabled) // Only show enabled days
            .map(([day, details]) => (
              <Text key={day} fontSize="sm" color="gray.600">
                {day}
                :
                {details.hours[0]}
                {' '}
                -
                {details.hours[1]}
              </Text>
            ))}
        </VStack>

        {/* Calendar Link */}
        <Link fontSize="sm" href={service.calendly} target="_blank" color="blue.600">
          {service.calendly}
        </Link>

        {/* Address */}
        <VStack align="start" fontSize="sm" width="full">
          <Heading size="sm">Adresse</Heading>
          <HStack width="full">
            <Text>{service.location.street}</Text>
            <Text>{service.location.number}</Text>
          </HStack>
          <HStack width="full">
            <Text>{service.location.postalCode}</Text>
            <Text>{service.location.city}</Text>
          </HStack>
        </VStack>

        {/* Provider Info */}
        <VStack align="start" fontSize="md" width="full">
          <Heading size="sm">Anbieter</Heading>
          <HStack width="full">
            <Text fontSize="sm">

              {user.privateMetadata.companyTitle as string}
              {' '}
              {' '}
              <Tag>
                {' '}
                {companyTypeRetriever(user.privateMetadata.companyCategory as string)}
                {' '}
              </Tag>

            </Text>
          </HStack>
          <VStack fontSize="sm">
            <Link href={`tel:${user.privateMetadata.phone}`} color="blue.600">
              {user.privateMetadata.phone as string}
            </Link>
          </VStack>
        </VStack>

        {/* Actions */}
        <Stack direction="row" pt="4" width="100%">
          {/* Calendly Link */}
          <Link href={`${service.calendly}`} style={{ flex: 2 }} target="_blank">
            <Button colorScheme="blue" size="md" width="100%">
              Zur Webseite
            </Button>
          </Link>

          {/* Popover for Contacting */}
          <PopoverRoot>
            <PopoverTrigger>
              <Button
                size="md"
                width="100%"
                flex="2"
              >
                Kontaktieren Sie den Anbieter
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverBody>
                <Text mb={2}>
                  Kontaktieren Sie
                  {' '}
                  <Box as="span" fontWeight="bold">
                    {' '}
                    {user.privateMetadata.companyTitle as string}
                    {' '}
                    {companyTypeRetriever(user.privateMetadata.companyCategory as string) !== 'Einzelfirma'
                    && companyTypeRetriever(user.privateMetadata.companyCategory as string)}
                  </Box>

                </Text>
                <Textarea
                  placeholder="Geben Sie hier Ihre Nachricht ein..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  size="sm"
                  disabled={loading}
                />
                <Button
                  colorScheme="blue"
                  mt={3}
                  onClick={handleSendMessage}
                  loading={loading}
                >
                  Senden
                </Button>
              </PopoverBody>
            </PopoverContent>
          </PopoverRoot>

          {/* Go Back Button */}
          <Button
            variant="outline"
            colorScheme="blue"
            size="md"
            flex="1"
            width="100%"
            onClick={() => router.back()}
          >
            {t('Zurück')}
          </Button>
        </Stack>
      </VStack>

      <Toaster />
    </Box>
  );
}
