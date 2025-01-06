import { Box, Text, VStack } from '@chakra-ui/react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

import type { ServiceFormData } from '@/utils/Types';

import { Button } from './ui/button';

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
            {formData.serviceTitle}
            {' '}
          </Box>
          {' '}
          {formData.serviceTitle}
          {' '}
          wurde erfolgreich eingestellt.
        </Text>
      </VStack>
      <VStack>

        <Button mt={8} onClick={() => router.push('/welcome')}>
          zur Startseite
        </Button>
      </VStack>
    </VStack>
  );
};

export default ServiceSuccess;
