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

export const EmailTemplateServiceRequest: React.FC<Readonly<EmailTemplateProps>> = (
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
    <h1>Betreff: Terminanfrage über Care2you – Bitte kontaktieren Sie den Kunden umgehend</h1>
    <p>
      Hallo
      {service_vorname}
      {' '}
      {service_name}
      ,
    </p>
    <p>
      Sie haben eine neue Terminanfrage über Care2you erhalten. Bitte setzen Sie sich so schnell wie möglich mit dem potenziellen Kunden in Verbindung, um Ihre Dienstleistung anzubieten.
    </p>
    <h2>Details der Anfrage:</h2>
    <ul>
      <li>
        <strong>Service:</strong>
        {' '}
        {service_title}
      </li>
      <li>
        <strong>Kundenname:</strong>
        {' '}
        {client_vorname}
        {' '}
        {client_name}
      </li>
      <li>
        <strong>E-Mail:</strong>
        {' '}
        {client_email}
      </li>
      <li>
        <strong>Telefonnummer:</strong>
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
      Bitte beachten Sie, dass Care2you eine reine Serviceplattform ist. Die Terminvereinbarung und die Erbringung der Dienstleistung erfolgen direkt zwischen Ihnen und dem Kunden.
    </p>
    <p>Vielen Dank!</p>
    <p>Ihr Care2you-Team</p>
  </div>
);
