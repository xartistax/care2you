'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="border-t border-gray-100 py-8 text-center text-xs">
      {`© Copyright ${new Date().getFullYear()} ` }

      <a
        href="https://www.iaha.ch"
        className="text-blue-700 hover:border-b hover:border-blue-700"
      >
        {t('copyright')}
      </a>

    </footer>
  );
}
