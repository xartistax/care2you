'use client';
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react';

const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: `'Figtree', sans-serif` },
        body: { value: `'Figtree', sans-serif` },
      },
    },
  },
});

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>

      {props.children}
    </ChakraProvider>

  );
}
