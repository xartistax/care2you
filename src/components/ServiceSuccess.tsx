import { Box, Text, VStack } from '@chakra-ui/react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import type { z } from 'zod';

import { logMessage } from '@/utils/sentryLogger';
import type { serviceSchema } from '@/validations/serviceValidation';

import { Button } from './ui/button';

type ServiceFormData = z.infer<typeof serviceSchema>;

type ServiceSuccessProps = {
  formData: ServiceFormData;
};

const ServiceSuccess: React.FC<ServiceSuccessProps> = ({ formData }) => {
  const router = useRouter();
  return (
    <VStack justifyContent="center" alignItems="center" height="70vh">
      <VStack textAlign="center">
        <CheckCircleIcon fontSize="small" color="green.500" className="size-8" />
        <Text fontSize="xl" fontWeight="bold">
          Vielen Dank
        </Text>
        <Text fontSize="sm">
          Der Service
          {' '}
          <Box as="span" fontWeight="bold">
            {' '}
            {formData.title}
            {' '}
          </Box>
          {' '}
          wurde erfolgreich eingestellt.
        </Text>
      </VStack>
      <VStack>

        <Button
          mt={8}
          onClick={() => {
            logMessage('ServiceSuccess: Navigation button clicked', { file: 'ServiceSuccess.tsx', to: '/welcome' });
            router.push('/welcome');
          }}
        >
          zur Startseite
        </Button>
      </VStack>
    </VStack>
  );
};

export default ServiceSuccess;
