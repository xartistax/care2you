import { currentUser } from '@clerk/nextjs/server';
import { type NextRequest, NextResponse } from 'next/server';

import { logError, logMessage, logWarning } from '@/utils/sentryLogger';

export async function POST(_request: NextRequest) {
  try {
    logMessage('Received current-user request');
    const user = await currentUser();

    // If role does not exist, return false
    if (!user) {
      logWarning('User not found in current-user', {});
      return new NextResponse(JSON.stringify({ result: false }), { status: 500 });
    }

    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error) {
    logError(error, { location: 'POST /current-user' });
    return new NextResponse(JSON.stringify({ result: false, error: 'Internal Server Error' }), { status: 500 });
  }
}
