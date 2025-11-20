import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Can be imported from a shared config
const locales = ['fr', 'en', 'es', 'de'] as const;

// @ts-expect-error - Next-intl v4 type inference issue with Next.js 15
export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as 'fr' | 'en' | 'es' | 'de')) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
