'use client';

import { createContext, useContext, ReactNode } from 'react';

type MessageValue = string | Record<string, MessageValue>;
type Messages = Record<string, MessageValue>;

const I18nContext = createContext<{ messages: Messages; locale: string } | null>(null);

export function I18nProvider({ children, messages, locale }: { children: ReactNode; messages: Messages; locale: string }) {
  return (
    <I18nContext.Provider value={{ messages, locale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslations(namespace: string) {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useTranslations doit être utilisé dans I18nProvider');
  
  return (key: string, params?: Record<string, string | number>) => {
    const keys = `${namespace}.${key}`.split('.');
    let value: MessageValue = context.messages;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (typeof value === 'string' && params) {
      return value.replace(/\{(\w+)\}/g, (_, key) => params[key] ?? `{${key}}`);
    }
    
    return value || key;
  };
}

export function useLocale() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useLocale doit être utilisé dans I18nProvider');
  return context.locale;
}
