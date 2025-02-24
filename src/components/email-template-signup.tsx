import * as React from 'react';

type EmailTemplateProps = {
  user_email: string;
  user_name: string;
  user_vorname: string;
  user_phone: string;
  user_role: string;
};

export const EmailTemplateSignUp: React.FC<Readonly<EmailTemplateProps>> = ({ user_email, user_name, user_vorname, user_phone, user_role }) => (
  <div>
    <h1>Betreff: Neuer Benutzer hat sich auf Care2you registriert</h1>

    <p>
      Ein neuer Benutzer hat sich soeben auf Care2you registriert. Bitte überprüfen Sie die Details und stellen Sie sicher, dass der Account ordnungsgemäss eingerichtet ist.
    </p>
    <h2>Details des neuen Benutzers:</h2>
    <p>
      <strong>Name:</strong>
      {' '}
      {user_vorname}
      {' '}
      {user_name}
    </p>
    <p>
      <strong>E-Mail:</strong>
      {' '}
      {user_email}
    </p>
    <p>
      <strong>Telefon:</strong>
      {' '}
      {user_phone}
    </p>

    <p>
      <strong>Rolle:</strong>
      {' '}
      {user_role}
    </p>
  </div>
);
