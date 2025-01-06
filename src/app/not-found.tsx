'use client';

import { useTranslations } from 'next-intl';

// Error boundaries must be Client Components

export default function NotFound() {
  const t = useTranslations('NotFound');

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
