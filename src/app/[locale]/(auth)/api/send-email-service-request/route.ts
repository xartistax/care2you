import { Resend } from 'resend';

import { EmailTemplateServiceRequest } from '@/components/email-template-service-request';

const resend = new Resend(process.env.RESEND_API);

export async function POST(req: Request) {
  try {
    const { message, service_title, client_name, client_vorname, client_phone, client_email, service_email, service_lastName, service_firstName } = await req.json(); // Read JSON body from request

    // Data for the email
    const emailData = {
      service_email,
      service_name: service_lastName,
      service_vorname: service_firstName,
      service_title,
      client_email,
      client_name,
      client_vorname,
      client_phone,
      client_message: message,
    };

    const { data, error } = await resend.emails.send({
      from: 'Care2You - Terminanfrage <termine@care2you.ch>',
      to: [service_email, 'info@care2you.ch'], // Dynamically set recipient
      subject: 'Terminanfrage über Care2you – Bitte kontaktieren Sie den Kunden umgehend', // Use subject from the request
      react: EmailTemplateServiceRequest(emailData), // Pass email data to the template
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: (error as Error).message || 'An error occurred' }, { status: 500 });
  }
}
