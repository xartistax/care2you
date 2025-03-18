import { createListCollection } from '@chakra-ui/react';

export type OnBoardingClientUser = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | undefined;
  imageUrl?: string | null;
  privateMetadata: {
    phone: unknown;
    gender: unknown;
    role: unknown;
    compilance: unknown;
    companyTitle: unknown;
    companyDescription: unknown;
    companyCategory: unknown;
    serviceCategory: unknown;
    uidst: unknown;
    credits: unknown;
    expertise: unknown;
    skill: unknown[];
    languages: unknown[];
    certificates: unknown[];
    workingHours: {
      Montag: WorkingHours;
      Dienstag: WorkingHours;
      Mittwoch: WorkingHours;
      Donnerstag: WorkingHours;
      Freitag: WorkingHours;
      Samstag: WorkingHours;
      Sonntag: WorkingHours;
    };
  };
};

export type WorkingHours = {
  enabled: boolean;
  hours: [string, string]; // Exactly two string elements for start & end time
};

export type ServiceFormData = {
  id: string;
  serviceImage: string;
  fileToUpload: File | null;
  workingHours: {
    Montag: WorkingHours;
    Dienstag: WorkingHours;
    Mittwoch: WorkingHours;
    Donnerstag: WorkingHours;
    Freitag: WorkingHours;
    Samstag: WorkingHours;
    Sonntag: WorkingHours;
  };
  serviceTitle: string;
  serviceDescription: string;
  price: number;
  priceType: string; // This can be "fix" or "hourly" if you want stricter typing
  formattedPrice: string;
  calendly: string;
  location: {
    street: string;
    number: string;
    city: string;
    postalCode: string;
  };
};

export const defaultWorkingHours: {
  Montag: WorkingHours;
  Dienstag: WorkingHours;
  Mittwoch: WorkingHours;
  Donnerstag: WorkingHours;
  Freitag: WorkingHours;
  Samstag: WorkingHours;
  Sonntag: WorkingHours;
} = {
  Montag: { enabled: false, hours: ['08:00', '16:00'] },
  Dienstag: { enabled: false, hours: ['08:00', '16:00'] },
  Mittwoch: { enabled: false, hours: ['08:00', '16:00'] },
  Donnerstag: { enabled: false, hours: ['08:00', '16:00'] },
  Freitag: { enabled: false, hours: ['08:00', '16:00'] },
  Samstag: { enabled: false, hours: ['08:00', '16:00'] },
  Sonntag: { enabled: false, hours: ['08:00', '16:00'] },
};

export const categoriesList = createListCollection({
  items: [
    { value: 'all', label: 'Alle Services' },
    { value: '0', label: 'Mobilität & Transport' },
    { value: '1', label: 'Fusspflege' },
    { value: '2', label: 'Massage' },
    { value: '3', label: 'Physiotherapie' },
    { value: '4', label: 'Ergotherapie' },
    { value: '5', label: 'Coiffure' },
    { value: '6', label: 'Begleitdienst' },
    { value: '7', label: 'Haushaltdienstleistung' },
    { value: '8', label: 'Hauswart und Handwerkerdienste' },
    { value: '9', label: 'Mahlzeitendienst' },
    { value: '10', label: 'Andere' },
  ],
});
