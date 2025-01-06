import { clerkClient } from '@clerk/nextjs/server';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    const user = await clerkClient.users.getUser(userId);

    // Merge the existing privateMetadata with the new value
    const updatedPrivateMetadata = {
      ...user.privateMetadata, // Preserve existing keys
    };

    // Persist the updated privateMetadata back to Clerk

    await clerkClient.users.updateUser(userId, { privateMetadata: updatedPrivateMetadata });
    const newdata = await user.privateMetadata.compilance;

    if (!newdata) {
      return new NextResponse(JSON.stringify({ result: false }), { status: 500 });
    }

    // If role exists, return true
    return new NextResponse(JSON.stringify({ result: true }), { status: 200 });
  } catch (error) {
    console.error('Error in POST /update-compilance:', error);
    return new NextResponse(JSON.stringify({ result: false, error: 'Internal Server Error' }), { status: 500 });
  }
}
