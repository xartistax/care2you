'use client';

import {
  Box,
  CardBody,
  CardRoot,
  CardTitle,
  Link,
  LinkBox,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { ClipboardIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
// Fixed import
import NextLink from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import TextTruncate from 'react-text-truncate';
import type { z } from 'zod'; // Import Zod

import { categoryTypeRetriever } from '@/utils/Helpers';
import type { serviceSchema } from '@/validations/serviceValidation';

// Extract TypeScript type from Zod Schema
type ServiceProps = z.infer<typeof serviceSchema>;

export type ListElementProps = {
  formData: ServiceProps;
};

export default function ListElement({ formData }: ListElementProps) {
  const t = useTranslations('Service');
  // const buttonLabel = t('Buttons.confirm');
  const currency = 'CHF';
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  return (

    <LinkBox
      id={formData.id as unknown as string}
      as={CardRoot}
      height="auto"
      minHeight="150px"
      width="full"
      borderRadius="md"
      _hover={{ boxShadow: 'lg', transform: 'scale(1.02)' }}
      transition="all 0.2s"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      mb={4}
    >
      <CardBody
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        alignItems={isMobile ? 'stretch' : 'center'}
        gap="4"
        width="100%"
        height="100%"
      >
        {/* Background Image */}
        <Box
          flexShrink={0}
          width={isMobile ? '100%' : '150px'}
          height={isMobile ? '200px' : '120px'}
          backgroundImage={`url(${formData.image || '/placeholder.jpeg'})`} // ✅ Uses validated image
          backgroundSize="cover"
          backgroundPosition="center"
          borderRadius="md"
        />

        {/* Text Content */}
        <Stack flex="1" spaceY={0} justify="space-between" width="100%">
          {/* Title */}
          <NextLink href={`/welcome/new/service/single/${formData.internalId}`}>
            <CardTitle as="h2" fontSize="sm" fontWeight="bold" lineHeight={1}>
              {formData.title }
              {' '}
            </CardTitle>
          </NextLink>

          {/* Price */}
          <Box fontSize="sm" fontWeight="bold" color="blue.600">
            {' '}
            ab
            {' '}
            {currency}
            {' '}
            {formData.price}

            {formData.priceType === 'hourly' && ' /h'}
            {' '}
            {/* ✅ Add "/h" if priceType is hourly */}

            {' '}

          </Box>

          {/* Description */}
          <Box flex="1" minHeight="40px">
            {isReady && (
              <Text fontSize="sm">
                <TextTruncate
                  line={3}
                  element="span"
                  truncateText="…"
                  text={formData.description}
                  textTruncateChild={(
                    <Link as="a" href={`/welcome/new/service/single/${formData.internalId}`}>
                      {t('Einzelansicht')}
                    </Link>
                  )}
                />
              </Text>
            )}
            <Box>
              <br />

              <Box fontSize="sm" display="flex" flexFlow="row" alignItems="center" gap={2}>
                <GlobeAltIcon className="size-3" />
                { categoryTypeRetriever(formData.category as string)}
                {' '}
                |
                {' '}
                <GlobeAltIcon className="size-3" />
                {formData.companyTitle || 'no company title'}
                {' '}
                |
                {' '}
                <GlobeAltIcon className="size-3" />
                {formData.location.city}
                {' '}
                |
                {' '}
                <ClipboardIcon className="size-3" />
                {formData.location.postalCode}

              </Box>

            </Box>
          </Box>
        </Stack>

      </CardBody>
    </LinkBox>

  );
}
