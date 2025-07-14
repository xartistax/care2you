import { clerkClient } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { giveCredits } from '@/utils/Helpers';
import { logError, logMessage, logWarning } from '@/utils/sentryLogger';

export async function POST(request: NextRequest) {
  try {
    // Parse den Body
    const body = await request.json();
    logMessage('Received update-data-care request', { body });
    const credits = giveCredits(body.user?.privateMetadata?.role);

    // Überprüfe die Felder im Body
    if (
      !body.user?.privateMetadata?.role
      || !body.user.privateMetadata.phone
      || !body.user.privateMetadata.gender
      || !body.user.privateMetadata.dob
      || !body.user.privateMetadata.nationality
    ) {
      logWarning('Missing required fields in update-data-care', { privateMetadata: body.user?.privateMetadata });
      return NextResponse.json({ result: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Nutzer-ID aus dem Clerk Context (ersetze durch eine gültige ID-Quelle)
    const userId = body.user.id; // Muss aus deinem Request-Body oder einer anderen Quelle kommen

    if (!userId) {
      logWarning('User ID is missing in update-data-care', { body });
      return NextResponse.json({ result: false, error: 'User ID is missing' }, { status: 400 });
    }

    // Nutzer-Daten aktualisieren
    await clerkClient.users.updateUser(userId, {
      privateMetadata: {
        status: 'inactive',
        certificates: body.user.privateMetadata.certificates,
        dob: body.user.privateMetadata.dob || undefined,
        nationality: body.user.privateMetadata.nationality || undefined,
        role: body.user.privateMetadata.role || undefined,
        phone: body.user.privateMetadata.phone || undefined,
        gender: body.user.privateMetadata.gender || undefined,
        companyCategory: body.user.privateMetadata.companyCategory || undefined,
        companyTitle: body.user.privateMetadata.companyTitle || undefined,
        companyDescription: body.user.privateMetadata.companyDescription || undefined,
        uidst: body.user.privateMetadata.uidst || undefined,
        serviceCategory: body.user.privateMetadata.serviceCategory || undefined,
        street: body.user.privateMetadata.street || undefined,
        streetnumber: body.user.privateMetadata.streetnumber || undefined,
        plz: body.user.privateMetadata.plz || undefined,
        location: body.user.privateMetadata.location || undefined,
        credits,
        expertise: body.user.privateMetadata.expertise || undefined,
        workingHours: body.user.privateMetadata.workingHours || undefined,
        skill: body.user.privateMetadata.skill || undefined,
        languages: body.user.privateMetadata.languages || undefined,
      },
    });
    logMessage('User care data updated successfully in update-data-care', { userId });

    return NextResponse.json({ result: true }, { status: 200 });
  } catch (error) {
    logError(error, { location: 'POST /update-data-care' });
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
