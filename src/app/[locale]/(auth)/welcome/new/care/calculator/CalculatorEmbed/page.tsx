import Iframe from 'react-iframe';

const CalculatorEmbed = () => {
  return (
    <Iframe
      url="https://iaha-pflege-rechner.vercel.app/"
      width="100%"
      height="500px"
      styles={{ border: 'none' }}
      title="Calculator"
    />
  );
};

export default CalculatorEmbed;
