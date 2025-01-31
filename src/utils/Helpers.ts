import type { User } from '@clerk/nextjs/server';
import { v4 as uuidv4 } from 'uuid';
import type { z } from 'zod';

import type { OnboardingState } from '@/contexts/OnboardingContext';
import { Env } from '@/libs/Env';
import type { addressSchema } from '@/validations/addressValidation';
import type { OnBoardingClientUser } from '@/validations/onBoardingValidation';
import type { serviceSchema } from '@/validations/serviceValidation';

import { AppConfig } from './AppConfig';
import type { WorkingHours } from './Types';

type ServiceFormData = z.infer<typeof serviceSchema>;
type AddressFormData = z.infer<typeof addressSchema>;

export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (
    process.env.VERCEL_ENV === 'production'
    && process.env.VERCEL_PROJECT_PRODUCTION_URL
  ) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
};

export const getI18nPath = (url: string, locale: string) => {
  if (locale === AppConfig.defaultLocale) {
    return url;
  }

  return `/${locale}${url}`;
};

export const getClerkHeaders = (locale: string) => ({
  'Authorization': Env.CLERK_SECRET_KEY,
  'Cookie': `NEXT_LOCALE=${locale}`,
  'Content-Type': 'application/json',
});

export const getHeaders = (locale: string) => ({
  'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
  'Content-Type': 'application/json',
  'Cookie': `NEXT_LOCALE=${locale}`,
});

/// Get the ROLE & Check vaildility
export const chekOnboarding = async (locale: string, userId: string) => {
  try {
    const headers = getClerkHeaders(locale);
    const response = await fetch(`${getBaseUrl()}/${locale}/api/check-user-login`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();

    return data.result === true; // Return true if the server indicates success
  } catch (error) {
    console.error('Error in chekOnboarding:', error);
    return false;
  }
};

/// Get User Salutation
export const getSalutation = (gender: '0' | '1') => {
  switch (gender) {
    case '0':
      return 'Sehr geehrter Herr';
    case '1':
      return 'Sehr geehrte Frau';
  }
};

/// Get User Salutation
export const getShortSalutation = (gender: '0' | '1') => {
  switch (gender) {
    case '0':
      return 'Herr';
    case '1':
      return 'Frau';
  }
};

/// Update Clients Name & FirstName
export const updateFirstAndLastName = async (locale: string, user: OnBoardingClientUser) => {
  try {
    const response = await fetch(`/api/update-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Content-Type Header explizit setzen
      },
      body: JSON.stringify({
        locale,
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      }),
    });

    // Prüfe den HTTP-Status der Antwort
    if (!response.ok) {
      const errorResponse = await response.text(); // Lese die Fehlermeldung
      console.error(`Failed to update user: ${response.status} - ${response.statusText}`);
      console.error(`Response body: ${errorResponse}`);
      return false;
    }

    // Parsen der JSON-Antwort
    // const responseBody = await response.json();

    return true;
  } catch (error) {
    console.error('Error in updateFirstAndLastName:', error);
    return false;
  }
};

/// Update userdata
export const updateUserDataService = async (locale: string, user: OnBoardingClientUser) => {
  try {
    const response = await fetch(`/api/update-data-service`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Setze den Header explizit
      },
      body: JSON.stringify({
        user,
        locale,
      }),
    });

    // Prüfe den HTTP-Status der Antwort
    if (!response.ok) {
      const errorResponse = await response.text(); // Lese die Fehlermeldung aus der Antwort
      console.error(`Failed to update user: ${response.status} - ${response.statusText}`);
      console.error(`Response body: ${errorResponse}`);
      return false;
    }

    // Parsen der JSON-Antwort
    // const responseBody = await response.json();

    return true;
  } catch (error) {
    // Fehler bei Netzwerk oder Fetch
    console.error('Error in updateUserDataService:', error);
    return false;
  }
};

export const updateUserDataCare = async (locale: string, user: OnBoardingClientUser) => {
  try {
    const response = await fetch(`/api/update-data-care`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Setze den Header explizit
      },
      body: JSON.stringify({
        user,
        locale,
      }),
    });

    // Prüfe den HTTP-Status der Antwort
    if (!response.ok) {
      const errorResponse = await response.text(); // Lese die Fehlermeldung aus der Antwort
      console.error(`Failed to update user: ${response.status} - ${response.statusText}`);
      console.error(`Response body: ${errorResponse}`);
      return false;
    }

    // Parsen der JSON-Antwort
    // const responseBody = await response.json();

    return true;
  } catch (error) {
    // Fehler bei Netzwerk oder Fetch
    console.error('Error in updateUserDataService:', error);
    return false;
  }
};

/// Update Compilance
export const updateCompilance = async (userId: string) => {
  try {
    const response = await fetch(`/api/update-compilance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Header für JSON hinzufügen
      },
      body: JSON.stringify({ userId }), // JSON-Daten senden
    });

    // Prüfe den HTTP-Status
    if (!response.ok) {
      const errorText = await response.text(); // Hole die Antwort im Fehlerfall
      console.error(`Failed to update compliance: ${response.status} - ${response.statusText}`);
      console.error(`Response body: ${errorText}`);
      return false;
    }

    return true; // Erfolg
  } catch (error) {
    // Netzwerk- oder andere Fehler
    console.error('Error in updateCompilance:', error);
    return false;
  }
};

