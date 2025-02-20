'use client';

import { Input, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('Service');

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
        <Text textAlign="center" fontSize="sm">

          Bei Nutzung der Plattform hat der Serviceanbieter die Möglichkeit,
          seine Dienstleistung anzubieten und von interessierten Kunden gefunden zu werden.
          {' '}
          <br />
          <br />

          Kunden können Sie direkt über unsere Plattform per Telefon oder E-Mail kontaktieren.
          {' '}
          <br />
          <br />

          Um einen reibungslosen Ablauf zu gewährleisten, bitten wir Sie, sich innerhalb von 24 Stunden beim Kunden zu melden, um einen Termin zu vereinbaren.

          <br />
          <br />
          <strong> Ein Credit kostet CHF 5.00. </strong>
          <br />
          <br />

          Zur Begrüssung schenken wir Ihnen 10 Credits, damit Sie unsere Plattform unverbindlich ausprobieren können.

          Jedes Inserat entspricht einem Credit.
          <br />
          <br />

          <strong>Wir danken Ihnen herzlich für Ihre Unterstützung und freuen uns, Sie auf unserer Plattform willkommen zu heissen!</strong>

        </Text>
        <Input
          width="30%"
          placeholder={t('Kredit.Platzhalter')}
          value={amount}
          onChange={e => setAmount(e.target.value as unknown as number)}
          type="number"
          disabled={loading}
        />
        <Button colorScheme="blue" onClick={handleTopUp} loading={loading}>
          {t('Kredit.Button')}
        </Button>
      </VStack>

      {/* Toaster muss gerendert werden */}
      <Toaster />
    </>
  );
};

export default TopUpCredits;
