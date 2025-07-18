'use client';
import { Box, Button, Flex, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import { logMessage } from '@/utils/sentryLogger';

export default function Entrance({ title, linkTo, linkTitle }: { title: string; text?: string; linkTo: string; linkTitle: string }) {
  const router = useRouter();
  return (
    <Flex
      // Light background to contrast the box
      minHeight="100vh" // Full viewport height
      align="center" // Vertical centering
      justify="center" // Horizontal centering
      p={{ base: 4, md: 8 }} // Padding for smaller screens
    >
      <Box
        bg="white"

        maxW={{ base: '100%', md: '800px' }}
        w="100%" // Responsive width
        p={{ base: 4, md: 8 }}
      >
        <VStack>
          <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" textAlign="center">
            {title}
          </Text>

          <VStack>
            <Text fontSize="sm" textAlign="center">
              Hier haben Sie die Möglichkeit, sich als Kunde, Dienstleistungsanbieter oder private Pflegeperson zu registrieren.
            </Text>
            <Text fontSize="sm" fontWeight="bold">
              Als Kunde
            </Text>
            <Text fontSize="sm" textAlign="center">
              Finden Sie zahlreiche Dienstleistungen, übersichtlich kategorisiert nach Art der Dienstleistung und Distanz zu Ihrem Wohnort. So können Sie schnell und einfach passende Angebote in Ihrer Nähe entdecken.
            </Text>
            <Text fontSize="sm" fontWeight="bold">
              Als Dienstleister
            </Text>
            <Text fontSize="sm" textAlign="center">
              Bieten Sie Ihre Dienstleistungen auf unserer Plattform an und vereinbaren Sie direkt Termine mit Kunden. Erstellen Sie Ihr Inserat einfach und unkompliziert – wir bieten Ihnen die ideale Plattform, um Ihre Reichweite zu erhöhen und neue Kunden zu gewinnen.
            </Text>
            <Text fontSize="sm" fontWeight="bold">
              Als private Pflegeperson
            </Text>
            <Text fontSize="sm" textAlign="center">
              Registrieren Sie sich in unserem Pool und laden Sie Ihre Bewerbung direkt auf der Plattform hoch. Als Teil des IAHA-Pools werden Sie flexibel für passende Einsätze eingesetzt.
            </Text>
            <Text fontSize="sm" textAlign="center">
              Wir freuen uns, Sie auf unserer Plattform begrüssen zu dürfen!
            </Text>

          </VStack>

          <Button
            mt={{ base: 6, md: 12 }}
            colorScheme="teal"
            size="md"
            w={{ base: 'full', md: 'auto' }}
            onClick={() => {
              logMessage('Entrance: Navigation button clicked', { file: 'Entrance.tsx', linkTo });
              router.push(`/de${linkTo}`);
            }}
          >
            {linkTitle}
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
}
