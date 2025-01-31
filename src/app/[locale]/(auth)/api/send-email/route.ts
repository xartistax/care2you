import type * as React from 'react';
import { Resend } from 'resend';

import { EmailTemplate } from '@/components/email-template';

const resend = new Resend(process.env.RESEND_API);

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <care2you@bexolutions.dev>',
      to: ['demianfueglistaler@icloud.com'],
      subject: 'Hello world',
      react: EmailTemplate({ firstName: 'John' }) as React.ReactElement,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
