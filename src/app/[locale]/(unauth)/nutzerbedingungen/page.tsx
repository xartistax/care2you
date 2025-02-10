'use client';

import { Box, Heading, Text } from '@chakra-ui/react';

export default function Nutzerbestimmungen() {
  return (
    <Box
      p={8}
      bg="white"
      borderRadius="lg"
      maxWidth="800px"
      width="100%"
      margin="0 auto"
    >
      <Heading as="h1" size="xl" mb={4}>
        Nutzungsbestimmungen von Care2You
      </Heading>

      <Text mb={4}>
        1.
        {' '}
        <strong>Allgemeines:</strong>
        {' '}
        Diese Nutzungsbestimmungen regeln die Nutzung der Plattform Care2You durch registrierte und nicht-registrierte Nutzer. Mit der Nutzung unserer Dienste erklären Sie sich mit diesen Bestimmungen einverstanden.
      </Text>

      <Text mb={4}>
        2.
        {' '}
        <strong>Registrierung und Konto:</strong>
        {' '}
        Um bestimmte Funktionen von Care2You nutzen zu können, müssen Sie ein Benutzerkonto erstellen. Sie sind verpflichtet, bei der Registrierung korrekte und vollständige Angaben zu machen und Ihre Zugangsdaten vertraulich zu behandeln.
      </Text>

      <Text mb={4}>
        3.
        {' '}
        <strong>Leistungen von Care2You:</strong>
        {' '}
        Care2You bietet eine Plattform zur Vermittlung von Dienstleistungen zwischen Anbietern und Nutzern. Care2You ist nicht Vertragspartei der zwischen Nutzern geschlossenen Vereinbarungen und übernimmt keine Haftung für die erbrachten Dienstleistungen.
      </Text>

      <Text mb={4}>
        4.
        {' '}
        <strong>Pflichten der Nutzer:</strong>
        {' '}
        Die Plattform darf nicht für illegale oder unzulässige Zwecke genutzt werden. Die Nutzer verpflichten sich, keine falschen Informationen bereitzustellen oder Rechte Dritter zu verletzen. Jegliche missbräuchliche Nutzung der Plattform führt zur sofortigen Sperrung des Kontos.
      </Text>

      <Text mb={4}>
        5.
        {' '}
        <strong>Zahlungsbedingungen:</strong>
        {' '}
        Alle Zahlungen über Care2You erfolgen sicher über unsere Plattform. Etwaige Gebühren werden vor Abschluss eines Vertrags klar kommuniziert. Rückerstattungen richten sich nach den individuellen Vereinbarungen zwischen den Nutzern.
      </Text>

      <Text mb={4}>
        6.
        {' '}
        <strong>Haftungsausschluss:</strong>
        {' '}
        Care2You übernimmt keine Haftung für die Richtigkeit der von Nutzern bereitgestellten Inhalte oder für Schäden, die aus der Nutzung der Plattform entstehen, es sei denn, diese resultieren aus grober Fahrlässigkeit oder Vorsatz seitens Care2You.
      </Text>

      <Text mb={4}>
        7.
        {' '}
        <strong>Datenschutz:</strong>
        {' '}
        Der Schutz Ihrer persönlichen Daten ist uns wichtig. Informationen zur Erhebung und Nutzung Ihrer Daten finden Sie in unserer Datenschutzerklärung.
      </Text>

      <Text mb={4}>
        8.
        {' '}
        <strong>Änderungen der Nutzungsbestimmungen:</strong>
        {' '}
        Care2You behält sich das Recht vor, diese Nutzungsbestimmungen jederzeit zu ändern. Über wesentliche Änderungen werden Sie rechtzeitig informiert. Die fortgesetzte Nutzung der Plattform nach Änderungen gilt als Zustimmung zu den neuen Bestimmungen.
      </Text>

      <Text mb={4}>
        9.
        {' '}
        <strong>Anwendbares Recht und Gerichtsstand:</strong>
        {' '}
        Es gilt das Recht der Schweiz. Gerichtsstand für alle Streitigkeiten aus der Nutzung der Plattform ist, soweit gesetzlich zulässig, der Sitz von Care2You.
      </Text>

      <Text mt={6}>
        <strong>Kontakt:</strong>
        <br />
        Care2You GmbH
        <br />
        [Adresse]
        <br />
        [E-Mail-Adresse]
        <br />
        [Telefonnummer]
      </Text>
    </Box>
  );
}
