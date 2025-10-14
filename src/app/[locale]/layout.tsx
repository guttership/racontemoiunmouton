import { ReactNode } from 'react';
import { I18nProvider } from '@/lib/i18n-provider';
import { messages } from '@/lib/messages';
import Footer from '@/components/Footer';

export function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }, { locale: 'es' }, { locale: 'de' }];
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const localeMessages = messages[locale as keyof typeof messages];
  
  return (
    <I18nProvider messages={localeMessages} locale={locale}>
      {children}
      <Footer />
    </I18nProvider>
  );
}
