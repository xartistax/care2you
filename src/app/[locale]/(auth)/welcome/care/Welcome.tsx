'use client';
import {
  Box,
  CardBody,
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
import type { onboardingClientUserSchema } from '@/validations/onBoardingValidation';

type OnBoardingClientUser = z.infer<typeof onboardingClientUserSchema>;

export default function Welcome({ user }: { user: OnBoardingClientUser }) {
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
          <strong> Vielen Dank für Ihre Anmeldung auf unserer Plattform! </strong>
          {' '}
          <br />

          Wir werden Ihre Unterlagen prüfen und uns in Kürze bei Ihnen melden. Bei Fragen stehen wir Ihnen jederzeit gerne zur Verfügung.
          <br />
          <br />

          Wir schätzen Ihr Vertrauen und freuen uns auf die Zusammenarbeit!
          {' '}
          <br />
          <br />

          Wir werden Ihre unterlagen prüfen und uns in Kürze bei Ihnen melden. Bei Fragen stehen wir Ihnen jederzeit gerne unter
          {' '}
          <a href="tel:044 208 88 44"> 044 208 88 44 </a>
          {' '}
          oder
          {' '}
          <a href="mailto:info@care2you.ch"> info@care2you.ch </a>
          {' '}
          zur Verfügung.

        </Text>

      </Box>
    );
  } else {
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
          {t('Titel.Care')}
        </Heading>

        {/* Grid with Cards */}
        <Grid
          templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
          gap="6"
          marginTop="1rem"
        >
          {/* New Service Card */}

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
        </Grid>
      </Box>
    );
  }
}
