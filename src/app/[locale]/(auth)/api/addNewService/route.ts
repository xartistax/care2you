import { type NextRequest, NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { servicesSchema } from '@/models/Schema';
import { serviceSchema } from '@/validations/serviceValidation';

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request
    const json = await request.json();

    // Validate the input data
    const validatedData = serviceSchema.parse(json);

    // Insert into the database
    await db.insert(servicesSchema).values(validatedData);

    return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ success: false, error }), { status: 400 });
  }
}
