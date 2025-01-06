/* eslint-disable style/multiline-ternary */

'use client';

import { Box, createListCollection, Stack, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import ListElement from '@/components/ListElement';
import { Field } from '@/components/ui/field';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import type { serviceSchema } from '@/validations/serviceValidation';

import ListElementSkeleton from './ListElementSkeleton';

// Define schema for filters
const formSchema = z.object({
  priceRange: z.array(z.number().min(10, { message: 'Minimum price should be 10 CHF' })),
  priceType: z.enum(['all', 'fix', 'hourly']).default('all'), // Added priceType filter
});

type FormValues = z.infer<typeof formSchema>;
type ServiceType = z.infer<typeof serviceSchema>;

type ServiceListProps = {
  services: ServiceType[];
};

export default function ServiceList({ services }: ServiceListProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // 🔹 Determine the highest price dynamically from the fetched services
  const maxPrice = services.length > 0 ? Math.max(...services.map(s => s.price)) : 500;

  const {
    control,
    handleSubmit,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { priceRange: [10], priceType: 'all' }, // Default filters
  });

  const minPrice = watch('priceRange')[0]; // Watch price range
  const selectedPriceType = watch('priceType'); // Watch selected price type

  // ✅ Create a `ListCollection` using `createListCollection`
  const priceTypeCollection = createListCollection({
    items: [
      { value: 'all', label: 'Alle' },
      { value: 'fix', label: 'Fixpreis' },
      { value: 'hourly', label: 'Stundenpreis' },
    ],
  });

  // Filter services based on selection
  const filteredServices = services
    .filter(service => service.price >= minPrice!)
    .filter(service => selectedPriceType === 'all' || service.priceType === selectedPriceType);

  // eslint-disable-next-line no-console
  const onSubmit = (data: FormValues) => console.log('Selected Filters:', data);

  return (
    <Box>
      {/* Filter Section */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spaceY={6} align="flex-start">
          {/* Price Range Slider */}
          <Controller
            name="priceRange"
            control={control}
            render={({ field }) => (
              <Field label={`Preisbereich: ${field.value[0]} CHF`}>
                <Slider
                  width="full"
                  step={10}
                  min={10}
                  max={maxPrice} // ✅ Set highest price dynamically
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

          {/* Price Type Filter with `SelectRoot` */}
          <Controller
            name="priceType"
            control={control}
            render={({ field }) => (
              <Field label="Preis-Typ">
                <SelectRoot
                  collection={priceTypeCollection} // ✅ Fixed: Now using `createListCollection`
                  value={[field.value]}
                  onValueChange={(details) => {
                    const selected = details.items[0];
                    if (!selected) {
                      console.error('Invalid selection:', selected);
                      return;
                    }
                    field.onChange(selected.value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValueText placeholder="Bitte wählen..." />
                  </SelectTrigger>
                  <SelectContent>
                    {priceTypeCollection.items.map(item => (
                      <SelectItem key={item.value} item={item}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              </Field>
            )}
          />
        </Stack>
      </form>

      {/* Display Skeleton While Loading */}
      {isLoading ? (
        <Stack mt={8}>
          {[...Array(3)].map((_, index) => (
            <ListElementSkeleton key={index} />
          ))}
        </Stack>
      ) : (
        /* Display Filtered Services or No Results Message */
        <Stack mt={8}>
          {filteredServices.length > 0
            ? (
                filteredServices.map(service => (
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
