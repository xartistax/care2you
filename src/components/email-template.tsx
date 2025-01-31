import * as React from 'react';

type EmailTemplateProps = {
  service_email: string;
  service_name: string;
  service_vorname: string;
  service_title: string;
  client_email: string;
  client_name: string;
  client_vorname: string;
  client_phone: string;
  client_message: string;
};

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = (
  {
    service_name,
    service_vorname,
    service_title,
    client_email,
    client_name,
    client_vorname,
    client_phone,
    client_message,
  },
) => (
  <div>
    <h1>
      Sie haben eine Terminanfrage über Care2you erhalten
    </h1>
    <p>
      Hallo
      {' '}
      {service_vorname}
      {' '}
      {service_name}
      ,
    </p>
    <p>
      Wir haben eine Terminanfrage für den Service "
      {service_title}
      " erhalten. Die Details der Anfrage sind wie folgt:
    </p>
    <ul>
      <li>
        <strong>Service:</strong>
        {' '}
        {service_title}
        {' '}

      </li>

      <li>
        <strong>Client Name:</strong>
        {' '}
        {client_vorname}
        {' '}
        {client_name}
      </li>
      <li>
        <strong>Client Email:</strong>
        {' '}
        {client_email}
      </li>
      <li>
        <strong>Client Telefonnummer:</strong>
        {' '}
        {client_phone}
      </li>

      <li>
        <strong>Nachricht des Kunden:</strong>
        {' '}
        {client_message}
      </li>

    </ul>

    <p>
      Vielen Erfolg!
    </p>
  </div>
);
