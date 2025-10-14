import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://racontemoiunmouton.dmum.eu';
  const locales = ['fr', 'en', 'es', 'de'];
  const lastModified = new Date();

  const pages: MetadataRoute.Sitemap = [];

  // Page d'accueil pour chaque langue avec hreflang
  locales.forEach(locale => {
    pages.push({
      url: `${baseUrl}/${locale}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: {
          'fr': `${baseUrl}/fr`,
          'en': `${baseUrl}/en`,
          'es': `${baseUrl}/es`,
          'de': `${baseUrl}/de`,
        }
      }
    });
  });

  // Page mentions légales pour chaque langue
  locales.forEach(locale => {
    pages.push({
      url: `${baseUrl}/${locale}/mentions-legales`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.3,
      alternates: {
        languages: {
          'fr': `${baseUrl}/fr/mentions-legales`,
          'en': `${baseUrl}/en/mentions-legales`,
          'es': `${baseUrl}/es/mentions-legales`,
          'de': `${baseUrl}/de/mentions-legales`,
        }
      }
    });
  });

  // Redirection racine (redirige vers /fr)
  pages.push({
    url: baseUrl,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  });

  return pages;
}
