import { currentUser } from '@clerk/nextjs/server';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(_request: NextRequest) {
  try {
    const user = await currentUser();

    // If role does not exist, return false
    if (!user) {
      return new NextResponse(JSON.stringify({ result: false }), { status: 500 });
    }

    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error('Error in POST /check-compilance:', error);
    return new NextResponse(JSON.stringify({ result: false, error: 'Internal Server Error' }), { status: 500 });
  }
}
