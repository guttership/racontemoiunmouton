'use client';

import { usePathname, useRouter } from '@/navigation';
import { locales, localeNames, type Locale } from '@/i18n';
import { useState } from 'react';

export default function LocaleSwitcher({ currentLocale }: { currentLocale: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLocaleChange = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
    router.refresh();
    setIsOpen(false);
  };

  const flagEmojis: Record<Locale, string> = {
    fr: '🇫🇷',
    en: '🇬🇧',
    es: '🇪🇸',
    de: '🇩🇪',
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
        aria-label="Change language"
      >
        <span className="text-xl">{flagEmojis[currentLocale as Locale]}</span>
        <span>{localeNames[currentLocale as Locale]}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute right-0 z-20 w-48 mt-2 origin-top-right bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="py-1">
              {locales.map((locale) => (
                <button
                  key={locale}
                  onClick={() => handleLocaleChange(locale)}
                  className={`flex items-center gap-3 w-full px-4 py-2 text-sm text-left transition-colors ${
                    locale === currentLocale
                      ? 'bg-orange-50 text-orange-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{flagEmojis[locale]}</span>
                  <span>{localeNames[locale]}</span>
                  {locale === currentLocale && (
                    <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
