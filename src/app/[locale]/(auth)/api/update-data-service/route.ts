import { clerkClient } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { OnBoardingClientUser } from '@/validations/onBoardingValidation';

type UserProfileProps = {
  user: OnBoardingClientUser; // Adjust the type if needed
};

export async function POST(request: NextRequest) {
  try {
    // Parse den Body
    const body: UserProfileProps = await request.json();

    // Überprüfe die Felder im Body
    if (!body.user?.privateMetadata?.role || !body.user.privateMetadata.phone || !body.user.privateMetadata.gender) {
      return NextResponse.json({ result: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Nutzer-ID aus dem Clerk Context (ersetze durch eine gültige ID-Quelle)
    const userId = body.user.id; // Muss aus deinem Request-Body oder einer anderen Quelle kommen

    if (!userId) {
      return NextResponse.json({ result: false, error: 'User ID is missing' }, { status: 400 });
    }

    // Nutzer-Daten aktualisieren
    await clerkClient.users.updateUser(userId, {
      privateMetadata: {

        role: body.user.privateMetadata.role,
        phone: body.user.privateMetadata.phone,
        gender: body.user.privateMetadata.gender,
        skill: body.user.privateMetadata.skill,
        languages: body.user.privateMetadata.languages,
        certificates: body.user.privateMetadata.certificates,
        workingHours: body.user.privateMetadata.workingHours,
        street: body.user.privateMetadata.street,
        streetnumber: body.user.privateMetadata.streetnumber,
        plz: body.user.privateMetadata.plz,
        location: body.user.privateMetadata.location,
        companyTitle: body.user.privateMetadata.companyTitle,
        companyDescription: body.user.privateMetadata.companyDescription,
        uidst: body.user.privateMetadata.uidst,
        expertise: body.user.privateMetadata.expertise,

      },
    });

    return NextResponse.json({ result: true }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
