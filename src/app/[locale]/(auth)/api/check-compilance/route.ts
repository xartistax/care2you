import { clerkClient } from '@clerk/nextjs/server';
import { type NextRequest, NextResponse } from 'next/server';

import { logError, logMessage, logWarning } from '@/utils/sentryLogger';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    logMessage('Received check-compilance request', { userId });
    const user = await clerkClient.users.getUser(userId);

    const compilance = await user.privateMetadata.compilance;

    // If role does not exist, return false
    if (!compilance || compilance === undefined) {
      logWarning('Compilance missing or undefined in check-compilance', { userId, compilance });
      return new NextResponse(JSON.stringify({ result: false }), { status: 500 });
    }

    return new NextResponse(JSON.stringify({ result: true }), { status: 200 });
  } catch (error) {
    logError(error, { location: 'POST /check-compilance' });
    return new NextResponse(JSON.stringify({ result: false, error: 'Internal Server Error' }), { status: 500 });
  }
}
