import { Divider } from '@chakra-ui/layout';
import { Box, Flex, Grid, GridItem, Heading, Text, VStack } from '@chakra-ui/react';
import type { z } from 'zod';

import { Avatar } from '@/components/ui/avatar';
import type { onboardingClientUserSchema } from '@/validations/onBoardingValidation';

type OnBoardingClientUser = z.infer<typeof onboardingClientUserSchema>;

// User profile component
type UserProfileProps = {
  user: OnBoardingClientUser;
};

export default function UserProfile({ user }: UserProfileProps) {
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

  const { privateMetadata } = user;
  const {
    streetnumber,
    street,
    plz,
    location,
    phone,
    gender,
    role,
    companyTitle,
    companyDescription,
    workingHours,
    expertise,
    skill,
    languages,
    certificates,
  } = privateMetadata;

  return (
    <Box p={6} bg="white" borderRadius="lg" maxW="800px" margin="0 auto">
      {/* Personal Details */}
      <Flex direction="column" align="center" textAlign="center" mb={6}>
        <Avatar size="xl" name={fullName} src={user.imageUrl || ''} mb={4} />
        <Text fontSize="2xl" fontWeight="bold">{fullName || 'N/A'}</Text>
        <Text fontSize="md" color="gray.600">{user.email || 'No email provided'}</Text>
        <Text fontSize="sm" color="gray.500">{role as string}</Text>
      </Flex>

      <Divider my={4} />

      {/* Address and Contact Details */}
      <VStack align="start" mb={6}>
        <Heading size="sm" mb={2}>Kontakt</Heading>
        <Text>
          Adresse:
          {`${street || 'N/A'} ${streetnumber || ''}, ${plz || 'N/A'} ${location || ''}`}
        </Text>
        <Text>
          Telefon:
          {phone as string}
        </Text>
        <Text>
          Gender:
          {gender as string}
        </Text>
      </VStack>

      <Divider my={4} />

      {/* Company Details */}

      {
        role === 'service'
          ? (
              <VStack align="start" mb={6}>
                <Heading size="sm" mb={2}>Firmen Details</Heading>
                <Text>
                  Title:
                  {' '}
                  { companyTitle as string }
                </Text>
                <Text>
                  Description:
                  {' '}
                  {companyDescription as string}
                </Text>
              </VStack>
            )
          : null
      }

      <Divider my={4} />

      {/* Skills, Expertise, and Certificates */}

      {
        role === 'care' && (
          <>
            {/* Skills, Expertise, Languages, Certificates */}
            <VStack align="start" mb={6}>
              <Heading size="sm">Skills</Heading>
              <Text>{skill && skill.length > 0 ? skill.join(', ') : 'No skills provided'}</Text>

              <Heading size="sm">Expertise</Heading>
              <Text>{expertise as string}</Text>

              <Heading size="sm">Languages</Heading>
              <Text>{languages && languages.length > 0 ? languages.join(', ') : 'No languages provided'}</Text>

              <Heading size="sm">Certificates</Heading>
              <Text>{certificates && certificates.length > 0 ? certificates.join(', ') : 'No certificates provided'}</Text>
            </VStack>

            <Divider my={4} />

            {/* Working Hours */}
            <Heading size="sm" mb={4}>Working Hours</Heading>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              {workingHours
              && Object.entries(workingHours).map(([day, { enabled, hours }]) => (
                <GridItem key={day}>
                  <Text fontWeight="bold">{day}</Text>
                  {enabled
                    ? (
                        <Text>
                          {hours[0]}
                          {' '}
                          -
                          {hours[1]}
                        </Text>
                      )
                    : (
                        <Text color="gray.500">Not available</Text>
                      )}
                </GridItem>
              ))}
            </Grid>
          </>
        )
      }

    </Box>
  );
}
