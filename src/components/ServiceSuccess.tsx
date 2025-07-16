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
    <VStack
      justifyContent="center"
      alignItems="center"
      height={{ base: 'auto', md: '70vh' }}
      px={{ base: 4, md: 0 }}
      py={{ base: 8, md: 0 }}
      width="100%"
      maxW="md"
      mx="auto"
    >
      <VStack textAlign="center">
        <CheckCircleIcon
          fontSize="small"
          color="green.500"
          className="size-8"
        />
        <Text fontSize={{ base: '2xl', md: 'xl' }} fontWeight="bold">
          Vielen Dank
        </Text>
        <Text fontSize={{ base: 'md', md: 'sm' }}>
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
      <VStack width="100%">
        <Button
          mt={{ base: 6, md: 8 }}
          width={{ base: '100%', md: 'auto' }}
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
