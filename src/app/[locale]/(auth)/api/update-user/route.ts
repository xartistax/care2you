import { clerkClient, currentUser } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables

    const body = await request.json();
    const clerkClientObject = await clerkClient();
    const clerkUserObject = await currentUser();

    // const body = await request.json();

    if (!clerkClient || !clerkUserObject) {
      return new NextResponse(JSON.stringify({ result: false }), { status: 500 });
    }

    if (!body.firstName || !body.lastName || !body.locale) {
      return new NextResponse(JSON.stringify({ result: false }), { status: 500 });
    }

    clerkClientObject.users.updateUser(clerkUserObject.id, {

      firstName: body.firstName,
      lastName: body.lastName,

    });

    return new NextResponse(JSON.stringify({ result: true }), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
