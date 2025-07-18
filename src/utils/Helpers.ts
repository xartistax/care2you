import type { User } from '@clerk/nextjs/server';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import type { z } from 'zod';

import type { OnboardingState } from '@/contexts/OnboardingContext';
import { Env } from '@/libs/Env';
import { logError, logMessage, logWarning } from '@/utils/sentryLogger';
import type { addressSchema } from '@/validations/addressValidation';
import type { careSchema } from '@/validations/careValidation';
import type { companySchema } from '@/validations/companyValidation';
import type { OnBoardingClientUser } from '@/validations/onBoardingValidation';
import type { serviceSchema } from '@/validations/serviceValidation';

import { AppConfig } from './AppConfig';
import type { WorkingHours } from './Types';

type ServiceFormData = z.infer<typeof serviceSchema>;
type AddressFormData = z.infer<typeof addressSchema>;
type CompanyFormData = z.infer<typeof companySchema>;
type CareFormData = z.infer<typeof careSchema>;

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
    logMessage('Helpers: Checking onboarding', { file: 'Helpers.ts', locale, userId });
    const response = await fetch(`${getBaseUrl()}/${locale}/api/check-user-login`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ userId }),
    });
    if (!response.ok) {
      logWarning('Helpers: checkOnboarding response not ok', { file: 'Helpers.ts', status: response.status });
      return false;
    }
    const data = await response.json();
    return data.result === true; // Return true if the server indicates success
  } catch (error) {
    logError(error, { file: 'Helpers.ts', location: 'checkOnboarding' });
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
    logMessage('Helpers: Updating first and last name', { file: 'Helpers.ts', locale, userId: user.id });
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
    if (!response.ok) {
      const errorResponse = await response.text();
      logError('Helpers: Failed to update user', { file: 'Helpers.ts', status: response.status, statusText: response.statusText, errorResponse });
      return false;
    }
    return true;
  } catch (error) {
    logError(error, { file: 'Helpers.ts', location: 'updateFirstAndLastName' });
    return false;
  }
};

/// Update userdata
export const updateUserDataService = async (locale: string, user: OnBoardingClientUser) => {
  try {
    logMessage('Helpers: Updating user data (service)', { file: 'Helpers.ts', locale, userId: user.id });
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
    if (!response.ok) {
      const errorResponse = await response.text();
      logError('Helpers: Failed to update user (service)', { file: 'Helpers.ts', status: response.status, statusText: response.statusText, errorResponse });
      return false;
    }
    return true;
  } catch (error) {
    logError(error, { file: 'Helpers.ts', location: 'updateUserDataService' });
    return false;
  }
};

export const updateUserDataCare = async (locale: string, user: OnBoardingClientUser) => {
  try {
    logMessage('Helpers: Updating user data (care)', { file: 'Helpers.ts', locale, userId: user.id });
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
    if (!response.ok) {
      const errorResponse = await response.text();
      logError('Helpers: Failed to update user (care)', { file: 'Helpers.ts', status: response.status, statusText: response.statusText, errorResponse });
      return false;
    }
    return true;
  } catch (error) {
    logError(error, { file: 'Helpers.ts', location: 'updateUserDataCare' });
    return false;
  }
};