export const removeCompilance = async (userId: string) => {
  try {
    const response = await fetch(`/api/remove-compilance`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      console.error(`Failed to update compilance: ${response.statusText}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateRole:', error);
    return false;
  }
};

export const chekCompilance = async (locale: string, userId: string) => {
  try {
    const response = await fetch(`${getBaseUrl()}/${locale}/api/check-compilance`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      console.error(`Failed to check compilance: ${response.statusText}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in checkCompilance:', error);
    return false;
  }
};

export const currentUser = async (locale: string, userId: string) => {
  try {
    const response = await fetch(`${getBaseUrl()}/${locale}/api/current-user`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      console.error(`Failed to update compilance: ${response.statusText}`);
      return false;
    }

    return response;
  } catch (error) {
    console.error('Error in updateRole:', error);
    return false;
  }
};

export const constructOnboardingUser = (formState: OnboardingState): OnBoardingClientUser => {
  return {
    id: formState.data.id,
    firstName: formState.data.firstName,
    lastName: formState.data.lastName,
    email: formState.data.email,
    imageUrl: formState.data.imageUrl || null,
    privateMetadata: {

      status: formState.data.privateMetadata.status,
      dob: formState.data.privateMetadata.dob,
      nationality: formState.data.privateMetadata.nationality,

      phone: formState.data.privateMetadata.phone,
      gender: formState.data.privateMetadata.gender,
      role: formState.data.privateMetadata.role,
      compilance: formState.data.privateMetadata.compilance,
      companyTitle: `${formState.data.privateMetadata.companyTitle}`,
      companyDescription: formState.data.privateMetadata.companyDescription,
      companyCategory: formState.data.privateMetadata.companyCategory,
      serviceCategory: formState.data.privateMetadata.serviceCategory,
      uidst: formState.data.privateMetadata.uidst,
      credits: formState.data.privateMetadata.credits,
      expertise: formState.data.privateMetadata.expertise,
      skill: formState.data.privateMetadata.skill,
      languages: formState.data.privateMetadata.languages,
      certificates: formState.data.privateMetadata.certificates,
      workingHours: formState.data.privateMetadata.workingHours,
      street: formState.data.privateMetadata.street,
      streetnumber: formState.data.privateMetadata.streetnumber,
      plz: formState.data.privateMetadata.plz,
      location: formState.data.privateMetadata.location,

    },
  };
};

export const constructUser = (user: User): OnBoardingClientUser => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.emailAddresses[0]?.emailAddress,
    imageUrl: user.imageUrl || null,
    privateMetadata: {
      status: user.privateMetadata.status,
      dob: user.privateMetadata.dob,
      nationality: user.privateMetadata.nationality,
      phone: user.privateMetadata.phone,
      gender: user.privateMetadata.gender,
      role: user.privateMetadata.role,
      compilance: user.privateMetadata.compilance,
      companyTitle: user.privateMetadata.companyTitle,
      companyDescription: user.privateMetadata.companyDescription,
      companyCategory: user.privateMetadata.companyCategory,
      serviceCategory: user.privateMetadata.serviceCategory,
      uidst: user.privateMetadata.uidst,
      credits: user.privateMetadata.credits,
      expertise: user.privateMetadata.expertise,
      skill: user.privateMetadata.skill as unknown[],
      languages: user.privateMetadata.languages as unknown[],
      certificates: user.privateMetadata.certificates as unknown[],
      workingHours: user.privateMetadata.workingHours as {
        Montag: WorkingHours;
        Dienstag: WorkingHours;
        Mittwoch: WorkingHours;
        Donnerstag: WorkingHours;
        Freitag: WorkingHours;
        Samstag: WorkingHours;
        Sonntag: WorkingHours;
      },
      street: user.privateMetadata.street,
      streetnumber: user.privateMetadata.streetnumber,
      plz: user.privateMetadata.plz,

      location: user.privateMetadata.location,
    },
  };
};

export const giveCredits = (role: string) => {
  if (role === 'service') {
    return 10;
  } else {
    return 0;
  }
};

export const uploadImageToBunny = async (serviceImage: File | null) => {
  if (!serviceImage) {
    throw new Error('No file provided for upload.');
  }

  const formData = new FormData();
  formData.append('file', serviceImage);

  const response = await fetch('/api/bunny-upload', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(`Upload failed: ${result.error || response.statusText}`);
  }

  return result; // This should be { success: true, url: "..." }
};

