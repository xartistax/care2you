// pages/api/services/update-status.ts
import { eq } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

import { db } from '@/libs/DB'; // Import your database connection
import { servicesSchema } from '@/models/Schema'; // Import the schema for services

export async function PATCH(request: NextRequest) {
  try {
    // Parse the incoming request
    const { serviceId, newStatus } = await request.json();

    // Validate that both serviceId and newStatus are provided
    if (!serviceId || typeof newStatus !== 'boolean') {
      return new NextResponse(JSON.stringify({ success: false, error: 'Missing or invalid parameters' }), { status: 400 });
    }

    // Update the service status in the database
    await db
      .update(servicesSchema)
      .set({ status: newStatus ? 'active' : 'inactive' })
      .where(eq(servicesSchema.internalId, serviceId));

    return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error updating service status:', error);
    return new NextResponse(JSON.stringify({ success: false, error: 'Error updating status' }), { status: 500 });
  }
}
