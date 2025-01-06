import type { User } from '@clerk/nextjs/server';

import type { OnboardingState } from '@/contexts/OnboardingContext';
import { Env } from '@/libs/Env';

import { AppConfig } from './AppConfig';
import type { OnBoardingClientUser, ServiceFormData } from './Types';

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
export const updateUserData = async (locale: string, user: OnBoardingClientUser) => {
  try {
    const response = await fetch(`/api/update-data`, {
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
    console.error('Error in updateUserData:', error);
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
      phone: formState.data.privateMetadata.phone,
      gender: formState.data.privateMetadata.gender,
      role: formState.data.privateMetadata.role,
      compilance: formState.data.privateMetadata.compilance,
      companyTitle: formState.data.privateMetadata.companyTitle,
      companyDescription: formState.data.privateMetadata.companyDescription,
      companyCategory: formState.data.privateMetadata.companyCategory,
      serviceCategory: formState.data.privateMetadata.serviceCategory,
      uidst: formState.data.privateMetadata.uidst,
      credits: undefined,
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
        title: formData.serviceTitle as string, // Ensure it's a string
        description: formData.serviceDescription as string, // Ensure it's a string
        price: formData.price,
        priceType: formData.priceType === 'Fixpreis' ? 'fix' : 'hourly', // Convert to expected format
        userId,
        image: formData.serviceImage,
        calendly: formData.calendly,
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
