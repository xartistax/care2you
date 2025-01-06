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
  };
};

type WorkingHours = {
  enabled: boolean;
  hours: [string, string]; // Exactly two string elements for start & end time
};

export type ServiceFormData = {
  id: string;
  serviceImage: string;
  fileToUpload: File | null;
  workingHours: {
    Monday: WorkingHours;
    Tuesday: WorkingHours;
    Wednesday: WorkingHours;
    Thursday: WorkingHours;
    Friday: WorkingHours;
    Saturday: WorkingHours;
    Sunday: WorkingHours;
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
