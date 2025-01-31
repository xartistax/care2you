'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

import type { OnBoardingClientUser } from '@/validations/onBoardingValidation';

export type OnboardingState = {
  step: number;
  data: OnBoardingClientUser ;
};

type OnboardingContextProps = {
  formState: OnboardingState;
  setFormState: React.Dispatch<React.SetStateAction<OnboardingState>>;
  nextStep: () => void;
  prevStep: () => void;
  showAlert: boolean;
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
  alertMessage: string;
  setAlertMessage: React.Dispatch<React.SetStateAction<string>>;
  isChecked: boolean;
  setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
  pageVariants: {
    initial: object;
    animate: object;
    exit: object;
  };
  animationDirection: string;
  locale: string;
};

const OnboardingContext = createContext<OnboardingContextProps | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode; initialState: OnboardingState; locale: string }> = ({ children, initialState, locale }) => {
  const [formState, setFormState] = useState<OnboardingState>({
    step: 1,
    data: {
      id: initialState.data.id,
      firstName: initialState.data.firstName,
      lastName: initialState.data.lastName,
      email: initialState.data.email,
      privateMetadata: {
        status: initialState.data.privateMetadata.status,
        dob: initialState.data.privateMetadata.dob,
        nationality: initialState.data.privateMetadata.nationality,
        streetnumber: initialState.data.privateMetadata.streetnumber,
        street: initialState.data.privateMetadata.street,
        plz: initialState.data.privateMetadata.plz,
        location: initialState.data.privateMetadata.location,
        phone: initialState.data.privateMetadata.phone,
        gender: initialState.data.privateMetadata.gender,
        role: initialState.data.privateMetadata.role,
        compilance: initialState.data.privateMetadata.compilance,
        companyTitle: initialState.data.privateMetadata.companyTitle,
        companyDescription: initialState.data.privateMetadata.companyDescription,
        companyCategory: initialState.data.privateMetadata.companyCategory,
        serviceCategory: initialState.data.privateMetadata.serviceCategory,
        uidst: initialState.data.privateMetadata.uidst,
        credits: initialState.data.privateMetadata.credits,
        expertise: initialState.data.privateMetadata.expertise,
        skill: Array.isArray(initialState.data.privateMetadata?.skill) ? initialState.data.privateMetadata.skill : [],
        languages: Array.isArray(initialState.data.privateMetadata?.languages) ? initialState.data.privateMetadata.languages : [],
        certificates: Array.isArray(initialState.data.privateMetadata?.certificates) ? initialState.data.privateMetadata.certificates : [],
        workingHours: initialState.data.privateMetadata?.workingHours || {

          Montag: { enabled: false, hours: ['08:00', '16:00'] },
          Dienstag: { enabled: false, hours: ['08:00', '16:00'] },
          Mittwoch: { enabled: false, hours: ['08:00', '16:00'] },
          Donnerstag: { enabled: false, hours: ['08:00', '16:00'] },
          Freitag: { enabled: false, hours: ['08:00', '16:00'] },
          Samstag: { enabled: false, hours: ['08:00', '16:00'] },
          Sonntag: { enabled: false, hours: ['08:00', '16:00'] },
        },
      },
    },
  });

  const [animationDirection, setAnimationDirection] = useState<'left' | 'right'>('left');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  type PageVariants = {
    initial: object;
    animate: object;
    exit: object;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pageVariants: PageVariants = {
    initial: {
      opacity: 0,
      x: '-100vw',
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      x: '100vw',
      transition: {
        duration: 0.5,
      },
    },
  };

  const nextStep = () => {
    setAnimationDirection('left'); // Neue Seite kommt von rechts (Standardrichtung)
    setFormState(prev => ({ ...prev, step: prev.step + 1 }));
  };

  const prevStep = () => {
    setAnimationDirection('right'); // Alte Seite kommt von links
    setFormState(prev => ({ ...prev, step: Math.max(prev.step - 1, 1) }));
  };

  const value = useMemo(
    () => ({
      formState,
      setFormState,
      showAlert,
      setShowAlert,
      alertMessage,
      setAlertMessage,
      isChecked,
      setIsChecked,
      nextStep,
      prevStep,
      pageVariants,
      animationDirection, // Neue Variable
      setAnimationDirection, // Setter-Funktion für Richtung
      locale,
    }),
    [formState, showAlert, alertMessage, isChecked, pageVariants, animationDirection, locale],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export default OnboardingContext;
