import { clerkClient } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { logError, logMessage, logWarning } from '@/utils/sentryLogger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    logMessage('Received editAddress request', { body });

    if (!body.user || !body.user.privateMetadata) {
      logWarning('Invalid request structure in editAddress', { body });
      return NextResponse.json({ result: false, error: 'Invalid request structure' }, { status: 400 });
    }

    if (!body.user.privateMetadata.phone || !body.user.privateMetadata.street || !body.user.privateMetadata.plz || !body.user.privateMetadata.location || !body.user.privateMetadata.streetnumber) {
      logWarning('Missing required fields in editAddress', { privateMetadata: body.user.privateMetadata });
      return NextResponse.json({ result: false, error: 'Missing required fields' }, { status: 400 });
    }

    const userId = body.user.id;
    if (!userId) {
      logWarning('User ID is missing in editAddress', { body });
      return NextResponse.json({ result: false, error: 'User ID is missing' }, { status: 400 });
    }

    // Fetch existing user data
    const existingUser = await clerkClient.users.getUser(userId);
    const existingMetadata = existingUser.privateMetadata || {}; // Ensure it's an object

    // Merge existing metadata with new address data
    const updatedMetadata = {
      ...existingMetadata, // Keep all existing fields
      street: body.user.privateMetadata.street,
      plz: body.user.privateMetadata.plz,
      location: body.user.privateMetadata.location,
      streetnumber: body.user.privateMetadata.streetnumber,
      phone: body.user.privateMetadata.phone,
    };

    // Update user while preserving existing data
    await clerkClient.users.updateUser(userId, {
      privateMetadata: updatedMetadata,
    });
    logMessage('User address updated successfully', { userId, updatedMetadata });

    return NextResponse.json({ result: true }, { status: 200 });
  } catch (error) {
    logError(error, { location: 'POST /editAddress' });
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
