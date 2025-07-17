import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { type NextFetchEvent, type NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { logError, logMessage, logWarning } from '@/utils/sentryLogger';

import { routing } from './libs/i18nNavigation';
import { chekOnboarding, getI18nPath } from './utils/Helpers';

const intlMiddleware = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  getI18nPath('/welcome(.*)', ':locale'),
  getI18nPath('/admin(.*)', ':locale'),
]);

const isAuthPage = createRouteMatcher([

  getI18nPath('/user-profile(.*)', ':locale'),
  getI18nPath('/onboarding(.*)', ':locale'),
  getI18nPath('/admin(.*)', ':locale'),
  getI18nPath('/sign-in(.*)', ':locale'),
  getI18nPath('/sign-up(.*)', ':locale'),
]);

export default function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  logMessage('middleware: Entry', { file: 'middleware.ts', function: 'middleware', url: request.nextUrl.pathname });
  // Run Clerk middleware only when it's necessary
  if (
    isAuthPage(request) || isProtectedRoute(request)
  ) {
    logMessage('middleware: Auth or protected route', { file: 'middleware.ts', function: 'middleware', url: request.nextUrl.pathname });
    return clerkMiddleware(async (auth, req) => {
      logMessage('middleware: clerkMiddleware invoked', { file: 'middleware.ts', function: 'middleware', url: req.nextUrl.pathname });
      const url = req.nextUrl.clone();

      if (isProtectedRoute(req)) {
        const locale = req.nextUrl.pathname.match(/^\/[a-z]{2}(?=\/)/)?.[1] ?? '';
        const { userId } = auth();
        logMessage('middleware: Protected route check', { file: 'middleware.ts', function: 'middleware', locale, userId });
        if (userId) {
          try {
            const checkOnboarding = await chekOnboarding(locale, userId);
            if (!checkOnboarding) {
              logWarning('middleware: Onboarding check failed, redirecting', { file: 'middleware.ts', function: 'middleware', locale, userId });
              url.pathname = '/onboarding';
              return NextResponse.redirect(url);
            }
          } catch (error) {
            logError(error, { file: 'middleware.ts', function: 'middleware', location: 'checkOnboarding', locale, userId });
            url.pathname = '/onboarding';
            return NextResponse.redirect(url);
          }
        }
        const signInUrl = new URL(`/good-bye`, req.url);

        auth().protect({
          unauthenticatedUrl: signInUrl.toString(),
        });
      }

      return intlMiddleware(req);
    })(request, event);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|monitoring|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
