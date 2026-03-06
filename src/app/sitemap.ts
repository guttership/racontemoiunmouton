import { MetadataRoute } from 'next';

const FR_URL = 'https://racontemoiunmouton.fr';
const EN_URL = 'https://tellmeasheep.com';

// Hreflang alternates communs (toutes les versions de chaque page)
function buildAlts(frPath: string, enPath: string) {
  return {
    'x-default': `${FR_URL}${frPath}`,
    'fr': `${FR_URL}${frPath}`,
    'en': `${EN_URL}${enPath}`,
    'es': `${EN_URL}${enPath.replace('/en/', '/es/')}`,
    'de': `${EN_URL}${enPath.replace('/en/', '/de/')}`,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || FR_URL;
  const isFrSite = siteUrl.includes('racontemoiunmouton');
  const lastModified = new Date('2026-03-06');

  if (isFrSite) {
    // Sitemap pour racontemoiunmouton.fr — uniquement les pages FR
    return [
      {
        url: `${FR_URL}/fr`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 1.0,
        alternates: { languages: buildAlts('/fr', '/en') },
      },
      {
        url: `${FR_URL}/fr/premium`,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: { languages: buildAlts('/fr/premium', '/en/premium') },
      },
      {
        url: `${FR_URL}/fr/mentions-legales`,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.3,
        alternates: { languages: buildAlts('/fr/mentions-legales', '/en/mentions-legales') },
      },
    ];
  }

  // Sitemap pour tellmeasheep.com — EN / ES / DE
  const locales = ['en', 'es', 'de'];
  const pages: MetadataRoute.Sitemap = [];

  locales.forEach(locale => {
    pages.push({
      url: `${EN_URL}/${locale}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: { languages: buildAlts('/fr', '/en') },
    });
  });

  locales.forEach(locale => {
    pages.push({
      url: `${EN_URL}/${locale}/premium`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: { languages: buildAlts('/fr/premium', '/en/premium') },
    });
  });

  locales.forEach(locale => {
    pages.push({
      url: `${EN_URL}/${locale}/mentions-legales`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.3,
      alternates: { languages: buildAlts('/fr/mentions-legales', '/en/mentions-legales') },
    });
  });

  return pages;
}
