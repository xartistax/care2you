import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { servicesSchema } from '@/models/Schema';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const services = await db
      .select()
      .from(servicesSchema)
      .where(eq(servicesSchema.userId, userId)) // Use the userId from query string
      .limit(10);

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ message: 'Error fetching services' }, { status: 500 });
  }
}
