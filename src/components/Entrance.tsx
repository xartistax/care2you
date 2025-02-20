'use client';
import { Box, Button, Flex, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

export default function Entrance({ title, linkTo, linkTitle }: { title: string; text?: string; linkTo: string; linkTitle: string }) {
  const router = useRouter();
  return (
    <Flex
      // Light background to contrast the box
      minHeight="100vh" // Full viewport height
      align="center" // Vertical centering
      justify="center" // Horizontal centering
      p={4} // Padding for smaller screens
    >
      <Box
        bg="white"

        maxWidth="800px"
        width="100%" // Responsive width
        p={8}
      >
        <VStack>
          <Text fontSize="3xl" fontWeight="bold">
            {title}
          </Text>
          <Text fontSize="sm" textAlign="center">

            Hier haben Sie die Möglichkeit, sich als Kunde, Dienstleistungsanbieter oder private Pflegeperson zu registrieren.
            <br />

            Als Kunde finden Sie zahlreiche Dienstleistungen, übersichtlich kategorisiert nach Art der Dienstleistung und Distanz zu Ihrem Wohnort.
            So können Sie schnell und einfach passende Angebote in Ihrer Nähe entdecken.
            {' '}
            <br />
            <br />

            Als Dienstleister (Service) können Sie Ihre Dienstleistungen auf unserer Plattform anbieten und direkt mit Kunden Termine vereinbaren.
            Erstellen Sie Ihr Inserat einfach und unkompliziert – wir bieten Ihnen die ideale Plattform, um Ihre Reichweite zu erhöhen und neue Kunden zu gewinnen.
            <br />
            <br />
            Als private Pflegeperson (Care) haben Sie die Möglichkeit, sich in unserem Pool zu registrieren und Ihre Bewerbung direkt auf der Plattform hochzuladen.
            So werden Sie von potenziellen Auftraggebern gefunden und können flexibel Pflegeeinsätze übernehmen.
            <br />
            <br />
            <strong> Wir freuen uns, Sie auf unserer Plattform begrüssen zu dürfen! </strong>

          </Text>
          <Button
            mt={12}
            colorScheme="teal"
            size="md"
            onClick={() => router.push(`/de${linkTo}`)}
          >
            {linkTitle}
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
}
