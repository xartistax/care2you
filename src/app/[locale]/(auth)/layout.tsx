import { deDE } from '@clerk/localizations';
import { ClerkProvider } from '@clerk/nextjs';

import { AppConfig } from '@/utils/AppConfig';

export default function AuthLayout(props: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const clerkLocale = deDE;

  let signInUrl = '/sign-in';
  let signUpUrl = '/sign-up';
  let welcomeUrl = '/welcome';
  let afterSignOutUrl = signInUrl;

  if (props.params.locale !== AppConfig.defaultLocale) {
    signInUrl = `/${props.params.locale}${signInUrl}`;
    signUpUrl = `/${props.params.locale}${signUpUrl}`;
    welcomeUrl = `/${props.params.locale}${welcomeUrl}`;
    afterSignOutUrl = `/${props.params.locale}${afterSignOutUrl}`;
  }

  return (
    <ClerkProvider
      localization={clerkLocale}
      signInUrl={signInUrl}
      signUpUrl={signUpUrl}
      signInFallbackRedirectUrl={welcomeUrl}
      signUpFallbackRedirectUrl={welcomeUrl}
      afterSignOutUrl={afterSignOutUrl}
    >
      {props.children}
    </ClerkProvider>
  );
}
