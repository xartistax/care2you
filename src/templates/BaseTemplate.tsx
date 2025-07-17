import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import Navigation from '@/components/navigation/main/Navigation';
import { constructUser } from '@/utils/Helpers';

export async function BaseTemplate({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const user = await currentUser();

  if (!user) {
    redirect('/de/good-bye');
  }

  const constructedUser = constructUser(user);

  return (
    <div className="flex min-h-screen flex-col text-gray-700 antialiased">

      <Header
        leftNav={
          constructedUser?.privateMetadata?.status === 'active' ? <Navigation userRole={String(user.privateMetadata.role)} /> : null
        }
        user={constructedUser}
        locale={locale}
      />

      <div className="mx-auto w-full max-w-screen-xl grow px-1">
        <main>{children}</main>
      </div>

      <Footer />
    </div>
  );
}
