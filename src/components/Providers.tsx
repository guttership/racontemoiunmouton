'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/lib/theme-provider';
import { I18nProvider } from '@/lib/i18n-provider';

interface ProvidersProps {
  children: ReactNode;
  locale: string;
  messages: Record<string, unknown>;
}

export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <ThemeProvider>
      <I18nProvider messages={messages} locale={locale}>
        {children}
      </I18nProvider>
    </ThemeProvider>
  );
}
