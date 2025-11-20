'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from '@/lib/theme-provider';

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
    <SessionProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </NextIntlClientProvider>
    </SessionProvider>
  );
}
