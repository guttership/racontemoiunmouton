'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/lib/theme-provider';
import { I18nProvider } from '@/lib/i18n-provider';

interface MessageValue {
  [key: string]: string | MessageValue;
}

type Messages = Record<string, MessageValue>;

interface ProvidersProps {
  children: ReactNode;
  locale: string;
  messages: Messages;
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
