import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function SiteLogo() {
  const t = useTranslations('Header');
  return (

    <Link href="/welcome">
      <Image alt={t('description')} height={50} width={100} src="/LogoCare2you.png" />
    </Link>
  );
}
