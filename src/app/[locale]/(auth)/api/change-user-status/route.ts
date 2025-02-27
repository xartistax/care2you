import { clerkClient } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { servicesSchema } from '@/models/Schema';

export async function POST(request: NextRequest) {
  try {
    // Parse den Body
    const body = await request.json();

    // Nutzer-ID aus dem Clerk Context
    const userId = body.userId; // Muss aus deinem Request-Body oder einer anderen Quelle kommen
    const currentStatus = body.currentStatus;
    const newStatus = (currentStatus ?? 'inactive') === 'inactive' ? 'active' : 'inactive';
    const user = await clerkClient.users.getUser(userId);

    if (!userId) {
      return NextResponse.json({ result: false, error: 'User ID is missing' }, { status: 400 });
    }

    // Nutzer-Daten aktualisieren
    await clerkClient.users.updateUser(userId, {
      privateMetadata: {
        ...user.privateMetadata, // Keep existing data
        status: newStatus, // Update only status
      },
    });

    // Alle zugehörigen Services auf den neuen Status setzen
    await db.update(servicesSchema)
      .set({ status: newStatus })
      .where(eq(servicesSchema.userId, userId));

    return NextResponse.json({ result: true }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
