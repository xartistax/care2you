import { Resend } from 'resend';

import { EmailTemplateSignUp } from '@/components/email-template-signup';
import { logError, logMessage } from '@/utils/sentryLogger';

const resend = new Resend(process.env.RESEND_API);

export async function POST(req: Request) {
  try {
    const { user_email, user_name, user_vorname, user_phone, user_role } = await req.json(); // Read JSON body from request
    logMessage('Received send-email-signup request', { user_email, user_role });

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
      to: ['info@care2you.ch'], // Dynamically set recipient
      subject: 'Neuer User hat sich angemeldet', // Use subject from the request
      react: EmailTemplateSignUp(emailData), // Pass email data to the template
    });
    logMessage('Email sent attempt in send-email-signup', { user_email, user_role, result: !!data, error });

    if (error) {
      logError(error, { location: 'POST /send-email-signup', user_email });
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    logError(error, { location: 'POST /send-email-signup' });
    return Response.json({ error: (error as Error).message || 'An error occurred' }, { status: 500 });
  }
}
