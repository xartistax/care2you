/* eslint-disable style/multiline-ternary */
'use client';
import { Box, SelectContent, SelectItem, SelectTrigger, SelectValueText, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

import ListElement from '@/components/ListElement';
import { Field } from '@/components/ui/field';
import { logMessage, logWarning } from '@/utils/sentryLogger';
import { categoriesList } from '@/utils/Types';
import type { serviceSchema } from '@/validations/serviceValidation';

import ListElementSkeleton from './ListElementSkeleton';
import { SelectRoot } from './ui/select';

// Schema for form validation
const _formSchema = z.object({
  distanceRange: z.array(z.number().min(1, { message: 'Minimum distance should be 1 km' })), // Slider filter
  category: z.string().nullable(), // Category select
});

type FormValues = z.infer<typeof _formSchema>;
type ServiceListProps = {
  services: (z.infer<typeof serviceSchema> & { companyTitle?: string | null })[];
};

export default function ServiceList({ services }: ServiceListProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: { distanceRange: [10], category: null },
  });

  const selectedCategory = watch('category');

  const handleSelectChange = (
    field: { onChange: (value: string | null) => void; value: string | null },
    selected: { value: string; label: string } | undefined,
  ) => {
    if (selected) {
      logMessage('ServiceList: Category selected', { file: 'ServiceList.tsx', category: selected.value });
      field.onChange(selected.value);
    } else {
      logWarning('ServiceList: Invalid category selection', { file: 'ServiceList.tsx', selected });
      field.onChange(null);
    }
  };

  // Filtering services based on category
  const filteredServices = services.filter((service) => {
    return !selectedCategory || selectedCategory === 'all' || service.category === selectedCategory;
  });

  return (
    <Box position="relative" paddingTop={100}>
      {/* Filter Section */}
      <Box typeof="form" position="absolute" top={0} left={0} width="100%" onSubmit={handleSubmit(() => {})}>
        <Stack spaceY={6} align="center" direction="row" width="100%">

          {/* Entfernung Slider */}
          {/* <Box width="100%">
            <Controller
              name="distanceRange"
              control={control}
              render={({ field }) => (
                <Field label={`Entfernung: ${field.value[0]} km`} width="100%">
                  <Slider
                    width="full"
                    step={1}
                    min={1}
                    max={100}
                    name={field.name}
                    value={field.value}
                    onValueChange={({ value }) => field.onChange(value)}
                  />
                </Field>
              )}
            />
          </Box> */}

          {/* Category Select */}
          <Box width="100%">

            <Text> Sie können zuerst die gewünschte Kategorie auswählen und dann die passende Dienstleistung filtern. Anschliessend können Sie den Dienstleister direkt über Telefon, Homepage oder die Plattform kontaktieren. Der Dienstleister wird sich umgehend bei Ihnen melden. </Text>
            <br />
            <Controller
              name="category"
              control={control}
              render={({ field }) => (

                <Field label="Kategorie" width="48%">
                  <SelectRoot
                    value={field.value ? [field.value] : []} // FIXED: Ensures selected category is displayed
                    onValueChange={(details) => {
                      const selected = details.items[0] ?? null;
                      handleSelectChange(field, selected ? { value: selected.value, label: selected.label } : undefined);
                    }}
                    collection={categoriesList}
                  >
                    <SelectTrigger>
                      <SelectValueText placeholder="Kategorie auswählen...">
                        {field.value
                          ? categoriesList.items.find(category => category.value === field.value)?.label
                          : 'Kategorie auswählen...'}
                      </SelectValueText>
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesList.items.map(category => (
                        <SelectItem key={category.value} item={category}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>

                </Field>
              )}
            />
          </Box>

        </Stack>
      </Box>

      {isLoading ? (
        <Stack mt={8}>
          {[...Array(3)].map(() => <ListElementSkeleton key={uuidv4()} />)}
        </Stack>
      ) : (
        <Stack mt={8}>
          {filteredServices.length > 0 ? (
            filteredServices.map(service => <ListElement key={service.id} formData={service} />)
          ) : (
            <Text fontSize="sm" color="gray.500" textAlign="center" mt={20}>
              ❌ Keine passenden Services gefunden. Bitte passe die Filter an.
            </Text>
          )}
        </Stack>
      )}
    </Box>
  );
}
