'use client';

import { Box } from '@chakra-ui/react';

import CalculatorEmbed from './CalculatorEmbed/page';

export default function CareCalculator() {
  // const t = useTranslations('Welcome');

  return (
    <Box

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
