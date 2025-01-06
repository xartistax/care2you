import { clerkClient, currentUser } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables

    const { userId } = await request.json();
    const clerkClientObject = await clerkClient();
    const clerkUserObject = await currentUser();
    const compilance = new Date().toISOString();

    if (!clerkClient || !clerkUserObject) {
      return new NextResponse(JSON.stringify({ result: false }), { status: 500 });
    }

    if (!userId) {
      return new NextResponse(JSON.stringify({ result: false }), { status: 500 });
    }

    clerkClientObject.users.updateUser(clerkUserObject.id, {

      privateMetadata: {
        compilance,
      },

    });

    return new NextResponse(JSON.stringify({ result: true }), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
