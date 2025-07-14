import { type NextRequest, NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { servicesSchema } from '@/models/Schema';
import { logError, logMessage, logWarning } from '@/utils/sentryLogger';
import { serviceSchema } from '@/validations/serviceValidation';

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request
    const json = await request.json();
    logMessage('Received addNewService request', { requestBody: json });

    // Validate the input data
    let validatedData;
    try {
      validatedData = serviceSchema.parse(json);
    } catch (validationError) {
      logWarning('Validation failed in addNewService', { requestBody: json, validationError });
      return new NextResponse(JSON.stringify({ success: false, error: validationError }), { status: 400 });
    }

    // Insert into the database
    await db.insert(servicesSchema).values(validatedData);
    logMessage('Service added successfully', { validatedData });

    return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    logError(error, { location: 'POST /addNewService' });
    return new NextResponse(JSON.stringify({ success: false, error }), { status: 400 });
  }
}
