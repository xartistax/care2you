import { clerkClient } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { servicesSchema } from '@/models/Schema';
import { logError, logMessage, logWarning } from '@/utils/sentryLogger';

export async function POST(request: NextRequest) {
  try {
    // Parse den Body
    const body = await request.json();
    logMessage('Received change-user-status request', { body });

    // Nutzer-ID aus dem Clerk Context
    const userId = body.userId; // Muss aus deinem Request-Body oder einer anderen Quelle kommen
    const currentStatus = body.currentStatus;
    const newStatus = (currentStatus ?? 'inactive') === 'inactive' ? 'active' : 'inactive';
    const user = await clerkClient.users.getUser(userId);

    if (!userId) {
      logWarning('User ID is missing in change-user-status', { body });
      return NextResponse.json({ result: false, error: 'User ID is missing' }, { status: 400 });
    }

    // Nutzer-Daten aktualisieren
    await clerkClient.users.updateUser(userId, {
      privateMetadata: {
        ...user.privateMetadata, // Keep existing data
        status: newStatus, // Update only status
      },
    });
    logMessage('User status updated in Clerk', { userId, newStatus });

    // Alle zugehörigen Services auf den neuen Status setzen
    await db.update(servicesSchema)
      .set({ status: newStatus })
      .where(eq(servicesSchema.userId, userId));
    logMessage('User services status updated in DB', { userId, newStatus });

    return NextResponse.json({ result: true }, { status: 200 });
  } catch (error) {
    logError(error, { location: 'POST /change-user-status' });
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
