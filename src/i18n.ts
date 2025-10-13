import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Langues supportées
export const locales = ['fr', 'en', 'es', 'de'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';

export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
};

export default getRequestConfig(async ({ locale }) => {
  // Valider que la locale entrante est supportée
  const isValidLocale = locales.some((l) => l === locale);
  if (!isValidLocale) notFound();

  const validLocale = locale!; // Assert non-null après validation

  return {
    locale: validLocale,
    messages: (await import(`../messages/${validLocale}.json`)).default,
  };
});
