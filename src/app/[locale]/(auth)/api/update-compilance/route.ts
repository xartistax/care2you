import { clerkClient, currentUser } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { logError, logMessage, logWarning } from '@/utils/sentryLogger';

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    const { userId } = await request.json();
    logMessage('Received update-compilance request', { userId });
    const clerkClientObject = clerkClient();
    const clerkUserObject = await currentUser();
    const compilance = new Date().toISOString();

    if (!clerkClient || !clerkUserObject) {
      logWarning('Clerk client or user object missing in update-compilance', { clerkClient, clerkUserObject });
      return new NextResponse(JSON.stringify({ result: false }), { status: 500 });
    }

    if (!userId) {
      logWarning('User ID missing in update-compilance', {});
      return new NextResponse(JSON.stringify({ result: false }), { status: 500 });
    }

    clerkClientObject.users.updateUser(clerkUserObject.id, {
      privateMetadata: {
        compilance,
      },
    });
    logMessage('User compilance updated successfully', { userId, compilance });

    return new NextResponse(JSON.stringify({ result: true }), { status: 200 });
  } catch (error) {
    logError(error, { location: 'POST /update-compilance' });
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