/// Update Compilance
export const updateCompilance = async (userId: string) => {
  try {
    logMessage('Helpers: Updating compliance', { file: 'Helpers.ts', userId });
    const response = await fetch(`/api/update-compilance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Header für JSON hinzufügen
      },
      body: JSON.stringify({ userId }), // JSON-Daten senden
    });

    // Prüfe den HTTP-Status
    if (!response.ok) {
      logWarning('Helpers: updateCompilance response not ok', { file: 'Helpers.ts', status: response.status });
      return false;
    }
    return true; // Erfolg
  } catch (error) {
    logError(error, { file: 'Helpers.ts', location: 'updateCompilance' });
    return false;
  }
};

export const removeCompilance = async (userId: string) => {
  try {
    logMessage('Helpers: Removing compliance', { file: 'Helpers.ts', userId });
    const response = await fetch(`/api/remove-compilance`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
    if (!response.ok) {
      logWarning('Helpers: removeCompilance response not ok', { file: 'Helpers.ts', status: response.status });
      return false;
    }
    return true;
  } catch (error) {
    logError(error, { file: 'Helpers.ts', location: 'removeCompilance' });
    return false;
  }
};

export const chekCompilance = async (locale: string, userId: string) => {
  try {
    logMessage('Helpers: Checking compliance', { file: 'Helpers.ts', locale, userId });
    const response = await fetch(`${getBaseUrl()}/${locale}/api/check-compilance`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
    if (!response.ok) {
      logWarning('Helpers: chekCompilance response not ok', { file: 'Helpers.ts', status: response.status });
      return false;
    }
    return true;
  } catch (error) {
    logError(error, { file: 'Helpers.ts', location: 'chekCompilance' });
    return false;
  }
};

export const currentUser = async (locale: string) => {
  try {
    logMessage('Helpers: Fetching current user', { file: 'Helpers.ts', locale });
    const response = await fetch(`${getBaseUrl()}/${locale}/api/current-user`, {
      method: 'POST',
    });
    if (!response.ok) {
      logWarning('Helpers: currentUser response not ok', { file: 'Helpers.ts', status: response.status });
      return false;
    }
    return response;
  } catch (error) {
    logError(error, { file: 'Helpers.ts', location: 'currentUser' });
    return false;
  }
};

export const constructOnboardingUser = (formState: OnboardingState): OnBoardingClientUser => {
  return {
    id: formState.data.id,
    phone: formState.data.privateMetadata.phone as string,
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
    phone: user.privateMetadata.phone as string,
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
    logError('Helpers: No file provided for upload', { file: 'Helpers.ts' });
    throw new Error('No file provided for upload.');
  }
  logMessage('Helpers: Uploading image to Bunny', { file: 'Helpers.ts', fileName: serviceImage.name });
  const formData = new FormData();
  formData.append('file', serviceImage);
  const response = await fetch('/api/bunny-upload', {
    method: 'POST',
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) {
    logError('Helpers: Upload to Bunny failed', { file: 'Helpers.ts', error: result.error || response.statusText });
    throw new Error(`Upload failed: ${result.error || response.statusText}`);
  }
  logMessage('Helpers: Image uploaded to Bunny successfully', { file: 'Helpers.ts', url: result.url });
  return result; // This should be { success: true, url: "..." }
};

export const saveNewService = async (formData: ServiceFormData, userId: string) => {
  try {
    logMessage('Helpers: Saving new service', { file: 'Helpers.ts', function: 'saveNewService', userId, formData });
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
      logError('Helpers: Failed to add new service', { file: 'Helpers.ts', function: 'saveNewService', status: response.status, statusText: response.statusText, errorText });
      throw new Error(`Failed to add new service: ${response.status} - ${response.statusText}\n${errorText}`);
    }

    return true;
  } catch (error) {
    logError(error, { file: 'Helpers.ts', function: 'saveNewService' });
    throw error;
  }
};

export const decreaseCreditByOne = async (userId: string) => {
  try {
    logMessage('Helpers: Decreasing credit by one', { file: 'Helpers.ts', function: 'decreaseCreditByOne', userId });
    const response = await fetch(`/api/decrease-credit`, {
      method: 'POST',
      body: JSON.stringify({
        userId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logError('Helpers: Failed to decrease credit', { file: 'Helpers.ts', function: 'decreaseCreditByOne', status: response.status, statusText: response.statusText, errorText });
      throw new Error(`Failed to decrease cxredit: ${response.status} - ${response.statusText}\n${errorText}`);
    }

    return true;
  } catch (error) {
    logError(error, { file: 'Helpers.ts', function: 'decreaseCreditByOne' });
    throw error;
  }
};

export const topUpCredits = async (userId: string, credits: number) => {
  try {
    logMessage('Helpers: Topping up credits', { file: 'Helpers.ts', function: 'topUpCredits', userId, credits });
    const response = await fetch(`/api/addCredits`, {
      method: 'POST',
      body: JSON.stringify({
        userId,
        credits,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logError('Helpers: Failed to top up credits', { file: 'Helpers.ts', function: 'topUpCredits', status: response.status, statusText: response.statusText, errorText });
      throw new Error(`Failed to decrease cxredit: ${response.status} - ${response.statusText}\n${errorText}`);
    }

    return true;
  } catch (error) {
    logError(error, { file: 'Helpers.ts', function: 'topUpCredits' });
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
    case '3':
      return 'Verein';
    case '4':
      return 'Andere';

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
    case 'all':
      return 'all';
    case '0':
      return 'Mobilität & Transport';
    case '1':
      return 'Fusspflege';
    case '2':
      return 'Massage';
    case '3':
      return 'Physiotherapie';
    case '4':
      return 'Ergotherapie';
    case '5':
      return 'Coiffure';
    case '6':
      return 'Begleitdienst';
    case '7':
      return 'Haushaltdienstleistung';
    case '8':
      return 'Hauswart und Handwerkerdienste';
    case '9':
      return 'Mahlzeitendienst';
    default:
      return 'Andere'; // Default aligns with your categoriesList
  }
};

export const editAddress = async (formData: AddressFormData, userId: string) => {
  try {
    logMessage('Helpers: Editing address', { file: 'Helpers.ts', function: 'editAddress', userId, formData });
    const response = await fetch(`/api/editAddress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: {
          id: userId, // Make sure to include the user ID
          privateMetadata: {
            street: formData.street,
            streetnumber: formData.streetnumber,
            location: formData.location,
            plz: formData.plz,
            phone: formData.phone,
          },
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logError('Helpers: Failed to edit address', { file: 'Helpers.ts', function: 'editAddress', status: response.status, statusText: response.statusText, errorText });
      throw new Error(`Failed to addressEdit cxredit: ${response.status} - ${response.statusText}\n${errorText}`);
    }

    return true;
  } catch (error) {
    logError(error, { file: 'Helpers.ts', function: 'editAddress' });
    throw error;
  }
};

export const editCompany = async (formData: CompanyFormData, userId: string) => {
  try {
    logMessage('Helpers: Editing company', { file: 'Helpers.ts', function: 'editCompany', userId, formData });
    const response = await fetch(`/api/editCompany`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: {
          id: userId, // Make sure to include the user ID
          privateMetadata: {
            companyTitle: formData.companyTitle,
            companyCategory: formData.companyCategory,
            uidst: formData.uidst,
            companyDescription: formData.companyDescription,
          },
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logError('Helpers: Failed to edit company', { file: 'Helpers.ts', function: 'editCompany', status: response.status, statusText: response.statusText, errorText });
      throw new Error(`Failed to addressEdit cxredit: ${response.status} - ${response.statusText}\n${errorText}`);
    }

    return true;
  } catch (error) {
    logError(error, { file: 'Helpers.ts', function: 'editCompany' });
    throw error;
  }
};

export const editCare = async (formData: CareFormData, userId: string) => {
  try {
    logMessage('Helpers: Editing care', { file: 'Helpers.ts', function: 'editCare', userId, formData });
    const response = await fetch(`/api/editCare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: {
          id: userId, // Make sure to include the user ID
          privateMetadata: {
            skill: formData.skill,
            expertise: formData.expertise,
            workingHours: formData.workingHours,
            certificates: formData.certificates,
          },
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logError('Helpers: Failed to edit care', { file: 'Helpers.ts', function: 'editCare', status: response.status, statusText: response.statusText, errorText });
      throw new Error(`Failed to editCare: ${response.status} - ${response.statusText}\n${errorText}`);
    }

    return true;
  } catch (error) {
    logError(error, { file: 'Helpers.ts', function: 'editCare' });
    throw error;
  }
};

export const updateStatus = async (userId: string, currentStatus: string) => {
  try {
    logMessage('Helpers: Updating status', { file: 'Helpers.ts', function: 'updateStatus', userId, currentStatus });
    const response = await fetch(`/api/change-user-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Header für JSON hinzufügen
      },
      body: JSON.stringify({ userId, currentStatus }), // JSON-Daten senden
    });

    // Prüfe den HTTP-Status
    if (!response.ok) {
      logWarning('Helpers: updateStatus response not ok', { file: 'Helpers.ts', function: 'updateStatus', status: response.status });
      return false;
    }
    return true; // Erfolg
  } catch (error) {
    // Netzwerk- oder andere Fehler
    logError(error, { file: 'Helpers.ts', function: 'updateStatus' });
    return false;
  }
};

