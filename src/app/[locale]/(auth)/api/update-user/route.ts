import { clerkClient, currentUser } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { logError, logMessage, logWarning } from '@/utils/sentryLogger';

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    const body = await request.json();
    logMessage('Received update-user request', { body });
    const clerkClientObject = await clerkClient();
    const clerkUserObject = await currentUser();

    if (!clerkClient || !clerkUserObject) {
      logWarning('Clerk client or user object missing in update-user', { clerkClient, clerkUserObject });
      return new NextResponse(JSON.stringify({ result: false }), { status: 500 });
    }

    if (!body.firstName || !body.lastName || !body.locale) {
      logWarning('Missing required fields in update-user', { body });
      return new NextResponse(JSON.stringify({ result: false }), { status: 500 });
    }

    clerkClientObject.users.updateUser(clerkUserObject.id, {
      firstName: body.firstName,
      lastName: body.lastName,
    });
    logMessage('User updated successfully in update-user', { userId: clerkUserObject.id, firstName: body.firstName, lastName: body.lastName });

    return new NextResponse(JSON.stringify({ result: true }), { status: 200 });
  } catch (error) {
    logError(error, { location: 'POST /update-user' });
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
