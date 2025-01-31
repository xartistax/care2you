import { Heading, Text } from '@chakra-ui/react';
import Iframe from 'react-iframe';

const CalculatorEmbed = () => {
  return (
    <>

      <Heading as="h1" size="2xl">

        Care2You Pflegerechner
      </Heading>

      <Text mb={10} fontSize="sm">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aspernatur eos quasi ducimus excepturi architecto, eius optio magni voluptatibus nemo illum placeat voluptas earum, beatae laborum. Ducimus aut tempore debitis dignissimos?
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
