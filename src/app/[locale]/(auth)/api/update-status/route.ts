// pages/api/services/update-status.ts
import { eq } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

import { db } from '@/libs/DB'; // Import your database connection
import { servicesSchema } from '@/models/Schema'; // Import the schema for services
import { logError, logMessage, logWarning } from '@/utils/sentryLogger';

export async function PATCH(request: NextRequest) {
  try {
    // Parse the incoming request
    const { serviceId, newStatus } = await request.json();
    logMessage('Received update-status request', { serviceId, newStatus });

    // Validate that both serviceId and newStatus are provided
    if (!serviceId || typeof newStatus !== 'boolean') {
      logWarning('Missing or invalid parameters in update-status', { serviceId, newStatus });
      return new NextResponse(JSON.stringify({ success: false, error: 'Missing or invalid parameters' }), { status: 400 });
    }

    // Update the service status in the database
    await db
      .update(servicesSchema)
      .set({ status: newStatus ? 'active' : 'inactive' })
      .where(eq(servicesSchema.internalId, serviceId));
    logMessage('Service status updated successfully', { serviceId, newStatus });

    return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    logError(error, { location: 'PATCH /update-status' });
    return new NextResponse(JSON.stringify({ success: false, error: 'Error updating status' }), { status: 500 });
  }
}
