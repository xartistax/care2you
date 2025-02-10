import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { type NextFetchEvent, type NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { routing } from './libs/i18nNavigation';
import { chekOnboarding, getBaseUrl, getI18nPath } from './utils/Helpers';

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
  // Run Clerk middleware only when it's necessary
  if (
    isAuthPage(request) || isProtectedRoute(request)
  ) {
    return clerkMiddleware(async (auth, req) => {
      if (isProtectedRoute(req)) {
        const locale = req.nextUrl.pathname.match(/^\/([a-z]{2})(?=\/)/)?.[1] ?? '';
        const { userId } = auth();
        if (userId) {
          /// Check if user has a role if so is it a valid Role? TRUE/FALSE
          /// IF False -> redirect to onboarding

          const checkOnboarding = await chekOnboarding(locale, userId);
          // const checkCompilance = await chekCompilance(locale, userId);

          if (!checkOnboarding) {
            return NextResponse.redirect(getI18nPath(`${getBaseUrl()}/onboarding`, locale));
          }
        }

        // return NextResponse.redirect(getI18nPath(`${getBaseUrl()}/onboarding`, locale));

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
