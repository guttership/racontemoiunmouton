import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: 'always'
});

export const config = {
  // Exclude API routes, Next.js internals, static files, and SEO files (sitemap, robots)
  matcher: ['/((?!api|_next|_vercel|sitemap\\.xml|robots\\.txt|favicon\\.ico|.*\\.svg|.*\\.png|.*\\.jpg).*)']
};
