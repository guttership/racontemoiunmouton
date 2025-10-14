﻿import { ReactNode } from 'react';
import { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import { messages } from '@/lib/messages';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }, { locale: 'es' }, { locale: 'de' }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const localeMessages = messages[locale as keyof typeof messages];
  const meta = localeMessages.Meta as { title: string; description: string; keywords: string };
  
  const baseUrl = 'https://racontemoiunmouton.dmum.eu';
  const locales = { fr: 'fr', en: 'en', es: 'es', de: 'de' };
  
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    authors: [{ name: 'Yann Gutter', url: 'https://dmum.eu' }],
    creator: 'Yann Gutter',
    publisher: 'dmum.eu',
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'fr': '/fr',
        'en': '/en',
        'es': '/es',
        'de': '/de',
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${baseUrl}/${locale}`,
      siteName: 'Raconte-moi un mouton',
      locale: locales[locale as keyof typeof locales],
      type: 'website',
      images: [
        {
          url: `${baseUrl}/logo_mouton.svg`,
          width: 512,
          height: 512,
          alt: 'Logo Raconte-moi un mouton',
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: meta.title,
      description: meta.description,
      images: [`${baseUrl}/logo_mouton.svg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const localeMessages = messages[locale as keyof typeof messages];
  
  return (
    <Providers locale={locale} messages={localeMessages}>
      <Header />
      {children}
      <Footer />
    </Providers>
  );
}
