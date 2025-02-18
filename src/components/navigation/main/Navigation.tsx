import { currentUser } from '@clerk/nextjs/server';
import { ClipboardIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function MainNavigation() {
  // const t = useTranslations('RootLayout');
  const user = await currentUser();
  if (!user) {
    redirect('/good-bye');
  }
  const role = String(user.privateMetadata.role);

  switch (role) {
    case 'service':
      return (
        <>

          <li>
            <Link
              href="/de/welcome/new/service"
              className="flex items-center gap-x-2 border-none text-gray-700 hover:text-gray-900"
            >
              <PlusCircleIcon className="size-5" />
              Service erstellen
            </Link>
          </li>

          <li>
            <Link
              href="/de/welcome/new/care"
              className="flex items-center gap-x-2 border-none text-gray-700 hover:text-gray-900"
            >

              <ClipboardIcon className="size-5" />
              Services
            </Link>
          </li>
        </>
      );

    case 'care':
      return null;

    case 'client':
      return (
        <>

          <li>
            <Link
              href="/de/welcome/new/care"
              className="flex items-center gap-x-2 border-none text-gray-700 hover:text-gray-900"
            >

              <ClipboardIcon className="size-5" />
              Services
            </Link>
          </li>

          <li>
            <Link
              href="/de/welcome/new/care/calculator"
              className="flex items-center gap-x-2 border-none text-gray-700 hover:text-gray-900"
            >

              <ClipboardIcon className="size-5" />
              Neue Pflege
            </Link>
          </li>
        </>
      );

    default:
      return null;
  }
}
