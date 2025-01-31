'use client';

import { Box, Link, Table, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import { categoryTypeRetriever } from '@/utils/Helpers';
import { serviceSchema } from '@/validations/serviceValidation'; // Assuming you have a serviceSchema for validation

import { Switch } from './ui/switch'; // Assuming you have a Switch component

// Define the Zod schema for an array of services
const ServiceArraySchema = z.array(serviceSchema);

export default function UserServices({ userId }: { userId: string }) {
  const [services, setServices] = useState<z.infer<typeof ServiceArraySchema>>([]); // This infers the type from the Zod schema

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/user-services', {
          method: 'POST', // Use POST method
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId, // Pass the userId in the body of the request
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();

        try {
          const validatedServices = ServiceArraySchema.parse(data);
          setServices(validatedServices);
        } catch (validationError) {
          console.error(validationError); // Log validation error for debugging
          throw new Error('Invalid data format');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [userId]);

  if (loading) {
    return (
      <Box textAlign="start" py={4}>
        <Text fontSize="sm" color="gray.500">Services werden geladen</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={10}>
        <Text fontSize="sm" color="red.500">{error}</Text>
      </Box>
    );
  }

  if (services.length === 0) {
    return (
      <Box textAlign="start" py={4}>
        <Text fontSize="sm" color="gray.500">
          Sie haben noch keine Services aufgegeben!
          {' '}
          <Link href="/de/welcome/new/service"> Erstellen Sie jetzt ihren ersten Service </Link>
        </Text>
      </Box>
    );
  }

  // Function to handle the toggle of the switch
  const handleSwitchChange = async (serviceId: string, newStatus: boolean) => {
    // eslint-disable-next-line no-console
    console.log('Toggling status for serviceId', serviceId, 'to', newStatus ? 'active' : 'inactive');

    // Send a PATCH request to update the service status in the database
    try {
      const response = await fetch('/api/update-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId,
          newStatus,
        }),
      });

      if (response.ok) {
        // Optionally, update the local state after the API call succeeds
        const updatedServices = services.map((service) => {
          if (service.internalId === serviceId) {
            return { ...service, status: newStatus ? 'active' : 'inactive' }; // Toggle status
          }
          return service;
        });
        setServices(updatedServices);
      } else {
        console.error('Failed to update service status');
      }
    } catch (error) {
      console.error('Error occurred while updating status:', error);
    }
  };

  return (
    <Table.Root size="sm">
      <Table.Body>
        {services.map((service) => {
          const isInactive = service.status === 'inactive';
          const category = categoryTypeRetriever(service.category as string);

          return (
            <Table.Row
              key={service.internalId}
              bg={isInactive ? 'gray.100' : 'transparent'}
            >
              <Table.Cell>
                <Link href={`/de/welcome/new/service/single/${service.internalId}`}>
                  {service.title}
                </Link>
              </Table.Cell>
              <Table.Cell>{category}</Table.Cell>
              <Table.Cell>
                {service.price}
                {' '}
                {service.priceType}
              </Table.Cell>
              <Table.Cell textAlign="end">
                <Switch
                  checked={!isInactive} // The switch is "checked" when the status is 'active' (NOT inactive)
                  onCheckedChange={(details) => {
                    handleSwitchChange(service.internalId, details.checked); // Extract checked value from details
                  }}
                />
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
}
