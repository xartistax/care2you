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
        { t('Pflegerechner.Text') }
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
