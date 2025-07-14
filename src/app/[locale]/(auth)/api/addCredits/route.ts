import { clerkClient } from '@clerk/nextjs/server';
import { type NextRequest, NextResponse } from 'next/server';

import { logError, logMessage, logWarning } from '@/utils/sentryLogger';

export async function POST(request: NextRequest) {
  try {
    const { userId, credits } = await request.json();
    logMessage('Received addCredits request', { userId, credits });
    const user = await clerkClient.users.getUser(userId);

    const currentCredits = user.privateMetadata.credits as number;
    const topUp = credits as number;

    // Check if the user has enough credits
    if (!credits || credits <= 0) {
      logWarning('Credits validation failed in addCredits', { userId, credits });
      return new NextResponse(JSON.stringify({ result: false, error: 'Credits failed' }), { status: 400 });
    }

    // topUp
    const newCredits = currentCredits + topUp;

    // Save updated credits back to Clerk
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: { credits },
    });

    logMessage('Credits updated successfully', { userId, newCredits });
    return new NextResponse(JSON.stringify({ result: true, newCredits }), { status: 200 });
  } catch (error) {
    logError(error, { location: 'POST /addCredits' });
    return new NextResponse(JSON.stringify({ result: false, error }), { status: 500 });
  }
}
