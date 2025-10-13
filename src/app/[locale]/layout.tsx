import type { Metadata } from "next";
import Footer from "@/components/Footer";
import LocaleSwitcher from '@/components/LocaleSwitcher';
import { getTranslations, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n';

type Props = {
  params: Promise<{ locale: string }>;
};

// Génération de métadonnées par langue
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  
  const localeMap: Record<Locale, string> = {
    fr: 'fr_FR',
    en: 'en_US',
    es: 'es_ES',
    de: 'de_DE',
  };

  return {
    metadataBase: new URL('https://racontemoiunmouton.dmum.eu'),
    title: {
      default: t('title'),
      template: `%s | ${t('title')}`,
    },
    description: t('description'),
    keywords: t('keywords'),
    authors: [{ name: t('title') }],
    creator: t('title'),
    publisher: t('title'),
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `https://racontemoiunmouton.dmum.eu/${locale}`,
      siteName: t('title'),
      images: [
        {
          url: "/logo_mouton.svg",
          width: 400,
          height: 400,
          alt: `${t('title')} - Logo`,
        },
      ],
      locale: localeMap[locale as Locale],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t('title'),
      description: t('description'),
      images: ["/logo_mouton.svg"],
      creator: "@racontemoiunmouton",
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `https://racontemoiunmouton.dmum.eu/${locale}`,
      languages: {
        'fr': '/fr',
        'en': '/en',
        'es': '/es',
        'de': '/de',
      },
    },
    verification: {
      google: 'google-site-verification-code',
    },
  };
}

// Générer les paramètres statiques pour toutes les locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  //  Vérifier que la locale est supportée
  const isValidLocale = locales.some((l) => l === locale);
  if (!isValidLocale) {
    notFound();
  }

  // Récupérer les messages de traduction
  const messages = await getMessages();

  // JSON-LD Schema.org
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Raconte-moi un mouton',
    description: 'Application de création d\'histoires personnalisées pour enfants avec l\'intelligence artificielle',
    url: `https://racontemoiunmouton.dmum.eu/${locale}`,
    applicationCategory: 'EntertainmentApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
    audience: {
      '@type': 'PeopleAudience',
      suggestedMinAge: 0,
      suggestedMaxAge: 12,
    },
    inLanguage: locale,
    featureList: [
      'Création d\'histoires personnalisées',
      'Narration audio avec voix IA',
      'Choix de personnages et environnements',
      'Histoires adaptées à l\'âge de l\'enfant',
    ],
  };

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <div className="flex flex-col min-h-screen">
        <header className="fixed top-4 right-4 z-50">
          <LocaleSwitcher currentLocale={locale} />
        </header>
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        <main className="flex-1">
          {children}
        </main>
        
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
