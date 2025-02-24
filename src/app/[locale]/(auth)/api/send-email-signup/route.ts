import { Resend } from 'resend';

import { EmailTemplateSignUp } from '@/components/email-template-signup';

const resend = new Resend(process.env.RESEND_API);

export async function POST(req: Request) {
  try {
    const { user_email, user_name, user_vorname, user_phone, user_role } = await req.json(); // Read JSON body from request

    // Data for the email
    const emailData = {
      user_email,
      user_name,
      user_vorname,
      user_phone,
      user_role,
    };

    const { data, error } = await resend.emails.send({
      from: 'Care2You - Terminanfrage <termine@care2you.ch>',
      to: ['demian@bexolutions.ch'], // Dynamically set recipient
      subject: 'Terminanfrage über Care2you – Bitte kontaktieren Sie den Kunden umgehend', // Use subject from the request
      react: EmailTemplateSignUp(emailData), // Pass email data to the template
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: (error as Error).message || 'An error occurred' }, { status: 500 });
  }
}
