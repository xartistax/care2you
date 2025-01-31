import { clerkClient } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ result: false, error: 'User ID is missing' }, { status: 400 });
    }

    await clerkClient.users.deleteUser(userId);

    return NextResponse.json({ result: true }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ result: false, error: (error as Error).message }, { status: 500 });
  }
}
