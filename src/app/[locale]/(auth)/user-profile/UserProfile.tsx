'use client';

// Icons you requested

import { Divider } from '@chakra-ui/layout';
import { Box, Button, createListCollection, type FileUploadFileAcceptDetails, Flex, Grid, GridItem, Heading, IconButton, Input, Link, SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText, Spinner, Text, Textarea, VStack } from '@chakra-ui/react';
import { ClipboardIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { z } from 'zod';

import { Avatar } from '@/components/ui/avatar';
import { FileUploadDropzone, FileUploadList, FileUploadRoot } from '@/components/ui/file-upload';
import WorkingHoursForm from '@/components/WorkingHoursForm';
import { companyTypeRetriever, editAddress, editCare, editCompany, expertiseTypeRetriever, uploadCertsToBunny } from '@/utils/Helpers';
import type { onboardingClientUserSchema } from '@/validations/onBoardingValidation';

type OnBoardingClientUser = z.infer<typeof onboardingClientUserSchema>;

// User profile component
type UserProfileProps = {
  user: OnBoardingClientUser;
};

export default function UserProfile({ user }: UserProfileProps) {
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

  const { privateMetadata } = user;

  const phone = privateMetadata.phone;
  const role = privateMetadata.role;
  const workingHours = privateMetadata.workingHours;
  const oldFilesArray = privateMetadata.certificates;

  const [companyEditMode, setCompanyEditMode] = useState(false);
  const [adressEditMode, setAddressEditMode] = useState(false);
  const [careEditMode, setCareEditMode] = useState(false);
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);

  const company_collection = createListCollection({
    items: [
      { value: '0', label: 'AG' },
      { value: '1', label: 'GmbH' },
      { value: '2', label: 'Einzelfirma' },
    ],
  });

  const [adressFormData, setAdressFormData] = useState({
    street: privateMetadata.street as string || '',
    streetnumber: privateMetadata.streetnumber as string || '',
    plz: privateMetadata.plz as string || '',
    location: privateMetadata.location as string || '',
    phone: privateMetadata.phone as string || '',
  });

  const [companyFormData, setCompanyFormData] = useState({
    companyTitle: privateMetadata.companyTitle as string || '',
    companyCategory: privateMetadata.companyCategory as string || '',
    companyDescription: privateMetadata.companyDescription as string || '',
    uidst: privateMetadata.uidst as string || '',
  });

  const [careFormData, setCareFormData] = useState({
    skill: (privateMetadata.skill as unknown[]) ?? [],
    expertise: (privateMetadata.expertise as string) ?? '',
    certificates: (privateMetadata.certificates as unknown[]) ?? [],
    workingHours: (privateMetadata.workingHours as {
      Montag: { enabled: boolean; hours: [string, string] };
      Dienstag: { enabled: boolean; hours: [string, string] };
      Mittwoch: { enabled: boolean; hours: [string, string] };
      Donnerstag: { enabled: boolean; hours: [string, string] };
      Freitag: { enabled: boolean; hours: [string, string] };
      Samstag: { enabled: boolean; hours: [string, string] };
      Sonntag: { enabled: boolean; hours: [string, string] };
    }) ?? {
      Montag: { enabled: false, hours: ['00:00', '00:00'] },
      Dienstag: { enabled: false, hours: ['00:00', '00:00'] },
      Mittwoch: { enabled: false, hours: ['00:00', '00:00'] },
      Donnerstag: { enabled: false, hours: ['00:00', '00:00'] },
      Freitag: { enabled: false, hours: ['00:00', '00:00'] },
      Samstag: { enabled: false, hours: ['00:00', '00:00'] },
      Sonntag: { enabled: false, hours: ['00:00', '00:00'] },
    },
  });

  const skill_collection = createListCollection({
    items: [
      { value: 'Betreuung älterer Menschen', label: 'Betreuung älterer Menschen' },
      { value: 'Unterstützung bei Behinderungen', label: 'Unterstützung bei Behinderungen' },
      { value: 'Medizinische Hilfe', label: 'Medizinische Hilfe' },
      { value: 'Haushalt', label: 'Haushalt' },
    ],
  });

  const expertise_collection = createListCollection({
    items: [
      { value: '0', label: 'weniger als 1-Jahr' },
      { value: '1', label: 'zwischen 1 und 3 Jahre' },
      { value: '2', label: 'über 5 Jahre' },
    ],
  });

  const daysOfWeek = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

  const handleAdressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAdressFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdressSaveChanges = async () => {
    setLoading(true); // Start loading
    try {
      await editAddress(adressFormData, user.id);
      setAddressEditMode(false); // Only hide edit mode after successful save
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setLoading(false); // Stop loading in all cases
    }
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCompanySelectChange = (selected?: { value: string; label: string }) => {
    if (selected && (selected.value === '0' || selected.value === '1' || selected.value === '2')) {
      setCompanyFormData(prev => ({
        ...prev,
        companyCategory: selected.value as '0' | '1' | '2', // Gender wird korrekt gesetzt
      }));
    } else {
      console.error('Invalid selection:', selected);
    }
  };

  const handleCompanySaveChanges = async () => {
    setLoading(true); // Start loading
    try {
      await editCompany(companyFormData, user.id);
      setCompanyEditMode(false); // Only hide edit mode after successful save
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setLoading(false); // Stop loading in all cases
    }
  };

  const handleCareSaveChanges = async () => {
    setLoading(true);
    try {
      // Upload certificates
      const uploadedFiles = await uploadCertsToBunny(careFormData.certificates as File[]);
      const newcertificates = Object.values(uploadedFiles).map(url => ({ url }));
      const newextractedFiles = Object.values(newcertificates[1]?.url || []);
      const newFiles = oldFilesArray.concat(newextractedFiles);

      // Prepare the data for the API call
      const validCareFormData = {
        skill: Array.isArray(careFormData.skill) ? careFormData.skill : [],
        expertise: careFormData.expertise || '',
        certificates: newFiles, // Use the final combined list
        workingHours: careFormData.workingHours || {},
      };

      await editCare(validCareFormData, user.id);

      // ✅ Check the structure of uploadedFiles to understand how to access the URLs
    } catch (error) {
      console.error('Error uploading certificates:', error);
    } finally {
      setLoading(false);
      setCareEditMode(false);
      window.location.href = '/de/user-profile';
    }
  };

  const handleSkillSelectChange = (selectedItems: string[]) => {
    setCareFormData(prev => ({
      ...prev, // Ensure you're preserving the rest of the form data
      skill: selectedItems,
    }));
  };

  const handleExpertiseSelectChange = (selected?: { value: string; label: string }) => {
    if (selected) {
      setCareFormData(prev => ({
        ...prev,

        expertise: selected.value as string, // Gender wird korrekt gesetzt

      }));
    } else {
      console.error('Invalid selection:', selected);
    }
  };

  const handleToggle = (day: keyof typeof careFormData.workingHours) => {
    setCareFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day] ?? { enabled: false, hours: ['', ''] }, // Falls undefined, Standardwert setzen
          enabled: !prev.workingHours[day]?.enabled,
        },
      },
    }));
  };

  const handleTimeChange = (
    day: keyof typeof careFormData.workingHours,
    value: [string, string],
  ) => {
    setCareFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          hours: value, // Update the hours, no need to toggle `enabled`
        },
      },
    }));
  };

  const handleAcceptedFiles = (fileDetails: FileUploadFileAcceptDetails) => {
    const maxSize = 5 * 1024 * 1024; // 5MB limit

    // Ensure acceptedFiles exists and is an array
    if (Array.isArray(fileDetails.files)) {
      const validFiles = fileDetails.files.filter((file) => {
        if (file.size > maxSize) {
          console.error(`File ${file.name} exceeds the 5MB size limit.`);
          return false; // Exclude file if it's too large
        }
        return true; // Include valid files
      });

      // Update the state with the valid files
      setAcceptedFiles(validFiles);
    } else {
      console.error('No accepted files found');
    }
  };

  if (acceptedFiles.length > 0) {
    careFormData.certificates = acceptedFiles;
  }

  return (
  /// AVATAR

    <Box p={6} bg="white" borderRadius="lg" maxW="800px" margin="0 auto">
      <Flex direction="column" align="center" textAlign="center" mb={6}>
        <Avatar size="xl" name={fullName} src={user.imageUrl || ''} mb={4} />
        <Text fontSize="2xl" fontWeight="bold">{fullName || 'N/A'}</Text>
        <Text fontSize="sm" color="gray.600">{user.email || 'No email provided'}</Text>
        <Text fontSize="sm" color="gray.500">{privateMetadata.role as string}</Text>
      </Flex>

      <Divider my={4} />

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
                onClick={() => setAddressEditMode(true)}

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
            {`${adressFormData.street || 'N/A'} ${adressFormData.streetnumber || ''}, ${adressFormData.plz || 'N/A'} ${adressFormData.location || ''}`}

          </Text>
        </Flex>

        {/* Phone */}
        <Flex align="center" justify="space-between" width="100%">
          <Text fontSize="sm">
            Telefon:
            {' '}
            { phone as string || 'N/A'}
          </Text>
        </Flex>
      </VStack>
      {adressEditMode && (
        <VStack align="start" mb={6}>
          <Heading size="sm" mb={2}> Ändern Sie ihre Kontaktinformationen </Heading>
          <Input
            name="street"
            value={adressFormData.street as string || ''}
            onChange={handleAdressChange}
            mb={3}
            placeholder="Strasse"
          />
          <Input
            name="streetnumber"
            value={adressFormData.streetnumber as string || ''}
            onChange={handleAdressChange}
            mb={3}
            placeholder="Nr."
          />
          <Input
            name="plz"
            value={adressFormData.plz as string || ''}
            onChange={handleAdressChange}
            mb={3}
            placeholder="Postleitzahl"
          />
          <Input
            name="location"
            value={adressFormData.location as string || ''}
            onChange={handleAdressChange}
            mb={3}
            placeholder="Adresse"
          />
          <Input
            name="phone"
            value={adressFormData.phone || ''}
            onChange={handleAdressChange}
            mb={3}
            placeholder="Telefon"
          />
          <Flex gap={4}>

            <Button size="sm" onClick={handleAdressSaveChanges} disabled={loading} aria-label="Save Changes" colorScheme="blue">
              {loading ? <Spinner size="sm" /> : 'Speichern'}
            </Button>

          </Flex>
        </VStack>
      )}

      {
        role === 'service' && (
          <>
            <Divider my={4} />

            <VStack align="start" mb={6}>
              <Flex align="center" justify="space-between" width="100%">
                <Heading size="sm" mb={2}>
                  <Flex align="center">
                    <Text>Firmendetails</Text>
                    {/* Add margin to the left of the icon */}
                    <IconButton
                      marginLeft={4}
                      aria-label="Search database"
                      variant="outline"
                      size="xs"
                      onClick={() => setCompanyEditMode(true)}

                    >
                      <ClipboardIcon />
                    </IconButton>
                  </Flex>
                </Heading>
              </Flex>

              <Flex align="center" justify="space-between" width="100%">
                <Text fontSize="sm">
                  {' '}
                  {`${companyFormData.companyTitle || 'N/A'} ${companyTypeRetriever(companyFormData.companyCategory) || ''} - ${companyFormData.uidst || ''}`}
                  <br />
                  {companyFormData.companyDescription || 'N/A'}

                </Text>
              </Flex>
            </VStack>

            {companyEditMode && (
              <VStack align="start" mb={6}>
                <Heading size="sm" mb={2}> Ändern Sie die Firmendetails </Heading>
                <Input
                  name="companyTitle"
                  value={companyFormData.companyTitle as string || ''}
                  onChange={handleCompanyChange}
                  mb={3}
                  placeholder="Firmenname"
                />

                <Input
                  name="uidst"
                  value={companyFormData.uidst as string || ''}
                  onChange={handleCompanyChange}
                  mb={3}
                  placeholder="Steuernummer"
                />

                <SelectRoot
                  collection={company_collection}
                  value={
                    String(companyFormData.companyCategory)
                      ? [String(companyFormData.companyCategory)]
                      : []
                  }
                  onValueChange={(details) => {
                    const selected = details.items[0];
                    if (!selected) {
                      console.error('Invalid selection:', selected);
                    }
                    handleCompanySelectChange(selected);
                  }}
                >
                  <SelectTrigger>
                    <SelectValueText placeholder="Unternehmensform" />
                  </SelectTrigger>
                  <SelectContent>
                    {company_collection.items.map(item => (
                      <SelectItem key={item.value} item={item}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>

                <Textarea
                  name="companyDescription"
                  value={companyFormData.companyDescription as string || ''}
                  onChange={handleCompanyChange}
                  mb={3}
                  placeholder="Beschreibung"

                />

                <Flex gap={4}>

                  <Button size="sm" onClick={handleCompanySaveChanges} disabled={loading} aria-label="Save Changes" colorScheme="blue">
                    {loading ? <Spinner size="sm" /> : 'Speichern'}
                  </Button>

                </Flex>
              </VStack>
            )}
          </>
        )
      }

      {
        role === 'care' && (
          <>
            <Divider my={4} />

            <VStack align="start" mb={6}>
              <Flex align="center" justify="space-between" width="100%">
                <Heading size="sm" mb={2}>
                  <Flex align="center">
                    <Text>Weitere Infos</Text>
                    {/* Add margin to the left of the icon */}
                    <IconButton
                      marginLeft={4}
                      aria-label="Search database"
                      variant="outline"
                      size="xs"
                      onClick={() => setCareEditMode(true)}

                    >
                      <ClipboardIcon />
                    </IconButton>
                  </Flex>
                </Heading>
              </Flex>

              <Text fontSize="sm" marginBottom="8px">
                Skills:
                {' '}
                {careFormData.skill && careFormData.skill.length > 0 ? careFormData.skill.join(', ') : null}
              </Text>

              <Heading size="sm">Expertise</Heading>
              <Text fontSize="sm" marginBottom="8px">
                {expertiseTypeRetriever(careFormData.expertise as string)}
              </Text>
              <Heading size="sm">Zertifikate</Heading>

              {careFormData.certificates.length > 0
                ? (
                    careFormData.certificates.map((cert, index) => (
                      <Link key={uuidv4()} href={cert as string} target="_blank" fontSize="sm">

                        Zertifikat
                        {' '}
                        {index + 1}

                      </Link>
                    ))
                  )
                : null}

              <Heading size="sm" mb={4}>Verfügbarkeiten</Heading>

              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                {workingHours
                && Object.entries(workingHours)
                  .sort(([dayA], [dayB]) => daysOfWeek.indexOf(dayA) - daysOfWeek.indexOf(dayB)) // Sort by custom order
                  .map(([day, { enabled, hours }]) => (
                    <GridItem key={day}>
                      <Text fontSize="sm" fontWeight="bold">{day}</Text>
                      {enabled
                        ? (
                            <Text fontSize="sm">
                              {hours[0]}
                              {' '}
                              -
                              {hours[1]}
                            </Text>
                          )
                        : (
                            <Text fontSize="sm" color="gray.500">N/A</Text>
                          )}
                    </GridItem>
                  ))}
              </Grid>

            </VStack>

            {careEditMode && (
              <VStack align="start" mb={6}>
                <Heading size="sm" mb={2}> Ändern Sie Ihre Informationen </Heading>

                <SelectRoot
                  multiple
                  collection={skill_collection}
                  value={careFormData.skill as string[] || []}
                  onValueChange={(details) => {
                    if (details?.items && Array.isArray(details.items)) {
                      const selected = details.items
                        .filter(item => item && 'value' in item) // Ensure `item` and `value` exist
                        .map(item => item.value);
                      handleSkillSelectChange(selected); // Pass the selected values to state
                    } else {
                      handleSkillSelectChange([]); // Fallback for invalid `details`
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValueText placeholder="Skills">
                      {/* Map over the selected items and join their labels */}
                      {careFormData.skill?.length > 0
                        ? careFormData.skill.map((skill) => {
                            const item = skill_collection.items.find(i => i.value === skill);
                            return item ? item.label : null;
                          }).join(', ') // Join them with a comma
                        : 'Select Skills'}
                    </SelectValueText>
                  </SelectTrigger>

                  <SelectContent>
                    {skill_collection.items.map(item => (
                      <SelectItem key={item.value} item={item}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>

                <SelectRoot
                  collection={expertise_collection}
                  value={
                    String(careFormData.expertise)
                      ? [String(careFormData.expertise)]
                      : []
                  }
                  onValueChange={(details) => {
                    const selected = details.items[0];
                    if (!selected) {
                      console.error('Invalid selection:', selected);
                      return;
                    }
                    handleExpertiseSelectChange(selected);
                  }}
                >
                  <SelectTrigger>
                    <SelectValueText placeholder="Erfahrung" />
                  </SelectTrigger>
                  <SelectContent>
                    {expertise_collection.items.map(item => (
                      <SelectItem key={item.value} item={item}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>

                <WorkingHoursForm
                  workingHours={careFormData.workingHours}
                  onToggle={handleToggle}
                  onTimeChange={handleTimeChange}
                  label="Verfügbarkeiten"
                />

                <FileUploadRoot
                  accept="application/pdf"
                  maxW="xl"
                  alignItems="stretch"
                  maxFiles={3}
                  onFileAccept={((files) => {
                    handleAcceptedFiles(files);
                  })}
                >
                  <FileUploadDropzone
                    label="Zertifikate Upload"

                  />
                  <FileUploadList clearable />
                </FileUploadRoot>

                <Flex gap={4}>

                  <Button size="sm" onClick={handleCareSaveChanges} disabled={loading} aria-label="Save Changes" colorScheme="blue">
                    {loading ? <Spinner size="sm" /> : 'Speichern'}
                  </Button>

                </Flex>
              </VStack>
            )}
          </>
        )
      }

    </Box>
  );
}
