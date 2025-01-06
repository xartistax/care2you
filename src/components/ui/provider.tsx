'use client';

import { Theme } from '@chakra-ui/react';

import { ColorModeProvider } from '@/components/ui/color-mode';

type ForcedColorModeProps = {
  children: React.ReactNode;
};

export const ForcedColorMode = ({ children }: ForcedColorModeProps) => {
  return (
    <ColorModeProvider forcedTheme="dark">
      <Theme appearance="dark">{children}</Theme>
    </ColorModeProvider>
  );
};
