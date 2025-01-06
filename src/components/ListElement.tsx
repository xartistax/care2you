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
// Fixed import
import NextLink from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import TextTruncate from 'react-text-truncate';
import type { z } from 'zod'; // Import Zod

import type { serviceSchema } from '@/validations/serviceValidation';

import { Tag } from './ui/tag';

// Extract TypeScript type from Zod Schema
type ServiceProps = z.infer<typeof serviceSchema>;

export type ListElementProps = {
  formData: ServiceProps;
};

export default function ListElement({ formData }: ListElementProps) {
  const t = useTranslations();
  // const buttonLabel = t('Buttons.confirm');
  const currency = t('RootLayout.currency');
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isReady, setIsReady] = useState(false);

  let formattedPriceType = '';

  switch (formData.priceType) {
    case 'fix':
      formattedPriceType = 'Fixpreis';
      break; // ✅ Stop execution after setting value
    case 'hourly':
      formattedPriceType = 'Stundenpreis';
      break; // ✅ Stop execution after setting value
    default:
      formattedPriceType = 'Stundenpreis';
  }

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
          <NextLink href={`/welcome/new/service/single/${formData.id}`}>
            <CardTitle as="h2" fontSize="sm" fontWeight="bold" lineHeight={1}>
              {formData.title }
              {' '}
              title
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
            <Tag fontWeight="normal">
              {' '}
              {formattedPriceType}
              {' '}
            </Tag>
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
                    <Link as="a" href={`/welcome/new/service/single/${formData.id}`}>
                      {t('Buttons.read_more')}
                    </Link>
                  )}
                />
              </Text>
            )}
          </Box>
        </Stack>

      </CardBody>
    </LinkBox>

  );
}
