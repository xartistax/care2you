'use client';

import { Input, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Toaster, toaster } from '@/components/ui/toaster';
import { topUpCredits } from '@/utils/Helpers';

import { Button } from './ui/button';

type TopUpCreditsProps = {
  userId: string;
};

const TopUpCredits = ({ userId }: TopUpCreditsProps) => {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleTopUp = async () => {
    if (!amount || amount <= 0) {
      toaster.create({
        title: 'Invalid Amount',
        description: 'Bitte geben Sie mehr ein als null',
        type: 'error',
        meta: { closable: true },
      });
      return;
    }

    setLoading(true);

    try {
      // Simulate API request (replace with actual request)
      // await new Promise(resolve => setTimeout(resolve, 1500));

      await topUpCredits(userId, amount);

      toaster.create({
        title: 'Super!',
        description: `Du hast erfolgreich ${amount} Credits hinzugefügt!`,
        type: 'success',
        meta: { closable: true },
      });

      setAmount(0);
    } catch (error) {
      toaster.create({
        title: 'Error',
        description: `Bitte versuchen Sies später nochmals ${error}`,
        type: 'error',
        meta: { closable: true },
      });
    } finally {
      router.refresh();
    }

    setLoading(false);
  };

  return (
    <>

      <VStack spaceY={4} maxWidth="800px">
        <Text textAlign="center" fontSize="sm"> Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi praesentium incidunt facilis quisquam nam harum sed, eaque blanditiis amet reiciendis et provident quae minus eligendi repellendus nihil totam reprehenderit aspernatur?</Text>
        <Input
          width="30%"
          placeholder="Anzahl Credits eingeben"
          value={amount}
          onChange={e => setAmount(e.target.value as unknown as number)}
          type="number"
          disabled={loading}
        />
        <Button colorScheme="blue" onClick={handleTopUp} loading={loading}>
          Credits aufladen
        </Button>
      </VStack>

      {/* Toaster muss gerendert werden */}
      <Toaster />
    </>
  );
};

export default TopUpCredits;
