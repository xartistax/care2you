import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import MainNavigation from '@/components/navigation/main/Navigation';
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
    <div className="w-full px-1 text-gray-700 antialiased">

      <Header
        leftNav={
          constructedUser?.privateMetadata?.status === 'active' ? <MainNavigation /> : null
        }
        user={constructedUser}
        locale={locale}
      />

      <div className="mx-auto max-w-screen-xl">
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
