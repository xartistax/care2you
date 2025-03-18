import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { createListCollection, HStack, Input, Stack } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '@/components/ui/select';
import type { OnboardingState } from '@/contexts/OnboardingContext';
import { AppConfig } from '@/utils/AppConfig';
import { roleLabels } from '@/utils/Helpers';

export function OnBoardingFormDefault({
  formState,
  handleNext,
  handleRoleSelect,
  handleInputChange,
  handleSelectChange,
}: {
  formState: OnboardingState; // Update to match the actual structure
  handleNext: () => void;
  handleRoleSelect: (role: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (selected?: { value: string; label: string }) => void;
  roles: string[];
}) {
  const t = useTranslations('OnBoarding');
  const collection = createListCollection({
    items: [
      { value: '0', label: t('Allgemein.Anrede.Maskulin') },
      { value: '1', label: t('Allgemein.Anrede.Feminim') },
    ],
  });
  const roleToRemove = 'admin';
  const system_roles = AppConfig.userRoles;
  const roles = system_roles.filter(item => item !== roleToRemove);

  return (
    <>
      <Stack direction="row" align="stretch" w="100%" h={85}>
        <FormControl flex="1">
          <FormLabel fontSize="small" fontWeight="bold">
            {' '}
            {t('Allgemein.Rolle.Feld')}
            {' '}
            *
            {' '}
          </FormLabel>
          <Stack direction="row" align="stretch" w="100%">
            {' '}
            {/* Add spacing here */}
            {roles.map(role => (
              <Button
                key={role}
                onClick={() => handleRoleSelect(role)}
                loading={false}
                bg={formState.data.privateMetadata.role === role ? 'black' : 'white'} // Rot für die aktuell ausgewählte Rolle
                color={formState.data.privateMetadata.role === role ? 'white' : 'black'} // Weißer Text auf rotem Hintergrund
                variant={formState.data.privateMetadata.role === role ? 'solid' : 'outline'} // Visuelle Hervorhebung für die aktuelle Rolle
                _hover={{
                  bg: formState.data.privateMetadata.role === role ? 'black' : 'white', // Kein Hover-Effekt für ausgewählte Rolle
                }}
              >

                {roleLabels[role] || role}
              </Button>

            ))}
          </Stack>
        </FormControl>
      </Stack>

      <Stack h={85} align="stretch" w="100%">
        <FormControl flex="1">
          <FormLabel fontSize="small" fontWeight="bold" width="100%">

            {
              t('Allgemein.Anrede.Feld')
            }
            {' '}
            *

          </FormLabel>

          <SelectRoot
            width="100%"
            collection={collection}
            value={String(formState.data.privateMetadata.gender) ? [String(formState.data.privateMetadata.gender)] : []} // Use only the string value
            onValueChange={(details) => {
              const selected = details.items[0]; // Get the first selected item
              if (!selected) {
                console.error('Invalid selection:', selected);
                return;
              }
              handleSelectChange(selected); // ✅ Pass only the string value
            }}
          >
            <SelectTrigger>
              <SelectValueText placeholder={t('Allgemein.Anrede.Platzhalter')} />
            </SelectTrigger>
            <SelectContent>
              {collection.items.map(item => (
                <SelectItem key={item.value} item={item}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>

        </FormControl>
      </Stack>

      <Stack h={85} align="stretch" w="100%">
        <FormControl flex="1">
          <FormLabel fontSize="small" fontWeight="bold">
            {t('Allgemein.Vorname.Feld')}
            {' '}
            *
          </FormLabel>
          <Input
            disabled
            type="text"
            width="100%"
            name="firstName"
            value={formState.data.firstName || ''}
            onChange={handleInputChange}
            placeholder={t('Allgemein.Vorname.Platzhalter')}
          />
        </FormControl>
      </Stack>

      <Stack h={85} align="stretch" w="100%">
        <FormControl flex="1">
          <FormLabel fontSize="small" fontWeight="bold">
            {t('Allgemein.Nachname.Feld')}
            {' '}
            *
          </FormLabel>
          <Input
            placeholder={t('Allgemein.Nachname.Platzhalter')}
            disabled
            type="text"
            width="100%"
            name="lastName"
            value={formState.data.lastName || ''}
            onChange={handleInputChange}
          />
        </FormControl>
      </Stack>

      <Stack h={85} align="stretch" w="100%">
        <FormControl flex="1">
          <FormLabel fontSize="small" fontWeight="bold">
            {' '}
            {t('Allgemein.E-Mail.Feld')}
            {' '}
            *
            {' '}
          </FormLabel>
          <Input
            type="email"
            disabled
            width="100%"
            name="email"
            placeholder={t('Allgemein.E-Mail.Platzhalter')}
            value={formState.data.email || ''}
            onChange={handleInputChange}
          />
        </FormControl>
      </Stack>

      <Stack h={85} align="stretch" w="100%">
        <FormControl flex="1">
          <FormLabel fontSize="small" fontWeight="bold">
            {' '}
            {t('Allgemein.Telefon.Feld')}
            {' '}
            *
            {' '}
          </FormLabel>

          <Input
            type="tel"
            width="100%"
            name="phone"
            value={String(formState?.data.privateMetadata?.phone || '')}
            onChange={handleInputChange}
            placeholder={t('Allgemein.Telefon.Platzhalter')}
          />
        </FormControl>

      </Stack>

      <Stack h={85} align="stretch" w="100%">

        <HStack>

          <FormControl flex="3">
            <FormLabel fontSize="small" fontWeight="bold">
              {t('Allgemein.Strasse.Feld')}
              {' '}
              *
            </FormLabel>

            <Input
              type="text"
              width="100%"
              name="street"
              value={String(formState?.data.privateMetadata?.street || '')}
              placeholder={t('Allgemein.Strasse.Platzhalter')}
              onChange={handleInputChange}

            />
          </FormControl>

          <FormControl flex="1">
            <FormLabel fontSize="small" fontWeight="bold">
              {t('Allgemein.Strasse.Nr')}
              {' '}
              *
            </FormLabel>

            <Input
              type="text"
              width="100%"
              name="streetnumber"
              value={String(formState?.data.privateMetadata?.streetnumber || '')}
              placeholder={t('Allgemein.Strasse.Nr')}
              onChange={handleInputChange}
            />
          </FormControl>

        </HStack>

      </Stack>

      <Stack h={85} align="stretch" w="100%">

        <HStack>

          <FormControl flex="1">
            <FormLabel fontSize="small" fontWeight="bold">
              {t('Allgemein.Postleitzahl.Feld')}
              {' '}
              *
            </FormLabel>

            <Input
              type="text"
              width="100%"
              name="plz"
              value={String(formState?.data.privateMetadata?.plz || '')}
              placeholder={t('Allgemein.Postleitzahl.Platzhalter')}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl flex="3">
            <FormLabel fontSize="small" fontWeight="bold">
              {t('Allgemein.Ortschaft.Feld')}
              {' '}
              *
            </FormLabel>

            <Input
              type="text"
              width="100%"
              name="location"
              value={String(formState?.data.privateMetadata?.location || '')}
              placeholder={t('Allgemein.Ortschaft.Platzhalter')}
              onChange={handleInputChange}
            />
          </FormControl>

        </HStack>

      </Stack>

      <Stack direction="row" justifyContent="flex-end" w="100%">
        <Button
          onClick={handleNext}
          colorScheme="blue"
          size="md" // Control button size
        >
          {t('Allgemein.Button')}
        </Button>
      </Stack>

    </>
  );
}
