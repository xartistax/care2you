import { clerkClient } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { logError, logMessage, logWarning } from '@/utils/sentryLogger';

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    const { user, note } = await request.json();
    logMessage('Received update-notes request', { user, note });
    const clerkClientObject = clerkClient();

    if (!clerkClient) {
      logWarning('Clerk client missing in update-notes', {});
      return new NextResponse(JSON.stringify({ result: false }), { status: 500 });
    }

    if (!user) {
      logWarning('User missing in update-notes', {});
      return new NextResponse(JSON.stringify({ result: false }), { status: 500 });
    }

    clerkClientObject.users.updateUser(user.id, {
      privateMetadata: {
        status: user.privateMetadata.status,
        role: user.privateMetadata.role,
        phone: user.privateMetadata.phone,
        gender: user.privateMetadata.gender,
        skill: user.privateMetadata.skill,
        languages: user.privateMetadata.languages,
        certificates: user.privateMetadata.certificates,
        workingHours: user.privateMetadata.workingHours,
        street: user.privateMetadata.street,
        streetnumber: user.privateMetadata.streetnumber,
        plz: user.privateMetadata.plz,
        location: user.privateMetadata.location,
        companyTitle: user.privateMetadata.companyTitle,
        companyDescription: user.privateMetadata.companyDescription,
        uidst: user.privateMetadata.uidst,
        expertise: user.privateMetadata.expertise,
        note,
      },
    });
    logMessage('User notes updated successfully in update-notes', { userId: user.id, note });

    return new NextResponse(JSON.stringify({ result: true }), { status: 200 });
  } catch (error) {
    logError(error, { location: 'POST /update-notes' });
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
