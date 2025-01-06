import { clerkClient } from '@clerk/nextjs/server';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    const user = await clerkClient.users.getUser(userId);
    const role = user.privateMetadata.role;
    const phone = user.privateMetadata.phone;
    const gender = user.privateMetadata.gender;

    // If role does not exist, return false
    if (!role || !phone || !gender) {
      return new NextResponse(JSON.stringify({ result: false }), { status: 500 });
    }

    // If role exists, return true
    return new NextResponse(JSON.stringify({ result: true }), { status: 200 });
  } catch (error) {
    console.error('Error in POST /check-user-login:', error);
    return new NextResponse(JSON.stringify({ result: false, error: 'Internal Server Error' }), { status: 500 });
  }
}
