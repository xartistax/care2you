'use client'; // Error boundaries must be Client Components

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { logError } from '@/utils/sentryLogger';

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('Error');

  useEffect(() => {
    // Log the error to an error reporting service
    logError(error);
  }, [error]);

  return (
    <div className="grid h-screen place-content-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-9xl font-black text-gray-200">404</h1>

        <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {' '}
          { t('title') }
          {' '}
        </p>

        <p className="mt-4 text-gray-500">
          {' '}
          {t('description')}
          {' '}
        </p>

      </div>
    </div>
  );
}
