import { clerkClient } from '@clerk/nextjs/server';
import { type NextRequest, NextResponse } from 'next/server';

import { logError, logMessage, logWarning } from '@/utils/sentryLogger';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    logMessage('Received decrease-credit request', { userId });
    const user = await clerkClient.users.getUser(userId);

    let credits = user.privateMetadata.credits as number;

    // Check if the user has enough credits
    if (!credits || credits <= 0) {
      logWarning('Not enough credits in decrease-credit', { userId, credits });
      return new NextResponse(JSON.stringify({ result: false, error: 'Not enough credits' }), { status: 400 });
    }

    // Decrease credits by 1
    credits -= 1;

    // Save updated credits back to Clerk
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: { credits },
    });

    logMessage('Credits decreased successfully', { userId, newCredits: credits });
    return new NextResponse(JSON.stringify({ result: true, newCredits: credits }), { status: 200 });
  } catch (error) {
    logError(error, { location: 'POST /decrease-credit' });
    return new NextResponse(JSON.stringify({ result: false, error }), { status: 500 });
  }
}
