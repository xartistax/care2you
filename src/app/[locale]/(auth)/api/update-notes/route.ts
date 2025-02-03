import { clerkClient } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables

    const { user, note } = await request.json();
    const clerkClientObject = clerkClient();

    if (!clerkClient) {
      return new NextResponse(JSON.stringify({ result: false }), { status: 500 });
    }

    if (!user) {
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

    return new NextResponse(JSON.stringify({ result: true }), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
