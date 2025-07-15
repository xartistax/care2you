import { clerkClient } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { servicesSchema } from '@/models/Schema';
import { logError, logMessage, logWarning } from '@/utils/sentryLogger';

export async function POST(request: NextRequest) {
  try {
    const { userId, role } = await request.json();
    logMessage('Received delete-user request', { userId, role });

    if (!userId || !role) {
      logWarning('User ID or role is missing in delete-user', { userId, role });
      return NextResponse.json({ result: false, error: 'User ID is missing' }, { status: 400 });
    }

    await clerkClient.users.deleteUser(userId);
    logMessage('User deleted from Clerk', { userId });

    /// Delete all DB entries related to the user!

    if (role === 'service') {
      await db
        .delete(servicesSchema)
        .where(eq(servicesSchema.userId, userId));
      logMessage('User services deleted from DB', { userId });
    }

    return NextResponse.json({ result: true }, { status: 200 });
  } catch (error) {
    logError(error, { location: 'POST /delete-user' });
    return NextResponse.json({ result: false, error: (error as Error).message }, { status: 500 });
  }
}
