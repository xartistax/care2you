import { Heading, Text } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import Iframe from 'react-iframe';

const CalculatorEmbed = () => {
  const t = useTranslations('Client');
  return (
    <>

      <Heading as="h1" size="2xl">

        { t('Pflegerechner.Titel') }
      </Heading>

      <Text mb={10} fontSize="sm">

        Bitte beantworten Sie die neun Fragen, um eine Einschätzung Ihres Pflegebedarfs sowie die entsprechende Entlohnung zu erhalten. Sobald Ihre Angaben eingegangen sind, werden wir diese prüfen und uns zeitnah bei Ihnen melden.
        {' '}
        <br />
        <br />
        {' '}
        Bei Fragen stehen wir Ihnen jederzeit gerne zur Verfügung.

        Vielen Dank für Ihr Vertrauen!
      </Text>
      <Iframe
        url="https://iaha-pflege-rechner.vercel.app/"
        width="100%"
        height="500px"
        styles={{ border: 'none' }}
        title="Calculator"
      />
    </>

  );
};

export default CalculatorEmbed;
