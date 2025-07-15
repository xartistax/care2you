import { Buffer } from 'node:buffer';
import fs from 'node:fs';
import path from 'node:path';

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
    // Use formData() to parse the form data
    const formData = await request.formData();
    logMessage('Received caregiver-file-management upload request', { formDataKeys: Array.from(formData.keys()) });
    const uploadedFiles: { [key: string]: { url: string; filename: string } } = {}; // Object to hold file URLs

    // Loop over each file in the form data
    for (const [key, value] of formData.entries()) {
      if (typeof value === 'object' && 'arrayBuffer' in value) {
        const fileExtension = path.extname(value.name);
        const internalFilename = uuidv4() + fileExtension;

        // Convert the file to a buffer
        const buffer = Buffer.from(await value.arrayBuffer());

        // Temp file path
        const tempFilePath = path.join('/tmp', internalFilename);

        // Save the file temporarily
        fs.writeFileSync(tempFilePath, buffer);
        logMessage('File saved temporarily', { tempFilePath, originalName: value.name });

        // Upload the file to Bunny Storage
        const bunnyStorage = new BunnyStorage(BUNNY_API, STORAGE_ZONE);
        await bunnyStorage.upload(tempFilePath);
        logMessage('File uploaded to Bunny Storage', { tempFilePath, internalFilename });

        // Store the file URL in the object
        uploadedFiles[key] = { url: `https://iahapullzone.b-cdn.net/${internalFilename}`, filename: value.name };
      }
    }

    logMessage('All files processed in caregiver-file-management', { uploadedFiles });
    return new NextResponse(
      JSON.stringify({ success: true, files: uploadedFiles }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    logError(error, { location: 'POST /caregiver-file-management' });
    return new NextResponse(
      JSON.stringify({ success: false, error: 'Upload failed' }),
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const STORAGE_ZONE = process.env.BUNNY_ZONE;
  const BUNNY_API = process.env.BUNNY_API;

  if (!BUNNY_API || !STORAGE_ZONE) {
    logError('Missing Bunny config', { BUNNY_API, STORAGE_ZONE });
    return NextResponse.json({ success: false, error: 'Missing Bunny config' }, { status: 500 });
  }

  try {
    const { urls } = await request.json();
    logMessage('Received caregiver-file-management delete request', { urls });

    if (!Array.isArray(urls) || urls.length === 0) {
      logWarning('No URLs provided for deletion in caregiver-file-management', { urls });
      return NextResponse.json({ success: false, error: 'No URLs provided' }, { status: 400 });
    }

    const bunnyStorage = new BunnyStorage(BUNNY_API, STORAGE_ZONE);
    for (const url of urls) {
      const filename = url.split('/').pop();
      if (filename) {
        await bunnyStorage.delete(filename);
        logMessage('File deleted from Bunny Storage', { filename });
      }
    }
    logMessage('All files deleted in caregiver-file-management', { urls });
    return NextResponse.json({ success: true });
  } catch (error) {
    logError(error, { location: 'DELETE /caregiver-file-management' });
    return NextResponse.json({ success: false, error: 'Delete failed' }, { status: 500 });
  }
}
