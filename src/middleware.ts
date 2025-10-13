import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  // Langues supportées
  locales,
  
  // Langue par défaut
  defaultLocale,
  
  // Stratégie de détection de locale
  localeDetection: true,
  
  // Préfixe toujours visible dans l'URL (meilleur pour SEO)
  localePrefix: 'always',
});

export const config = {
  // Matcher pour exclure les fichiers statiques et API
  matcher: [
    // Inclure toutes les routes sauf :
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // Mais inclure les routes API de l'app si nécessaire
    // '/(api|trpc)(.*)',
  ],
};
