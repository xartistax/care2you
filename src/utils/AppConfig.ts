import type { LocalePrefix } from 'node_modules/next-intl/dist/types/src/routing/types';

const localePrefix: LocalePrefix = 'always';

// FIXME: Update this configuration file based on your project information
export const AppConfig = {
  name: 'Care2You',
  locales: ['de'],
  userRoles: ['client', 'service', 'care', 'admin'],
  defaultLocale: 'de',
  localePrefix,
};
