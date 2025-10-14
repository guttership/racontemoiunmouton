import frMessages from '../../messages/fr.json';
import enMessages from '../../messages/en.json';
import esMessages from '../../messages/es.json';
import deMessages from '../../messages/de.json';

export const messages = {
  fr: frMessages,
  en: enMessages,
  es: esMessages,
  de: deMessages,
} as const;

export type Locale = keyof typeof messages;
