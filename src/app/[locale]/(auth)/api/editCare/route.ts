import { clerkClient } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { logError, logMessage, logWarning } from '@/utils/sentryLogger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    logMessage('Received editCare request', { body });

    if (!body.user || !body.user.privateMetadata) {
      logWarning('Invalid request structure in editCare', { body });
      return NextResponse.json({ result: false, error: 'Invalid request structure' }, { status: 400 });
    }

    if (!body.user.privateMetadata.skill || !body.user.privateMetadata.expertise || !body.user.privateMetadata.certificates || !body.user.privateMetadata.workingHours) {
      logWarning('Missing required fields in editCare', { privateMetadata: body.user.privateMetadata });
      return NextResponse.json({ result: false, error: 'Missing required fields' }, { status: 400 });
    }

    const userId = body.user.id;
    if (!userId) {
      logWarning('User ID is missing in editCare', { body });
      return NextResponse.json({ result: false, error: 'User ID is missing' }, { status: 400 });
    }

    // Fetch existing user data
    const existingUser = await clerkClient.users.getUser(userId);
    const existingMetadata = existingUser.privateMetadata || {}; // Ensure it's an object

    // Merge existing metadata with new address data
    const updatedMetadata = {
      ...existingMetadata, // Keep all existing fields
      skill: body.user.privateMetadata.skill,
      expertise: body.user.privateMetadata.expertise,
      workingHours: body.user.privateMetadata.workingHours,
      certificates: body.user.privateMetadata.certificates,
    };

    // Update user while preserving existing data
    await clerkClient.users.updateUser(userId, {
      privateMetadata: updatedMetadata,
    });
    logMessage('User care data updated successfully', { userId, updatedMetadata });

    return NextResponse.json({ result: true }, { status: 200 });
  } catch (error) {
    logError(error, { location: 'POST /editCare' });
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
