import { deDE } from '@clerk/localizations';
import { ClerkProvider } from '@clerk/nextjs';

export default function AuthLayout(props: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const clerkLocale = deDE;

  const signInUrl = '/sign-in';
  const signUpUrl = '/sign-up';
  const welcomeUrl = '/welcome';

  return (
    <ClerkProvider
      localization={clerkLocale}
      signInUrl={signInUrl}
      signUpUrl={signUpUrl}
      signInFallbackRedirectUrl={welcomeUrl}
      signUpFallbackRedirectUrl={welcomeUrl}
    >
      {props.children}
    </ClerkProvider>
  );
}
