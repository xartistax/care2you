'use client';

import { Divider } from '@chakra-ui/layout';
import { Box, Flex, Grid, GridItem, Heading, IconButton, Input, Spinner, Text, VStack } from '@chakra-ui/react';
import { ClipboardIcon } from '@heroicons/react/24/outline'; // Icons you requested
import { useEffect, useState } from 'react';
import type { z } from 'zod';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tag } from '@/components/ui/tag';
import { companyTypeRetriever, editAddress, expertiseTypeRetriever } from '@/utils/Helpers';
import type { onboardingClientUserSchema } from '@/validations/onBoardingValidation';

type OnBoardingClientUser = z.infer<typeof onboardingClientUserSchema>;

// User profile component
type UserProfileProps = {
  user: OnBoardingClientUser;
};

export default function UserProfile({ user }: UserProfileProps) {
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  const [loading, setLoading] = useState(false);
  const [isClient, setClient] = useState(false);

  const { privateMetadata } = user;
  const {
    streetnumber,
    street,
    plz,
    location,
    phone,
    role,
    companyTitle,
    companyCategory,
    companyDescription,
    workingHours,
    expertise,
    skill,
    languages,
    certificates,
  } = privateMetadata;

  // Editable state
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState<{
    street: string;
    streetnumber: string;
    plz: string;
    location: string;
    phone: string;
  }>({
    street: street as string,
    streetnumber: streetnumber as string,
    plz: plz as string,
    location: location as string,
    phone: phone as string,
  });

  useEffect(() => {
    setClient(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    setLoading(true); // Start loading
    try {
      await editAddress(formData, user.id);
      setEditMode(false); // Only hide edit mode after successful save
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setLoading(false); // Stop loading in all cases
    }
  };
  if (!isClient) {
    return null;
  }

  return (
    <Box p={6} bg="white" borderRadius="lg" maxW="800px" margin="0 auto">
      {/* Personal Details */}
      <Flex direction="column" align="center" textAlign="center" mb={6}>
        <Avatar size="xl" name={fullName} src={user.imageUrl || ''} mb={4} />
        <Text fontSize="2xl" fontWeight="bold">{fullName || 'N/A'}</Text>
        <Text fontSize="sm" color="gray.600">{user.email || 'No email provided'}</Text>
        <Text fontSize="sm" color="gray.500">{role as string}</Text>
      </Flex>

      <Divider my={4} />

      {/* Address and Contact Details */}
      <VStack align="start" mb={6}>
        <Flex align="center" justify="space-between" width="100%">
          <Heading size="sm" mb={2}>
            <Flex align="center">
              <Text>Kontakt</Text>
              {/* Add margin to the left of the icon */}
              <IconButton
                marginLeft={4}
                aria-label="Search database"
                variant="outline"
                size="xs"
                onClick={() => setEditMode(true)}

              >
                <ClipboardIcon />
              </IconButton>
            </Flex>
          </Heading>

          {/* Edit icon next to "Kontakt" */}

        </Flex>

        {/* Street and Address */}
        <Flex align="center" justify="space-between" width="100%">
          <Text fontSize="sm">
            Adresse:
            {' '}
            {`${formData.street || 'N/A'} ${formData.streetnumber || ''}, ${formData.plz || 'N/A'} ${formData.location || ''}`}
          </Text>
        </Flex>

        {/* Phone */}
        <Flex align="center" justify="space-between" width="100%">
          <Text fontSize="sm">
            Telefon:
            {' '}
            {formData.phone || 'N/A'}
          </Text>
        </Flex>
      </VStack>

      {editMode && (
        <VStack align="start" mb={6}>
          <Heading size="sm" mb={2}> Ändern Sie ihre Kontaktinformationen </Heading>
          <Input
            name="street"
            value={formData.street as string || ''}
            onChange={handleInputChange}
            mb={3}
            placeholder="Strasse"
          />
          <Input
            name="streetnumber"
            value={formData.streetnumber as string || ''}
            onChange={handleInputChange}
            mb={3}
            placeholder="Nr."
          />
          <Input
            name="plz"
            value={formData.plz as string || ''}
            onChange={handleInputChange}
            mb={3}
            placeholder="Postleitzahl"
          />
          <Input
            name="location"
            value={formData.location as string || ''}
            onChange={handleInputChange}
            mb={3}
            placeholder="Adresse"
          />
          <Input
            name="phone"
            value={formData.phone || ''}
            onChange={handleInputChange}
            mb={3}
            placeholder="Telefon"
          />
          <Flex gap={4}>

            <Button size="sm" onClick={handleSaveChanges} disabled={loading} aria-label="Save Changes" colorScheme="blue">
              {loading ? <Spinner size="sm" /> : 'Speichern'}
            </Button>

          </Flex>
        </VStack>
      )}

      <Divider my={4} />

      {/* Company Details */}
      {role === 'service' && (
        <VStack align="start" mb={6}>
          <Heading size="sm" mb={2}>Firmen Details</Heading>
          <Text fontSize="sm">
            Title:
            {' '}
            {companyTitle as string}
            {' '}
            <span>
              <Tag>{companyTypeRetriever(companyCategory as string)}</Tag>
            </span>
          </Text>
          <Text fontSize="sm">
            Beschreibung:
            {companyDescription as string}
          </Text>
        </VStack>
      )}

      <Divider my={4} />

      {/* Skills, Expertise, and Certificates */}
      {role === 'care' && (
        <>
          <VStack align="start" mb={6}>
            <Heading size="sm">Skills</Heading>
            <Text fontSize="sm" marginBottom="8px">
              {skill && skill.length > 0 ? skill.join(', ') : 'N/A'}
            </Text>
            <Heading size="sm">Expertise</Heading>
            <Text fontSize="sm" marginBottom="8px">
              {expertiseTypeRetriever(expertise as string)}
            </Text>
            <Heading size="sm">Sprachen</Heading>
            <Text marginBottom="8px" fontSize="sm">
              {languages && languages.length > 0 ? languages.join(', ') : 'N/A'}
            </Text>
            <Heading size="sm">Zertifikate</Heading>
            <Text marginBottom="8px" fontSize="sm">
              {certificates && certificates.length > 0 ? certificates.join(', ') : 'N/A'}
            </Text>
          </VStack>

          <Divider my={4} />

          {/* Working Hours */}
          <Heading size="sm" mb={4}>Erreichbarkeit</Heading>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            {workingHours
            && Object.entries(workingHours).map(([day, { enabled, hours }]) => (
              <GridItem key={day}>
                <Text fontSize="sm" fontWeight="bold">{day}</Text>
                {enabled
                  ? (
                      <Text fontSize="sm">
                        {hours[0]}
                        {' '}
                        -
                        {' '}
                        {hours[1]}
                      </Text>
                    )
                  : (
                      <Text fontSize="sm" color="gray.500"> N/A</Text>
                    )}
              </GridItem>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
}
