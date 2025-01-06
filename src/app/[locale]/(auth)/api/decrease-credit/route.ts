import { clerkClient } from '@clerk/nextjs/server';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    const user = await clerkClient.users.getUser(userId);

    let credits = user.privateMetadata.credits as number;

    // Check if the user has enough credits
    if (!credits || credits <= 0) {
      return new NextResponse(JSON.stringify({ result: false, error: 'Not enough credits' }), { status: 400 });
    }

    // Decrease credits by 1
    credits -= 1;

    // Save updated credits back to Clerk
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: { credits },
    });

    return new NextResponse(JSON.stringify({ result: true, newCredits: credits }), { status: 200 });
  } catch (error) {
    console.error('Error in POST /decrease-credit:', error);
    return new NextResponse(JSON.stringify({ result: false, error }), { status: 500 });
  }
}