export const saveNewService = async (formData: ServiceFormData, userId: string) => {
  try {
    const response = await fetch(`/api/addNewService`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({
        internalId: uuidv4(),
        userId,
        title: formData.title as string, // Ensure it's a string
        description: formData.description as string, // Ensure it's a string
        category: formData.category as string,
        price: formData.price,
        priceType: formData.priceType === 'fix' ? 'fix' : 'hourly', // Convert to expected format
        image: formData.image,
        calendly: formatLink(formData.calendly),
        workingHours: Object.keys(formData.workingHours).reduce((acc, day) => {
          const dayKey = day as keyof typeof formData.workingHours; // ✅ Cast `day` to a valid key
          acc[dayKey] = {
            enabled: formData.workingHours[dayKey].enabled,
            hours: formData.workingHours[dayKey].hours,
          };
          return acc;
        }, {} as Record<string, { enabled: boolean; hours: [string, string] }>),
        location: {
          street: formData.location.street,
          number: formData.location.number,
          city: formData.location.city,
          postalCode: formData.location.postalCode,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add new service: ${response.status} - ${response.statusText}\n${errorText}`);
    }

    return true;
  } catch (error) {
    console.error('Error in saveNewService:', error);
    throw error;
  }
};

export const decreaseCreditByOne = async (userId: string) => {
  try {
    const response = await fetch(`/api/decrease-credit`, {
      method: 'POST',
      body: JSON.stringify({
        userId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to decrease cxredit: ${response.status} - ${response.statusText}\n${errorText}`);
    }

    return true;
  } catch (error) {
    console.error('Error in decrease credit:', error);
    throw error;
  }
};

export const topUpCredits = async (userId: string, credits: number) => {
  try {
    const response = await fetch(`/api/addCredits`, {
      method: 'POST',
      body: JSON.stringify({
        userId,
        credits,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to decrease cxredit: ${response.status} - ${response.statusText}\n${errorText}`);
    }

    return true;
  } catch (error) {
    console.error('Error in decrease credit:', error);
    throw error;
  }
};

export const companyTypeRetriever = (companyType: string) => {
  switch (companyType) {
    case '0':
      return 'AG';
    case '1':
      return 'GmbH';
    case '2':
      return 'Einzelfirma';

    default:
      return 'Einzelfirma';
  }
};

export const expertiseTypeRetriever = (expertise: string) => {
  switch (expertise) {
    case '0':
      return 'weniger als 1-Jahr';
    case '1':
      return 'zwischen 1 und 3 Jahre';
    case '2':
      return 'über 5 Jahre';

    default:
      return 'weniger als 1-Jahr';
  }
};

export const categoryTypeRetriever = (category: string) => {
  switch (category) {
    case '0':
      return 'Alltagshilfe';
    case '1':
      return 'Pflege & Gesundheitsversorgung';
    case '2':
      return 'Demenzbetreuung';
    case '3':
      return 'Begleitung & Gesellschaft';
    case '4':
      return '24-Stunden-Betreuung';
    case '5':
      return 'Haushaltsdienstleistungen';
    case '6':
      return 'Mobilität & Transport';
    case '7':
      return 'Essen & Ernährung';
    case '8':
      return 'Technikhilfe für Senioren';
    case '9':
      return 'Anträge & Bürokratie';
    default:
      return 'Alltagshilfe'; // Default case remains the same
  }
};

export const editAddress = async (formData: AddressFormData, userId: string) => {
  try {
    const response = await fetch(`/api/editAddress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: {
          id: userId, // Make sure to include the user ID
          privateMetadata: {
            street: formData.street,
            streetNumber: formData.streetnumber,
            location: formData.location,
            plz: formData.plz,
            phone: formData.phone,
          },
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to addressEdit cxredit: ${response.status} - ${response.statusText}\n${errorText}`);
    }

    return true;
  } catch (error) {
    console.error('Error address edit:', error);
    throw error;
  }
};

export const updateStatus = async (userId: string, currentStatus: string) => {
  try {
    const response = await fetch(`/api/change-user-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Header für JSON hinzufügen
      },
      body: JSON.stringify({ userId, currentStatus }), // JSON-Daten senden
    });

    // Prüfe den HTTP-Status
    if (!response.ok) {
      return false;
    }
    return true; // Erfolg
  } catch (error) {
    // Netzwerk- oder andere Fehler
    console.error('Error in updateStatus:', error);
    return false;
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const response = await fetch(`/api/change-user-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Header für JSON hinzufügen
      },
      body: JSON.stringify({ userId }), // JSON-Daten senden
    });

    // Prüfe den HTTP-Status
    if (!response.ok) {
      return false;
    }
    return true; // Erfolg
  } catch (error) {
    // Netzwerk- oder andere Fehler
    console.error('Error in deleteUser:', error);
    return false;
  }
};

export function formatLink(input: string) {
  // Trim any extra spaces
  let link = input.trim();

  // Check if the input already has a protocol (http:// or https://)
  if (!link.match(/^https?:\/\//)) {
    // If not, prepend https://www.
    if (!link.match(/^www\./)) {
      link = `https://www.${link}`;
    } else {
      link = `https://${link}`;
    }
  }

  return link;
}
