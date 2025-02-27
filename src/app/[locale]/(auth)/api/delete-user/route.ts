import { clerkClient } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { servicesSchema } from '@/models/Schema';

export async function POST(request: NextRequest) {
  try {
    const { userId, role } = await request.json();

    if (!userId || !role) {
      return NextResponse.json({ result: false, error: 'User ID is missing' }, { status: 400 });
    }

    await clerkClient.users.deleteUser(userId);

    /// Delete all DB entries related to the user!

    if (role === 'service') {
      await db
        .delete(servicesSchema)
        .where(eq(servicesSchema.userId, userId));
    }

    return NextResponse.json({ result: true }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ result: false, error: (error as Error).message }, { status: 500 });
  }
}
