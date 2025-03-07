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
import type { z } from 'zod';

import { Avatar } from '@/components/ui/avatar';
import { CardBody } from '@/components/ui/card';
import UserServices from '@/components/UserServices';
import type { onboardingClientUserSchema } from '@/validations/onBoardingValidation';

type OnBoardingClientUser = z.infer<typeof onboardingClientUserSchema>;

export default function WelcomeService({ user }: { user: OnBoardingClientUser }) {
  const t = useTranslations('Willkommen');

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
          { t('Inaktiv.Service.Text') }
        </Text>

      </Box>
    );
  }

  return (
    <Box
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

      </HStack>

      {/* Subheading */}
      <Heading as="h2" size="xl" marginBottom="4" lineHeight={1.3}>
        {t('Titel.Service')}
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
                  <LinkOverlay fontSize="xl" color="#A0A0A0" href="/welcome/new/service">
                    {t('Service anbieten')}
                  </LinkOverlay>
                </CardTitle>
              </Box>
            </CardBody>
          </LinkBox>
        </GridItem>
      </Grid>

      {/* Placeholder for "Meine aktiven Services" */}
      <Box mb={6} p={0} mt={10}>
        <Heading as="h3" size="lg" color="gray.700">
          {t('aktive Services')}
        </Heading>
        <UserServices userId={user.id} />
      </Box>
    </Box>
  );
}
