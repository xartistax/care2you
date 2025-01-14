'use client';

import { Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import CalculatorEmbed from './CalculatorEmbed/page';

export default function CareCalculator() {
  const [isVisible, setIsVisible] = useState(false);
  // const t = useTranslations('Welcome');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Box
      className={`transition-opacity duration-1000 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      p={8}
      bg="white"
      borderRadius="lg"
      maxWidth="800px"
      margin="0 auto"
    >
      <CalculatorEmbed />
    </Box>
  );
}
