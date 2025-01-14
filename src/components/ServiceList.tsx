/* eslint-disable style/multiline-ternary */
'use client';
import { Box, createListCollection, SelectContent, SelectItem, SelectTrigger, SelectValueText, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

import ListElement from '@/components/ListElement';
import { Field } from '@/components/ui/field';
import { Slider } from '@/components/ui/slider';
import type { serviceSchema } from '@/validations/serviceValidation';

import ListElementSkeleton from './ListElementSkeleton';
import { SelectRoot } from './ui/select';

// Define schema for filters
// eslint-disable-next-line unused-imports/no-unused-vars
const formSchema = z.object({
  distanceRange: z.array(z.number().min(1, { message: 'Minimum distance should be 1 km' })), // Slider filter
  category: z.string().nullable(), // Category select
});

type FormValues = z.infer<typeof formSchema>;

// type ServiceType = {
//   id: string;
//   name: string;
//   description: string;
//   location: {
//     number: string;
//     street: string;
//     city: string;
//     postalCode: string;
//   };
//   workingHours: Record<string, { enabled: boolean; hours: [string, string] }>;
//   image?: string;
//   price: number;
//   priceType: string;
//   userId: string; // Ensure these fields are present
//   calendly: string; // Ensure these fields are present
// };

// type ServiceListProps = {
//   services: ServiceType[];
// };

type ServiceListProps = {
  services: z.infer<typeof serviceSchema>[];
};

export default function ServiceList({ services }: ServiceListProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const {
    control,
    handleSubmit,
  // _watch,
  } = useForm<FormValues>({
    defaultValues: { distanceRange: [10], category: null }, // Default for Entfernung and category
  });

  // const selectedDistance = watch('distanceRange')[0];
  // const selectedCategory = watch('category');

  const categories = createListCollection({
    items: [
      { value: '0', label: 'Kategorie 1' },
      { value: '1', label: 'Kategorie 2' },
      { value: '2', label: 'Kategorie 3' },
    ],
  });

  // Dummy function to handle submission
  const onSubmit = (data: FormValues) => {
    // eslint-disable-next-line no-console
    console.log('Selected Filters:', data);
  };

  const handleSelectChange = (field: { onChange: (value: string | null) => void }, selected: { value: string; label: string } | undefined) => {
    if (selected) {
      field.onChange(selected.value);
    } else {
      console.error('Invalid selection:', selected);
      field.onChange(null);
    }
  };

  return (
    <Box position="relative" paddingTop={100}>
      {/* Filter Section */}
      <Box typeof="form" position="absolute" top={0} left={0} width="100%" onSubmit={handleSubmit(onSubmit)}>
        <Stack spaceY={6} align="center" direction="row" width="100%">
          {/* Entfernung Slider */}
          <Box width="100%">

            <Controller
              name="distanceRange"
              control={control}
              render={({ field }) => (
                <Field label={`Entfernung: ${field.value[0]} km`} width="100%">
                  <Slider
                    width="full"
                    step={1}
                    min={1}
                    max={100} // Set max range to 100 km
                    onFocusChange={({ focusedIndex }) => {
                      if (focusedIndex !== -1) {
                        return;
                      }
                      field.onBlur();
                    }}
                    name={field.name}
                    value={field.value}
                    onValueChange={({ value }) => field.onChange(value)}
                  />
                </Field>
              )}
            />

          </Box>

          <Box width="100%">
            {/* Category Select */}

            <Box position="absolute" top={0} width="100%">
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Field label="Kategorie" width="48%">
                    <SelectRoot
                      value={field.value ? [field.value] : []}
                      onValueChange={(details) => {
                        const selected = details.items[0]; // Get the first selected item
                        handleSelectChange(field, selected); // Pass `field` and the selected item
                      }}
                      collection={categories} // Add the collection prop here
                    >
                      <SelectTrigger>
                        <SelectValueText placeholder="Kategorie auswählen...">
                          {field.value
                            ? categories.items.find(category => category.value === field.value)?.label
                            : 'Kategorie auswählen...'}
                        </SelectValueText>
                      </SelectTrigger>
                      <SelectContent>
                        {categories.items.map(category => (
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
          </Box>

        </Stack>
      </Box>

      {isLoading ? (
        <Stack mt={8}>
          {[...Array(3)].map((_, _index) => (
            <ListElementSkeleton key={uuidv4()} />
          ))}
        </Stack>
      ) : (
        /* Display Dummy Services or No Results Message */
        <Stack mt={8}>
          {services.length > 0
            ? (
                services.map(service => (
                  <ListElement key={service.id} formData={service} />
                ))
              )
            : (
                <Text fontSize="lg" color="gray.500" textAlign="center" mt={6}>
                  ❌ Keine passenden Services gefunden. Bitte passe die Filter an.
                </Text>
              )}
        </Stack>
      )}
    </Box>
  );
}
