import * as Sentry from '@sentry/nextjs';

export const logError = (error: unknown, context?: Record<string, any>) => {
  Sentry.captureException(error, { extra: context });
};

export const logMessage = (message: string, context?: Record<string, any>) => {
  Sentry.captureMessage(message, { extra: context });
};

export const logWarning = (message: string, context?: Record<string, any>) => {
  Sentry.captureMessage(message, { level: 'warning', extra: context });
};
