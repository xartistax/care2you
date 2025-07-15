/* eslint-disable style/multiline-ternary */
import { Box, Link, Spinner, Table, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import { categoryTypeRetriever } from '@/utils/Helpers';
import { logError, logMessage, logWarning } from '@/utils/sentryLogger';
import { serviceSchema } from '@/validations/serviceValidation';

import { Switch } from './ui/switch';

const ServiceArraySchema = z.array(serviceSchema);

export default function UserServices({ userId }: { userId: string }) {
  const [services, setServices] = useState<z.infer<typeof ServiceArraySchema>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingServiceId, setLoadingServiceId] = useState<string | null>(null); // Track which service is updating

  useEffect(() => {
    const fetchServices = async () => {
      logMessage('UserServices: Fetching user services', { userId });
      try {
        const response = await fetch('/api/user-services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
          logWarning('UserServices: Failed to fetch services', { userId, status: response.status });
          throw new Error('Failed to fetch services');
        }

        const data = await response.json();
        setServices(ServiceArraySchema.parse(data));
        logMessage('UserServices: Services fetched and parsed successfully', { userId, count: data.length });
      } catch (err: any) {
        logError(err, { userId, location: 'UserServices fetchServices' });
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [userId]);

  const handleSwitchChange = async (serviceId: string, newStatus: boolean) => {
    setLoadingServiceId(serviceId); // Set loading state
    logMessage('UserServices: Attempting to update service status', { serviceId, newStatus });
    try {
      const response = await fetch('/api/update-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId, newStatus }),
      });

      if (response.ok) {
        setServices(prevServices =>
          prevServices.map(service =>
            service.internalId === serviceId
              ? { ...service, status: newStatus ? 'active' : 'inactive' }
              : service,
          ),
        );
        logMessage('UserServices: Service status updated successfully', { serviceId, newStatus });
      } else {
        logWarning('UserServices: Failed to update service status', { serviceId, newStatus, status: response.status });
      }
    } catch (error) {
      logError(error, { serviceId, newStatus, location: 'UserServices handleSwitchChange' });
    } finally {
      setLoadingServiceId(null); // Remove loading state
    }
  };

  if (loading) {
    return (
      <Box textAlign="start" py={4}>
        <Text fontSize="sm" color="gray.500">Services werden geladen...</Text>
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
          <Link href="/de/welcome/new/service">Erstellen Sie jetzt Ihren ersten Service</Link>
        </Text>
      </Box>
    );
  }

  return (
    <Table.Root size="sm">
      <Table.Body>
        {services.map((service) => {
          const isInactive = service.status === 'inactive';
          const category = categoryTypeRetriever(service.category as string);

          return (
            <Table.Row key={service.internalId} bg={isInactive ? 'gray.100' : 'transparent'}>
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
                {loadingServiceId === service.internalId ? (
                  <Spinner size="sm" color="blue.500" />
                ) : (
                  <Switch
                    checked={!isInactive}
                    onCheckedChange={details => handleSwitchChange(service.internalId, details.checked)}
                    disabled={loadingServiceId === service.internalId} // Disable while updating
                  />
                )}
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
}
