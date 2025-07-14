import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { servicesSchema } from '@/models/Schema';
import { logError, logMessage, logWarning } from '@/utils/sentryLogger';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    logMessage('Received user-services request', { userId });

    if (!userId) {
      logWarning('User ID is required in user-services', {});
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const services = await db
      .select()
      .from(servicesSchema)
      .where(eq(servicesSchema.userId, userId)) // Use the userId from query string
      .limit(10);
    logMessage('Fetched user services successfully', { userId, count: services.length });

    return NextResponse.json(services);
  } catch (error) {
    logError(error, { location: 'POST /user-services' });
    return NextResponse.json({ message: 'Error fetching services' }, { status: 500 });
  }
}
