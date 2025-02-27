'use client';

import {
  Box,
  CardRoot,
  CardTitle,
  Grid,
  GridItem,
  Heading,
  HStack,
  LinkBox,
  LinkOverlay,
  Text,
} from '@chakra-ui/react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import type { z } from 'zod';

import { Avatar } from '@/components/ui/avatar';
import { CardBody } from '@/components/ui/card';
import { Tag } from '@/components/ui/tag';
import type { onboardingClientUserSchema } from '@/validations/onBoardingValidation';

type OnBoardingClientUser = z.infer<typeof onboardingClientUserSchema>;

export default function Welcome({ user }: { user: OnBoardingClientUser }) {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations('Willkommen');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (user.privateMetadata.status === 'inactive') {
    return (
      <Box

        p={8}
        bg="white"
        borderRadius="lg"
        maxWidth="800px"
        margin="0 auto"
      >
        {/* Header Section */}
        <HStack alignItems="center" marginBottom="8">
          <Avatar src="" name={`${user.firstName} ${user.lastName}`} size="lg" />
          <Heading as="h1" size="2xl">

            {t('Begrüssung', { username: `${user.firstName} ${user.lastName}` })}
          </Heading>

        </HStack>

        <Text fontSize="sm">
          {' '}
          { t('Inaktiv.Client.Text') }
          {' '}
        </Text>

      </Box>
    );
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
      {/* Header Section */}
      <HStack alignItems="center" marginBottom="16">
        <Avatar src="" name={`${user.firstName} ${user.lastName}`} size="lg" />
        <Heading as="h1" size="2xl">

          {t('Begrüssung', { username: `${user.firstName} ${user.lastName}` })}
        </Heading>
        <Box as="span">
          <Tag>
            {String(user.privateMetadata.role || 'norole')}

          </Tag>
        </Box>
      </HStack>

      {/* Subheading */}
      <Heading as="h2" size="xl" marginBottom="4" lineHeight={1.3}>
        {t('Titel.Client')}
      </Heading>

      {/* Grid with Cards */}
      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        gap="6"
        marginTop="1rem"
      >
        {/* New Service Card */}
        <GridItem>
          <LinkBox
            as={CardRoot}
            height="100%"
            bg="gray.50"
            p="4"
            borderRadius="md"
            _hover={{ boxShadow: 'lg', transform: 'scale(1.02)' }}
            transition="all 0.2s"
          >
            <CardBody display="flex" flexDirection={{ base: 'column', md: 'row' }} alignItems="center" gap="4" height="100%">
              {/* Image */}
              <Box flexShrink={0} mb={{ base: '4', md: '0' }}>
                <Image
                  src="/assets/images/icon_newService.svg"
                  width={63.1}
                  height={81.4}
                  alt="New Service"
                />
              </Box>

              {/* Text Content */}
              <Box>
                <CardTitle lineHeight={0}>
                  <LinkOverlay fontSize="xl" color="#A0A0A0" href="/welcome/new/care">
                    {t('Neuer Service')}
                  </LinkOverlay>
                </CardTitle>
              </Box>
            </CardBody>
          </LinkBox>
        </GridItem>

        {/* New Care Card */}
        <GridItem>
          <LinkBox
            as={CardRoot}
            height="100%"
            p="4"
            bg="gray.50"
            borderRadius="md"
            _hover={{ boxShadow: 'lg', transform: 'scale(1.02)' }}
            transition="all 0.2s"
          >
            <CardBody display="flex" flexDirection={{ base: 'column', md: 'row' }} alignItems="center" gap="4" height="100%">
              {/* Image */}
              <Box flexShrink={0} mb={{ base: '4', md: '0' }}>
                <Image
                  src="/assets/images/icon_newCare.svg"
                  width={63.1}
                  height={81.4}
                  alt="New Care"
                />
              </Box>

              {/* Text Content */}
              <Box>
                <CardTitle lineHeight={0}>
                  <LinkOverlay fontSize="xl" color="#A0A0A0" href="/welcome/new/care/calculator">
                    {t('Neue Pflege')}

                  </LinkOverlay>
                </CardTitle>
              </Box>
            </CardBody>
          </LinkBox>
        </GridItem>
      </Grid>
    </Box>
  );
}
