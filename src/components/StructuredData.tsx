'use client';

import { useLocale, useTranslations } from '@/lib/i18n-provider';

export default function StructuredData() {
  const locale = useLocale();
  const t = useTranslations('Meta');
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t('title'),
    description: t('description'),
    url: `https://racontemoiunmouton.dmum.eu/${locale}`,
    applicationCategory: 'EntertainmentApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
    creator: {
      '@type': 'Person',
      name: 'Yann Gutter',
      url: 'https://dmum.eu',
    },
    inLanguage: [locale],
    audience: {
      '@type': 'PeopleAudience',
      audienceType: 'Parents of young children',
    },
    keywords: t('keywords'),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
