import { Buffer } from 'node:buffer';
import fs from 'node:fs';
import path, { extname } from 'node:path';

import BunnyStorage from 'bunnycdn-storage';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import { logError, logMessage, logWarning } from '@/utils/sentryLogger';

export async function POST(request: NextRequest) {
  const STORAGE_ZONE = process.env.BUNNY_ZONE;
  const BUNNY_API = process.env.BUNNY_API;

  if (!BUNNY_API || !STORAGE_ZONE) {
    logError('No API KEY OR STORAGE ZONE', { BUNNY_API, STORAGE_ZONE });
    throw new Error('No API KEY OR STORAGE ZONE');
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      logWarning('No file uploaded in bunny-upload', {});
      return new NextResponse(JSON.stringify({ success: false, error: 'No file uploaded' }), { status: 400 });
    }
    const fileExtension = extname(file.name);
    const filename = uuidv4() + fileExtension;

    // Convert File object to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const tempFilePath = path.join('/tmp', `${filename}`);

    logMessage('Saving file to temp path', { tempFilePath });
    await fs.promises.writeFile(tempFilePath, buffer);
    logMessage('File saved successfully', { tempFilePath });

    const bunnyStorage = new BunnyStorage(BUNNY_API, STORAGE_ZONE);

    logMessage('Attempting to upload to Bunny CDN', { tempFilePath, filename });
    bunnyStorage.upload(tempFilePath);
    logMessage('Upload initiated', { filename });

    return new NextResponse(
      JSON.stringify({ success: true, url: `https://iahapullzone.b-cdn.net/${filename}` }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }, // Ensure JSON response
      },
    );
  } catch (error) {
    logError(error, { location: 'POST /bunny-upload' });
    return new NextResponse(JSON.stringify({ success: false, error: 'Upload failed' }), { status: 500 });
  }
}