export const deleteUser = async (userId: string, role: string) => {
  try {
    logMessage('Helpers: Deleting user', { file: 'Helpers.ts', function: 'deleteUser', userId, role });
    const response = await fetch(`/api/delete-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Header für JSON hinzufügen
      },
      body: JSON.stringify({ userId, role }), // JSON-Daten senden
    });

    // Prüfe den HTTP-Status
    if (!response.ok) {
      logWarning('Helpers: deleteUser response not ok', { file: 'Helpers.ts', function: 'deleteUser', status: response.status });
      return false;
    }
    return true; // Erfolg
  } catch (error) {
    // Netzwerk- oder andere Fehler
    logError(error, { file: 'Helpers.ts', function: 'deleteUser' });
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

export const get18YearsAgoDate = () => {
  const today = new Date();
  today.setFullYear(today.getFullYear() - 18); // Subtract 18 years
  return format(today, 'dd.MM.yyyy');
};

export const uploadCertsToBunny = async (certFiles: File[]) => {
  try {
    logMessage('Helpers: Uploading certificates to Bunny', { file: 'Helpers.ts', function: 'uploadCertsToBunny', certFilesLength: certFiles?.length });
    if (!certFiles || certFiles.length < 1) {
      logError('Helpers: No file provided for upload', { file: 'Helpers.ts', function: 'uploadCertsToBunny' });
      throw new Error('No file provided for upload.');
    }

    // Create a new FormData object to append the files
    const formData = new FormData();

    // Append each file to the FormData object
    certFiles.forEach((file, index) => {
      formData.append(`file${index}`, file); // Ensure the field name matches on the server side
    });

    // Make the API request with the FormData as the body
    const response = await fetch('/api/caregiver-file-management', {
      method: 'POST',
      body: formData, // The body contains the FormData with files
    });

    // Parse the response and check for success
    const result = await response.json();

    if (!response.ok) {
      logError('Helpers: Upload certificates to Bunny failed', { file: 'Helpers.ts', function: 'uploadCertsToBunny', error: result.error || response.statusText });
      throw new Error(`Upload failed: ${result.error || response.statusText}`);
    }

    logMessage('Helpers: Certificates uploaded to Bunny successfully', { file: 'Helpers.ts', function: 'uploadCertsToBunny', result });
    return result; // This should contain the URLs from the response
  } catch (error) {
    logError(error, { file: 'Helpers.ts', function: 'uploadCertsToBunny' });
    throw error;
  }
};

export const deleteCertsFromBunny = async (urls: string[]) => {
  try {
    logMessage('Helpers: Deleting certificates from Bunny', { file: 'Helpers.ts', function: 'deleteCertsFromBunny', urls });
    const response = await fetch('/api/caregiver-file-management', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      logError('Helpers: Failed to delete certificates from Bunny', { file: 'Helpers.ts', function: 'deleteCertsFromBunny', status: response.status, statusText: response.statusText, errorText });
      throw new Error(`Failed to delete files: ${response.status} - ${response.statusText}\n${errorText}`);
    }
    return true;
  } catch (error) {
    logError(error, { file: 'Helpers.ts', function: 'deleteCertsFromBunny' });
    return false;
  }
};

export const SaveNote = async (note: string, user: OnBoardingClientUser) => {
  try {
    logMessage('Helpers: Saving note', { file: 'Helpers.ts', function: 'SaveNote', userId: user.id, note });
    const response = await fetch(`/api/update-notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Content-Type Header explizit setzen
      },
      body: JSON.stringify({
        user,
        note,
      }),
    });

    // Prüfe den HTTP-Status der Antwort
    if (!response.ok) {
      const errorResponse = await response.text(); // Lese die Fehlermeldung
      logError('Helpers: Failed to update note', { file: 'Helpers.ts', function: 'SaveNote', status: response.status, statusText: response.statusText, errorResponse });
      return false;
    }

    return true;
  } catch (error) {
    logError(error, { file: 'Helpers.ts', function: 'SaveNote' });
    return false;
  }
};

export const formatDate = (dateString: string) => {
  if (!dateString) {
    return 'N/A';
  } // Handle missing dates
  const timeZone = 'Europe/Berlin'; // Equivalent to Europe/Bern
  return new Intl.DateTimeFormat('de-CH', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone,
  }).format(new Date(dateString));
};

export const roleLabels: Record<string, string> = {
  client: 'Kunde',
  service: 'Dienstleister',
  care: 'Pflegeperson',
  admin: 'Administrator',
};
